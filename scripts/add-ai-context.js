import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const portfolioData = JSON.parse(rawData);

const targetProjects = [
  "project-deep-sea",
  "project-peak",
  "project-velocity",
  "project-fashion",
  "project-kernel",
  "project-vayora"
];

portfolioData.projects.forEach(project => {
  if (targetProjects.includes(project.id)) {
      // Check if it already has the AI Context section to prevent duplicates
      const hasAiSection = project.contentSections.some(sec => sec.sectionTitle === "Applied AI Engineering");
      
      if (!hasAiSection) {
          project.contentSections.push({
              "id": `${project.id}-ai-context`,
              "sectionTitle": "Applied AI Engineering",
              "layout": "full",
              "columns": [
                  {
                      "id": `${project.id}-ai-col`,
                      "columnTitle": "",
                      "blocks": [
                          {
                              "id": `${project.id}-ai-text`,
                              "type": "text",
                              "content": "This project serves as an exercise in rapid prototyping via strict LLM constraint prompting. To prevent AI component hallucination, a rigorous Master System Prompt was engineered to lock the model into specific DOM architectures, responsive breakpoints, and motion physics. You can view the raw AI Directive used for this build by clicking the Skills.md button at the top of this case study."
                          }
                      ]
                  }
              ]
          });
      }
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Successfully injected Applied AI Engineering sections into landing pages!');
