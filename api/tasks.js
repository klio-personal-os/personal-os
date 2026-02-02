// Vercel serverless function - Tasks API
const fs = require('fs');
const path = require('path');

const TASKS_PATH = path.join(process.cwd(), 'tasks.json');

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET') {
        // Return all tasks
        try {
            if (fs.existsSync(TASKS_PATH)) {
                const tasks = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
                res.status(200).json({ success: true, tasks });
            } else {
                res.status(200).json({ success: true, tasks: [] });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    } else if (req.method === 'POST') {
        // Save tasks
        try {
            const { tasks } = req.body;
            fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2));
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};
