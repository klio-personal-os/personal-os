// System status API for Vercel
const systemState = {
    status: 'online',
    uptime: 0,
    cpu: 0,
    memory: 0,
    sessions: [
        { id: 'web-1', name: 'Web Chat', status: 'active', connectedAt: Date.now() - 720000 },
        { id: 'discord-1', name: 'Discord', status: 'idle', connectedAt: Date.now() - 3600000 }
    ]
};

export default function handler(req, res) {
    // Simulate real-time stats
    systemState.uptime = Date.now() / 1000;
    systemState.cpu = Math.floor(Math.random() * 30) + 10;
    systemState.memory = Math.floor(Math.random() * 30) + 40;
    systemState.timestamp = Date.now();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    res.status(200).json(systemState);
}
