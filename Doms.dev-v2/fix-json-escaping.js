const fs = require('fs');
const path = require('path');

// Read the JSON file
const filePath = path.join(__dirname, 'src', 'features', 'projects', 'data', 'dataProjects.json');
const rawData = fs.readFileSync(filePath, 'utf8');

// Parse JSON (this automatically converts \\n to \n)
const projects = JSON.parse(rawData);

// Write back with proper formatting (this will use \n not \\n)
fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');

console.log('✅ Fixed JSON escaping in dataProjects.json');
