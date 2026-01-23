// src/features/projects/components/ProjectBottom.jsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectBottom = () => {
  const container = useRef(null);
  const glows = useRef([]);
  const scrollLabel = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 95%",
        toggleActions: "play none none none",
        once: true,
      },
      defaults: { ease: "power4.out", duration: 1.4 },
    });

    // Animate main words
    tl.from(".animate-bottom-line", {
      y: 60,
      opacity: 0,
      skewY: 4,
      stagger: 0.15,
    })
      // Animate "Scroll for More" AFTER main text
      .from(scrollLabel.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "+=0.2"); // slight delay after main text

    // Animate glows
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
      className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-2xl p-6"
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
        className="absolute -top-1/2 -left-1/4 w-[120%] h-[120%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none transform-gpu"
      />
      <div
        ref={(el) => (glows.current[1] = el)}
        className="absolute -bottom-1/2 -right-1/4 w-[120%] h-[120%] bg-purple-500/10 blur-[80px] rounded-full pointer-events-none transform-gpu"
      />

      {/* Text + scroll label */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        {/* Main words */}
        <div className="flex flex-nowrap justify-center items-center gap-x-3 sm:gap-x-6 md:gap-x-12">
          {["Crafted.", "Tested.", "Improved."].map((word) => (
            <div
              key={word}
              className="animate-bottom-line font-playfair font-black text-lg sm:text-2xl md:text-4xl lg:text-6xl tracking-tighter text-white/95 whitespace-nowrap"
            >
              {word}
            </div>
          ))}
        </div>

        {/* Scroll for More micro-label */}
        <div
          ref={scrollLabel}
          className="opacity-30 text-xs sm:text-sm md:text-base tracking-widest uppercase text-white"
        >
          Scroll for More
        </div>
      </div>
    </div>
  );
};

export default ProjectBottom;
