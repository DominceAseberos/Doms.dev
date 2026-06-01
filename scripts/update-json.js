import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'portfolioData.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const portfolioData = JSON.parse(rawData);

const updates = {
  "project-fashion": {
    shortDescription: "An immersive, editorial-style fashion storefront focusing on 'quiet luxury' with smooth scrollytelling and high-end visual pacing.",
    contentSections: [
      {
        id: "fashion-overview",
        sectionTitle: "Overview",
        layout: "full",
        columns: [
          {
            id: "fashion-overview-col",
            columnTitle: "",
            blocks: [
              {
                id: "fashion-overview-text",
                type: "text",
                content: "The Fashion Storefront is a personal project built for practicing storytelling website development. It focuses on creating an immersive, editorial-style experience with smooth scrollytelling and high-end visual pacing, emphasizing a 'quiet luxury' aesthetic."
              }
            ]
          }
        ]
      },
      {
        id: "fashion-arch",
        sectionTitle: "Architecture",
        layout: "2-equal",
        columns: [
          {
            id: "fashion-arch-left",
            columnTitle: "Tech Stack",
            blocks: [
              { id: "fashion-core", type: "chips", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP"] }
            ]
          },
          {
            id: "fashion-arch-right",
            columnTitle: "Design System",
            blocks: [
              { id: "fashion-colors", type: "color-palette", colors: ["#F4F1EC", "#0E0E0E", "#3A1A1A", "#A89684"] },
              { id: "fashion-fonts", type: "font-preview", fonts: [
                { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", role: "Display & Headings" },
                { name: "Inter", family: "'Inter', sans-serif", role: "Body & UI" }
              ]}
            ]
          }
        ]
      },
      {
        id: "fashion-features",
        sectionTitle: "Key Features",
        layout: "full",
        columns: [
          {
            id: "fashion-feat-col",
            columnTitle: "",
            blocks: [
              {
                id: "fashion-feat-list",
                type: "list",
                items: [
                  "Aesthetic: 'Quiet Luxury' Editorial Design",
                  "Motion: GSAP Scrollytelling Pacing",
                  "Layout: High-end Visual Merchandising"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "project-velocity": {
    shortDescription: "A premium, high-performance private car collection interface featuring cinematic video panels and immersive dark-mode scrollytelling.",
    contentSections: [
      {
        id: "velocity-overview",
        sectionTitle: "Overview",
        layout: "full",
        columns: [
          {
            id: "velocity-overview-col",
            columnTitle: "",
            blocks: [
              {
                id: "velocity-overview-text",
                type: "text",
                content: "VELOCE is designed around a premium, high-performance private car collection, focusing on cinematic video panels and immersive scrollytelling. It features dark mode textures like carbon fiber, gold accents, and elegant typography to deliver a luxury aesthetic."
              }
            ]
          }
        ]
      },
      {
        id: "velocity-arch",
        sectionTitle: "Architecture",
        layout: "2-equal",
        columns: [
          {
            id: "velocity-arch-left",
            columnTitle: "Tech Stack",
            blocks: [
              { id: "velocity-core", type: "chips", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP", "Lenis"] }
            ]
          },
          {
            id: "velocity-arch-right",
            columnTitle: "Design System",
            blocks: [
              { id: "velocity-colors", type: "color-palette", colors: ["#1A1A1A", "#F1C40F", "#BDC3C7", "#2C3E50"] },
              { id: "velocity-fonts", type: "font-preview", fonts: [
                { name: "Playfair Display", family: "'Playfair Display', serif", role: "Primary Display" },
                { name: "DM Mono", family: "'DM Mono', monospace", role: "Technical Details" }
              ]}
            ]
          }
        ]
      },
      {
        id: "velocity-features",
        sectionTitle: "Key Features",
        layout: "full",
        columns: [
          {
            id: "velocity-feat-col",
            columnTitle: "",
            blocks: [
              {
                id: "velocity-feat-list",
                type: "list",
                items: [
                  "Aesthetic: High-Performance Luxury Carbon & Gold",
                  "Motion: Lenis hardware-accelerated scroll + Infinite Marquees",
                  "Media: Cinematic Video Panel Scrollytelling"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "project-peak": {
    shortDescription: "A high-end scrollytelling experience designed to explore peak athletic performance through smooth micro-interactions and cohesive visual branding.",
    contentSections: [
      {
        id: "peak-overview",
        sectionTitle: "Overview",
        layout: "full",
        columns: [
          {
            id: "peak-overview-col",
            columnTitle: "",
            blocks: [
              {
                id: "peak-overview-text",
                type: "text",
                content: "Peak Performance Lab explores immersive, high-end scrollytelling experiences using modern web technologies. The project leverages smooth micro-interactions and cohesive visual branding to deliver a premium user experience."
              }
            ]
          }
        ]
      },
      {
        id: "peak-arch",
        sectionTitle: "Architecture",
        layout: "2-equal",
        columns: [
          {
            id: "peak-arch-left",
            columnTitle: "Tech Stack",
            blocks: [
              { id: "peak-core", type: "chips", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "GSAP"] }
            ]
          },
          {
            id: "peak-arch-right",
            columnTitle: "Design System",
            blocks: [
              { id: "peak-colors", type: "color-palette", colors: ["#020817", "#1E293B", "#3B82F6", "#F59E0B"] },
              { id: "peak-fonts", type: "font-preview", fonts: [
                { name: "Instrument Sans", family: "'Instrument Sans', sans-serif", role: "Primary Body" },
                { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", role: "Display Titles" }
              ]}
            ]
          }
        ]
      },
      {
        id: "peak-features",
        sectionTitle: "Key Features",
        layout: "full",
        columns: [
          {
            id: "peak-feat-col",
            columnTitle: "",
            blocks: [
              {
                id: "peak-feat-list",
                type: "list",
                items: [
                  "Aesthetic: Premium Athletic Performance UI",
                  "Components: Accessible shadcn/ui foundations",
                  "Interaction: Bespoke micro-interactions & GSAP triggers"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "project-deep-sea": {
    shortDescription: "An immersive aquatic-themed scrollytelling experience utilizing dynamic visual elements and fluid animations to simulate a deep-dive narrative.",
    contentSections: [
      {
        id: "deep-sea-overview",
        sectionTitle: "Overview",
        layout: "full",
        columns: [
          {
            id: "deep-sea-overview-col",
            columnTitle: "",
            blocks: [
              {
                id: "deep-sea-overview-text",
                type: "text",
                content: "Deep-Sea serves as an exploration of immersive, aquatic-themed scrollytelling, utilizing dynamic visual elements and video playback to simulate a deep-dive experience into the ocean's depths."
              }
            ]
          }
        ]
      },
      {
        id: "deep-sea-arch",
        sectionTitle: "Architecture",
        layout: "2-equal",
        columns: [
          {
            id: "deep-sea-arch-left",
            columnTitle: "Tech Stack",
            blocks: [
              { id: "deep-sea-core", type: "chips", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP"] }
            ]
          },
          {
            id: "deep-sea-arch-right",
            columnTitle: "Design System",
            blocks: [
              { id: "deep-sea-colors", type: "color-palette", colors: ["#0a0540", "#26c2e6", "#b31a33"] },
              { id: "deep-sea-fonts", type: "font-preview", fonts: [
                { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", role: "Story Titles" },
                { name: "Space Mono", family: "'Space Mono', monospace", role: "Depth Meters & HUD" }
              ]}
            ]
          }
        ]
      },
      {
        id: "deep-sea-features",
        sectionTitle: "Key Features",
        layout: "full",
        columns: [
          {
            id: "deep-sea-feat-col",
            columnTitle: "",
            blocks: [
              {
                id: "deep-sea-feat-list",
                type: "list",
                items: [
                  "Theme: Atmospheric Oceanic Depth",
                  "Motion: Synchronized GSAP Scroll Tracking",
                  "Effects: Pure CSS Particle Bubbles & Creature Animations"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

portfolioData.projects.forEach(project => {
  if (updates[project.id]) {
    project.shortDescription = updates[project.id].shortDescription;
    project.contentSections = updates[project.id].contentSections;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 4), 'utf8');
console.log('Successfully updated portfolioData.json with refined content!');
