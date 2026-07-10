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

        // Set initial POV (Far out, showing Asia)
        globeEl.current.pointOfView({ lat: 10, lng: 100, altitude: 2.5 }, 0);

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: scrollTriggerRef.current,
                start: scrollStart,
                end: scrollEnd,
                scrub: 1, // Smooth scrub
                onUpdate: (self) => {
                    if (!globeEl.current) return;
                    
                    const p = self.progress;
                    
                    // Custom easing for smooth zoom
                    const easeP = gsap.parseEase('power2.inOut')(p);

                    const startLat = 10;
                    const startLng = 100;
                    const startAlt = 2.5;

                    const endLat = targetLocation.lat;
                    const endLng = targetLocation.lng;
                    const endAlt = 0.35; // Deep zoom

                    const currentLat = startLat + (endLat - startLat) * easeP;
                    const currentLng = startLng + (endLng - startLng) * easeP;
                    const currentAlt = startAlt + (endAlt - startAlt) * easeP;

                    globeEl.current.pointOfView({
                        lat: currentLat,
                        lng: currentLng,
                        altitude: currentAlt
                    }, 0);
                    
                    // Reveal logo overlay near the end of the zoom, but hold it visible
                    if (logoRef.current && courseRef.current) {
                        let logoOpacity = 0;
                        if (p > 0.6) {
                            logoOpacity = Math.min(1, (p - 0.6) * 5); // scales 0 to 1 between p=0.6 and p=0.8, caps at 1
                        }
                        logoRef.current.style.opacity = logoOpacity;
                        logoRef.current.style.transform = `translate(20px, -50%) scale(${0.8 + logoOpacity * 0.4})`; // prominent scale in
                        
                        let courseOpacity = 0;
                        if (p > 0.65) { // slightly delayed
                            courseOpacity = Math.min(1, (p - 0.65) * 5);
                        }
                        courseRef.current.style.opacity = courseOpacity;
                        courseRef.current.style.transform = `translate(40px, calc(-50% + 75px)) scale(${0.8 + courseOpacity * 0.4})`;
                    }
                    
                    // Expand background to cover text at the very end of sequence
                    if (bgRef.current) {
                        let expand = 0;
                        if (p > 0.8) {
                            expand = (p - 0.8) * 5; // 0 to 1
                        }
                        
                        const maxWidth = parseFloat(bgRef.current.dataset.maxWidth);
                        const baseWidth = parseFloat(bgRef.current.dataset.baseWidth);
                        const offset = parseFloat(bgRef.current.dataset.offset);
                        
                        if (!isNaN(maxWidth) && !isNaN(baseWidth)) {
                            bgRef.current.dataset.animating = 'true';
                            
                            // Ease the expansion using power2.inOut for a smoother wave effect
                            const easeExpand = gsap.parseEase('power2.inOut')(expand);
                            const currentWidth = baseWidth + (maxWidth - baseWidth) * easeExpand;
                            bgRef.current.style.width = `${currentWidth}px`;
                            
                            // Pan the globe from right-aligned (centered in 500px) to center-aligned
                            if (globeWrapperRef.current && !isNaN(offset)) {
                                const currentOffset = offset * (1 - easeExpand);
                                globeWrapperRef.current.style.transform = `translateX(${currentOffset}px)`;
                            }
                        }
                    }
                }
            });
        });

        return () => ctx.revert();
    }, [scrollTriggerRef, isClient]);

    if (!isClient) return <div style={{ width: '100%', height: '100%', minHeight: '500px' }} />;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px', maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Inner wrapper for the map to hide corners without clipping the logo */}
            <div ref={bgRef} style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#050505', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'absolute', top: 0, right: 0 }}>
                {/* Globe inner container to keep it pinned to the right when bg expands */}
                <div ref={globeWrapperRef} style={{ position: 'absolute', top: 0, right: 0, width: `${dimensions.width}px`, height: '100%', pointerEvents: 'none' }}>
                    <Globe
                        ref={globeEl}
                        width={dimensions.width}
                        height={dimensions.height}
                        backgroundColor="rgba(0,0,0,0)"
                        showAtmosphere={true}
                        atmosphereColor="#baff29"
                        atmosphereAltitude={0.15}
                        
                        // Textureless, flat geometry for stylized look
                        globeImageUrl={null}
                        bumpImageUrl={null}
                        
                        // Render country polygons
                        polygonsData={countries.features}
                        polygonAltitude={0.01}
                        polygonCapColor={() => '#e8e6e3'} // Off-white cream color to match site
                        polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
                        polygonStrokeColor={() => '#d4d0ca'}

                        // Render pulsing ring on Tagum City
                        ringsData={[targetLocation]}
                        ringColor={() => '#baff29'}
                        ringMaxRadius={5}
                        ringPropagationSpeed={2}
                        ringRepeatPeriod={1000}
                        
                        // Add a glowing dot
                        pointsData={[targetLocation]}
                        pointColor={() => '#baff29'}
                        pointAltitude={0.05}
                        pointRadius={0.1}
                    />
                </div>
            </div>
            
            {/* School Logo Overlay (Revealed via GSAP near end of zoom) */}
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

            {/* Course Overlay */}
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
