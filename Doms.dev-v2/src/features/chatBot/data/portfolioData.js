// src/data/portfolioData.js

export const portfolioData = {
  identity: {
    name: "Domince A. Aseberos", 
    role: "React Developer",
    location: "Davao City, Philippines",
    bio: "I showcase personal projects, audio visualizers, and creative experiments."
  },
  techStack: ["React", "Tailwind CSS", "Node.js", "Zustand", "TanStack Query"],
  projects: [
    { name: "Portfolio Bot", desc: "A chatbot built with React & Tailwind." },
    { name: "Interactive Game", desc: "A mini-game feature in my portfolio." },
    { name: "Audio Visualizer", desc: "React-based audio visualization experiments." }
  ],
  contact: {
    email: "contact@example.com",
    github: "github.com/yourusername"
  }
};

// Turn the JSON into a readable string for the AI
export const PORTFOLIO_CONTEXT = `
You are an AI assistant for ${portfolioData.identity.name}'s portfolio website.
Your role is to answer visitor questions nicely and professionally.

Here is ${portfolioData.identity.name}'s specific data:
- Role: ${portfolioData.identity.role}
- Location: ${portfolioData.identity.location}
- Bio: ${portfolioData.identity.bio}
- Tech Stack: ${portfolioData.techStack.join(", ")}
- Projects: ${portfolioData.projects.map(p => `${p.name} (${p.desc})`).join(", ")}
- Contact: Email at ${portfolioData.contact.email}

Rules:
1. Answer strictly based on this data.
2. If asked about something not here (like "what is the capital of France"), politely say you only know about ${portfolioData.identity.name}.
3. Keep answers concise (under 3 sentences) unless asked for details.
`;