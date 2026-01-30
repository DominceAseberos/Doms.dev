import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const useButtonMotion = () => {
    const ref = useRef(null);
    const { contextSafe } = useGSAP({ scope: ref });

    const onEnter = contextSafe(() => {
        gsap.to(ref.current, {
            scale: 1.1,
            rotation: -1.5,
            duration: 0.3,
            ease: "back.out(1.7)",
            overwrite: 'auto'
        });
    });

    const onLeave = contextSafe(() => {
        gsap.to(ref.current, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: 'auto'
        });
    });

    const onTap = contextSafe(() => {
        gsap.to(ref.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
            overwrite: 'auto'
        });
    });

    return { ref, onEnter, onLeave, onTap };
};
