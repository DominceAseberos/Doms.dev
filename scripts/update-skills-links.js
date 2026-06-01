import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const portfolioData = JSON.parse(rawData);

const linkMap = {
  "project-fashion": "/fashion-skills.md",
  "project-velocity": "/velocity-skills.md",
  "project-deep-sea": "/deep-sea-skills.md",
  "project-peak": "/peak-skills.md"
};

portfolioData.projects.forEach(project => {
  if (linkMap[project.id]) {
    project.primaryBtnUrl = linkMap[project.id];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Updated portfolioData.json with individual skills.md links successfully!');
