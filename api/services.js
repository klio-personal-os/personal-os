// Services API for Vercel
const services = {
    gateway: { status: 'running', port: 3000 },
    websocket: { status: 'running', port: 3001 },
    api: { status: 'running', port: 3002 },
    'mcp-server': { status: 'stopped', port: 3003 },
    agent: { status: 'running', port: null }
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, query } = req;
    const { serviceId, action } = query;

    if (method === 'GET') {
        res.status(200).json(services);
    } else if (method === 'POST') {
        const service = services[serviceId];

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

        res.status(200).json({ success: true, service: serviceId, action, status: service.status });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
