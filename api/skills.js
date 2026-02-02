// Skills API for Vercel
const skills = {
    github: { status: 'active', lastSync: Date.now() },
    'coding-agent': { status: 'active' },
    mcporter: { status: 'active' },
    notion: { status: 'inactive' },
    slack: { status: 'active' },
    terminal: { status: 'active' },
    browser: { status: 'active' },
    memory: { status: 'active' }
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, query } = req;
    const { skillId, action } = query;

    if (method === 'GET') {
        res.status(200).json(skills);
    } else if (method === 'POST') {
        const skill = skills[skillId];

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

        res.status(200).json({ success: true, skill: skillId, action, status: skill.status });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
