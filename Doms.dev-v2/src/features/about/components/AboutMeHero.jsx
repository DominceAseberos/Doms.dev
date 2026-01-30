import React from 'react';
import heroImage from '../../../assets/hero-image.png';
import { useImageMotion } from '../../../hooks/useImageMotion';

const AboutMeHero = ({ heroCardRef, onExpand, profile }) => {
    const { ref, onEnter, onLeave } = useImageMotion();
    return (
        <div
            ref={heroCardRef}
            className="
                h-66 flex items-center
                md:col-span-2 md:h-50
                lg:col-span-2 lg:h-55
                rounded-2xl  border 
                md:p-4
                border-white/5 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                ref={ref}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="scroll-reveal w-full aspect-square rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onExpand('hero')}
                style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
            >
                <img
                    src={profile?.heroImg || heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default AboutMeHero;
