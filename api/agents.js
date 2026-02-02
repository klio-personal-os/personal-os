// Vercel serverless function - Agents API
// Returns status of all 5 agents

const AGENTS = [
    { 
        id: 'beacon', 
        name: 'Beacon', 
        role: 'Product Strategist',
        status: 'active',
        currentTask: 'Exploring UpNextAnalytics.app',
        lastHeartbeat: new Date().toISOString().split('T')[0]
    },
    { 
        id: 'forge', 
        name: 'Forge', 
        role: 'Developer',
        status: 'idle',
        currentTask: 'Waiting for first assignment',
        lastHeartbeat: new Date().toISOString().split('T')[0]
    },
    { 
        id: 'echo', 
        name: 'Echo', 
        role: 'Content Creator',
        status: 'idle',
        currentTask: 'Ready for content tasks',
        lastHeartbeat: new Date().toISOString().split('T')[0]
    },
    { 
        id: 'scout', 
        name: 'Scout', 
        role: 'Researcher',
        status: 'idle',
        currentTask: 'Ready for research missions',
        lastHeartbeat: new Date().toISOString().split('T')[0]
    },
    { 
        id: 'sentinel', 
        name: 'Sentinel', 
        role: 'QA',
        status: 'idle',
        currentTask: 'Ready for testing',
        lastHeartbeat: new Date().toISOString().split('T')[0]
    }
];

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        success: true,
        agents: AGENTS,
        timestamp: new Date().toISOString()
    });
};
