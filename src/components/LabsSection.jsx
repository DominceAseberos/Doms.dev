import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './LabsSection.css';

gsap.registerPlugin(ScrollTrigger);

const labs = [
    {
        title: "Physics Cloth Sim",
        desc: "Real-time verlet-integration cloth sim running on the GPU via WebGL compute shaders. Wind, gravity, and pin constraints. Fully interactive — grab and tear fabric in browser.",
        status: "Active",
        statusClass: "badge--active",
        stats: [
            { val: "60fps", label: "Sustained" },
            { val: "4096", label: "Particles" },
            { val: "WebGL2", label: "Renderer" }
        ],
        tech: ["GLSL", "WebGL", "Three.js", "Verlet"],
        color: ["#0a2a10", "#123a1a"],
        cardClass: "card--green"
    },
    {
        title: "Motion Language",
        desc: "A composable token-based animation language. Define entrance, exit, and state transitions as semantic primitives — compile to CSS, Framer Motion, or GSAP targets.",
        status: "In Progress",
        statusClass: "badge--wip",
        progress: 67,
        tech: ["TypeScript", "Framer Motion", "GSAP", "Tokens"],
        color: ["#2a2a0a", "#3a3a12"],
        cardClass: "card--yellow"
    },
    {
        title: "Reaction-Diffusion",
        desc: "Turing morphogenesis patterns computed in real-time. Tunable feed/kill rates, brush input seeding, and palette remapping. Exports as 4K video or animated WebP sequences.",
        status: "Active",
        statusClass: "badge--active",
        stats: [
            { val: "512²", label: "Grid res." },
            { val: "∞", label: "Patterns" }
        ],
        tech: ["Canvas 2D", "Workers", "Generative", "Export"],
        color: ["#0a2a2a", "#123a3a"],
        cardClass: "card--cyan"
    },
    {
        title: "Spatial Audio UI",
        desc: "Interface elements positioned in 3D audio space using Web Audio API panners. Hover triggers binaural depth cues — navigation by sound topology, not visual hierarchy.",
        status: "Concept",
        statusClass: "badge--concept",
        progress: 22,
        tech: ["Web Audio", "HRTF", "React", "Experim."],
        color: ["#1a0a2a", "#2a123a"],
        cardClass: "card--purple"
    }
];

const LabsSection = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const sections = gsap.utils.toArray('.aww-lab-section');

        sections.forEach((section) => {
            const title = section.querySelector('.aww-lab-title');
            const imgWrap = section.querySelector('.aww-lab-img-wrap');
            const imgInner = section.querySelector('.aww-lab-img-inner');
            const content = section.querySelector('.aww-lab-content');

            const splitText = new SplitType(title, { types: 'chars' });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=150%",
                    scrub: 1.5,
                    pin: true,
                }
            });

            tl.to(imgWrap, {
                width: "80vw",
                height: "70vh",
                borderRadius: "24px",
                ease: "power2.inOut",
                duration: 1
            }, 0);

            tl.to(imgInner, {
                scale: 1,
                y: -50,
                duration: 1,
                ease: "none"
            }, 0);

            tl.from(splitText.chars, {
                y: 100,
                opacity: 0,
                stagger: 0.02,
                duration: 0.5,
                ease: "back.out(1.5)"
            }, 0.2);

            tl.from(content, {
                opacity: 0,
                y: 20,
                duration: 0.4
            }, 0.5);
        });

        return () => {
            SplitType.revert('.aww-lab-title');
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="labs-aww-timeline">
            {labs.map((lab, i) => (
                <section className={`aww-lab-section ${lab.cardClass}`} key={i}>
                    <div className="aww-lab-container">

                        <div className="aww-lab-header">
                            <span className="aww-lab-index">LAB / 0{i + 1}</span>
                            <h1 className="aww-lab-title">{lab.title}</h1>
                        </div>

                        <div className="aww-lab-img-wrap">
                            <div className="aww-lab-img-inner" style={{
                                background: `linear-gradient(135deg, ${lab.color[0]}, ${lab.color[1]})`
                            }}></div>
                        </div>

                        <div className="aww-lab-content">
                            <div className="aww-lab-top">
                                <span className={`aww-lab-badge ${lab.statusClass}`}>{lab.status}</span>
                            </div>

                            <p className="aww-lab-desc">{lab.desc}</p>

                            {/* Render Stats or Progress depending on lab data */}
                            {lab.stats && (
                                <div className="aww-lab-stats border-t border-white/5 pt-4">
                                    {lab.stats.map(s => (
                                        <div className="aww-lab-stat" key={s.label}>
                                            <span className="aww-sval">{s.val}</span>
                                            <span className="aww-slabel">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {lab.progress && (
                                <div className="aww-lab-progress border-t border-white/5 pt-4">
                                    <div className="aww-p-labels">
                                        <span>Completion</span>
                                        <span>{lab.progress}%</span>
                                    </div>
                                    <div className="aww-p-track">
                                        <div className="aww-p-fill" style={{ width: `${lab.progress}%`, background: lab.color[1] }}></div>
                                    </div>
                                </div>
                            )}

                            <div className="aww-lab-tech pt-4">
                                {lab.tech.map(t => <span key={t}>{t}</span>)}
                            </div>

                            <div className="aww-lab-acts">
                                <button className="aww-lab-btn px"><span>↗</span> Run Experiment</button>
                                <button className="aww-lab-btn"><span>≡</span> Details</button>
                            </div>
                        </div>

                    </div>
                </section>
            ))}
        </div>
    );
};

export default LabsSection;
