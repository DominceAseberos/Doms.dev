import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const portfolioData = JSON.parse(rawData);

const nameFixes = {
  "project-fashion": "FASHION SHOP",
  "project-velocity": "VELOCITY",
  "project-deep-sea": "DEEP SEA",
  "project-peak": "PEAK"
};

portfolioData.projects.forEach(project => {
  if (nameFixes[project.id]) {
    project.title = nameFixes[project.id];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Fixed the project titles successfully!');
