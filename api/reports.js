// Vercel serverless function - Reports API
// Aggregates all agent outputs and reports from JSON

const fs = require('fs');
const path = require('path');

// Try multiple paths for Vercel compatibility
const possiblePaths = [
    path.join(process.cwd(), 'reports', 'agent-reports.json'),
    path.join(__dirname, '..', 'reports', 'agent-reports.json'),
    path.join(__dirname, '..', '..', 'reports', 'agent-reports.json'),
    '/home/ben/personal-os/reports/agent-reports.json'
];

function getReportsData() {
    for (const reportsPath of possiblePaths) {
        try {
            if (fs.existsSync(reportsPath)) {
                const data = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'));
                console.log('Found reports at:', reportsPath);
                return data;
            }
        } catch (err) {
            console.log('Path not found:', reportsPath);
        }
    }
    return null;
}

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const data = getReportsData();
    
    if (data && data.agents) {
        // Format for frontend
        const reports = Object.entries(data.agents).map(([id, agent]) => ({
            agent: { id, name: agent.name, role: agent.role, avatar: getAvatar(id) },
            status: agent.status,
            currentTask: agent.currentTask,
            report: agent.report
        }));
        
        res.status(200).json({
            success: true,
            reports: reports,
            activities: [],
            ideas: [],
            timestamp: data.lastUpdated
        });
    } else {
        res.status(200).json({
            success: true,
            reports: [],
            activities: [],
            ideas: [],
            timestamp: new Date().toISOString(),
            note: 'No report data found'
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
