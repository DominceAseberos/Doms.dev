import React from 'react';
import umtcLogo from '../../../assets/umtc-logo.png';
import { useImageMotion } from '../../../hooks/useImageMotion';

const AboutMeEducation = ({ educationCardRef, education, onExpand }) => {
    const { ref: logoRef, onEnter, onLeave } = useImageMotion();
    // Removed local GSAP context and handlers

    return (
        <div
            ref={educationCardRef}
            className="
                h-85 flex flex-col justify-between
                md:col-span-6 md:h-45 md:w-full md:flex md:flex-row md:justify-between md:gap-5
                lg:col-span-6 lg:aspect-[2/1] lg:h-auto lg:w-full lg:flex lg:flex-row lg:justify-between lg:gap-5
                rounded-2xl p-6 border border-white/5 space-y-4"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                ref={logoRef}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="scroll-reveal w-full h-full rounded-xl flex items-center justify-center
                md:w-1/2 md:h-full md:flex md:flex-row md:justify-center
                lg:w-1/2 lg:h-full lg:flex lg:flex-row lg:justify-center
                bg-white border cursor-pointer"
                onClick={() => onExpand('education')}
                style={{
                    background: '#fff',
                    borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                }}
            >
                <img
                    src={education.logo_url || umtcLogo}
                    alt={education.school || "Education Logo"}
                    className="w-full h-full object-contain p-4"
                />
            </div>

            <div className="scroll-reveal space-y-2">
                <h3
                    className="font-bold"
                    style={{
                        color: 'rgb(var(--contrast-rgb))',
                        fontSize: 'clamp(16px, 3vw, 18px)'
                    }}
                >
                    {education.school}
                </h3>
                <p
                    className="text-gray-300 font-medium"
                    style={{ fontSize: 'clamp(13px, 2vw, 14px)' }}
                >
                    {education.degree}
                </p>

            </div>
        </div>
    );
};

export default AboutMeEducation;
