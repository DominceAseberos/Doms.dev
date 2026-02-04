import React from 'react';

const AboutMeIdentity = ({ identityCardRef, profile }) => {
    return (
        <div
            ref={identityCardRef}
            className="
                w-full flex-1 min-h-0
                rounded-2xl p-6 border border-white/5 "
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div className="scroll-reveal">
                <h1
                    className="font-bold tracking-tight leading-none text-base md:text-xl lg:text-2xl"
                    style={{
                        color: 'rgb(var(--contrast-rgb))'
                    }}
                >
                    {profile.name}
                </h1>
                <p
                    className="text-gray-400 font-medium mt-1 text-xs md:text-sm"
                >
                    {profile.birthday} • {profile.role} • {profile.location}
                </p>
            </div>

            <div className="scroll-reveal">
                <p
                    className="text-gray-300 leading-relaxed text-sm md:text-base"
                >
                    {profile.bio}
                </p>
            </div>
        </div>
    );
};

export default AboutMeIdentity;
