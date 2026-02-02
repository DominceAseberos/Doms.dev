import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Tag, ExternalLink, Github } from 'lucide-react';
import { getIconByName } from '../../../../utils/IconRegistry';
import { useButtonMotion } from '../../../../hooks/useButtonMotion';

/**
 * ProjectMetadata component - displays project title, date, type, tech stack, and Live Preview button
 */
const ProjectMetadata = ({
    title,
    dateCreated,
    projectType,
    stacks = [],
    livePreviewLink,
    githubLink
}) => {
    const liveMotion = useButtonMotion();
    const gitMotion = useButtonMotion();
    const [isSticky, setIsSticky] = useState(false);
    const buttonsRef = useRef(null);

    // Scroll Observer for Sticky Effect
    useEffect(() => {
        const handleScroll = () => {
            if (!buttonsRef.current) return;
            const rect = buttonsRef.current.getBoundingClientRect();
            // If the buttons are above the viewport (scrolled past), show sticky
            // We use -60 to give it a bit of trigger space before it completely leaves
            setIsSticky(rect.top < 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const ActionButtons = ({ isStickyMode = false }) => (
        <div className={`flex flex-col gap-3 ${isStickyMode ? 'flex-row' : 'pt-4'}`}>
            {livePreviewLink && (
                <a
                    ref={isStickyMode ? null : liveMotion.ref} // Only attach ref to original to avoid conflict? Or attach to both? Motion hook single ref. 
                    href={livePreviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={isStickyMode ? null : liveMotion.onEnter} // Disable hover physics on sticky for simplicity or duplicate hook
                    onMouseLeave={isStickyMode ? null : liveMotion.onLeave}
                    onClick={isStickyMode ? null : liveMotion.onTap}
                    className={`flex items-center justify-center gap-2 rounded-lg font-inter font-semibold text-sm transition-all shadow-md ${isStickyMode ? 'flex-1 py-3 text-xs' : 'px-6 py-3'
                        }`}
                    style={{
                        background: 'rgb(var(--contrast-rgb))',
                        color: 'rgb(0,0,0)',
                        boxShadow: '0 4px 12px rgba(var(--contrast-rgb), 0.3)'
                    }}
                >
                    <ExternalLink size={isStickyMode ? 14 : 18} />
                    <span>{isStickyMode ? 'Preview' : 'Live Preview'}</span>
                </a>
            )}

            {githubLink && (
                <a
                    ref={isStickyMode ? null : gitMotion.ref}
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={isStickyMode ? null : gitMotion.onEnter}
                    onMouseLeave={isStickyMode ? null : gitMotion.onLeave}
                    onClick={isStickyMode ? null : gitMotion.onTap}
                    className={`flex items-center justify-center gap-2 rounded-lg font-inter font-semibold text-sm border transition-all ${isStickyMode ? 'flex-1 py-3 text-xs' : 'px-6 py-3'
                        }`}
                    style={{
                        borderColor: 'rgba(var(--contrast-rgb), 0.2)',
                        color: 'rgb(var(--contrast-rgb))',
                        background: 'rgba(var(--contrast-rgb), 0.05)'
                    }}
                >
                    <Github size={isStickyMode ? 14 : 18} />
                    <span>{isStickyMode ? 'Source' : 'Source Code'}</span>
                </a>
            )}
        </div>
    );

    return (
        <div className="project-card relative">
            {/* Sticky Mobile Header (Portal to break out of GSAP transform context) */}
            {createPortal(
                <div
                    className={`fixed top-0 left-0 right-0 z-[100] p-3 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300 md:hidden ${isSticky
                        ? 'translate-y-0 opacity-100 visible'
                        : '-translate-y-full opacity-0 invisible pointer-events-none'
                        }`}
                >
                    <div className="max-w-7xl mx-auto">
                        <ActionButtons isStickyMode={true} />
                    </div>
                </div>,
                document.body
            )}

            <div
                className="rounded-2xl p-6 h-full"
                style={{
                    background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                    border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                }}
            >
                <div className="card-content space-y-4">
                    <h1
                        className="text-[clamp(1.5rem,4vw,2.5rem)] font-playfair font-black leading-tight"
                        style={{ color: 'rgb(var(--contrast-rgb))' }}
                    >
                        {title}
                    </h1>

                    {/* Date & Type */}
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2" style={{ color: 'rgba(var(--contrast-rgb), 0.7)' }}>
                            <Calendar size={16} />
                            <span className="font-inter">{new Date(dateCreated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: 'rgba(var(--contrast-rgb), 0.7)' }}>
                            <Tag size={16} />
                            <span className="font-inter font-medium">{projectType}</span>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 className="text-sm font-inter font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(var(--contrast-rgb), 0.5)' }}>
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {stacks.map((stack, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 py-1.5 rounded-lg text-sm font-inter font-medium flex items-center gap-1.5"
                                    style={{
                                        background: 'rgba(var(--contrast-rgb), 0.1)',
                                        color: 'rgb(var(--contrast-rgb))',
                                        border: '1px solid rgba(var(--contrast-rgb), 0.2)'
                                    }}
                                >
                                    <span className="text-sm">
                                        {(() => {
                                            const Icon = getIconByName(stack);
                                            return <Icon size={16} />;
                                        })()}
                                    </span>
                                    <span>{stack}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Original Action Buttons (Ref Target) */}
                    <div ref={buttonsRef} className={`transition-opacity duration-300 ${isSticky ? 'md:opacity-100 opacity-0' : 'opacity-100'}`}>
                        <ActionButtons />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectMetadata;
