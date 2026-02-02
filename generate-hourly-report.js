#!/usr/bin/env node
/**
 * Hourly Agent Report Generator
 * Runs every hour, collects agent reports, and drafts a summary
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPORTS_PATH = '/home/ben/clawd/agents/agent-reports.json';
const OUTPUT_PATH = '/home/ben/personal-os/reports/hourly-report.md';
const AGENTS = {
    beacon: { name: 'Beacon', role: 'Product Strategist', emoji: '🎯' },
    forge: { name: 'Forge', role: 'Developer', emoji: '🔨' },
    echo: { name: 'Echo', role: 'Content Creator', emoji: '📢' },
    scout: { name: 'Scout', role: 'Researcher', emoji: '🔭' },
    sentinel: { name: 'Sentinel', role: 'QA', emoji: '🛡️' }
};

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function generateHourlyReport() {
    // Read agent reports
    let reports = [];
    try {
        if (fs.existsSync(REPORTS_PATH)) {
            const raw = JSON.parse(fs.readFileSync(REPORTS_PATH, 'utf-8'));
            // Handle both formats: {"agent": ...} (single) or [...] (array)
            if (Array.isArray(raw)) {
                reports = raw;
            } else if (raw.agent) {
                reports = [raw];
            } else if (raw.reports && Array.isArray(raw.reports)) {
                reports = raw.reports;
            }
        }
    } catch (err) {
        console.error('Error reading reports:', err.message);
        return null;
    }

    if (!reports || reports.length === 0) {
        console.log('No reports to summarize');
        return null;
    }

    // Get hour ago timestamp
    const hourAgo = Date.now() - (2 * 60 * 60 * 1000); // Last 2 hours for testing
    const recentReports = reports.filter(r => new Date(r.timestamp) > hourAgo);

    // Group by agent
    const byAgent = {};
    for (const agentId of Object.keys(AGENTS)) {
        byAgent[agentId] = recentReports.filter(r => r.agent === agentId);
    }

    // Generate report
    const now = new Date();
    const hour = now.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    let report = `# 🤖 Hourly Agent Report (${hour12}:00 ${ampm})\n\n`;
    report += `*Generated: ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}*\n\n`;

    // Completed this hour
    const completed = recentReports.filter(r => 
        r.accomplished && !r.blocking && r.blocking !== 'None'
    );
    
    report += `## ✅ Completed This Hour\n\n`;
    report += `| Agent | Task | What They Did |\n`;
    report += `|-------|------|---------------|\n`;
    
    for (const r of completed) {
        const agent = AGENTS[r.agent];
        report += `| ${agent.emoji} ${agent.name} | ${r.task} | ${r.accomplished.substring(0, 80)}... |\n`;
    }

    // In Progress
    const inProgress = recentReports.filter(r => r.accomplished && r.blocking);
    if (inProgress.length > 0) {
        report += `\n## 🔥 In Progress\n\n`;
        report += `| Agent | Task | Status |\n`;
        report += `|-------|------|--------|\n`;
        for (const r of inProgress) {
            const agent = AGENTS[r.agent];
            report += `| ${agent.emoji} ${agent.name} | ${r.task} | Working... |\n`;
        }
    }

    // Blockers
    const blocked = recentReports.filter(r => r.blocking && r.blocking !== 'None' && r.blocking !== '');
    if (blocked.length > 0) {
        report += `\n## ⚠️ Blockers\n\n`;
        for (const r of blocked) {
            const agent = AGENTS[r.agent];
            report += `- **${agent.name}**: ${r.blocking}\n`;
        }
    }

    // Next steps (from current task)
    report += `\n## 📋 Next Hour\n\n`;
    for (const [agentId, reports] of Object.entries(byAgent)) {
        if (reports.length > 0) {
            const agent = AGENTS[agentId];
            const last = reports[reports.length - 1];
            report += `- ${agent.emoji} ${agent.name}: ${last.task}\n`;
        }
    }

    // Stats
    report += `\n---\n`;
    report += `*${recentReports.length} reports from ${Object.keys(byAgent).filter(k => byAgent[k].length > 0).length} agents*\n`;

    return report;
}

// Main
const report = generateHourlyReport();
if (report) {
    // Save to personal-os
    fs.writeFileSync(OUTPUT_PATH, report);
    console.log('Hourly report generated:', OUTPUT_PATH);
    
    // Also send to Ben via message if we have a way
    console.log('\n' + report);
}
