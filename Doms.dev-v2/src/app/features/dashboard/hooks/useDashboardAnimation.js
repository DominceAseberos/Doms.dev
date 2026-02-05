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
        if (!revealReady) return;

        // 0. Water Droplet Ripple (Shared)
        if (dropletRef?.current?.length) {
            gsap.fromTo(dropletRef.current,
                { attr: { r: 0 }, opacity: 1, strokeWidth: 2 },
                {
                    attr: { r: "120%" },
                    opacity: 0,
                    strokeWidth: 0,
                    duration: 4.0,
                    ease: "power2.out",
                    stagger: 0.4
                }
            );
        }

        if (!isMobile) {
            let ctx = gsap.context(() => {
                let mm = gsap.matchMedia();
                mm.add("(min-width: 768px)", () => {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            document.querySelectorAll('[class*="desktop-"]').forEach(el => {
                                el.classList.add('animation-complete');
                            });
                        }
                    });

                    // --- STEP 1: INITIAL ANCHOR (Profile & About) ---
                    tl.fromTo(".desktop-profile-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
                        0.5
                    );

                    // --- STEP 2: PROJECT SECTION (Head + Carousel) ---
                    // Project Head Container
                    tl.fromTo(".desktop-projecthead-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
                        ">0.1"
                    );

                    // Project Head Text Reveal
                    // We select them dynamically. If they don't exist yet, this might be tricky, 
                    // but they should be in DOM if revealReady is true.
                    const projectHeadTexts = document.querySelectorAll('.desktop-projecthead-row .animate-portfolio, .desktop-projecthead-row .animate-breadcrumb');
                    if (projectHeadTexts.length > 0) {
                        tl.fromTo(projectHeadTexts,
                            { y: 15, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
                            ">"
                        );
                    }

                    // Project Carousel
                    tl.fromTo(".desktop-projects-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        ">0.1" // Wait for text reveal
                    );

                    // --- STEP 3: GITHUB FOCUS CARD ---
                    tl.fromTo(".desktop-focus-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        ">0.1"
                    );

                    // --- STEP 4: PROJECT BOTTOM ---
                    // Container
                    tl.fromTo(".desktop-projectbottom-row",
                        { opacity: 0, y: 25, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
                        ">0.1"
                    );

                    // Bottom Text Reveal
                    const bottomLines = document.querySelectorAll('.desktop-projectbottom-row .animate-bottom-line');
                    if (bottomLines.length > 0) {
                        tl.fromTo(bottomLines,
                            { y: 15, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
                            ">"
                        );
                    }
                    const scrollLabel = document.querySelector('.desktop-projectbottom-row .opacity-30'); // Commit by commit label
                    if (scrollLabel) {
                        tl.fromTo(scrollLabel,
                            { y: 10, opacity: 0 },
                            { y: 0, opacity: 0.3, duration: 0.5, ease: "power2.out" },
                            "<0.2" // Slight overlap with previous text check
                        );
                    }

                    // --- STEP 5: TECH STACKS ---
                    tl.fromTo(".desktop-techstacks-row",
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        ">0.1"
                    );

                    // --- STEP 6: MUSIC PLAYER ---
                    // Group ThemeToggle with Music
                    tl.fromTo(".desktop-theme-row",
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                        ">0.1"
                    );
                    tl.fromTo(".desktop-music-row",
                        { opacity: 0, y: 25, scale: 0.98 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
                        "<0.1"
                    );

                    // --- STEP 7: CONTACTS ---
                    tl.fromTo(".desktop-contacts-row",
                        { opacity: 0, y: 25 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                        ">0.1"
                    );

                    // --- STEP 8: STATS GITHUB ---
                    tl.fromTo(".desktop-github-row",
                        { opacity: 0, y: 30, scale: 0.95 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                        ">0.1"
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

        // Force strict explicit order for mobile cards based on their DOM order
        // We will create a timeline for the visible ones to ensure text reveals are respected steps

        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Check which are visible
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

            // Animate Visible Cards Sequentially
            // Start delay
            tl.to({}, { duration: 1.2 }); // Initial wait

            visibleCards.forEach(card => {
                // Card Reveal
                tl.fromTo(card,
                    { scale: 0.95, opacity: 0, y: 30 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                    ">"
                );

                // Text Reveal Steps (if any inside this card)
                const innerElements = card.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                if (innerElements.length > 0) {
                    tl.fromTo(innerElements,
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
                        ">" // Strict wait: Card finishes -> Text Anims Start -> Text Anims Finish -> Next Card
                    );
                }
            });

            // Hidden cards use ScrollTrigger as they are scrolled into view
            hiddenCards.forEach(card => {
                gsap.fromTo(card,
                    { scale: 0.95, opacity: 0, y: 30 },
                    {
                        scale: 1, opacity: 1, y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                            once: true
                        },
                        onComplete: () => {
                            // Independent text animation for scroll-triggered items
                            const innerElements = card.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                            if (innerElements.length) {
                                gsap.fromTo(innerElements,
                                    { y: 20, opacity: 0 },
                                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
                                );
                            }
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [revealReady, isMobile]);
};
