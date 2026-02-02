const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// System state store
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
        cpu: Math.floor(Math.random() * 40) + 15, // Simulated for demo
        memory: Math.floor((memory.heapUsed / memory.heapTotal) * 100),
        storage: Math.floor(Math.random() * 30) + 40,
        sessions: [
            { id: 'web-1', name: 'Main Session', status: 'active', connectedAt: Date.now() - 720000, type: 'direct' },
            { id: 'subagent-1', name: 'Sub-agent Session', status: 'active', connectedAt: Date.now() - 3600000, type: 'subagent' }
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

// Agents API
const agentsApi = require('./api/agents');
app.get(agentsApi.path, agentsApi.handler);

// Main route - serve the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🖥️  Personal OS Admin Dashboard running at http://localhost:${PORT}`);
    console.log('   API endpoints:');
    console.log('   - GET  /api/status   - System status');
    console.log('   - GET  /api/skills   - List all skills');
    console.log('   - POST /api/skills/:id/:action - Control skill');
    console.log('   - GET  /api/services - List all services');
    console.log('   - POST /api/services/:id/:action - Control service');
    console.log('\n');
});

module.exports = app;
