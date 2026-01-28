import React, { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { getIconByName, getBrandColorByName } from "../../utils/IconRegistry";

const TechMarquee = () => {
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const { techStack: rawTechStack } = usePortfolioData();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const techStack = useMemo(() => {
    return rawTechStack
      .filter(t => t.type === "core" || t.type === "tool")
      .slice(0, 10) // Increased limit for better marquee flow
      .map(t => ({
        ...t,
        brandColor: getBrandColorByName(t.iconName || t.name),
        Icon: getIconByName(t.iconName || t.name)
      }));
  }, [rawTechStack]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const element = scrollRef.current;

    gsap.set(element, { willChange: "transform" });
    const totalWidth = element.scrollWidth / 2;

    animRef.current = gsap.to(element, {
      x: -totalWidth,
      duration: 30, // Slower marquee for premium feel
      ease: "none",
      repeat: -1,
      force3D: true,
    });

    return () => animRef.current?.kill();
  }, [techStack]);

  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl flex items-center p-2 group/marquee"
      onMouseEnter={pause}
      onMouseLeave={play}
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>

      <div ref={scrollRef} className="flex flex-row gap-3 px-4 whitespace-nowrap">
        {[...techStack, ...techStack].map((tech, index) => {
          const isHovered = hoveredIndex === index;
          const brandColor = tech.brandColor;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex flex-col items-center justify-center w-12 h-12 shrink-0 rounded-xl border transition-all duration-500 cursor-pointer group/icon"
              style={{
                backgroundColor: isHovered ? `${brandColor}10` : 'rgba(255, 255, 255, 0.03)',
                borderColor: isHovered ? `${brandColor}40` : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isHovered ? `0 0 20px ${brandColor}20` : 'none',
                transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)'
              }}
            >
              <span
                className="transition-all duration-500"
                style={{
                  color: isHovered ? brandColor : 'rgba(255, 255, 255, 0.2)',
                  filter: isHovered ? `drop-shadow(0 0 8px ${brandColor}80)` : 'none'
                }}
              >
                <tech.Icon size={20} strokeWidth={isHovered ? 2.5 : 2} />
              </span>

              {tech.type === "learning" && !isHovered && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechMarquee;
