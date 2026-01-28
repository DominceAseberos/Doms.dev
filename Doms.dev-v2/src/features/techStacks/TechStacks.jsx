import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { getIconByName, getBrandColorByName } from "../../utils/IconRegistry";

const TechMarquee = () => {
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const containerRef = useRef(null);
  const { techStack: rawTechStack } = usePortfolioData();

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

  const { contextSafe } = useGSAP({ scope: containerRef });

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

  const onIconEnter = contextSafe((e) => {
    const brandColor = e.currentTarget.dataset.color;
    gsap.to(e.currentTarget, {
      scale: 1.1,
      y: -2,
      backgroundColor: `${brandColor}10`,
      borderColor: `${brandColor}40`,
      boxShadow: `0 0 20px ${brandColor}20`,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(e.currentTarget.querySelector('.icon-wrapper'), {
      color: brandColor,
      filter: `drop-shadow(0 0 8px ${brandColor}80)`,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  const onIconLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: 'none',
      duration: 0.3,
      ease: "power1.inOut"
    });
    gsap.to(e.currentTarget.querySelector('.icon-wrapper'), {
      color: 'rgba(255, 255, 255, 0.2)',
      filter: 'none',
      duration: 0.3,
      ease: "power1.inOut"
    });
  });

  return (
    <div
      ref={containerRef}
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
          return (
            <div
              key={index}
              data-color={tech.brandColor}
              onMouseEnter={onIconEnter}
              onMouseLeave={onIconLeave}
              className="relative flex flex-col items-center justify-center w-12 h-12 shrink-0 rounded-xl border cursor-pointer"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <span
                className="icon-wrapper"
                style={{
                  color: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <tech.Icon size={20} strokeWidth={2} />
              </span>

              {tech.type === "learning" && (
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
