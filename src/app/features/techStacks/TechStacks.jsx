import React, { useMemo } from "react";
import { usePortfolioData } from "@shared/hooks/usePortfolioData";
import { getIconByName, getBrandColorByName } from "@shared/utils/IconRegistry";

const TechStacks = () => {
  const { techStack: rawTechStack } = usePortfolioData();

  const techStack = useMemo(() => {
    return rawTechStack
      .filter(t => t.type === "core" || t.type === "tool")
      .map(t => ({
        ...t,
        brandColor: getBrandColorByName(t.iconName || t.name),
        Icon: getIconByName(t.iconName || t.name)
      }));
  }, [rawTechStack]);

  return (
    <div
      className="relative h-full w-full overflow-hidden  rounded-3xl group/marquee"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>

      {/* Container that provides the height and vertical centering */}
      <div className="relative h-full w-full flex items-center min-h-[80px] px-4 overflow-hidden">

        {/* Mobile/Tablet View: Grid Layout (Existing) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full md:hidden">
          {techStack.slice(0, 12).map((tech, index) => (
            <TechCard key={`mobile-${index}`} tech={tech} />
          ))}
        </div>

        {/* Desktop View: Marquee/Slider (New) */}
        <div className="hidden md:flex flex-nowrap w-full group/track">
          <div className="flex flex-nowrap gap-4 animate-marquee hover:[animation-play-state:paused]">
            {/* First set of items */}
            {techStack.map((tech, index) => (
              <TechCard key={`desktop-1-${index}`} tech={tech} />
            ))}
            {/* Duplicate set for seamless loop */}
            {techStack.map((tech, index) => (
              <TechCard key={`desktop-2-${index}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted Card Component to keep code DRY
const TechCard = ({ tech }) => (
  <div
    className="tech-icon-card relative flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-8 lg:w-12 lg:h-12 xl:w-12 md:h-8 xl:h-12 shrink-0 rounded-xl border cursor-pointer bg-white/[0.03] border-white/[0.05] hover:scale-105 transition-all ease-in-out duration-600 hover:-translate-y-0.5"
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = `${tech.brandColor}15`;
      e.currentTarget.style.borderColor = `${tech.brandColor}40`;
      e.currentTarget.style.boxShadow = `0 0 20px ${tech.brandColor}20`;
      const icon = e.currentTarget.querySelector('.icon-wrapper');
      if (icon) {
        icon.style.color = tech.brandColor;
        icon.style.filter = `drop-shadow(0 0 8px ${tech.brandColor}80)`;
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.boxShadow = 'none';
      const icon = e.currentTarget.querySelector('.icon-wrapper');
      if (icon) {
        icon.style.color = 'rgb(var(--contrast-rgb))';
        icon.style.filter = 'none';
      }
    }}
  >
    <span
      className="icon-wrapper transition-all ease duration-500"
      style={{
        color: 'rgb(var(--contrast-rgb)',
      }}
    >
      <tech.Icon size={24} strokeWidth={2} />
    </span>
  </div>
);


export default TechStacks;
