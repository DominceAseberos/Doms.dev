import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { getIconByName } from "../../utils/IconRegistry";

const TechMarquee = () => {
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const { techStack: rawTechStack } = usePortfolioData();

  const techStack = useMemo(() => {
    return rawTechStack
      .filter(t => t.type === "core" || t.type === "tool" || t.type === "learning")
      .map(t => {
        const Icon = getIconByName(t.iconName || t.name);
        return {
          ...t,
          icon: <Icon color={t.color || "white"} />
        };
      });
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