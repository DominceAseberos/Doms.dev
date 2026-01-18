// src/data/portfolioData.js

export const portfolioData = {
  identity: {
    name: "Domince A. Aseberos",
    role: "Web Developer",
    location: "Davao City, Philippines",
    bio: "I build real-world, interactive web applications using modern JavaScript frameworks, focusing on performance, clean UI, and practical features.",
    age: "22 years old",
    birthday: "September 7, 2003",
  },
  
education: {
  level: "Undergraduate",
  yearLevel: 3,
  school: "University of Mindanao – Tagum City",
  degree: "Bachelor of Science in Computer Science",
},


  techStack: [
    "React",
    "Tailwind CSS",
    "JavaScript (ES6+)",
    "Node.js",
    "TanStack Query",
    "Zustand",
    "Axios",
    "GSAP",
    "Git",
  ],

interests: [
"Developing applications that solve real-world problems",
"Custom landing page development",
"Building interactive and performance-focused user interfaces"
],

projects: [
  {
    name: "Banana Leaf Disease Detector",
    desc: "A machine learning web application built with Python, OpenCV, scikit-learn, and Flask to detect whether a banana leaf is Healthy, Unhealthy, or Not a Leaf using image processing and KNN classification."
  },
  {
    name: "AI Text Summarizer",
    desc: "A web application that generates concise summaries from long text or articles using an AI-powered NLP API."
  },
  {
     name: "Baylora",
    desc: "A modern marketplace and trading platform where users can sell, trade, or mix transactions, with bidding, verified profiles, and secure authentication."
    },
    
  {
    name: "Templyx",
    desc: "A modern portfolio platform for developers with authentication, real-time features, and community interaction."
  },
 
    {
    name: "Summarizer",
    desc: "A Flask web app that extracts text from DOC/DOCX files and generates concise summaries using Python libraries (Sumy, NLTK, python-docx, textract) with a simple web interface."
    },
    
],

    Experience: [
     "No formal experience yet currently building personal projects and learning full-stack development"
    ],


  contacts: {
    email: "daseberos@gmail.com",
    github: "https://github.com/Domincee",
    messenger: "https://www.messenger.com/t/domince.aseberos"
  }
};


export const PORTFOLIO_CONTEXT = `
You are an AI assistant for ${portfolioData.identity.name}'s portfolio website.
Your role is to answer visitor questions clearly, professionally, and friendly.

Here is ${portfolioData.identity.name}'s information:
- Role: ${portfolioData.identity.role}
- Location: ${portfolioData.identity.location}
- Bio: ${portfolioData.identity.bio}
- Tech Stack: ${portfolioData.techStack.join(", ")}
- Projects: ${portfolioData.projects
  .map(p => `${p.name}: ${p.desc}`)
  .join(" | ")}
- Age: ${portfolioData.identity.age}
- 
- Birthday: ${portfolioData.identity.birthday}
- Contact Email: ${portfolioData.contacts.email}
- GitHub: ${portfolioData.contacts.github}
- Experience: ${portfolioData.Experience}
- Education:
  - Level: ${portfolioData.education.level}
  - Year Level: ${portfolioData.education.yearLevel}
  - School: ${portfolioData.education.school}
  - Degree: ${portfolioData.education.degree}


  
Rules:
1. Answer strictly based on this data only.
2. If asked about topics outside this portfolio, politely say you only know information about ${portfolioData.identity.name}.
3. Keep answers concise (1–3 sentences) unless the visitor asks for more detail.
4. Maintain a friendly, professional developer tone.
5. When describing projects, only provide a **short description** and limit to the **first three projects**.
6. Never invent details, dates, or tech not listed in the data.
7. If asked about experience, answer based on personal projects, learning, and academic work. Do not invent formal job history.


`;
