import React from 'react';
import { useButtonMotion } from '../../../hooks/useButtonMotion';

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

const AboutMeIdentity = ({ identityCardRef, profile, techStack }) => {
    return (
        <div
            ref={identityCardRef}
            className="
                md:col-span-6 md:h-full md:w-full
                lg:col-span-4  lg:aspect-[2/1] lg:h-full lg:w-full
                rounded-2xl p-6 border border-white/5 "
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div className="scroll-reveal">
                <h1
                    className="font-bold tracking-tight leading-none"
                    style={{
                        color: 'rgb(var(--contrast-rgb))',
                        fontSize: 'clamp(24px, 4vw, 32px)'
                    }}
                >
                    {profile.name}
                </h1>
                <p
                    className="text-gray-400 font-medium mt-1"
                    style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}
                >
                    {profile.age} • {profile.role} • {profile.location}
                </p>
            </div>

            <div className="scroll-reveal">
                <p
                    className="text-gray-300 leading-relaxed"
                    style={{ fontSize: 'clamp(13px, 2.2vw, 15px)' }}
                >
                    {profile.bio}
                </p>
            </div>

            <div className="md:hidden lg:hidden scroll-reveal space-y-2 ">
                <h3
                    className="font-semibold"
                    style={{
                        color: 'rgb(var(--contrast-rgb))',
                        fontSize: 'clamp(14px, 2.5vw, 16px)'
                    }}
                >
                    Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2 justify-around text-center">
                    {techStack.map((tech, index) => (
                        <AnimatedStack key={index}>
                            <div className="rounded-full text-xs font-medium border px-3 py-2 w-32 cursor-pointer select-none touch-manipulation"
                                style={{
                                    color: 'rgb(var(--contrast-rgb))',
                                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                    background: 'rgba(var(--contrast-rgb), 0.05)'
                                }}
                            >
                                {tech.name}
                            </div>
                        </AnimatedStack>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutMeIdentity;
