import { useRef } from 'react';
import { gsap } from 'gsap';

export const useButtonMotion = () => {
    const ref = useRef(null);

    const onEnter = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 1.1,
            rotation: -4,
            duration: 0.2,
            ease: "power3.out"
        });
    };

    const onLeave = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 1,
            rotation: 0,
            duration: 0.25,
            ease: "elastic.out(1, 0.4)"
        });
    };

    const onTap = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 0.95,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
    };

    return { ref, onEnter, onLeave, onTap };
};
