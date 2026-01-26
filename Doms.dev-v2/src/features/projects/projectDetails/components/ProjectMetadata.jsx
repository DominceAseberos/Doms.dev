import { useRef } from 'react';
import { Calendar, Tag, ExternalLink, Github } from 'lucide-react';
import { getIconByName } from '../../../../utils/IconRegistry';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
    const liveBtnRef = useRef(null);
    const gitBtnRef = useRef(null);
    const { contextSafe: liveSafe } = useGSAP({ scope: liveBtnRef });
    const { contextSafe: gitSafe } = useGSAP({ scope: gitBtnRef });

    const handleHover = (ref) => {
        gsap.to(ref.current, {
            rotation: -2,
            scale: 1.05,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    };

    const handleLeave = (ref) => {
        gsap.to(ref.current, {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <div className="project-card md:col-span-4">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4">
                        {livePreviewLink && (
                            <a
                                ref={liveBtnRef}
                                href={livePreviewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => handleHover(liveBtnRef)}
                                onMouseLeave={() => handleLeave(liveBtnRef)}
                                onTouchStart={() => handleHover(liveBtnRef)}
                                onTouchEnd={() => handleLeave(liveBtnRef)}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-inter font-semibold text-sm transition-shadow shadow-md"
                                style={{
                                    background: 'rgb(var(--contrast-rgb))',
                                    color: 'rgb(0,0,0)',
                                    boxShadow: '0 4px 12px rgba(var(--contrast-rgb), 0.3)'
                                }}
                            >
                                <ExternalLink size={18} />
                                <span>Live Preview</span>
                            </a>
                        )}

                        {githubLink && (
                            <a
                                ref={gitBtnRef}
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => handleHover(gitBtnRef)}
                                onMouseLeave={() => handleLeave(gitBtnRef)}
                                onTouchStart={() => handleHover(gitBtnRef)}
                                onTouchEnd={() => handleLeave(gitBtnRef)}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-inter font-semibold text-sm border transition-all"
                                style={{
                                    borderColor: 'rgba(var(--contrast-rgb), 0.2)',
                                    color: 'rgb(var(--contrast-rgb))',
                                    background: 'rgba(var(--contrast-rgb), 0.05)'
                                }}
                            >
                                <Github size={18} />
                                <span>View Source Code</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectMetadata;
