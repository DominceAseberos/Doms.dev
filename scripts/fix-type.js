import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const portfolioData = JSON.parse(rawData);

const targetProjects = [
  "project-fashion",
  "project-velocity",
  "project-deep-sea",
  "project-peak"
];

portfolioData.projects.forEach(project => {
  if (targetProjects.includes(project.id)) {
    project.projectType = "LANDING PAGE";
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Fixed project types to LANDING PAGE successfully!');
