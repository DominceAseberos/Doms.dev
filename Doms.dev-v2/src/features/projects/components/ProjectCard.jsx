import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowLeft, ExternalLink, Code2, Layers, Cpu, Globe, Database } from 'lucide-react';

// Icon mapping for stacks
const stackIcons = {
    'React': Globe,
    'Tailwind CSS': Layers,
    'GSAP': Cpu,
    'Python': Code2,
    'Flask': Database,
    'OpenCV': Cpu,
    'Firebase': Database,
    'Lucide': Layers,
    'Vite': Globe,
    'NLP': Cpu,
    'API': Globe
};

const ProjectCard = ({ project, isExpanded, onExpand, onCollapse }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        if (isExpanded) {
            // Expansion Animation
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power3.out" }
            );
        }
    }, [isExpanded]);

    const IconComponent = (name) => {
        const Icon = stackIcons[name] || Code2;
        return <Icon size={14} className="mr-1" />;
    };

    if (isExpanded) {
        return (
            <div
                ref={cardRef}
                className="absolute inset-0 z-50 rounded-2xl p-4 flex flex-col overflow-y-auto scrollbar-custom"
                style={{
                    background: 'rgba(21, 18, 38, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(230, 230, 255, 0.1)'
                }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCollapse();
                    }}
                    className="mb-4 flex items-center text-sm font-inter font-medium text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>

                <div ref={contentRef} className="flex flex-col gap-4">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden group">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop';
                            }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#151226] via-transparent to-transparent opacity-60" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-playfair font-black text-white leading-tight">
                            {project.title}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {project.stacks.map((stack, idx) => (
                                <span key={idx} className="flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-inter font-semibold text-white/80 uppercase tracking-wider">
                                    {IconComponent(stack)}
                                    {stack}
                                </span>
                            ))}
                        </div>

                        <p className="text-sm font-inter text-white/70 leading-relaxed mt-2">
                            {project.shortDescription}
                        </p>

                        <div className="flex gap-3 mt-4">
                            <a
                                href={project.livePreviewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 rounded-xl bg-white text-[#151226] font-inter font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e6e6ff] transition-all transform active:scale-95 cursor-pointer"
                            >
                                Live Preview <ExternalLink size={16} />
                            </a>
                            <a
                                href={project.fullDetailsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-inter font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all transform active:scale-95 cursor-pointer"
                            >
                                Source Code <Code2 size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={cardRef}
            onClick={() => onExpand(project.id)}
            className="relative shrink-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer group snap-center"
            style={{
                background: 'rgba(30, 27, 47, 0.6)',
                border: '1px solid rgba(230, 230, 255, 0.1)'
            }}
        >
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop';
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#151226] to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col gap-1 z-10">
                <div className="flex flex-wrap gap-1 mb-1">
                    {project.stacks.slice(0, 3).map((stack, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded-sm bg-black/40 backdrop-blur-md text-[8px] font-inter font-bold text-white/60 uppercase tracking-tighter">
                            {stack}
                        </span>
                    ))}
                </div>
                <h3 className="text-lg font-playfair font-black text-white/95 leading-none transition-transform duration-300 group-hover:translate-x-1">
                    {project.title}
                </h3>
            </div>

            {/* Interactive Overlay Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(230,230,255,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    );
};

export default ProjectCard;
