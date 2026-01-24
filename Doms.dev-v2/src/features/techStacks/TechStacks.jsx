import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  SiReact, SiNextdotjs, SiTailwindcss, 
  SiGreensock, SiTypescript, SiThreedotjs, 
  SiPython, SiFigma, SiSupabase, SiDocker 
} from "react-icons/si";

const TechMarquee = () => {
  const scrollRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const element = scrollRef.current;
    const totalWidth = element.scrollWidth / 2;

    animRef.current = gsap.to(element, {
      x: -totalWidth,
      duration: 15, // Slightly faster for mobile to keep it engaging
      ease: "none",
      repeat: -1,
    });

    return () => animRef.current?.kill();
  }, []);

  // Pause/Play logic for both Mouse and Touch
  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

  const techStack = [
    { icon: <SiReact color="#61DAFB" />, name: "React", type: "core" },
    { icon: <SiNextdotjs color="#ffffff" />, name: "Next.js", type: "core" },
    { icon: <SiGreensock color="#88CE02" />, name: "GSAP", type: "core" },
    { icon: <SiTailwindcss color="#06B6D4" />, name: "Tailwind", type: "tool" },
    { icon: <SiFigma color="#F24E1E" />, name: "Figma", type: "tool" },
    { icon: <SiSupabase color="#3ECF8E" />, name: "Supabase", type: "tool" },
    { icon: <SiPython color="#FFE873" />, name: "Python", type: "learning" },
    { icon: <SiThreedotjs color="#ffffff" />, name: "Three.js", type: "learning" },
    { icon: <SiDocker color="#2496ED" />, name: "Docker", type: "learning" },
  ];

  return (
    <div 
      className="relative h-full w-full overflow-hidden rounded-3xl flex items-center p-2"
      onMouseEnter={pause}
      onMouseLeave={play}
      onTouchStart={pause}
      onTouchEnd={play}
      style={{
          background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}>
      
  

      <div ref={scrollRef} className="flex flex-row gap-3 px-4 whitespace-nowrap">
        {[...techStack, ...techStack].map((tech, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col items-center justify-center p-2 rounded-xl border border-white/10 active:border-green-400 active:bg-white active:scale-95 transition-all duration-200 w-12 h-12 shrink-0"
          >
            {tech.type === "learning" && (
              <span className="absolute -top-0.5 px-1 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-[4px] text-yellow-500 font-bold uppercase tracking-tighter">
                Learning
              </span>
            )}
            
            <span className="text-xl group-active:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all">
              {tech.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;