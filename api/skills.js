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
    const { method } = req;

    if (method === 'GET') {
        res.json(skills);
    } else if (method === 'POST') {
        const { skillId, action } = req.query;
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

        res.json({ success: true, skill: skillId, action, status: skill.status });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
