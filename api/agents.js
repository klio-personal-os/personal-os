// Vercel serverless function - Agents API
// Returns status of all 5 agents from reports JSON

const fs = require('fs');
const path = require('path');

// Try multiple paths for Vercel compatibility
const possiblePaths = [
    path.join(process.cwd(), 'reports', 'agent-reports.json'),
    path.join(__dirname, '..', 'reports', 'agent-reports.json'),
    path.join(__dirname, '..', '..', 'reports', 'agent-reports.json'),
    '/home/ben/personal-os/reports/agent-reports.json'
];

function getAgentsData() {
    for (const reportsPath of possiblePaths) {
        try {
            if (fs.existsSync(reportsPath)) {
                const data = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'));
                const agents = [];
                for (const [id, agent] of Object.entries(data.agents || {})) {
                    agents.push({
                        id: id,
                        name: agent.name,
                        role: agent.role,
                        status: agent.status,
                        currentTask: agent.currentTask,
                        lastReport: agent.lastReport,
                        report: agent.report
                    });
                }
                return agents;
            }
        } catch (err) {
            // Try next path
        }
    }

    // Fallback data
    return [
        { id: 'beacon', name: 'Beacon', role: 'Product Strategist', status: 'active', currentTask: 'Exploring UpNextAnalytics.app' },
        { id: 'forge', name: 'Forge', role: 'Developer', status: 'idle', currentTask: 'Waiting for first assignment' },
        { id: 'echo', name: 'Echo', role: 'Content Creator', status: 'idle', currentTask: 'Ready for content tasks' },
        { id: 'scout', name: 'Scout', role: 'Researcher', status: 'idle', currentTask: 'Ready for research missions' },
        { id: 'sentinel', name: 'Sentinel', role: 'QA', status: 'idle', currentTask: 'Ready for testing' }
    ];
}

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        success: true,
        agents: getAgentsData(),
        timestamp: new Date().toISOString()
    });
};
