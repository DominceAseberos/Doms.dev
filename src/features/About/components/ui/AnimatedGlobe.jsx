import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SHOW_PLANE_PATHS } from './planeDebugConfig';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ── SCROLL PLANE CONFIG ─────────────────────────────────────────────────────
// Edit this block to customize the scroll-based plane animation!
const SCROLL_PLANE_CONFIG = {

    // Starting position of the plane (relative to center of the map box)
    initial: { x: -900, y: -500, scale: 0.15, rotation: -45 },

    // Waypoints the plane flies through before landing (add/remove freely!)
    // The pin duration auto-scales with the number of waypoints.
    flightPath: [
        { x: -400, y: -300 },
        { x: 200, y: 100 },
        { x: 0, y: 0 }, // Final landing point (center of map)
    ],

    // How much pinned scroll distance each waypoint costs
    scrollPerPoint: 80, // vh units — increase for slower flight
    // Extra pinned distance after the flight for the morph + globe reveal
    scrollForMorph: 120, // vh units
};

export default function AnimatedGlobe({ scrollTriggerRef, scrollStart = 'top 80%', scrollEnd = 'bottom 40%' }) {
    const globeEl = useRef();
    const containerRef = useRef();
    const logoRef = useRef();
    const courseRef = useRef();
    const bgRef = useRef();
    const globeWrapperRef = useRef();
    const creasesRef = useRef();
    const debugPathRef = useRef();
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

        // Set final POV (Deep zoom into Tagum)
        globeEl.current.pointOfView({
            lat: targetLocation.lat,
            lng: targetLocation.lng,
            altitude: 0.35
        }, 0);

        // ── PLANE TO MAP MORPHING TIMELINE ──

        // Plane Polygon (8 points)
        const planePolygon = 'polygon(50% 0%, 81% 29%, 90% 48%, 57% 49%, 52% 64%, 46% 49%, 14% 49%, 21% 29%)';
        // Map Polygon (8 points, mapped for smooth transition to a rounded rectangle look)
        const mapPolygon = 'polygon(50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%, 0% 0%)';

        // 1. Initial State Setup
        gsap.set(bgRef.current, {
            clipPath: planePolygon,
            x: SCROLL_PLANE_CONFIG.initial.x,
            y: SCROLL_PLANE_CONFIG.initial.y,
            rotation: SCROLL_PLANE_CONFIG.initial.rotation,
            scale: SCROLL_PLANE_CONFIG.initial.scale,
            width: '100%',
            borderRadius: '0px'
        });

        // Draw the debug path if enabled
        if (SHOW_PLANE_PATHS && debugPathRef.current) {
            try {
                const fullPath = [
                    { x: SCROLL_PLANE_CONFIG.initial.x, y: SCROLL_PLANE_CONFIG.initial.y },
                    ...SCROLL_PLANE_CONFIG.flightPath
                ];
                const rawPath = MotionPathPlugin.arrayToRawPath(fullPath, { curviness: 1.5 });
                const pathStr = MotionPathPlugin.rawPathToString(rawPath);
                debugPathRef.current.setAttribute('d', pathStr);
                debugPathRef.current.style.display = 'block';
            } catch (e) {
                console.error('Debug path error:', e);
            }
        }

        gsap.set(globeWrapperRef.current, { opacity: 0 });
        gsap.set(creasesRef.current, { opacity: 1 });
        gsap.set(containerRef.current, { opacity: 0 }); // Hide empty space until plane flies in

        if (logoRef.current && courseRef.current) {
            gsap.set(logoRef.current, { opacity: 0, x: 20, scale: 0.8 });
            gsap.set(courseRef.current, { opacity: 0, x: 40, scale: 0.8 });
        }

        // 2. Auto-calculate pin length from number of waypoints
        const numPoints = SCROLL_PLANE_CONFIG.flightPath.length;
        const pinDistance = (numPoints * SCROLL_PLANE_CONFIG.scrollPerPoint) + SCROLL_PLANE_CONFIG.scrollForMorph;

        // 3. Build Scroll Timeline — pin the parent row section
        const sectionEl = scrollTriggerRef.current?.closest('.ns-scrollytelling-row') || scrollTriggerRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top top',
                end: `+=${pinDistance}%`,  // Auto-scales with path length!
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
                refreshPriority: 1, // Ensure this pin spacer is calculated FIRST
            }
        });

        // Phase 1: Fly along the curved path — reveal container at very start
        tl.set(containerRef.current, { opacity: 1 }, 0); // Show container the moment scroll starts
        tl.to(bgRef.current, {
            motionPath: {
                path: SCROLL_PLANE_CONFIG.flightPath,
                curviness: 1.5,
                autoRotate: 90,
            },
            scale: 1,
            ease: 'power2.out',
            duration: numPoints, // More points = more timeline duration = more scroll
        }, 0);

        // Phase 2: Morph into Map
        tl.to(bgRef.current, {
            clipPath: mapPolygon,
            borderRadius: '24px', // Smooth corners
            rotation: 0, // Reset rotation back to upright
            ease: "power2.inOut",
            duration: 1
        }, ">"); // Right after flight lands

        // Phase 3: Fade out creases, Fade in Globe
        tl.to(creasesRef.current, { opacity: 0, duration: 0.5 }, ">-0.5");
        tl.to(globeWrapperRef.current, { opacity: 1, duration: 1 }, "<");

        // Phase 4: Overlays Pop In
        if (logoRef.current && courseRef.current) {
            tl.to(logoRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, ">-0.2");
            tl.to(courseRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, "<0.2");
        }

        // Phase 5: Deep zoom into Tagum
        tl.to({}, {
            duration: 1, // Empty tween just to trigger the pointOfView in scrub
            onUpdate: function () {
                // We use progress of this specific tween to interpolate zoom
                const p = this.progress();
                const currentAlt = 2.0 - (p * 1.65); // Zoom from 2.0 down to 0.35
                if (globeEl.current) {
                    globeEl.current.pointOfView({
                        lat: targetLocation.lat,
                        lng: targetLocation.lng,
                        altitude: currentAlt
                    }, 0); // 0ms transition because scrub is handling it
                }
            }
        }, ">-0.5");

        return () => {
            if (tl) tl.kill();
        };
    }, [scrollTriggerRef, isClient]);

    if (!isClient) return <div style={{ width: '100%', height: '100%', minHeight: '500px' }} />;

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '500px', maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0 }}>
            {/* DEBUG PATH — outside bgRef so clipping doesn't hide it */}
            {SHOW_PLANE_PATHS && (
                <svg style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '1px',
                    height: '1px',
                    overflow: 'visible',
                    pointerEvents: 'none',
                    zIndex: 9999,
                }}>
                    {/* Curved path line */}
                    <path
                        ref={debugPathRef}
                        fill="none"
                        stroke="red"
                        strokeWidth="3"
                        strokeDasharray="10, 6"
                        opacity="0.8"
                        style={{ display: 'none' }}
                    />
                    {/* Start dot */}
                    <circle cx={SCROLL_PLANE_CONFIG.initial.x} cy={SCROLL_PLANE_CONFIG.initial.y} r="8" fill="blue" />
                    {/* Waypoint dots */}
                    {SCROLL_PLANE_CONFIG.flightPath.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="8" fill="blue" />
                    ))}
                </svg>
            )}

            {/* Inner wrapper for the map to hide corners without clipping the logo */}

            <div ref={bgRef} style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#050505', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'absolute', top: 0, right: 0 }}>
                {/* Globe inner container to keep it pinned to the right when bg expands */}
                <div ref={globeWrapperRef} style={{ position: 'absolute', top: 0, right: 0, width: `${dimensions.width}px`, height: '100%', pointerEvents: 'none', opacity: 0 }}>
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

                {/* Paper Plane Creases (Visible initially, fades out after morph) */}
                <svg ref={creasesRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, pointerEvents: 'none' }}>
                    {/* Left wing crease */}
                    <line x1="50%" y1="0%" x2="46%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Right wing crease */}
                    <line x1="50%" y1="0%" x2="57%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Center fold down to the tail */}
                    <line x1="50%" y1="0%" x2="52%" y2="64%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                </svg>
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
