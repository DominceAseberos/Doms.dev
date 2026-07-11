import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PlaneSprayEffect({ planeRef, active = true }) {
    const sprayContainerRef = useRef(null);

    useEffect(() => {
        if (!active || !planeRef.current || !sprayContainerRef.current) return;

        let lastX = 0;
        let lastY = 0;

        let lastProgress = 0;

        const handleUpdate = () => {
            const px = gsap.getProperty(planeRef.current, 'x');
            const py = gsap.getProperty(planeRef.current, 'y');
            const pScale = gsap.getProperty(planeRef.current, 'scale') || 1;
            const progress = parseFloat(planeRef.current.dataset.progress || 0);

            // OPTIMIZATION 1: Blazing fast backwards erasure!
            // Since droplets are appended chronologically, the newest drops are always at the end.
            // Instead of scanning all 2000 dots, we just pop them off the end until we match the current progress.
            if (progress < lastProgress) {
                let lastChild = sprayContainerRef.current.lastElementChild;
                while (lastChild && parseFloat(lastChild.dataset.p || 0) > progress) {
                    sprayContainerRef.current.removeChild(lastChild);
                    lastChild = sprayContainerRef.current.lastElementChild;
                }
                lastX = px;
                lastY = py;
                lastProgress = progress;
                return; // Stop here so we don't spawn new ink while moving backwards
            }

            // Spawn a new ink splatter if the plane has moved far enough FORWARD
            const dist = Math.hypot(px - lastX, py - lastY);
            if (dist > 15 && progress >= lastProgress) {
                lastX = px;
                lastY = py;
                lastProgress = progress;

                // Spawn a MASSIVE cluster of dots to create a huge scattered box of ink
                const numDots = 15 + Math.floor(Math.random() * 15); // 15 to 30 dots per splatter

                for (let i = 0; i < numDots; i++) {
                    const droplet = document.createElement('div');
                    droplet.dataset.p = progress; // Stamp the droplet with the exact timeline progress
                    
                    const isMain = i < 5; // First 5 dots are the big chunky core
                    
                    // Main dots are big, satellite dots are small
                    const sizeMultiplier = isMain ? (1 + Math.random() * 1.5) : (0.1 + Math.random() * 0.5);
                    const baseSize = 35 * pScale * sizeMultiplier;
                    
                    // Create a wide rectangular "box" scatter pattern
                    const scatterWidth = 200 * pScale;
                    const scatterHeight = 200 * pScale;
                    const offsetX = (Math.random() - 0.5) * scatterWidth;
                    const offsetY = (Math.random() - 0.5) * scatterHeight;

                    // Random organic blob shape via CSS border-radius
                    const r1 = 30 + Math.random() * 40;
                    const r2 = 30 + Math.random() * 40;
                    const r3 = 30 + Math.random() * 40;
                    const r4 = 30 + Math.random() * 40;
                    const blobRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r4}% ${r3}% ${r2}% ${r1}%`;

                    Object.assign(droplet.style, {
                        position: 'absolute',
                        left: `${px + offsetX}px`,
                        top: `${py + offsetY}px`,
                        width: `${baseSize}px`,
                        height: `${baseSize}px`,
                        backgroundColor: '#11151c', // Solid dark ink
                        borderRadius: blobRadius,
                        transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                        pointerEvents: 'none',
                        opacity: '0.95', // Solid, not blurry
                        willChange: 'transform' // Tell GPU this will animate
                    });

                    sprayContainerRef.current.appendChild(droplet);

                    // Animate ink splashing onto the paper
                    gsap.fromTo(droplet, 
                        { scale: 0 },
                        {
                            scale: 1,
                            duration: 0.2 + Math.random() * 0.3,
                            ease: 'power2.out',
                            onComplete: () => {
                                // OPTIMIZATION 2: Free GPU memory once the animation finishes!
                                droplet.style.willChange = 'auto';
                            }
                        }
                    );
                }

                // Prevent infinite DOM explosion if user scrubs back and forth for hours
                while (sprayContainerRef.current.childNodes.length > 2000) {
                    sprayContainerRef.current.removeChild(sprayContainerRef.current.firstChild);
                }
            }
        };

        // Listen to GSAP ticker (fires every frame)
        gsap.ticker.add(handleUpdate);

        return () => {
            gsap.ticker.remove(handleUpdate);
            // Clean up any remaining droplets on unmount
            if (sprayContainerRef.current) {
                sprayContainerRef.current.innerHTML = '';
            }
        };
    }, [active, planeRef]);

    if (!active) return null;

    return (
        <div
            ref={sprayContainerRef}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                zIndex: 3, // Behind the plane (z: 5)
                pointerEvents: 'none',
            }}
        />
    );
}
