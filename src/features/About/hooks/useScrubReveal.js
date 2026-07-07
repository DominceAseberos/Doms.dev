import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function useScrubReveal(containerRef, dataReady) {
    useEffect(() => {
        if (!dataReady || !containerRef.current) return;

        // Small RAF delay so the DOM has fully painted before measuring
        const raf = requestAnimationFrame(() => {
            const ctx = gsap.context(() => {
                const els = gsap.utils.toArray('.ns-reveal', containerRef.current);
                if (els.length > 0) {
                    gsap.set(els, { opacity: 0, y: 36, immediateRender: true });

                    ScrollTrigger.batch(els, {
                        start: 'top 92%',
                        onEnter: (batch) => {
                            gsap.to(batch, {
                                opacity: 1,
                                y: 0,
                                duration: 0.7,
                                ease: 'power2.out',
                                stagger: 0.1,
                            });
                        },
                    });
                }

                const techRevealEls = gsap.utils.toArray('.ns-tech-reveal', containerRef.current);
                if (techRevealEls.length > 0) {
                    gsap.set(techRevealEls, { opacity: 0, scale: 0.8, y: 20 });
                    ScrollTrigger.batch(techRevealEls, {
                        start: 'top 95%',
                        onEnter: (batch) => {
                            gsap.to(batch, {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'back.out(1.5)',
                                stagger: 0.04,
                                overwrite: 'auto'
                            });
                        },
                    });
                }

                ScrollTrigger.refresh();
            }, containerRef);
            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
    }, [dataReady, containerRef]);
}
