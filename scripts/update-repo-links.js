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
    project.githubUrl = ""; // clear any existing URL
    project.githubBtnUrl = "";
    project.githubBtnLabel = "Private Repo";
  }
  
  // also explicitly update the liveUrl for fashion just in case
  if (project.id === "project-fashion") {
      project.liveUrl = "https://shop-cheq.vercel.app/";
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Updated portfolioData.json with Private Repo indicators and correct Fashion URL!');
