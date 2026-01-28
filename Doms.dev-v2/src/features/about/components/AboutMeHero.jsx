import React from 'react';
import heroImage from '../../../assets/hero-image.png';

const AboutMeHero = ({ heroCardRef, onExpand }) => {
    return (
        <div
            ref={heroCardRef}
            className="
                h-66 flex justify-center
                md:col-span-2 md:h-52
                lg:col-span-2 lg:h-52
                rounded-2xl p-6 border border-white/5 overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                className="scroll-reveal w-full aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => onExpand('hero')}
                style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
            >
                <img
                    src={heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default AboutMeHero;
