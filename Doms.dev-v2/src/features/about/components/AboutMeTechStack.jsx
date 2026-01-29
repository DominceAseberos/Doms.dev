import React from 'react';
import { useButtonMotion } from '../hooks/useAboutMotion';

const AnimatedStack = ({ children, className = '', style = {} }) => {
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

const AboutMeTechStack = ({ mdIconStack, techStack }) => {
    return (
        <div ref={mdIconStack}
            className="hidden
                md:block md:col-span-4 md:h-52 md:w-full
                lg:block lg:col-span-4 lg:h-52 lg:w-full
                scroll-reveal space-y-2
                rounded-2xl p-6 border border-white/5 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <h3
                className="font-semibold "
                style={{
                    color: 'rgb(var(--contrast-rgb))',
                    fontSize: 'clamp(14px, 2.5vw, 16px)'
                }}
            >
                Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2 text-center">
                {techStack.slice(0, 10).map((tech, index) => {
                    return (
                        <AnimatedStack key={index}>
                            <div className="rounded-full text-xs font-medium border px-3 py-2 w-fit cursor-pointer select-none touch-manipulation"
                                style={{
                                    color: 'rgb(var(--contrast-rgb))',
                                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                    background: 'rgba(var(--contrast-rgb), 0.05)'
                                }}
                            >
                                {tech.name}
                            </div>
                        </AnimatedStack>
                    );
                })}
            </div>
        </div>
    );
};

export default AboutMeTechStack;
