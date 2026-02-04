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
            h-full w-full
                 flex flex-row justify-between
                gap-2
                items-center
                rounded-2xl p-6 border border-white/5"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                ref={logoRef}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="scroll-reveal w-full h-full rounded-xl flex items-center aspect-square justify-center
                bg-white border cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out"
                onClick={() => onExpand('education')}
                style={{
                    background: '#fff',
                    borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                }}
            >
                <img
                    src={education.logo_url || umtcLogo}
                    alt={education.school || "Education Logo"}
                    className="w-full h-full object-contain p-4 opacity"
                />
            </div>

            <div className="scroll-reveal space-y-2">
                <h3
                    className="font-bold text-base md:text-lg"
                    style={{
                        color: 'rgb(var(--contrast-rgb))'
                    }}
                >
                    {education.school}
                </h3>
                <p
                    className="text-gray-300 font-medium text-xs md:text-sm"
                >
                    {education.degree}
                </p>

            </div>
        </div>
    );
};

export default AboutMeEducation;
