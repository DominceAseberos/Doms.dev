import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import DisplayName from './DisplayName';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
    const heroRef = useRef(null);

    useGSAP(() => {
        gsap.to(heroRef.current, {
            yPercent: 30, // Moves down 30% while normal scroll moves up 100%, creating parallax
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }, { scope: heroRef });

    return (
        <section className="hero" ref={heroRef}>
            <div className="marquee-wrap">
                <div className="marquee-track">
                    <span>Motion</span><span>·</span>
                    <span>Code</span><span>·</span>
                    <span>Design</span><span>·</span>
                    <span>Motion</span><span>·</span>
                    <span>Code</span><span>·</span>
                    <span>Design</span><span>·</span>
                </div>
            </div>

            <div className="hero-left">
                <div className="v-label">Developer × Motion Designer</div>

                <DisplayName showKicker />

                <p className="font-mono text-sm md:text-base tracking-[0.05em] leading-relaxed text-white/40 max-w-lg mt-8 mb-12">
                    Crafting high-performance web experiences where code meets motion. <span className="text-white/60">GSAP · WebGL · React.</span>
                </p>

                <div className="hero-cta">
                    <button className="btn-primary">View Work</button>
                    <a href="/contact" target="_blank" rel="noopener noreferrer" className="btn-ghost inline-block text-center decoration-0">Get in Touch</a>
                </div>
            </div>

            <div className="hero-right">
                <div className="tags-grid">
                    <div className="tag-grid-item active">GSAP</div>
                    <div className="tag-grid-item">THREE.JS</div>
                    <div className="tag-grid-item">GLSL</div>
                    <div className="tag-grid-item">FRAMER</div>
                    <div className="tag-grid-item">WEBGL</div>
                    <div className="tag-grid-item">REACT</div>
                    <div className="tag-grid-item">MOTION</div>
                    <div className="tag-grid-item">NEXT.JS</div>
                    <div className="tag-grid-item">LOTTINS</div>
                </div>

                <div className="metrics">
                    <div className="metric">
                        <div className="metric-val">60<sup>fps</sup></div>
                        <div className="metric-lbl">Render</div>
                    </div>
                    <div className="metric">
                        <div className="metric-val">48<sup>+</sup></div>
                        <div className="metric-lbl">Projects</div>
                    </div>
                    <div className="metric">
                        <div className="metric-val">1<sup>yr</sup></div>
                        <div className="metric-lbl">Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
