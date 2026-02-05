import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from "@shared/hooks/usePortfolioData";


gsap.registerPlugin(ScrollTrigger);

const MoreProjects = ({ currentProjectId }) => {
    const containerRef = useRef(null);
    const { projects } = usePortfolioData();

    // Filter out the current project and limit to 4 suggestions
    const otherProjects = projects
        .filter(p => p.id !== currentProjectId)
        .slice(0, 4);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.project-card');

        gsap.fromTo(cards,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: containerRef });

    if (otherProjects.length === 0) return null;

    return (
        <section ref={containerRef} className="w-full mt-24 border-t border-white/5 pt-16">
            <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-widest text-white/90">
                    Explore More
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {otherProjects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/project/${project.id}`}
                        className="project-card group relative block aspect-video rounded-xl overflow-hidden bg-black/20 border border-white/5 hover:border-primary/50 transition-all duration-300"
                    >
                        {/* Image */}
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                {project.projectType?.split('/')[0]}
                            </span>
                            <h4 className="text-white font-bold uppercase tracking-wider text-sm truncate">
                                {project.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default MoreProjects;
