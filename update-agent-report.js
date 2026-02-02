#!/usr/bin/env node
/**
 * Agent Report Updater
 * Usage: node update-agent-report.js <agent-id> <status> <currentTask> <report>
 * 
 * Example:
 *   node update-agent-report.js beacon active "Exploring app" "Found 3 product opportunities"
 * 
 * Agents run this after each heartbeat to update their report.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_PATH = path.join(__dirname, 'reports', 'agent-reports.json');
const AGENT_ID = process.argv[2];
const STATUS = process.argv[3];
const CURRENT_TASK = process.argv[4];
const REPORT = process.argv[5];

// Valid agents
const VALID_AGENTS = ['beacon', 'forge', 'echo', 'scout', 'sentinel'];

// Avatar mapping
const AVATARS = {
    beacon: '🎯',
    forge: '🔨',
    echo: '📢',
    scout: '🔭',
    sentinel: '🛡️'
};

function updateReport() {
    if (!AGENT_ID || !VALID_AGENTS.includes(AGENT_ID)) {
        console.error(`Usage: node update-agent-report.js <agent-id> <status> <currentTask> <report>`);
        console.error(`Valid agents: ${VALID_AGENTS.join(', ')}`);
        process.exit(1);
    }

    // Read existing reports
    let data = { agents: {}, lastUpdated: null };
    try {
        if (fs.existsSync(REPORTS_PATH)) {
            data = JSON.parse(fs.readFileSync(REPORTS_PATH, 'utf-8'));
        }
    } catch (err) {
        console.log('Creating new reports file...');
    }

    // Update agent data
    const agentName = AGENT_ID.charAt(0).toUpperCase() + AGENT_ID.slice(1);
    const roleNames = {
        beacon: 'Product Strategist',
        forge: 'Developer',
        echo: 'Content Creator',
        scout: 'Researcher',
        sentinel: 'QA'
    };

    data.agents[AGENT_ID] = {
        name: agentName,
        role: roleNames[AGENT_ID],
        status: STATUS || 'idle',
        currentTask: CURRENT_TASK || 'No task assigned',
        lastReport: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
        }),
        report: REPORT || ''
    };

    data.lastUpdated = new Date().toISOString();

    // Write updated reports
    fs.writeFileSync(REPORTS_PATH, JSON.stringify(data, null, 2));
    console.log(`✅ Updated ${agentName}'s report`);

    // Auto-push to GitHub
    try {
        console.log('📤 Pushing to GitHub...');
        execSync('git add reports/agent-reports.json', { cwd: __dirname });
        execSync(`git commit -m "Update ${agentName} report"`, { cwd: __dirname });
        execSync('git push origin main', { cwd: __dirname });
        console.log('✅ Pushed to GitHub');
    } catch (err) {
        console.error('⚠️  Failed to push:', err.message);
        process.exit(1);
    }
}

updateReport();
