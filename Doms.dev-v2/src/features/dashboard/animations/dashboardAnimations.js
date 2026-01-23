import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes the dashboard-wide animation system.
 * Detects all elements with .animate-card and sets up staggered reveal.
 */
export const initDashboardAnimations = () => {
    // 1. Find all cards to animate
    const cards = gsap.utils.toArray('.animate-card');

    cards.forEach((card, index) => {
        // 2. Setup a timeline for the card and its children
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 95%", // reveal as it enters bottom of screen
                toggleActions: "play none none none",
                once: true,
            }
        });

        // 3. Animate the card container (Glide-in)
        tl.from(card, {
            y: 50,
            opacity: 0,
            scale: 0.98,
            duration: 1.2,
            ease: "power4.out",
            delay: index % 3 * 0.1, // Small rhythmic stagger for visible grid rows
        });

        // 4. Animate inner items if they exist (.animate-item)
        const items = card.querySelectorAll('.animate-item');
        if (items.length > 0) {
            tl.from(items, {
                y: 20,
                opacity: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.8"); // start midway through card animation for "luxury" feel
        }
    });
};
