#!/usr/bin/env node
/**
 * Agent Report Watcher
 * Runs continuously, checks agent WORKING.md files, and updates dashboard
 * when agents have new reports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENTS_PATH = '/home/ben/clawd/agents';
const REPORTS_PATH = '/home/ben/personal-os/reports/agent-reports.json';
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
    const lines = content.split('\n');
    let status = 'idle';
    let currentTask = 'No task';
    let report = '';
    
    // Check status
    if (content.includes('✅')) status = 'active';
    else if (content.includes('⏸️') || content.includes('blocked')) status = 'blocked';
    
    // Get current task
    const taskMatch = content.match(/## Current Task[\s\S]*?\n([^#\n]+)/i);
    if (taskMatch) {
        currentTask = taskMatch[1].trim().substring(0, 100);
    }
    
    // Get findings/opportunities - look for numbered list items (like "1. **Game Previews")
    const opportunities = [];
    const oppMatch = content.match(/\d+\.\s+\*\\*([^*]+)/g);
    if (oppMatch) {
        oppMatch.slice(0, 3).forEach(opp => {
            opportunities.push(opp.replace(/\d+\.\s+\*\*/, '').trim());
        });
    }
    
    // Get latest report - look for Recent Reports section
    const recentMatch = content.match(/## Recent Reports[\s\S]*?-\s*([^#\n]+)/i);
    if (recentMatch) {
        report = recentMatch[1].trim();
    } else if (opportunities.length > 0) {
        // Use opportunities as the report
        report = `Found ${opportunities.length} opportunities: ${opportunities.join(', ')}`;
    }
    
    return { status, currentTask, report };
}

// Update the reports JSON
function updateReports() {
    let data = { agents: {}, lastUpdated: null };
    
    try {
        if (fs.existsSync(REPORTS_PATH)) {
            data = JSON.parse(fs.readFileSync(REPORTS_PATH, 'utf-8'));
        }
    } catch (err) {
        // File doesn't exist or is invalid
    }
    
    let hasChanges = false;
    
    for (const agent of AGENTS) {
        const workingMdPath = path.join(AGENTS_PATH, agent.id, 'memory', 'WORKING.md');
        
        try {
            if (fs.existsSync(workingMdPath)) {
                const content = fs.readFileSync(workingMdPath, 'utf-8');
                const contentHash = hash(content);
                
                if (lastHashes[agent.id] !== contentHash) {
                    // Content changed, update report
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
    
    if (hasChanges) {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(REPORTS_PATH, JSON.stringify(data, null, 2));
        console.log('✅ Reports updated, pushing to GitHub...');
        
        try {
            execSync('git add reports/agent-reports.json', { cwd: '/home/ben/personal-os' });
            execSync('git commit -m "Update agent reports"', { cwd: '/home/ben/personal-os' });
            execSync('git push origin main', { cwd: '/home/ben/personal-os' });
            console.log('✅ Pushed to GitHub');
        } catch (err) {
            console.error('⚠️  Failed to push:', err.message);
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
