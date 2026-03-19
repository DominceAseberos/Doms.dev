const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'portfolioData.json');
const uploadsDir = path.join(__dirname, 'public', 'assets', 'uploads');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const validProjectIds = new Set(data.projects.map(p => p.id));
// Also keep 'general' or others if needed
validProjectIds.add('general');

if (fs.existsSync(uploadsDir)) {
    const folders = fs.readdirSync(uploadsDir);
    let deletedCount = 0;
    
    folders.forEach(folder => {
        const folderPath = path.join(uploadsDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            if (!validProjectIds.has(folder)) {
                console.log('Deleting orphaned folder:', folder);
                fs.rmSync(folderPath, { recursive: true, force: true });
                deletedCount++;
            }
        }
    });
    console.log(`Orphan cleanup complete! Deleted ${deletedCount} unused project folders.`);
} else {
    console.log('No uploads directory found.');
}
