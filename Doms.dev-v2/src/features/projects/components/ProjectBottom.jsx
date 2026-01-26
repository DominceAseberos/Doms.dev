// src/features/projects/components/ProjectBottom.jsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioData } from "../../../hooks/usePortfolioData";

gsap.registerPlugin(ScrollTrigger);

const ProjectBottom = () => {
  const container = useRef(null);
  const glows = useRef([]);
  const scrollLabel = useRef(null);
  const { uiConfig } = usePortfolioData();

  useGSAP(() => {
    // Use matchMedia to handle desktop vs mobile differently
    let mm = gsap.matchMedia();

    // Mobile: Use ScrollTrigger
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 95%",
          toggleActions: "play none none none",
          once: true,
        },
        defaults: { ease: "power4.out", duration: 1.4 },
      });

      tl.from(".animate-bottom-line", {
        y: 60,
        opacity: 0,
        skewY: 4,
        stagger: 0.15,
      })
        .from(scrollLabel.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "+=0.2");
    });

    // Desktop: No animation - just show text immediately
    mm.add("(min-width: 768px)", () => {
      // Set text to be fully visible immediately, no animations
      gsap.set(".animate-bottom-line", {
        autoAlpha: 1,
        y: 0,
        skewY: 0
      });

      if (scrollLabel.current) {
        gsap.set(scrollLabel.current, {
          autoAlpha: 1,
          y: 0
        });
      }

      // Clean up will-change immediately
      setTimeout(() => {
        document.querySelectorAll('.animate-bottom-line').forEach(el => {
          el.classList.add('animation-complete');
        });
        if (scrollLabel.current) {
          scrollLabel.current.classList.add('animation-complete');
        }
      }, 100);
    });

    // Animate glows (same for all screens)
    glows.current.forEach((glow, i) => {
      gsap.to(glow, {
        x: i % 2 === 0 ? "15%" : "-15%",
        y: i % 2 === 0 ? "-10%" : "10%",
        duration: 10 + i * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glow, {
        scale: 1.2,
        duration: 6 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center w-full h-full min-h-15 overflow-hidden rounded-2xl p-6 md:p-2 lg:p-2"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(var(--box-Linear-1-rgb)),
          rgba(var(--box-Linear-2-rgb))
        )`,
      }}
    >
      {/* Liquid glows */}
      <div
        ref={(el) => (glows.current[0] = el)}
        className="absolute -top-1/2 -left-1/4 w-[120%] h-[120%] bg-blue-500/10 blur-[40px] rounded-full pointer-events-none transform-gpu"
      />
      <div
        ref={(el) => (glows.current[1] = el)}
        className="absolute -bottom-1/2 -right-1/4 w-[120%] h-[120%] bg-purple-500/10 blur-[40px] rounded-full pointer-events-none transform-gpu"
      />

      {/* Text + scroll label */}
      <div className="relative z-10 flex flex-col items-center  text-center">
        {/* Main words */}
        <div className="
        flex flex-nowrap justify-center items-center  sm:gap-x-6 ">
          {uiConfig.projectBottomSlogan.map((word) => (
            <div
              key={word}
              className="animate-bottom-line font-playfair font-black text-lg sm:text-2xl md:text-[14px] lg:text-2xl tracking-tighter text-white/95 whitespace-nowrap"
            >
              {word}
            </div>
          ))}
        </div>

        {/* Scroll for More micro-label */}
        <div
          ref={scrollLabel}
          className="opacity-30 text-xs sm:text-sm md:text-[12px] lg:text-xs tracking-widest uppercase text-white"
        >
          {uiConfig.projectBottomSubtext}
        </div>
      </div>
    </div>
  );
};

export default ProjectBottom;
