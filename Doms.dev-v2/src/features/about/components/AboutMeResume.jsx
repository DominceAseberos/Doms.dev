import React from 'react';
import { FileText } from 'lucide-react';
import { useButtonMotion } from '../hooks/useAboutMotion';

const AnimatedResume = ({ children, className = '', style = {} }) => {
    const motion = useButtonMotion();
    return (
        <span
            ref={motion.ref}
            onMouseEnter={motion.onEnter}
            onMouseLeave={motion.onLeave}
            onMouseDown={motion.onTap}
            className={`inline-block cursor-pointer select-none ${className}`}
            style={style}
        >
            {children}
        </span>
    );
};

const AboutMeResume = ({ resumeCardRef, onExpand }) => {
    return (
        <div
            ref={resumeCardRef}
            className="h-85 flex flex-col justify-center items-center
                md:col-span-6 md:h-45 md:flex md:flex-row md:gap-5 md:items-center
                lg:col-span-6 lg:h-45 lg:w-full lg:flex lg:flex-row lg:justify-between lg:gap-5
                rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                className="scroll-reveal w-1/2 h-full rounded-xl flex items-center justify-center border cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => onExpand('resume')}
                style={{
                    background: 'rgba(var(--contrast-rgb), 0.05)',
                    borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                }}
            >
                <FileText
                    size={48}
                    style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }}
                />
            </div>

            <AnimatedResume>
                <button
                    className="w-full h-fit py-4 px-4 rounded-xl flex-nowrap font-bold uppercase tracking-widest transition-all hover:cursor-pointer"
                    style={{
                        background: 'rgb(var(--contrast-rgb))',
                        color: '#000',
                        fontSize: 'clamp(10px, 2vw, 12px)'
                    }}
                >
                    Download CV
                </button>
            </AnimatedResume>
        </div>
    );
};

export default AboutMeResume;
