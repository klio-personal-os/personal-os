const fs = require('fs');
const path = require('path');

// Agent definitions
const AGENTS = [
    { id: 'beacon', name: 'Beacon', role: 'Product Strategist' },
    { id: 'forge', name: 'Forge', role: 'Developer' },
    { id: 'echo', name: 'Echo', role: 'Content Creator' },
    { id: 'scout', name: 'Scout', role: 'Researcher' },
    { id: 'sentinel', name: 'Sentinel', role: 'QA' }
];

const AGENTS_PATH = '/home/ben/clawd/agents';

// Extract current task from WORKING.md
function extractCurrentTask(workingMdPath) {
    try {
        if (fs.existsSync(workingMdPath)) {
            const content = fs.readFileSync(workingMdPath, 'utf-8');
            
            // Look for "Current Task" section
            const taskMatch = content.match(/## Current Task\s*\n\s*[\*•]?\s*(.+)/i);
            if (taskMatch) {
                return taskMatch[1].trim().replace(/^[\*\•]\s*/, '');
            }
            
            // Look for status lines
            const statusMatch = content.match(/Status[:\s]*([^\n]+)/i);
            if (statusMatch) {
                return statusMatch[1].trim();
            }
            
            // Return first non-empty line that's not a header
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
                    return trimmed.substring(0, 100);
                }
            }
        }
    } catch (err) {
        console.error(`Error reading WORKING.md: ${err.message}`);
    }
    return 'No task assigned';
}

// Get agent status based on WORKING.md file
function getAgentStatus(agentId) {
    const workingMdPath = path.join(AGENTS_PATH, agentId, 'memory', 'WORKING.md');
    
    try {
        if (fs.existsSync(workingMdPath)) {
            const content = fs.readFileSync(workingMdPath, 'utf-8').toLowerCase();
            
            // Check for status indicators
            if (content.includes('status:') || content.includes('## Status')) {
                if (content.includes('✅') || content.includes('active') || content.includes('running')) {
                    return 'active';
                }
                if (content.includes('⏸️') || content.includes('blocked') || content.includes('stopped')) {
                    return 'blocked';
                }
            }
            
            // Check for completion indicators
            const progressMatch = content.match(/(\d+)\s*of\s*(\d+)\s*complete|(\d+)\s*tasks?\s*(completed|done)/i);
            if (progressMatch) {
                return 'active';
            }
        }
    } catch (err) {
        console.error(`Error checking agent status: ${err.message}`);
    }
    
    // Default to idle if we can't determine
    return 'idle';
}

// Get last heartbeat time
function getLastHeartbeat(agentId) {
    const heartbeatPath = path.join(AGENTS_PATH, agentId, 'HEARTBEAT.md');
    
    try {
        if (fs.existsSync(heartbeatPath)) {
            const content = fs.readFileSync(heartbeatPath, 'utf-8');
            const dateMatch = content.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
                return dateMatch[0];
            }
        }
    } catch (err) {
        // Ignore errors
    }
    
    return new Date().toISOString().split('T')[0];
}

// API endpoint: Get all agents status
function getAgents(req, res) {
    const agentsData = AGENTS.map(agent => {
        const workingMdPath = path.join(AGENTS_PATH, agent.id, 'memory', 'WORKING.md');
        
        return {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            status: getAgentStatus(agent.id),
            currentTask: extractCurrentTask(workingMdPath),
            lastHeartbeat: getLastHeartbeat(agent.id)
        };
    });
    
    res.json({
        success: true,
        agents: agentsData,
        timestamp: new Date().toISOString()
    });
}

// Export route handler
module.exports = {
    path: '/api/agents',
    handler: getAgents
};
