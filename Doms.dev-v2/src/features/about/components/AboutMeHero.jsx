import React from 'react';
import heroImage from '../../../assets/hero-image.png';
import { useImageMotion } from '../../../hooks/useImageMotion';

const AboutMeHero = ({ heroCardRef, onExpand, profile }) => {
    const { ref, onEnter, onLeave } = useImageMotion();
    return (



        <div
            ref={heroCardRef}
            className="
                h-full w-full
                flex items-center justify-center
                rounded-2xl border p-2 aspect-square
                border-white/5 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                ref={ref}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="w-full  rounded-xl overflow-hidden cursor-pointer "
                onClick={() => onExpand('hero')}
                style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
            >
                <img
                    src={profile?.heroImg || heroImage}
                    alt="Hero"
                    className="w-full h-full object-contain opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out "
                />
            </div>
        </div>
    );
};

export default AboutMeHero;
