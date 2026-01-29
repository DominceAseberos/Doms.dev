import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowLeft, ExternalLink, BookOpen, Code2 } from 'lucide-react';
import { getIconByName } from '../../../utils/IconRegistry';

const ProjectCard = ({ project, isExpanded, onExpand, onCollapse }) => {
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const headerRef = useRef(null);
    const imgRef = useRef(null);
    const liveBtnRef = useRef(null);
    const docBtnRef = useRef(null);

    // Collapsed state refs
    const collapsedImgRef = useRef(null);
    const collapsedTitleRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    useGSAP(() => {
        if (isExpanded) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power3.out" }
            );
        }
    }, [isExpanded]);

    // Header Hover
    const onHeaderEnter = contextSafe(() => {
        gsap.to(headerRef.current, { color: 'rgb(var(--contrast-rgb))', duration: 0.3 });
    });
    const onHeaderLeave = contextSafe(() => {
        gsap.to(headerRef.current, { color: 'rgb(var(--contrast-rgb) / 0.6)', duration: 0.3 });
    });

    // Image Hover (Expanded)
    const onImageEnter = contextSafe(() => {
        gsap.to(imgRef.current, { scale: 1.05, duration: 0.7, ease: "power2.out" });
    });
    const onImageLeave = contextSafe(() => {
        gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power2.out" });
    });

    // Button Hovers
    const onBtnEnter = contextSafe((target) => {
        gsap.to(target, { scale: 1.02, duration: 0.3, ease: "power2.out" });
    });
    const onBtnLeave = contextSafe((target) => {
        gsap.to(target, { scale: 1, duration: 0.3, ease: "power2.out" });
    });

    // Collapsed Card Hover
    const onCardEnter = contextSafe(() => {
        gsap.to(collapsedImgRef.current, { scale: 1.1, opacity: 0.6, duration: 0.5, ease: "power2.out" });
        gsap.to(collapsedTitleRef.current, { x: 4, duration: 0.3, ease: "power2.out" });
    });
    const onCardLeave = contextSafe(() => {
        gsap.to(collapsedImgRef.current, { scale: 1, opacity: 0.4, duration: 0.5, ease: "power2.out" });
        gsap.to(collapsedTitleRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
    });

    const IconComponent = (name) => {
        const Icon = getIconByName(name);
        return <Icon size={14} className="mr-1" />;
    };

    if (isExpanded) {
        return (
            <div
                ref={cardRef}
                className="absolute inset-0 z-50 rounded-2xl p-4 flex flex-col overflow-y-auto"
                style={{
                    background: `linear-gradient(135deg, rgb(var(--box-Linear-1-rgb) / 0.95), rgb(var(--box-Linear-2-rgb) / 0.95))`,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgb(var(--contrast-rgb) / 0.2)'
                }}
            >
                <button
                    ref={headerRef}
                    onClick={(e) => { e.stopPropagation(); onCollapse(); }}
                    onMouseEnter={onHeaderEnter}
                    onMouseLeave={onHeaderLeave}
                    className="mb-4 flex items-center text-sm font-inter font-medium cursor-pointer w-fit"
                    style={{ color: 'rgb(var(--contrast-rgb) / 0.6)' }}
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>

                <div ref={contentRef} className="flex flex-col gap-4">
                    {/* Carousel or Single Image */}
                    {project.images && project.images.length > 0 ? (
                        <div
                            onMouseEnter={onImageEnter}
                            onMouseLeave={onImageLeave}
                            className="relative aspect-video w-full lg:h-55 rounded-xl overflow-x-auto snap-x snap-mandatory flex no-scrollbar border border-white/5"
                        >
                            {/* Primary/Thumbnail as first slide if needed, or just images array */}
                            {/* Assuming project.images contains all images including primary if properly managed. 
                                usePortfolioData ensures images array. If empty, we use project.image fallback logic below.
                            */}
                            {project.images.map((imgSrc, idx) => (
                                <img
                                    key={idx}
                                    src={imgSrc}
                                    alt={`${project.title} slide ${idx}`}
                                    className="w-full h-full object-cover shrink-0 snap-center"
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            onMouseEnter={onImageEnter}
                            onMouseLeave={onImageLeave}
                            className="relative aspect-video w-full lg:h-55 rounded-xl overflow-hidden group border border-white/5"
                        >
                            <img
                                ref={imgRef}
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151226] via-transparent to-transparent opacity-60" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <h2 className="text-[clamp(1.2rem,4vw,2rem)] font-playfair font-black leading-tight tracking-tight md:tracking-tighter lg:tracking-normal" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                            {project.title}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {project.stacks.map((stack, idx) => (
                                <span key={idx}
                                    className="flex items-center px-2 py-1 rounded-md text-[9px] md:text-[10px] font-inter font-semibold uppercase tracking-wider border"
                                    style={{
                                        backgroundColor: 'rgb(var(--contrast-rgb) / 0.05)',
                                        borderColor: 'rgb(var(--contrast-rgb) / 0.1)',
                                        color: 'rgb(var(--contrast-rgb) / 0.8)'
                                    }}
                                >
                                    {IconComponent(stack)}
                                    {stack}
                                </span>
                            ))}
                        </div>

                        <p className="text-[clamp(12px,1.5vw,14px)] font-inter leading-relaxed mt-2 opacity-70" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                            {project.shortDescription}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            {project.livePreviewLink && (
                                <a
                                    ref={liveBtnRef}
                                    onMouseEnter={() => onBtnEnter(liveBtnRef.current)}
                                    onMouseLeave={() => onBtnLeave(liveBtnRef.current)}
                                    href={project.livePreviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 rounded-xl font-inter font-bold text-[12px] md:text-[14px] flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg"
                                    style={{ backgroundColor: 'rgb(var(--contrast-rgb))', color: 'rgb(var(--theme-rgb))' }}
                                >
                                    Live Preview <ExternalLink size={16} />
                                </a>
                            )}

                            <Link
                                ref={docBtnRef}
                                onMouseEnter={() => onBtnEnter(docBtnRef.current)}
                                onMouseLeave={() => onBtnLeave(docBtnRef.current)}
                                to={`/project/${project.id}`}
                                className="flex-1 py-3 rounded-xl border font-inter font-bold text-[12px] md:text-[14px] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                style={{
                                    backgroundColor: 'rgb(var(--contrast-rgb) / 0.1)',
                                    borderColor: 'rgb(var(--contrast-rgb) / 0.2)',
                                    color: 'rgb(var(--contrast-rgb))'
                                }}
                            >
                                Documentation <BookOpen size={16} />
                            </Link>
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
            onMouseEnter={onCardEnter}
            onMouseLeave={onCardLeave}
            className="relative shrink-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer group snap-center border border-white/5"
            style={{
                background: `linear-gradient(135deg, rgb(var(--box-Linear-1-rgb) / 0.6), rgb(var(--box-Linear-2-rgb) / 0.6))`,
            }}
        >
            <div className="absolute inset-0 opacity-40 transition-opacity">
                <img
                    ref={collapsedImgRef}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151226] to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col gap-1 z-10">
                <div className="flex flex-wrap gap-1 mb-1">
                    <span
                        className="px-1.5 py-0.5 rounded-sm backdrop-blur-md text-[8px] font-inter font-bold uppercase tracking-tighter"
                        style={{ backgroundColor: 'rgb(0 0 0 / 0.4)', color: 'rgb(var(--contrast-rgb) / 0.8)' }}
                    >
                        {/* Display Project Type instead of Stacks for cleaner look matching Admin Dashboard */}
                        {project.projectType}
                    </span>
                </div>
                <h3
                    ref={collapsedTitleRef}
                    className="text-[clamp(14px,2.5vw,18px)] font-playfair font-black leading-none tracking-tight"
                    style={{ color: 'rgb(var(--contrast-rgb) / 0.95)' }}>
                    {project.title}
                </h3>
            </div>
        </div>
    );
};

export default ProjectCard;