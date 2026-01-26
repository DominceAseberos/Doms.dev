import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import {
  SiReact, SiNextdotjs, SiTailwindcss,
  SiGreensock, SiTypescript, SiThreedotjs,
  SiPython, SiFigma, SiSupabase, SiDocker,
  SiJavascript, SiNodedotjs, SiReactquery,
  SiGit
} from "react-icons/si";
import { usePortfolioData } from "../../hooks/usePortfolioData";

const TechMarquee = () => {
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const { techStack: rawTechStack } = usePortfolioData();

  // Mapping string names from JSON to React Icon components
  const iconMap = {
    "React": <SiReact color="#61DAFB" />,
    "Next.js": <SiNextdotjs color="#ffffff" />,
    "GSAP": <SiGreensock color="#88CE02" />,
    "Tailwind": <SiTailwindcss color="#06B6D4" />,
    "Figma": <SiFigma color="#F24E1E" />,
    "Supabase": <SiSupabase color="#3ECF8E" />,
    "Python": <SiPython color="#FFE873" />,
    "Three.js": <SiThreedotjs color="#ffffff" />,
    "Docker": <SiDocker color="#2496ED" />,
    "JavaScript (ES6+)": <SiJavascript color="#F7DF1E" />,
    "Node.js": <SiNodedotjs color="#339933" />,
    "TanStack Query": <SiReactquery color="#FF4154" />,
    "Git": <SiGit color="#F05032" />
  };

  const techStack = useMemo(() => {
    return rawTechStack
      .filter(t => t.type === "core" || t.type === "tool" || t.type === "learning")
      .map(t => ({
        ...t,
        icon: iconMap[t.name] || <SiReact /> // Fallback icon
      }));
  }, [rawTechStack]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const element = scrollRef.current;
    const totalWidth = element.scrollWidth / 2;

    animRef.current = gsap.to(element, {
      x: -totalWidth,
      duration: 15,
      ease: "none",
      repeat: -1,
    });

    return () => animRef.current?.kill();
  }, [techStack]);

  // Pause/Play logic for both Mouse and Touch
  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

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

            <span className="text-xl group-active:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all hover:scale-110 hover:cursor-pointer ">
              {tech.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;