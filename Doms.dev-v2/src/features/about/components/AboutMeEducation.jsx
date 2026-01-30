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
                gap-5
                rounded-2xl p-6 border border-white/5 space-y-4"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div
                ref={logoRef}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="scroll-reveal w-full h-full rounded-xl flex items-center aspect-square justify-center
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
