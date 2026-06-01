const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/portfolioData.json');
const publicDir = path.join(__dirname, '../public');

const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

let updated = 0;

data.projects.forEach(project => {
    if (['project-serveflow', 'project-baylora', 'project-pixvault', 'project-catsy'].includes(project.id)) {
        if (project.primaryBtnUrl && project.primaryBtnUrl.startsWith('/assets/markdowns/') && project.primaryBtnUrl.endsWith('.md')) {
            const mdPath = path.join(publicDir, project.primaryBtnUrl);
            if (fs.existsSync(mdPath)) {
                const mdContent = fs.readFileSync(mdPath, 'utf8');
                
                // Ensure contentSections exists
                if (!project.contentSections) project.contentSections = [];
                
                // Check if we already appended it
                const alreadyAppended = project.contentSections.some(sec => 
                    sec.id === "appended-arch-" + project.id
                );

                if (!alreadyAppended) {
                    project.contentSections.push({
                        "id": "appended-arch-" + project.id,
                        "sectionTitle": "System Documentation",
                        "layout": "full",
                        "columns": [
                            {
                                "id": "col-1-" + project.id,
                                "columnTitle": "",
                                "blocks": [
                                    {
                                        "id": "block-1-" + project.id,
                                        "type": "text",
                                        "content": mdContent
                                    }
                                ]
                            }
                        ]
                    });
                    updated++;
                    console.log(`Appended documentation to ${project.title}`);
                }
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
