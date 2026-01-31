import React from 'react';

const AboutMeIdentity = ({ identityCardRef, profile }) => {
    return (
        <div
            ref={identityCardRef}
            className="
                w-full h-full
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
                    {profile.birthday} • {profile.role} • {profile.location}
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
        </div>
    );
};

export default AboutMeIdentity;
