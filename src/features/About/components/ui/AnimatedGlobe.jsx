import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedGlobe({ scrollTriggerRef }) {
    const globeEl = useRef();
    const containerRef = useRef();
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
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        handleResize();
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
                start: 'top 80%',
                end: 'bottom 40%',
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
                }
            });
        });

        return () => ctx.revert();
    }, [scrollTriggerRef, isClient]);

    if (!isClient) return <div style={{ width: '100%', height: '100%', minHeight: '500px' }} />;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px', maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#050505', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
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
    );
}
