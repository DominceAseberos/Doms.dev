import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const useImageMotion = () => {
    const ref = useRef(null);
    const { contextSafe } = useGSAP({ scope: ref });

    const onEnter = contextSafe(() => {
        gsap.to(ref.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
            overwrite: 'auto'
        });
    });

    const onLeave = contextSafe(() => {
        gsap.to(ref.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: 'auto'
        });
    });

    return { ref, onEnter, onLeave };
};
