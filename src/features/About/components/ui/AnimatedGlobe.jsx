import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedGlobe({ scrollTriggerRef, scrollStart = 'top 80%', scrollEnd = 'bottom 40%' }) {
    const globeEl = useRef();
    const containerRef = useRef();
    const logoRef = useRef();
    const courseRef = useRef();
    const bgRef = useRef();
    const globeWrapperRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
    const [countries, setCountries] = useState({ features: [] });
    const [isClient, setIsClient] = useState(false);

    // The target location: Tagum City, Philippines
    const targetLocation = { lat: 7.4475, lng: 125.8080 };

    useEffect(() => {
        setIsClient(true);
        // Load GeoJSON data for countries from an open CDN
        fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries)
            .catch(e => console.error(e));

        // Handle Resize
        const handleResize = () => {
            if (containerRef.current) {
                const baseWidth = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;

                if (bgRef.current) {
                    const row = containerRef.current.closest('.ns-scrollytelling-row');
                    if (row) {
                        const rowRect = row.getBoundingClientRect();
                        const containerRect = containerRef.current.getBoundingClientRect();

                        // Distance from the right edge of container to the left edge of the row
                        const maxW = containerRect.right - rowRect.left;
                        bgRef.current.dataset.maxWidth = maxW;
                        bgRef.current.dataset.baseWidth = baseWidth;

                        const offset = (maxW / 2) - (baseWidth / 2);
                        bgRef.current.dataset.offset = offset;

                        // Render canvas at max width so it doesn't need to resize during animation
                        setDimensions({ width: maxW, height });

                        // Apply initial translation if not currently animating
                        if (globeWrapperRef.current && bgRef.current.dataset.animating !== 'true') {
                            globeWrapperRef.current.style.transform = `translateX(${offset}px)`;
                        }
                    } else {
                        setDimensions({ width: baseWidth, height });
                    }
                }
            }
        };

        // Slight delay to ensure DOM is fully rendered before measuring
        setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!globeEl.current || !scrollTriggerRef?.current || !isClient) return;

        // Disable auto-rotation initially to allow manual ScrollTrigger control
        globeEl.current.controls().autoRotate = false;
        globeEl.current.controls().enableZoom = false;

        // Set initial POV
        globeEl.current.pointOfView({
            lat: targetLocation.lat,
            lng: targetLocation.lng,
            altitude: 2.0
        }, 0);

        gsap.set(bgRef.current, {
            scale: 1,
            width: '100%',
            borderRadius: '24px'
        });

        gsap.set(globeWrapperRef.current, { opacity: 1 });
        gsap.set(containerRef.current, { opacity: 1 }); 

        if (logoRef.current && courseRef.current) {
            gsap.set(logoRef.current, { opacity: 0, x: 20, scale: 0.8 });
            gsap.set(courseRef.current, { opacity: 0, x: 40, scale: 0.8 });
        }

        const sectionEl = scrollTriggerRef.current?.closest('.ns-scrollytelling-row') || scrollTriggerRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top top',
                end: scrollEnd, 
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
                refreshPriority: 1, 
            }
        });

        // Zoom into Tagum and fade in overlays
        tl.to({}, {
            duration: 1, 
            onUpdate: function () {
                const p = this.progress();
                const currentAlt = 2.0 - (p * 1.65); // Zoom from 2.0 down to 0.35
                if (globeEl.current) {
                    globeEl.current.pointOfView({
                        lat: targetLocation.lat,
                        lng: targetLocation.lng,
                        altitude: currentAlt
                    }, 0); 
                }
            }
        }, 0);

        if (logoRef.current && courseRef.current) {
            tl.to(logoRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" }, 0.7);
            tl.to(courseRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" }, 0.7);
        }

        return () => {
            if (tl) tl.kill();
        };
    }, [scrollTriggerRef, isClient, scrollEnd]);

    if (!isClient) return <div style={{ width: '100%', height: '100%', minHeight: '500px' }} />;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px', maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div ref={bgRef} style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#050505', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'absolute', top: 0, right: 0 }}>
                <div ref={globeWrapperRef} style={{ position: 'absolute', top: 0, right: 0, width: `${dimensions.width}px`, height: '100%', pointerEvents: 'none' }}>
                    <Globe
                        ref={globeEl}
                        width={dimensions.width}
                        height={dimensions.height}
                        backgroundColor="rgba(0,0,0,0)"
                        showAtmosphere={true}
                        atmosphereColor="#baff29"
                        atmosphereAltitude={0.15}
                        globeImageUrl={null}
                        bumpImageUrl={null}
                        polygonsData={countries.features}
                        polygonAltitude={0.01}
                        polygonCapColor={() => '#e8e6e3'} 
                        polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
                        polygonStrokeColor={() => '#d4d0ca'}
                        ringsData={[targetLocation]}
                        ringColor={() => '#baff29'}
                        ringMaxRadius={5}
                        ringPropagationSpeed={2}
                        ringRepeatPeriod={1000}
                        pointsData={[targetLocation]}
                        pointColor={() => '#baff29'}
                        pointAltitude={0.05}
                        pointRadius={0.1}
                    />
                </div>
            </div>

            <div ref={logoRef} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                opacity: 0,
                transform: 'translate(20px, -50%) scale(0.8)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(5, 5, 5, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '12px 24px 12px 12px',
                borderRadius: '50px',
                border: '1px solid rgba(186, 255, 41, 0.2)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                zIndex: 10
            }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #baff29', flexShrink: 0 }}>
                    <img src="/logo-umtc.svg" alt="UM Tagum College" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>UM Tagum College</span>
                    <span style={{ color: '#baff29', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tagum City</span>
                </div>
            </div>

            <div ref={courseRef} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                opacity: 0,
                transform: 'translate(40px, calc(-50% + 75px)) scale(0.8)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(5, 5, 5, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '10px 20px 10px 10px',
                borderRadius: '50px',
                border: '1px solid rgba(186, 255, 41, 0.2)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                zIndex: 9
            }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#baff29', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.2' }}>BS Computer Science</span>
                    <span style={{ color: '#a0a0a0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3rd Year</span>
                </div>
            </div>
        </div>
    );
}

