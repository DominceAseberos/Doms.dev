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
    cvButtonRef
}) => {
    useLayoutEffect(() => {
        if (!revealReady) return;

        const isMobile = window.innerWidth < 768;
        const popCards = [heroCardRef, identityCardRef, feedCard, mdIconStack, educationCardRef, resumeCardRef, footerRef];
        const textContainers = [textAboutMeRef, textFeedRef, backButtonRef, cvButtonRef];

        const cardEls = popCards.map(ref => ref.current).filter(Boolean);
        const textEls = textContainers.map(ref => ref.current).filter(Boolean);
        gsap.killTweensOf([...cardEls, ...textEls]);

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

            // 1. Effects Card - Immediate Reveal
            if (effectsCard) {
                gsap.fromTo(effectsCard,
                    { opacity: 0, y: 30, scale: 0.92 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1, ease: 'power3.out',
                        onComplete: () => animateInner(effectsCard)
                    }
                );
            }

            // 2. Text About Me - Sequential Reveal (After Effects Card)
            if (textAboutMe) {
                gsap.fromTo(textAboutMe,
                    { opacity: 0, y: 30, scale: 0.95 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.8, ease: 'power2.out',
                        onComplete: () => animateInner(textAboutMe)
                    }
                );
            }

            // 3. All other cards - ScrollTrigger
            scrollWrappers.forEach((wrapper, index) => {
                // If the first scroll card (Hero) is ALREADY in view, wait for the intro sequence (1.4s).
                // Otherwise, reveal quickly when scrolled to (0.2s).
                const isHero = index === 0;
                const isVisible = ScrollTrigger.isInViewport(wrapper);
                const revealDelay = (isHero && isVisible) ? 1.4 : 0.2;

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

            // 1. Hero / Profile (0.1s) - Slow
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
                    0.2
                );
            }

            // 2. TextAboutMe - Text Reveal (0.5s)
            // 2. TextAboutMe (0.4s Container, 0.5s Text)
            if (textAboutMeRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textAboutMeRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    0.6
                );

                const textElements = textAboutMeRef.current.querySelectorAll('.text-reveal');
                if (textElements.length > 0) {
                    tl.fromTo(textElements,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)' },
                        0.5
                    );
                }
            }

            // 3. Identity (0.9s)
            if (identityCardRef.current) {
                tl.fromTo(identityCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    0.9
                );
            }

            // 4. TextFeed - Text Reveal (1.3s)
            // 4. TextFeed (1.2s Container, 1.3s Text)
            if (textFeedRef.current) {
                // Gentle container reveal (fade only)
                tl.fromTo(textFeedRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: 'power2.out' },
                    1.2
                );

                const textFeedElements = textFeedRef.current.querySelectorAll('.text-reveal');
                if (textFeedElements.length > 0) {
                    tl.fromTo(textFeedElements,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' },
                        1.3
                    );
                }
            }

            // 5. Feed Card (1.6s)
            if (feedCard.current) {
                tl.fromTo(feedCard.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
                    1.6
                );
            }

            // --- FASTER SEQUENCE ---

            // 6. Tech Stack (2.0s)
            if (mdIconStack.current) {
                tl.fromTo(mdIconStack.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.0
                );
            }

            // 7. Education (2.2s)
            if (educationCardRef.current) {
                tl.fromTo(educationCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.2
                );
            }

            // 8. Resume (2.4s)
            if (resumeCardRef.current) {
                tl.fromTo(resumeCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.4
                );
            }

            if (cvButtonRef.current) {
                tl.fromTo(cvButtonRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                    2.5
                );
            }

            // 9. Footer (2.6s)
            // 9. Footer (2.6s)
            if (footerRef.current) {
                // Reveal Container
                tl.fromTo(footerRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    2.6
                );

                // Reveal Icons/Text inside
                const footerElements = footerRef.current.querySelectorAll('.scroll-reveal');
                if (footerElements.length) {
                    tl.fromTo(footerElements,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' },
                        2.8 // Start after container reveals
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
