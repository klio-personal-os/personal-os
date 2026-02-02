// Vercel serverless function - Features API
const fs = require('fs');
const path = require('path');

const possiblePaths = [
    path.join(process.cwd(), 'reports', 'features.json'),
    path.join(__dirname, '..', 'reports', 'features.json'),
    path.join(__dirname, '..', '..', 'reports', 'features.json'),
    '/home/ben/personal-os/reports/features.json'
];

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET') {
        // Return all features
        for (const featuresPath of possiblePaths) {
            try {
                if (fs.existsSync(featuresPath)) {
                    const features = JSON.parse(fs.readFileSync(featuresPath, 'utf-8'));
                    res.status(200).json({ success: true, features });
                    return;
                }
            } catch (err) {
                // Continue
            }
        }
        res.status(200).json({ success: false, message: 'No features found' });
    } else if (req.method === 'POST') {
        // Update feature status
        const { featureId, status, notes } = req.body;
        
        for (const featuresPath of possiblePaths) {
            try {
                if (fs.existsSync(featuresPath)) {
                    const features = JSON.parse(fs.readFileSync(featuresPath, 'utf-8'));
                    const feature = features.find(f => f.id === featureId);
                    
                    if (feature) {
                        feature.status = status;
                        if (notes) feature.notes = notes;
                        if (status === 'approved') {
                            feature.approvedBy = 'Ben';
                            feature.approvedAt = new Date().toISOString();
                        }
                        if (status === 'declined') {
                            feature.declinedBy = 'Ben';
                            feature.declinedAt = new Date().toISOString();
                        }
                        
                        fs.writeFileSync(featuresPath, JSON.stringify(features, null, 2));
                        res.status(200).json({ success: true, feature });
                        return;
                    }
                }
            } catch (err) {
                // Continue
            }
        }
        res.status(404).json({ success: false, message: 'Feature not found' });
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};
