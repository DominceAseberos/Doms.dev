import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';

const DEBRIS_COUNT = 4;

const ProfileMorphCard = ({ realSrc = '/profile.png', animeSrc = '/profile-anime.png', alt = 'Profile portrait' }) => {
    const stageRef = useRef(null);
    const dotRef = useRef(null);
    const maskCircleRef = useRef(null);
    const debrisRefs = useRef([]);
    const turbulenceRef = useRef(null);
    const [animeFallback, setAnimeFallback] = useState(false);
    const [animeRenderSrc, setAnimeRenderSrc] = useState(animeSrc);

    const uid = useId().replace(/:/g, '');
    const filterId = `profile-slime-filter-${uid}`;
    const maskId = `profile-slime-mask-${uid}`;

    useEffect(() => {
        const stage = stageRef.current;
        const maskCircle = maskCircleRef.current;
        if (!stage || !maskCircle) return;

        gsap.to(stage, {
            boxShadow: '0 0 22px rgba(212,245,60,0.35), 0 0 60px rgba(212,245,60,0.12), inset 0 0 12px rgba(212,245,60,0.06)',
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        let turbTween;
        if (turbulenceRef.current) {
            turbTween = gsap.to(turbulenceRef.current, {
                attr: { baseFrequency: 0.02 },
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }

        const onMove = (e) => {
            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const isInside = x > 0 && x < rect.width && y > 0 && y < rect.height;

            if (isInside) {
                gsap.to(maskCircle, {
                    attr: { cx: x, cy: y, r: 45 },
                    duration: 0.1,
                    ease: 'none',
                });

                debrisRefs.current.forEach((debris, index) => {
                    if (!debris) return;
                    gsap.to(debris, {
                        attr: {
                            cx: x + (Math.random() - 0.5) * 35,
                            cy: y + (Math.random() - 0.5) * 35,
                            r: index % 2 === 0 ? 11 : 7,
                        },
                        duration: 0.2 + (index * 0.05),
                        ease: 'power1.out',
                    });
                });
                return;
            }

            gsap.to(maskCircle, {
                attr: { r: 0 },
                duration: 0.4,
                ease: 'power2.in',
            });

            debrisRefs.current.forEach((debris) => {
                if (!debris) return;
                gsap.to(debris, {
                    attr: { r: 0 },
                    duration: 0.5,
                    ease: 'power2.in',
                });
            });
        };

        window.addEventListener('mousemove', onMove);

        return () => {
            window.removeEventListener('mousemove', onMove);
            turbTween?.kill();
        };
    }, []);

    return (
        <div ref={stageRef} className="relative w-full h-full overflow-hidden rounded-2xl border border-[#d4f53c]/30 bg-black/50 backdrop-blur-sm" style={{ cursor: 'none' }}>
            <div className="absolute inset-0 z-[1]">
                <img
                    src={realSrc}
                    alt={alt}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center 82%' }}
                />
            </div>

            <div
                className="absolute inset-0 z-[5]"
                style={{
                    WebkitMask: `url(#${maskId})`,
                    mask: `url(#${maskId})`,
                }}
            >
                <img
                    src={animeRenderSrc}
                    alt={`${alt} anime variant`}
                    onError={() => {
                        if (animeRenderSrc !== realSrc) {
                            setAnimeRenderSrc(realSrc);
                            setAnimeFallback(true);
                        }
                    }}
                    className={`h-full w-full object-cover ${animeFallback ? 'saturate-[1.35] contrast-[1.2] brightness-[1.08]' : ''}`}
                    style={{ objectPosition: 'center 82%' }}
                />
            </div>

            {/* Corner bracket accents */}
            <div className="absolute top-3 left-3 z-[6] w-6 h-6 border-t-2 border-l-2 border-[#d4f53c]/70 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 z-[6] w-6 h-6 border-t-2 border-r-2 border-[#d4f53c]/70 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 z-[6] w-6 h-6 border-b-2 border-l-2 border-[#d4f53c]/70 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 z-[6] w-6 h-6 border-b-2 border-r-2 border-[#d4f53c]/70 rounded-br-sm pointer-events-none" />

            <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-0" aria-hidden="true">
                <defs>
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence
                            ref={turbulenceRef}
                            type="fractalNoise"
                            baseFrequency="0.08"
                            numOctaves="4"
                            result="noise"
                        />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="white" />
                        <circle ref={maskCircleRef} cx="-200" cy="-200" r="0" fill="black" filter={`url(#${filterId})`} />
                        {Array.from({ length: DEBRIS_COUNT }).map((_, index) => (
                            <circle
                                key={index}
                                ref={(el) => { debrisRefs.current[index] = el; }}
                                cx="-200"
                                cy="-200"
                                r="0"
                                fill="black"
                                filter={`url(#${filterId})`}
                            />
                        ))}
                    </mask>
                </defs>
            </svg>
        </div>
    );
};

export default ProfileMorphCard;
