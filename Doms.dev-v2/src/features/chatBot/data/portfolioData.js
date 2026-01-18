
export const portfolioData = {
  identity: {
    name: "John Doe", 
    role: "React Developer",
    location: "Davao City",
  },
  techStack: ["React", "Tailwind CSS", "Node.js", "Zustand"],
  socials: {
    github: "https://github.com/yourusername",
    email: "contact@example.com"
  },
  projects: [
    { name: "Portfolio Bot", desc: "A chatbot built with React & Tailwind." },
    { name: "E-Commerce", desc: "Online store dashboard." }
  ]
};

// Simple keyword matching logic
export const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("hello") || lowerInput.includes("hi")) 
    return "Hello! Ask me about my projects, skills, or contact info.";
  
  if (lowerInput.includes("skill") || lowerInput.includes("stack")) 
    return `My core stack is: ${portfolioData.techStack.join(", ")}.`;

  if (lowerInput.includes("project") || lowerInput.includes("work")) 
    return "I've worked on: " + portfolioData.projects.map(p => p.name).join(", ");

  if (lowerInput.includes("contact") || lowerInput.includes("email")) 
    return `Email me at ${portfolioData.socials.email} or check my GitHub!`;

  return "I'm not sure. Try asking about my skills or projects!";
};