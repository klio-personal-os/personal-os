#!/usr/bin/env node
/**
 * Agent Report Watcher
 * Runs continuously, checks agent WORKING.md files, and updates dashboard
 * when agents have new reports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CLAWD_AGENTS_PATH = '/home/ben/clawd/agents';
const REPORTS_PATH = '/home/ben/personal-os/reports/agent-reports.json';
const HOURLY_REPORT_PATH = '/home/ben/personal-os/reports/hourly-report.md';
const POLL_INTERVAL = 60000; // Check every 60 seconds

const AGENTS = [
    { id: 'beacon', name: 'Beacon', role: 'Product Strategist' },
    { id: 'forge', name: 'Forge', role: 'Developer' },
    { id: 'echo', name: 'Echo', role: 'Content Creator' },
    { id: 'scout', name: 'Scout', role: 'Researcher' },
    { id: 'sentinel', name: 'Sentinel', role: 'QA' }
];

// Track last known content hash
const lastHashes = {};

// Calculate simple hash of content
function hash(content) {
    let h = 0;
    for (let i = 0; i < content.length; i++) {
        h = ((h << 5) - h) + content.charCodeAt(i);
        h |= 0;
    }
    return h.toString();
}

// Get latest task and status from WORKING.md
function parseWorkingMd(content) {
    let status = 'idle';
    let currentTask = 'No task';
    let report = '';
    
    // Check status
    if (content.includes('✅') && content.includes('ACTIVE')) status = 'active';
    else if (content.includes('⏸️') || content.includes('blocked')) status = 'blocked';
    
    // Get current task - try multiple formats
    // Format 1: ## Current Task
    const taskMatch1 = content.match(/## Current Task[\s\S]*?\n([^#\n]+)/i);
    if (taskMatch1) {
        currentTask = taskMatch1[1].trim().substring(0, 100);
    }
    
    // Format 2: ## Current Sprint
    const taskMatch2 = content.match(/## Current Sprint[:\s]*([^\n#]+)/i);
    if (taskMatch2) {
        currentTask = taskMatch2[1].trim().substring(0, 100);
    }
    
    // Format 3: First line after "## Current Task" that's not a list item
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('current task') || lines[i].toLowerCase().includes('current sprint')) {
            for (let j = i + 1; j < lines.length && j < i + 4; j++) {
                const line = lines[j].trim();
                if (line && !line.startsWith('-') && !line.startsWith('**') && !line.startsWith('##')) {
                    currentTask = line.substring(0, 100);
                    break;
                }
            }
            break;
        }
    }
    
    // Get findings/opportunities - look for numbered list items
    const opportunities = [];
    const oppMatch = content.match(/\d+\.\s+\*\\*([^*]+)/g);
    if (oppMatch) {
        oppMatch.slice(0, 3).forEach(opp => {
            opportunities.push(opp.replace(/\d+\.\s+\*\*/, '').trim());
        });
    }
    
    // Get recent report - look for Recent Reports section or checkboxes
    const recentMatch = content.match(/-\s*(\[[\sx]\]|\*\*COMPLETED\*\*|2026-[^:]+:[^#]+)/);
    if (recentMatch) {
        report = recentMatch[1].replace('[ ]', '').replace('[x]', '').trim();
        if (report.startsWith('**') && report.endsWith('**')) {
            report = report.replace(/\*\*/g, '');
        }
    } else if (opportunities.length > 0) {
        // Use first opportunity as report
        report = `Sprint: ${currentTask}`;
    }
    
    return { status, currentTask, report };
}

// Update the reports JSON
function updateReports() {
    let data = { agents: {}, lastUpdated: null };
    let agentReports = [];
    
    // Try to read agent reports from clawd (new format)
    const clawdReportsPath = path.join(CLAWD_AGENTS_PATH, 'agent-reports.json');
    try {
        if (fs.existsSync(clawdReportsPath)) {
            const raw = fs.readFileSync(clawdReportsPath, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                agentReports = parsed;
            } else if (parsed.reports && Array.isArray(parsed.reports)) {
                agentReports = parsed.reports;
            }
        }
    } catch (err) {
        // Ignore
    }
    
    // Also check WORKING.md files for status
    let hasChanges = false;
    
    for (const agent of AGENTS) {
        const workingMdPath = path.join(CLAWD_AGENTS_PATH, agent.id, 'memory', 'WORKING.md');
        
        try {
            if (fs.existsSync(workingMdPath)) {
                const content = fs.readFileSync(workingMdPath, 'utf-8');
                const contentHash = hash(content);
                
                if (lastHashes[agent.id] !== contentHash) {
                    lastHashes[agent.id] = contentHash;
                    const { status, currentTask, report } = parseWorkingMd(content);
                    
                    data.agents[agent.id] = {
                        name: agent.name,
                        role: agent.role,
                        status,
                        currentTask,
                        lastReport: new Date().toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true 
                        }),
                        report
                    };
                    
                    hasChanges = true;
                    console.log(`📝 ${agent.name}: ${status} - ${currentTask.substring(0, 50)}`);
                }
            }
        } catch (err) {
            console.error(`Error reading ${agent.name}:`, err.message);
        }
    }
    
    // Also add latest agent report data
    if (agentReports.length > 0) {
        // Get last report per agent
        const byAgent = {};
        for (const r of agentReports) {
            if (!byAgent[r.agent] || new Date(r.timestamp) > new Date(byAgent[r.agent].timestamp)) {
                byAgent[r.agent] = r;
            }
        }
        
        for (const [agentId, report] of Object.entries(byAgent)) {
            if (data.agents[agentId]) {
                data.agents[agentId].report = report.accomplished;
                data.agents[agentId].currentTask = report.task;
                data.agents[agentId].blocking = report.blocking;
            }
        }
    }
    
    if (hasChanges || agentReports.length > 0) {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(REPORTS_PATH, JSON.stringify(data, null, 2));
        console.log('✅ Reports updated');
        
        // Generate hourly report
        try {
            const { execSync } = require('child_process');
            execSync('node generate-hourly-report.js', { cwd: '/home/ben/personal-os' });
            console.log('📊 Hourly report generated');
            
            // Copy to Vercel reports folder
            if (fs.existsSync(HOURLY_REPORT_PATH)) {
                // Hourly report already saved
            }
        } catch (err) {
            console.log('⚠️  Hourly report generation:', err.message);
        }
        
        console.log('🚀 Pushing to GitHub...');
        try {
            execSync('git add -A', { cwd: '/home/ben/personal-os' });
            execSync('git commit -m "Update agent reports and hourly summary"', { cwd: '/home/ben/personal-os' });
            execSync('git push origin main', { cwd: '/home/ben/personal-os' });
            console.log('✅ Pushed to GitHub');
        } catch (err) {
            console.log('⚠️  Push:', err.message);
        }
    }
}

// Main loop
console.log('🔄 Agent Report Watcher started');
console.log(`📊 Checking every ${POLL_INTERVAL/1000} seconds...\n`);

updateReports(); // Initial check

setInterval(() => {
    try {
        updateReports();
    } catch (err) {
        console.error('Error in update loop:', err.message);
    }
}, POLL_INTERVAL);
