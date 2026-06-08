const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src/data/portfolioData.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const catsy = data.projects.find(p => p.id === 'project-catsy');

if (catsy) {
    if (!catsy.contentSections) {
        catsy.contentSections = [];
    }

    const archSection = {
        "id": "catsy-arch-diagram",
        "sectionTitle": "System Architecture",
        "titleAlignment": "center",
        "layout": "full",
        "columns": [
            {
                "id": "catsy-arch-col",
                "columnTitle": "",
                "blocks": [
                    {
                        "id": "catsy-arch-img",
                        "type": "image",
                        "src": "/assets/uploads/project-catsy/imgs/architecture.png"
                    }
                ]
            }
        ]
    };

    // Check if it already exists
    const exists = catsy.contentSections.some(s => s.id === 'catsy-arch-diagram');
    if (!exists) {
        catsy.contentSections.push(archSection);
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
        console.log('Added Architecture section to Catsy.');
    } else {
        console.log('Architecture section already exists.');
    }
}
