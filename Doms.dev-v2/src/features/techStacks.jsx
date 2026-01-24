import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  SiReact, SiNextdotjs, SiTailwindcss, 
  SiGreensock, SiTypescript, SiThreedotjs, 
  SiPython, SiFigma, SiSupabase, SiDocker 
} from "react-icons/si";

const TechMarquee = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current;
    const totalHeight = element.scrollHeight / 2;

    const animation = gsap.to(element, {
      y: -totalHeight,
      duration: 25, // Slower speed to allow reading labels
      ease: "none",
      repeat: -1,
    });

    // Pause on hover so people can read the "Learning" status
    return () => animation.kill();
  }, []);

  const techStack = [
    // CORE STACK
    { icon: <SiReact color="#61DAFB" />, name: "React", type: "core" },
    { icon: <SiNextdotjs color="#ffffff" />, name: "Next.js", type: "core" },
    { icon: <SiGreensock color="#88CE02" />, name: "GSAP", type: "core" },
    
    // SUB / TOOLS
    { icon: <SiTailwindcss color="#06B6D4" />, name: "Tailwind", type: "tool" },
    { icon: <SiFigma color="#F24E1E" />, name: "Figma", type: "tool" },
    { icon: <SiSupabase color="#3ECF8E" />, name: "Supabase", type: "tool" },

    // CURRENTLY LEARNING
    { icon: <SiPython color="#FFE873" />, name: "Python", type: "learning" },
    { icon: <SiThreedotjs color="#ffffff" />, name: "Three.js", type: "learning" },
    { icon: <SiDocker color="#2496ED" />, name: "Docker", type: "learning" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl flex flex-col items-center "
     style={{
          background: `linear-gradient(
                         to bottom,
                          rgba(var(--box-Linear-1-rgb))  ,
                          rgba(var(--box-Linear-2-rgb))  
                     )`
        }}>

      <div ref={scrollRef} className="flex flex-row gap-6 py-8">
        {[...techStack, ...techStack].map((tech, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-white/10 hover:border-green-400/50 transition-all duration-500 w-18 h-18"
          >
            {/* Logic-based Badges */}
            {tech.type === "learning" && (
              <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-[8px] text-yellow-500 font-bold uppercase tracking-tighter animate-pulse">
                Learning
              </span>
            )}
            {tech.type === "tool" && (
              <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/50 text-[8px] text-blue-500 font-bold uppercase tracking-tighter">
                Tool
              </span>
            )}

            <span className="text-4xl mb-2 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all">
              {tech.icon}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-white transition-colors">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;