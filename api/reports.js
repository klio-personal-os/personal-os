// Vercel serverless function - Reports API
// Aggregates all agent outputs and reports
// Note: Works with mock data in serverless, real data when running locally

const CLAWD_PATH = process.env.CLAWD_PATH || '/home/ben/clawd';

// Mock data for serverless environment
const getMockReports = () => ({
    reports: [
        {
            agent: { id: 'beacon', name: 'Beacon', role: 'Product Strategist', avatar: '🎯' },
            status: 'active',
            currentTask: 'Exploring UpNextAnalytics.app',
            findings: [
                { type: 'idea', content: 'Add dark mode toggle for better accessibility' },
                { type: 'research', content: 'Competitor analysis: 3 similar apps have subscription models' }
            ],
            recentNotes: [
                { file: 'product-ideas.md', content: 'List of feature ideas...', timestamp: new Date() }
            ]
        },
        {
            agent: { id: 'forge', name: 'Forge', role: 'Developer', avatar: '🔨' },
            status: 'idle',
            currentTask: 'Waiting for first assignment',
            findings: [],
            recentNotes: []
        },
        {
            agent: { id: 'echo', name: 'Echo', role: 'Content Creator', avatar: '📢' },
            status: 'idle',
            currentTask: 'Ready for content tasks',
            findings: [],
            recentNotes: []
        },
        {
            agent: { id: 'scout', name: 'Scout', role: 'Researcher', avatar: '🔭' },
            status: 'idle',
            currentTask: 'Ready for research missions',
            findings: [],
            recentNotes: []
        },
        {
            agent: { id: 'sentinel', name: 'Sentinel', role: 'QA', avatar: '🛡️' },
            status: 'idle',
            currentTask: 'Ready for testing',
            findings: [],
            recentNotes: []
        }
    ],
    activities: [
        { agent: 'Beacon', agentId: 'beacon', agentAvatar: '🎯', action: 'Started exploration of UpNextAnalytics.app', time: 'Recent' },
        { agent: 'Forge', agentId: 'forge', agentAvatar: '🔨', action: 'Built v1.2.0 and deployed to staging', time: '2h ago' },
        { agent: 'Scout', agentId: 'scout', agentAvatar: '🔭', action: 'Completed competitor analysis for 5 apps', time: '3h ago' }
    ],
    ideas: [
        { text: 'Dark mode toggle for accessibility', source: 'product-ideas.md' },
        { text: 'Push notifications for task updates', source: 'product-ideas.md' },
        { text: 'Weekly analytics dashboard', source: 'product-ideas.md' }
    ]
});

// Try to get real data from file system
async function getRealReports() {
    try {
        const fs = require('fs');
        const path = require('path');
        
        const AGENTS = [
            { id: 'beacon', name: 'Beacon', role: 'Product Strategist', avatar: '🎯' },
            { id: 'forge', name: 'Forge', role: 'Developer', avatar: '🔨' },
            { id: 'echo', name: 'Echo', role: 'Content Creator', avatar: '📢' },
            { id: 'scout', name: 'Scout', role: 'Researcher', avatar: '🔭' },
            { id: 'sentinel', name: 'Sentinel', role: 'QA', avatar: '🛡️' }
        ];
        
        const reports = [];
        const activities = [];
        
        for (const agent of AGENTS) {
            const agentPath = path.join(CLAWD_PATH, 'agents', agent.id);
            const memoryPath = path.join(agentPath, 'memory');
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
                const ideasMatch = content.match(/## Ideas?[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
                if (ideasMatch) {
                    ideasMatch.forEach(match => {
                        const cleaned = match.replace(/## Ideas?[:\s]*/i, '').trim();
                        if (cleaned) findings.push({ type: 'idea', content: cleaned });
                    });
                }
                
                const researchMatch = content.match(/## Research[:\s]*([^\n]*(?:\n+[^\n]+)*)/gi);
                if (researchMatch) {
                    researchMatch.forEach(match => {
                        const cleaned = match.replace(/## Research[:\s]*/i, '').trim();
                        if (cleaned) findings.push({ type: 'research', content: cleaned });
                    });
                }
            }
            
            reports.push({
                agent: agent,
                status: status,
                currentTask: currentTask,
                findings: findings,
                recentNotes: []
            });
        }
        
        // Get ideas from Beacon's notes
        const ideas = [];
        const beaconNotesPath = path.join(CLAWD_PATH, 'agents', 'beacon', 'notes');
        if (fs.existsSync(beaconNotesPath)) {
            const files = fs.readdirSync(beaconNotesPath).filter(f => f.endsWith('.md'));
            for (const file of files) {
                const filePath = path.join(beaconNotesPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const ideasMatch = content.match(/- .+/g);
                if (ideasMatch) {
                    ideasMatch.forEach(idea => {
                        const cleaned = idea.replace(/^- /, '').trim();
                        if (cleaned.length > 10) {
                            ideas.push({ text: cleaned, source: file });
                        }
                    });
                }
            }
        }
        
        return { reports, activities, ideas };
    } catch (err) {
        console.error('Error reading reports:', err);
        return null;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Try to get real data, fall back to mock data
    const realData = await getRealReports();
    
    if (realData) {
        res.status(200).json({
            success: true,
            ...realData,
            timestamp: new Date().toISOString()
        });
    } else {
        // Use mock data for serverless environment
        const mockData = getMockReports();
        res.status(200).json({
            success: true,
            ...mockData,
            timestamp: new Date().toISOString(),
            note: 'Using demo data - configure CLAWD_PATH for real data'
        });
    }
};
