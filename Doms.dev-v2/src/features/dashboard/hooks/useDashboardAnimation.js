import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useDashboardAnimation = ({
    isMobile,
    revealReady,
    compRef,
    dashboardVisited,
    setDashboardVisited,
    dropletRef
}) => {
    // DESKTOP ANIMATION
    useLayoutEffect(() => {
        if (!revealReady) return; // Wait for loader to complete

        // 0. Water Droplet Ripple (Shared - Runs on both Mobile & Desktop)
        // Check local storage or state if you only want it once per session, currently runs every time hook mounts if revealReady
        if (dropletRef?.current?.length) {
            gsap.fromTo(dropletRef.current,
                { attr: { r: 0 }, opacity: 1, strokeWidth: 2 },
                {
                    attr: { r: "120%" },
                    opacity: 0,
                    strokeWidth: 0,
                    duration: 4.0, // Slower wave
                    ease: "power2.out",
                    stagger: 0.4 // Slower stagger
                }
            );
        }

        // Always animate on desktop (for testing - remove dashboardVisited check if needed later)
        if (!isMobile) {
            let ctx = gsap.context(() => {
                let mm = gsap.matchMedia();
                mm.add("(min-width: 768px)", () => {
                    // Sequential reveal per user spec
                    const tl = gsap.timeline();

                    // 1. Profile + AboutMe (1.2s)
                    tl.fromTo(".desktop-profile-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
                        1.2
                    );

                    // 2. ProjectHead (1.8s) - Wait for Profile
                    tl.fromTo(".desktop-projecthead-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out",
                            onComplete: () => {
                                // Animate inner text (Duration ~0.6s total with stagger)
                                const innerElements = document.querySelectorAll('.desktop-projecthead-row .animate-portfolio, .desktop-projecthead-row .animate-breadcrumb');
                                if (innerElements.length) {
                                    gsap.fromTo(innerElements,
                                        { y: 15, opacity: 0 },
                                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
                                    );
                                }
                            }
                        },
                        1.8
                    );

                    // 3. Projects carousel (2.5s) - Wait for ProjectHead Text (~0.7s delay)
                    tl.fromTo(".desktop-projects-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        2.5
                    );

                    // 4. MusicPlayer + ThemeToggle + Contacts (3.2s) - Wait for Projects
                    tl.fromTo(".desktop-theme-row",
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        3.2
                    );
                    tl.fromTo(".desktop-music-row",
                        { opacity: 0, y: 25, scale: 0.98 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
                        3.3
                    );
                    tl.fromTo(".desktop-contacts-row",
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                        3.4
                    );

                    // 5. ProjectBottom (4.0s) - Wait for Row 4
                    tl.fromTo(".desktop-projectbottom-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
                            onComplete: () => {
                                // Animate inner text elements (Duration ~0.6s)
                                const bottomLines = document.querySelectorAll('.desktop-projectbottom-row .animate-bottom-line');
                                const scrollLabel = document.querySelector('.desktop-projectbottom-row .opacity-30');

                                if (bottomLines.length) {
                                    gsap.fromTo(bottomLines,
                                        { y: 15, opacity: 0 },
                                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
                                    );
                                }
                                // Animate the "Commit by Commit" subtext
                                if (scrollLabel) {
                                    gsap.fromTo(scrollLabel,
                                        { y: 10, opacity: 0 },
                                        { y: 0, opacity: 0.3, duration: 0.5, delay: 0.2, ease: "power2.out" }
                                    );
                                }
                            }
                        },
                        4.0
                    );

                    // 6. GitHub Stats + GitHubFocusCard + TechStacks (4.8s) - Wait for ProjectBottom Text
                    tl.fromTo(".desktop-github-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        4.8
                    );
                    tl.fromTo(".desktop-focus-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        4.8
                    );
                    tl.fromTo(".desktop-techstacks-row",
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        5.0
                    );

                    tl.eventCallback("onComplete", () => {
                        document.querySelectorAll('[class*="desktop-"]').forEach(el => {
                            el.classList.add('animation-complete');
                        });
                    });
                });
            }, compRef);
            setDashboardVisited(true);
            return () => ctx.revert();
        }
    }, [dashboardVisited, setDashboardVisited, isMobile, revealReady, compRef]);

    // MOBILE ANIMATION
    useEffect(() => {
        if (!revealReady || !isMobile) return;

        const mobileCards = Array.from(document.querySelectorAll('.mobile-reveal'));
        if (!mobileCards.length) return;

        // SPLIT CARDS: Visible vs. Below Fold
        const visibleCards = [];
        const hiddenCards = [];

        mobileCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Check if card is roughly in viewport (top < windowHeight - small buffer)
            if (rect.top < window.innerHeight - 50) {
                visibleCards.push(card);
            } else {
                hiddenCards.push(card);
            }
        });

        // 1. ANIMATE VISIBLE CARDS (Sequential Top-to-Bottom)
        // Start after ripple overlap (approx 1.2s)
        const startDelay = 1.5;

        visibleCards.forEach((card, index) => {
            gsap.fromTo(card,
                { scale: 0.95, opacity: 0, y: 30 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.6,
                    // Use a larger stagger to allow text animations (if any) to play out before the next card starts
                    delay: startDelay + (index * 0.8),
                    ease: "power3.out",
                    onComplete: () => {
                        card.classList.add('animation-complete');
                        // Inner text animations (if any)
                        const innerElements = card.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                        if (innerElements.length) {
                            gsap.fromTo(innerElements,
                                { y: 20, opacity: 0 },
                                {
                                    y: 0, opacity: 1,
                                    duration: 0.6, stagger: 0.08, ease: "power3.out"
                                }
                            );
                        }
                    }
                }
            );
        });

        // 2. ANIMATE HIDDEN CARDS (ScrollTrigger)
        hiddenCards.forEach((card) => {
            gsap.fromTo(card,
                { scale: 0.95, opacity: 0, y: 30 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%", // Trigger slightly earlier than bottom
                        toggleActions: "play none none none",
                        once: true
                    },
                    onComplete: () => {
                        card.classList.add('animation-complete');
                        const innerElements = card.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                        if (innerElements.length) {
                            // Wait slightly for container to settle
                            gsap.fromTo(innerElements,
                                { y: 20, opacity: 0 },
                                { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.1 }
                            );
                        }
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [revealReady, isMobile]);
};
