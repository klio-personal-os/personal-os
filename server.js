const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: Date.now() });
});

app.listen(PORT, () => {
    console.log(`\n🖥️  Klio Admin running at http://localhost:${PORT}`);
    console.log('   Press Ctrl+C to stop\n');
});

module.exports = app;
