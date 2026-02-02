// Vercel serverless function - Reports API
// Aggregates all agent outputs and reports

const fs = require('fs');
const path = require('path');

const AGENTS = [
    { id: 'beacon', name: 'Beacon', role: 'Product Strategist', avatar: '🎯' },
    { id: 'forge', name: 'Forge', role: 'Developer', avatar: '🔨' },
    { id: 'echo', name: 'Echo', role: 'Content Creator', avatar: '📢' },
    { id: 'scout', name: 'Scout', role: 'Researcher', avatar: '🔭' },
    { id: 'sentinel', name: 'Sentinel', role: 'QA', avatar: '🛡️' }
];

const CLAWD_PATH = '/home/ben/clawd';
const REPORTS_PATH = path.join(CLAWD_PATH, 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_PATH)) {
    fs.mkdirSync(REPORTS_PATH, { recursive: true });
}

// Extract findings from a file
function extractFindings(content) {
    const findings = [];
    
    // Look for ideas, discoveries, etc.
    const ideasMatch = content.match(/## Ideas?[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
    if (ideasMatch) {
        ideasMatch.forEach(match => {
            const cleaned = match.replace(/## Ideas?[:\s]*/i, '').trim();
            if (cleaned) findings.push({ type: 'idea', content: cleaned });
        });
    }
    
    // Look for research findings
    const researchMatch = content.match(/## Research[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
    if (researchMatch) {
        researchMatch.forEach(match => {
            const cleaned = match.replace(/## Research[:\s]*/i, '').trim();
            if (cleaned) findings.push({ type: 'research', content: cleaned });
        });
    }
    
    // Look for content created
    const contentMatch = content.match(/## Content[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
    if (contentMatch) {
        contentMatch.forEach(match => {
            const cleaned = match.replace(/## Content[:\s]*/i, '').trim();
            if (cleaned) findings.push({ type: 'content', content: cleaned });
        });
    }
    
    // Look for code changes
    const codeMatch = content.match(/## Code[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
    if (codeMatch) {
        codeMatch.forEach(match => {
            const cleaned = match.replace(/## Code[:\s]*/i, '').trim();
            if (cleaned) findings.push({ type: 'code', content: cleaned });
        });
    }
    
    // Look for issues/errors
    const issuesMatch = content.match(/## Issues?[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
    if (issuesMatch) {
        issuesMatch.forEach(match => {
            const cleaned = match.replace(/## Issues?[:\s]*/i, '').trim();
            if (cleaned) findings.push({ type: 'issue', content: cleaned });
        });
    }
    
    return findings;
}

// Get all agent reports
function getAgentReports() {
    const reports = [];
    
    for (const agent of AGENTS) {
        const agentPath = path.join(CLAWD_PATH, 'agents', agent.id);
        const memoryPath = path.join(agentPath, 'memory');
        const notesPath = path.join(agentPath, 'notes');
        
        // Read WORKING.md for current task
        const workingMdPath = path.join(memoryPath, 'WORKING.md');
        let currentTask = 'No active task';
        let status = 'idle';
        let findings = [];
        
        if (fs.existsSync(workingMdPath)) {
            const content = fs.readFileSync(workingMdPath, 'utf-8');
            
            // Extract current task
            const taskMatch = content.match(/## Current Task\s*\n\s*[\*•]?\s*([^\n]+)/i);
            if (taskMatch) {
                currentTask = taskMatch[1].trim().replace(/^[\*\•]\s*/, '');
            }
            
            // Check status
            if (content.includes('✅')) {
                status = 'active';
            } else if (content.includes('⏸️') || content.includes('blocked')) {
                status = 'blocked';
            }
            
            // Extract findings
            findings = extractFindings(content);
        }
        
        // Read recent notes files
        let recentNotes = [];
        if (fs.existsSync(notesPath)) {
            const files = fs.readdirSync(notesPath)
                .filter(f => f.endsWith('.md'))
                .sort((a, b) => {
                    const statA = fs.statSync(path.join(notesPath, a));
                    const statB = fs.statSync(path.join(notesPath, b));
                    return statB.mtimeMs - statA.mtimeMs;
                })
                .slice(0, 5);
            
            for (const file of files) {
                const filePath = path.join(notesPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                recentNotes.push({
                    file: file,
                    content: content.substring(0, 500),
                    timestamp: fs.statSync(filePath).mtime
                });
            }
        }
        
        reports.push({
            agent: agent,
            status: status,
            currentTask: currentTask,
            findings: findings,
            recentNotes: recentNotes,
            lastActive: fs.existsSync(workingMdPath) ? fs.statSync(workingMdPath).mtime : null
        });
    }
    
    return reports;
}

// Get activity feed from memory files
function getActivityFeed() {
    const activities = [];
    
    for (const agent of AGENTS) {
        const workingMdPath = path.join(CLAWD_PATH, 'agents', agent.id, 'memory', 'WORKING.md');
        
        if (fs.existsSync(workingMdPath)) {
            const content = fs.readFileSync(workingMdPath, 'utf-8');
            
            // Look for recent progress
            const progressMatch = content.match(/## Recent Progress\s*([\s\S]*?)(?=\n## |\n# |\Z)/i);
            if (progressMatch) {
                const lines = progressMatch[1].split('\n').filter(l => l.trim());
                lines.slice(0, 3).forEach(line => {
                    const cleaned = line.replace(/^[\s\-*✅⏳🔄]*/, '').trim();
                    if (cleaned && cleaned.length > 5) {
                        activities.push({
                            agent: agent.name,
                            agentId: agent.id,
                            agentAvatar: agent.avatar,
                            action: cleaned,
                            time: 'Recent'
                        });
                    }
                });
            }
            
            // Look for next steps as activity
            const nextStepsMatch = content.match(/## Next Steps\s*([\s\S]*?)(?=\n## |\n# |\Z)/i);
            if (nextStepsMatch) {
                const lines = nextStepsMatch[1].split('\n').filter(l => l.trim() && l.match(/^\d+\./));
                if (lines.length > 0) {
                    activities.push({
                        agent: agent.name,
                        agentId: agent.id,
                        agentAvatar: agent.avatar,
                        action: `Has ${lines.length} pending tasks`,
                        time: 'Pending'
                    });
                }
            }
        }
    }
    
    return activities;
}

// Get all product ideas from notes
function getProductIdeas() {
    const ideas = [];
    const notesPath = path.join(CLAWD_PATH, 'agents', 'beacon', 'notes');
    
    if (fs.existsSync(notesPath)) {
        const files = fs.readdirSync(notesPath).filter(f => f.endsWith('.md'));
        
        for (const file of files) {
            const filePath = path.join(notesPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Look for ideas in the file
            const ideasMatch = content.match(/- .+/g);
            if (ideasMatch) {
                ideasMatch.forEach(idea => {
                    const cleaned = idea.replace(/^- /, '').trim();
                    if (cleaned.length > 10) {
                        ideas.push({
                            text: cleaned,
                            source: file,
                            timestamp: fs.statSync(filePath).mtime
                        });
                    }
                });
            }
        }
    }
    
    return ideas;
}

module.exports = (req, res) => {
    const reports = getAgentReports();
    const activities = getActivityFeed();
    const ideas = getProductIdeas();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        success: true,
        reports: reports,
        activities: activities,
        ideas: ideas,
        timestamp: new Date().toISOString()
    });
};
