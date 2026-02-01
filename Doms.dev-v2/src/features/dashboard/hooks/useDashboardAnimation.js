import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useDashboardAnimation = ({
    isMobile,
    revealReady,
    compRef,
    dashboardVisited,
    setDashboardVisited
}) => {
    // DESKTOP ANIMATION
    useLayoutEffect(() => {
        if (!revealReady) return; // Wait for loader to complete

        // Always animate on desktop (for testing - remove dashboardVisited check if needed later)
        if (!isMobile) {
            let ctx = gsap.context(() => {
                let mm = gsap.matchMedia();
                mm.add("(min-width: 768px)", () => {
                    // Sequential reveal per user spec
                    const tl = gsap.timeline();

                    // 1. Profile + AboutMe (first)
                    tl.fromTo(".desktop-profile-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
                        0.3
                    );

                    // 2. ProjectHead container, then inner text
                    tl.fromTo(".desktop-projecthead-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out",
                            onComplete: () => {
                                // Animate inner text of ProjectHead after container
                                const innerElements = document.querySelectorAll('.desktop-projecthead-row .animate-portfolio, .desktop-projecthead-row .animate-breadcrumb');
                                if (innerElements.length) {
                                    gsap.fromTo(innerElements,
                                        { y: 15, opacity: 0 },
                                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
                                    );
                                }
                            }
                        },
                        0.6
                    );

                    // 3. Projects carousel
                    tl.fromTo(".desktop-projects-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        0.9
                    );

                    // 4. MusicPlayer + ThemeToggle + Contacts (slight stagger)
                    tl.fromTo(".desktop-theme-row",
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        1.2
                    );
                    tl.fromTo(".desktop-music-row",
                        { opacity: 0, y: 25, scale: 0.98 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
                        1.3
                    );

                    // 5. ProjectBottom (container then inner text like ProjectHead)
                    tl.fromTo(".desktop-projectbottom-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        {
                            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
                            onComplete: () => {
                                // Animate inner text elements after container
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
                        1.5
                    );

                    // 6. GitHub Stats + GitHubFocusCard + TechStacks
                    tl.fromTo(".desktop-github-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        1.7
                    );
                    tl.fromTo(".desktop-focus-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        1.7
                    );
                    tl.fromTo(".desktop-techstacks-row",
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        1.9
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

        // Cards layout: [0]=Profile/Music, [1]=AboutMe, [2]=ProjectHead, [3]=Projects, [4+]=rest
        const profileRow = mobileCards[0];      // Profile + Music + Theme
        const aboutMe = mobileCards[1];         // AboutMe card
        const projectHead = mobileCards[2];     // ProjectHead container
        const projectsCarousel = mobileCards[3]; // Projects carousel
        const belowFoldCards = mobileCards.slice(4); // ProjectBottom, GitHub, Contacts, etc.

        // 1. Profile/Music row (delay: 0.5s)
        gsap.fromTo(profileRow,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 0.5, ease: "power3.out",
                onComplete: () => profileRow?.classList.add('animation-complete')
            }
        );

        // 2. AboutMe card (delay: 1s)
        gsap.fromTo(aboutMe,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 1, ease: "power3.out",
                onComplete: () => aboutMe?.classList.add('animation-complete')
            }
        );

        // 3. ProjectHead container (delay: 1.6s), then inner text
        gsap.fromTo(projectHead,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 1.6, ease: "power3.out",
                onComplete: () => {
                    projectHead?.classList.add('animation-complete');
                    // Animate inner text after container reveals
                    const innerElements = projectHead?.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                    if (innerElements?.length) {
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

        // 4. Projects carousel (delay: 2.4s - bigger delay)
        gsap.fromTo(projectsCarousel,
            { scale: 0.95, opacity: 0, y: 40 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.7, delay: 2.4, ease: "power3.out",
                onComplete: () => projectsCarousel?.classList.add('animation-complete')
            }
        );

        // 5. Below fold cards: scroll-triggered with staggered delays
        belowFoldCards.forEach((card, index) => {
            gsap.fromTo(card,
                { scale: 0.95, opacity: 0, y: 25 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.5, ease: "power2.out",
                    delay: index * 0.15, // Stagger delay
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true
                    },
                    onComplete: () => card?.classList.add('animation-complete')
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [revealReady, isMobile]);
};
