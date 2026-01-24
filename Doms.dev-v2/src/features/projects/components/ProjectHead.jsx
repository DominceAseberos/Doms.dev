// src/features/projects/components/ProjectHead.jsx
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProjectHead = () => {
  const container = useRef(null);
  const glows = useRef([]);

  useGSAP(() => {
    // 1. Entrance Stagger for Text
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 95%",
        toggleActions: "play none none none",
        once: true,
      },
      defaults: { ease: "power4.out", duration: 1.4 },
    });

    tl.from(".animate-portfolio", {
      y: 70,
      opacity: 0,
      skewY: 5,
      duration: 1.6,
      ease: "power4.out",
    })
      .from(".animate-breadcrumb", {
        y: 35,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
      }, "-=1.2");


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
        duration: 5 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

  }, { scope: container });

  return (
    <div
      ref={container}
      className="relative flex flex-col justify-center items-center w-full h-full min-h-15.5 overflow-hidden rounded-2xl p-3 md:p-2 lg:p-2"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      {/* Liquid Background Glows - Contained inside the card */}
      <div
        ref={el => glows.current[0] = el}
        className="absolute -top-1/2 -right-1/4 w-[120%] h-[120%] bg-blue-500/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none transform-gpu"
      />
      <div
        ref={el => glows.current[1] = el}
        className="absolute -bottom-1/2 -left-1/4 w-[120%] h-[120%] bg-purple-500/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none transform-gpu"
      />

      <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
        {/* Main Aesthetic Headline */}
        <h1 className="animate-portfolio text-4xl md:text-2xl lg:text-3xl font-black tracking-tighter font-playfair text-white/95 leading-none">
          Projects
        </h1>

        {/* Horizontal Breadcrumbs Row */}
        <div className="flex items-center gap-2 md:gap-2 px-2 overflow-hidden whitespace-nowrap">
          {['Idea', 'Experiments', 'Real Projects'].map((step, i) => (
            <React.Fragment key={step}>
              <span className="animate-breadcrumb text-[8px] md:text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 font-inter">
                {step}
              </span>
              {i < 2 && (
                <span className="animate-breadcrumb text-[6px] md:text-[8px] text-blue-400/20">
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectHead;
