// Vercel serverless function - Hourly Report API
const fs = require('fs');
const path = require('path');

const possiblePaths = [
    path.join(process.cwd(), 'reports', 'hourly-report.md'),
    path.join(__dirname, '..', 'reports', 'hourly-report.md'),
    path.join(__dirname, '..', '..', 'reports', 'hourly-report.md'),
    '/home/ben/personal-os/reports/hourly-report.md'
];

module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    let reportContent = null;
    let foundPath = null;
    
    for (const reportPath of possiblePaths) {
        try {
            if (fs.existsSync(reportPath)) {
                reportContent = fs.readFileSync(reportPath, 'utf-8');
                foundPath = reportPath;
                break;
            }
        } catch (err) {
            // Continue
        }
    }
    
    if (reportContent) {
        res.status(200).json({
            success: true,
            report: reportContent,
            generated: fs.statSync(foundPath).mtime.toISOString()
        });
    } else {
        res.status(200).json({
            success: false,
            message: 'No hourly report generated yet'
        });
    }
};
