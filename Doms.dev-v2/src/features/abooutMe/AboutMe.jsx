import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";

const AboutMe = () => {
  const btnRef = useRef(null);
  const { profile } = usePortfolioData();

  return (
    <div
      className="flex flex-col justify-between gap-1 rounded-2xl p-4 md:p-3 lg:p-5 h-full w-full overflow-hidden border border-white/5"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      <div className="space-y-1">
        <h1 className="font-bold tracking-tight text-[clamp(14px,2vw,20px)] leading-none" style={{ color: 'rgb(var(--contrast-rgb))' }}>
          {profile.name}
        </h1>
        <p className="text-gray-300 font-medium leading-snug text-[clamp(10px,1.2vw,13px)] line-clamp-3 md:line-clamp-2 lg:line-clamp-3">
          {profile.bio}
        </p>
      </div>

      {/* Theme-Matched Action Button - Now with Link */}
      <div className="w-full flex justify-end">
        <Link to="/about">
          <button
            className="w-fit px-4 py-2.5 rounded-full text-black font-bold uppercase tracking-widest text-[8px] md:text-[9px] lg:text-[11px] transition-all duration-200 active:scale-110 active:-rotate-2 hover:scale-110 hover:-rotate-1 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
            style={{
              background: `rgb(var(--contrast-rgb))`,
            }}
          >
            About Me
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AboutMe;