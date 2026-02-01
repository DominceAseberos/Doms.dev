import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useAboutMeAnimation = ({
    revealReady,
    heroCardRef,
    identityCardRef,
    feedCard,
    mdIconStack,
    educationCardRef,
    resumeCardRef,
    footerRef
}) => {
    useLayoutEffect(() => {
        if (!revealReady) return;

        const isMobile = window.innerWidth < 768;
        const cards = [heroCardRef, identityCardRef, feedCard, mdIconStack, educationCardRef, resumeCardRef, footerRef];
        const cardEls = cards.map(ref => ref.current).filter(Boolean);
        gsap.killTweensOf(cardEls);

        if (isMobile) {
            // MOBILE: Reveal sequences for wrappers
            const mobileCards = gsap.utils.toArray('.mobile-reveal-card');
            const [heroWrapper, ...scrollWrappers] = mobileCards;

            // Hide all inner .scroll-reveal elements initially (for "Container then Text" effect)
            mobileCards.forEach(card => {
                const inner = card.querySelectorAll('.scroll-reveal');
                if (inner.length) gsap.set(inner, { opacity: 0, y: 15 });
            });

            const animateInner = (card) => {
                const inner = card.querySelectorAll('.scroll-reveal');
                if (inner.length) {
                    gsap.fromTo(inner,
                        { y: 15, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
                    );
                }
            };

            // 1. Hero (0.5s delay) - Reveals as single unit
            if (heroWrapper) {
                gsap.fromTo(heroWrapper,
                    { opacity: 0, y: 30, scale: 0.92 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.5, ease: 'power3.out',
                        onComplete: () => {
                            // No animateInner(heroWrapper) as per request (single unit reveal)
                        }
                    }
                );
            }

            // 2. All other cards - ScrollTrigger
            // Reveal when top of card hits 85% of viewport height (slightly before bottom)
            scrollWrappers.forEach((wrapper) => {
                gsap.fromTo(wrapper,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "top 85%",
                            toggleActions: "play none none none",
                            once: true
                        },
                        onComplete: () => animateInner(wrapper)
                    }
                );
            });
        } else {
            // DESKTOP: Sequential reveal with specific timing
            // First, hide all cards immediately so they're not visible before animation
            gsap.set(cardEls, { opacity: 0, y: 25, scale: 0.95 });

            const tl = gsap.timeline();

            // 1. Hero (0.3s)
            if (heroCardRef.current) {
                tl.fromTo(heroCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.3
                );
            }

            // 2. Identity (0.5s)
            if (identityCardRef.current) {
                tl.fromTo(identityCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.5
                );
            }

            // 3. StatusCard (0.7s)
            if (feedCard.current) {
                tl.fromTo(feedCard.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.7
                );
            }

            // 4. TechStack (0.9s)
            if (mdIconStack.current) {
                tl.fromTo(mdIconStack.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.9
                );
            }

            // 5. Education (1.1s)
            if (educationCardRef.current) {
                tl.fromTo(educationCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.1
                );
            }

            // 6. Resume + CV Button (1.3s)
            if (resumeCardRef.current) {
                tl.fromTo(resumeCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.3
                );
            }

            // 7. Footer (1.5s)
            if (footerRef.current) {
                tl.fromTo(footerRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.5
                );
            }

            tl.eventCallback('onComplete', () => {
                cardEls.forEach(el => el?.classList.add('animation-complete'));
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [revealReady, heroCardRef, identityCardRef, feedCard, mdIconStack, educationCardRef, resumeCardRef, footerRef]);
};
