const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Store for system state
const systemState = {
    services: {
        gateway: { status: 'running', port: 3000 },
        websocket: { status: 'running', port: 3001 },
        api: { status: 'running', port: 3002 },
        'mcp-server': { status: 'stopped', port: 3003 },
        agent: { status: 'running', port: null }
    },
    skills: {
        github: { status: 'active', lastSync: Date.now() },
        'coding-agent': { status: 'active' },
        mcporter: { status: 'active' },
        notion: { status: 'inactive' },
        slack: { status: 'active' },
        terminal: { status: 'active' },
        browser: { status: 'active' },
        memory: { status: 'active' }
    }
};

// =======================
// API Routes
// =======================

// Get system status
app.get('/api/status', (req, res) => {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    res.json({
        status: 'online',
        uptime: uptime,
        cpu: cpuUsage.user / 1000000,
        memory: Math.round((memory.heapUsed / memory.heapTotal) * 100),
        sessions: [
            { id: 'web-1', name: 'Web Chat', status: 'active', connectedAt: Date.now() - 720000 },
            { id: 'discord-1', name: 'Discord', status: 'idle', connectedAt: Date.now() - 3600000 }
        ]
    });
});

// Get all services
app.get('/api/services', (req, res) => {
    res.json(systemState.services);
});

// Control a service
app.post('/api/services/:serviceId/:action', (req, res) => {
    const { serviceId, action } = req.params;
    const service = systemState.services[serviceId];

    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }

    switch(action) {
        case 'start':
            service.status = 'running';
            break;
        case 'stop':
            service.status = 'stopped';
            break;
        case 'restart':
            service.status = 'restarting';
            setTimeout(() => { service.status = 'running'; }, 1000);
            break;
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ success: true, service: serviceId, action: action, status: service.status });
});

// Get all skills
app.get('/api/skills', (req, res) => {
    res.json(systemState.skills);
});

// Control a skill
app.post('/api/skills/:skillId/:action', (req, res) => {
    const { skillId, action } = req.params;
    const skill = systemState.skills[skillId];

    if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
    }

    switch(action) {
        case 'start':
            skill.status = 'active';
            break;
        case 'stop':
            skill.status = 'inactive';
            break;
        case 'sync':
            skill.lastSync = Date.now();
            break;
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({ success: true, skill: skillId, action: action, status: skill.status });
});

// Execute a skill action
app.post('/api/skills/:skillId/execute', (req, res) => {
    const { skillId } = req.params;
    const { action } = req.body;

    if (!systemState.skills[skillId]) {
        return res.status(404).json({ error: 'Skill not found' });
    }

    console.log(`Executing ${action} on skill ${skillId}`);

    res.json({
        success: true,
        skill: skillId,
        action: action,
        result: 'Action executed successfully'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: Date.now() });
});

// Main route - serve the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🖥️  Personal OS running at http://localhost:${PORT}`);
    console.log('   Admin Dashboard available at /api endpoints');
    console.log('   Press Ctrl+C to stop\n');
});

module.exports = app;
