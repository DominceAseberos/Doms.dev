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
    footerRef,
    textAboutMeRef,
    textFeedRef,
    backButtonRef,
    cvButtonRef,
    dropletRef
}) => {
    useLayoutEffect(() => {
        if (!revealReady) return;

        const isMobile = window.innerWidth < 768;
        const popCards = [heroCardRef, identityCardRef, feedCard, mdIconStack, educationCardRef, resumeCardRef, footerRef];
        const textContainers = [textAboutMeRef, textFeedRef, backButtonRef, cvButtonRef];

        const cardEls = popCards.map(ref => ref.current).filter(Boolean);
        const textEls = textContainers.map(ref => ref.current).filter(Boolean);
        gsap.killTweensOf([...cardEls, ...textEls]);

        // Ripple Animation (Shared)
        if (dropletRef?.current?.length) {
            gsap.fromTo(dropletRef.current,
                { attr: { r: 0 }, opacity: 1, strokeWidth: 2 },
                {
                    attr: { r: "120%" },
                    opacity: 0,
                    strokeWidth: 0,
                    duration: 4.0, // Slower wave
                    ease: "power2.out",
                    stagger: 0.4
                }
            );
        }

        if (isMobile) {
            // MOBILE: Reveal sequences for wrappers
            const mobileCards = gsap.utils.toArray('.mobile-reveal-card');

            // Hide all inner .scroll-reveal AND .text-reveal elements initially
            mobileCards.forEach(card => {
                const inner = card.querySelectorAll('.scroll-reveal, .text-reveal');
                if (inner.length) gsap.set(inner, { opacity: 0, y: 12 });
            });

            // SPLIT CARDS: Visible vs. Below Fold
            const visibleCards = [];
            const hiddenCards = [];

            mobileCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    visibleCards.push(card);
                } else {
                    hiddenCards.push(card);
                }
            });

            const animateInner = (card, delay = 0) => {
                const inner = card.querySelectorAll('.scroll-reveal, .text-reveal');
                if (inner.length) {
                    gsap.fromTo(inner,
                        { y: 15, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: delay }
                    );
                }
            };

            // 1. ANIMATE VISIBLE CARDS (Sequential Top-to-Bottom)
            // Start after ripple overlap (approx 1.2s)
            const startDelay = 1.5;

            visibleCards.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.6,
                        delay: startDelay + (index * 0.8), // Wait for text reveals
                        ease: 'power3.out',
                        onComplete: () => {
                            animateInner(card, 0.1); // slight delay for inner
                        }
                    }
                );
            });

            // 2. ANIMATE HIDDEN CARDS (ScrollTrigger)
            hiddenCards.forEach((card) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                            once: true
                        },
                        onComplete: () => {
                            animateInner(card, 0.1);
                        }
                    }
                );
            });
        } else {


            // DESKTOP: Sequential reveal with specific timing
            // First, hide all cards immediately so they're not visible before animation
            gsap.set(cardEls, { opacity: 0, y: 25, scale: 0.95 });
            gsap.set(textEls, { opacity: 0 });

            const tl = gsap.timeline();

            // 1. Hero / Profile (1.2s)
            if (heroCardRef.current) {
                tl.fromTo(heroCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    1.2
                );
            }

            if (backButtonRef.current) {
                tl.fromTo(backButtonRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
                    1.2
                );
            }

            // 2. TextAboutMe (1.6s)
            if (textAboutMeRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textAboutMeRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    1.6
                );

                const textElements = textAboutMeRef.current.querySelectorAll('.text-reveal');
                if (textElements.length > 0) {
                    tl.fromTo(textElements,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)' },
                        1.0
                    );
                }
            }

            // 3. Identity (2.4s) - Wait for TextAboutMe (approx 0.8s)
            if (identityCardRef.current) {
                tl.fromTo(identityCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    2.4
                );
            }

            // 4. TextFeed (2.7s)
            if (textFeedRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textFeedRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    2.7
                );

                const textFeedElements = textFeedRef.current.querySelectorAll('.text-reveal');
                if (textFeedElements.length > 0) {
                    tl.fromTo(textFeedElements,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' },
                        2.8
                    );
                }
            }

            // 5. Feed Card (3.5s) - Wait for TextFeed (approx 0.8s)
            if (feedCard.current) {
                tl.fromTo(feedCard.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    3.5
                );
            }

            // --- FASTER SEQUENCE ---

            // 6. Tech Stack (3.9s)
            if (mdIconStack.current) {
                tl.fromTo(mdIconStack.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    3.9
                );
            }

            // 7. Education (4.1s)
            if (educationCardRef.current) {
                tl.fromTo(educationCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    4.1
                );
            }

            // 8. Resume (4.3s)
            if (resumeCardRef.current) {
                tl.fromTo(resumeCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    4.3
                );
            }

            if (cvButtonRef.current) {
                tl.fromTo(cvButtonRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                    4.4
                );
            }

            // 9. Footer (4.5s)
            if (footerRef.current) {
                // Reveal Container
                tl.fromTo(footerRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    4.5
                );

                // Reveal Icons/Text inside
                const footerElements = footerRef.current.querySelectorAll('.scroll-reveal');
                if (footerElements.length) {
                    tl.fromTo(footerElements,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' },
                        4.7 // Start after container reveals
                    );
                }
            }

            tl.eventCallback('onComplete', () => {
                [...cardEls, ...textEls].forEach(el => el?.classList.add('animation-complete'));
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [revealReady, heroCardRef, textAboutMeRef, identityCardRef, feedCard, textFeedRef, mdIconStack, educationCardRef, resumeCardRef, footerRef, backButtonRef, cvButtonRef]);
};
