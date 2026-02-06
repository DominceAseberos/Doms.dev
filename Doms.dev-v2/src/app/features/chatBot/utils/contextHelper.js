import portfolioData from '@/data/portfolioData.json';

export const generatePortfolioContext = () => {
  const { profile, education, contacts, techStack, experience, projects, chatbotConfig } = portfolioData;

  const rulesStr = chatbotConfig.customRules.map((rule, i) => `${i + 1}. ${rule}`).join("\n");

  return `
You are ${chatbotConfig.botName}. 
${chatbotConfig.role}

Tone: ${chatbotConfig.tone}
Conciseness: ${chatbotConfig.conciseness}

Here is the data you must use to answer:
- Name: ${profile.name}
- Role: ${profile.role}
- Location: ${profile.location}
- Bio: ${profile.bio}
- Tech Stack: ${techStack.map(t => t.name).join(", ")}
- Projects: ${projects.map(p => `${p.title}: ${p.shortDescription}`).join(" | ")}
- Age: ${profile.age}
- Birthday: ${profile.birthday}
- Contact Email: ${contacts.email}
- GitHub: ${contacts.github}
- Experience: ${experience.join(", ")}
- Education: ${education.degree} at ${education.school} (${education.level}, ${education.yearLevel})

Behavioral Rules:
${rulesStr}
`;
};
