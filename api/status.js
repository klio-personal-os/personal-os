// System status API for Vercel
export default function handler(req, res) {
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    res.json({
        status: 'online',
        uptime: uptime,
        memory: Math.round((memory.heapUsed / memory.heapTotal) * 100),
        cpu: Math.floor(Math.random() * 30) + 10, // Simulated for serverless
        sessions: [
            { id: 'web-1', name: 'Web Chat', status: 'active', connectedAt: Date.now() - 720000 },
            { id: 'discord-1', name: 'Discord', status: 'idle', connectedAt: Date.now() - 3600000 }
        ],
        timestamp: Date.now()
    });
}
