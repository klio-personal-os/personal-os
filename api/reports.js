// Vercel serverless function - Reports API
// Aggregates all agent outputs and reports from JSON

const fs = require('fs');
const path = require('path');

const REPORTS_PATH = path.join(__dirname, '..', 'reports', 'agent-reports.json');

function getReportsData() {
    try {
        if (fs.existsSync(REPORTS_PATH)) {
            return JSON.parse(fs.readFileSync(REPORTS_PATH, 'utf-8'));
        }
    } catch (err) {
        console.error('Error reading reports:', err);
    }
    return null;
}

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const data = getReportsData();
    
    if (data) {
        // Format for frontend
        const reports = Object.entries(data.agents || {}).map(([id, agent]) => ({
            agent: { id, name: agent.name, role: agent.role, avatar: getAvatar(id) },
            status: agent.status,
            currentTask: agent.currentTask,
            report: agent.report
        }));
        
        res.status(200).json({
            success: true,
            reports: reports,
            activities: [], // Could add activity tracking later
            ideas: [], // Could add ideas from separate file
            timestamp: data.lastUpdated
        });
    } else {
        res.status(200).json({
            success: true,
            reports: [],
            activities: [],
            ideas: [],
            timestamp: new Date().toISOString()
        });
    }
};

function getAvatar(id) {
    const avatars = {
        beacon: '🎯',
        forge: '🔨',
        echo: '📢',
        scout: '🔭',
        sentinel: '🛡️'
    };
    return avatars[id] || '🤖';
}
