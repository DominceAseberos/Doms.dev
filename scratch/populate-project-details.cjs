const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/portfolioData.json');
const publicDir = path.join(__dirname, '../public');

const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

let updated = 0;

data.projects.forEach(project => {
    if (!project.contentSections || project.contentSections.length === 0) {
        if (project.primaryBtnUrl && project.primaryBtnUrl.startsWith('/assets/markdowns/') && project.primaryBtnUrl.endsWith('.md')) {
            const mdPath = path.join(publicDir, project.primaryBtnUrl);
            if (fs.existsSync(mdPath)) {
                const mdContent = fs.readFileSync(mdPath, 'utf8');
                
                project.contentSections = [
                    {
                        "id": "arch-section-" + project.id,
                        "sectionTitle": "System Documentation",
                        "layout": "full",
                        "columns": [
                            {
                                "id": "col-1",
                                "columnTitle": "",
                                "blocks": [
                                    {
                                        "id": "block-1",
                                        "type": "text",
                                        "content": mdContent
                                    }
                                ]
                            }
                        ]
                    }
                ];
                updated++;
                console.log(`Populated contentSections for ${project.title}`);
            }
        }
    }
});

if (updated > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    console.log(`Successfully updated ${updated} projects in portfolioData.json`);
} else {
    console.log('No projects needed updating.');
}
