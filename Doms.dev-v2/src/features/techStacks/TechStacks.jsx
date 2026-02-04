import React, { useMemo } from "react";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { getIconByName, getBrandColorByName } from "../../utils/IconRegistry";

const TechStacks = () => {
  const { techStack: rawTechStack } = usePortfolioData();

  const techStack = useMemo(() => {
    return rawTechStack
      .filter(t => t.type === "core" || t.type === "tool")
      .slice(0, 12)
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
      <div className="relative h-full w-full flex justify-center items-center min-h-[80px] px-4">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
          {techStack.map((tech, index) => {
            return (
              <div
                key={index}
                className="tech-icon-card relative flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-8 lg:w-14 lg:h-14 xl:w-16 md:h-8  xl:h-16 shrink-0 rounded-xl border cursor-pointer bg-white/[0.03] border-white/[0.05] hover:scale-105 transition-all ease-in-out duration-600 hover:-translate-y-0.5"
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
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStacks;
