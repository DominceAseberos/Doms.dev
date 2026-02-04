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
                    duration: 2.5,
                    ease: "power2.out",
                    stagger: 0.2
                }
            );
        }

        if (isMobile) {
            // MOBILE: Reveal sequences for wrappers
            const mobileCards = gsap.utils.toArray('.mobile-reveal-card');
            const [effectsCard, textAboutMe, ...scrollWrappers] = mobileCards;

            // Hide all inner .scroll-reveal AND .text-reveal elements initially
            mobileCards.forEach(card => {
                const inner = card.querySelectorAll('.scroll-reveal, .text-reveal');
                if (inner.length) gsap.set(inner, { opacity: 0, y: 12 });
            });

            const animateInner = (card) => {
                const inner = card.querySelectorAll('.scroll-reveal, .text-reveal');
                if (inner.length) {
                    gsap.fromTo(inner,
                        { y: 15, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
                    );
                }
            };

            // 1. Effects Card - Immediate Reveal (Delayed by 0.6s)
            if (effectsCard) {
                gsap.fromTo(effectsCard,
                    { opacity: 0, y: 30, scale: 0.92 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.6, ease: 'power3.out',
                        onComplete: () => animateInner(effectsCard)
                    }
                );
            }

            // 2. Text About Me - Sequential Reveal (Delayed by 1.3s)
            if (textAboutMe) {
                gsap.fromTo(textAboutMe,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 1.3, ease: 'power2.out',
                        onComplete: () => animateInner(textAboutMe)
                    }
                );
            }

            // 3. All other cards - ScrollTrigger
            scrollWrappers.forEach((wrapper, index) => {
                // If the first scroll card (Hero) is ALREADY in view, wait for the intro sequence.
                const isHero = index === 0;
                const isVisible = ScrollTrigger.isInViewport(wrapper);
                const revealDelay = (isHero && isVisible) ? 1.9 : 0.2; // Shift 1.4 -> 1.9

                gsap.fromTo(wrapper,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: revealDelay, ease: 'power2.out',
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
            gsap.set(textEls, { opacity: 0 });

            const tl = gsap.timeline();

            // 1. Hero / Profile (0.1s) - Slow (Shifted to 1.7s)
            if (heroCardRef.current) {
                tl.fromTo(heroCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    1.7
                );
            }

            if (backButtonRef.current) {
                tl.fromTo(backButtonRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
                    0.7
                );
            }

            // 2. TextAboutMe - Text Reveal (1.1s)
            if (textAboutMeRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textAboutMeRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    1.1
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

            // 3. Identity (1.4s)
            if (identityCardRef.current) {
                tl.fromTo(identityCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    1.4
                );
            }

            // 4. TextFeed - Text Reveal (1.7s)
            if (textFeedRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textFeedRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    1.7
                );

                const textFeedElements = textFeedRef.current.querySelectorAll('.text-reveal');
                if (textFeedElements.length > 0) {
                    tl.fromTo(textFeedElements,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' },
                        1.8
                    );
                }
            }

            // 5. Feed Card (2.1s)
            if (feedCard.current) {
                tl.fromTo(feedCard.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    2.1
                );
            }

            // --- FASTER SEQUENCE ---

            // 6. Tech Stack (2.5s)
            if (mdIconStack.current) {
                tl.fromTo(mdIconStack.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.5
                );
            }

            // 7. Education (2.7s)
            if (educationCardRef.current) {
                tl.fromTo(educationCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.7
                );
            }

            // 8. Resume (2.9s)
            if (resumeCardRef.current) {
                tl.fromTo(resumeCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.9
                );
            }

            if (cvButtonRef.current) {
                tl.fromTo(cvButtonRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                    3.0
                );
            }

            // 9. Footer (3.1s)
            if (footerRef.current) {
                // Reveal Container
                tl.fromTo(footerRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    3.1
                );

                // Reveal Icons/Text inside
                const footerElements = footerRef.current.querySelectorAll('.scroll-reveal');
                if (footerElements.length) {
                    tl.fromTo(footerElements,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' },
                        3.3 // Start after container reveals
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
