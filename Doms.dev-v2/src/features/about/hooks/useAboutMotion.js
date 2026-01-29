import { useRef } from 'react';

export const useButtonMotion = () => {
    const ref = useRef(null);

    const onEnter = () => {
        if (!ref.current) return;
        ref.current.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        ref.current.style.transform = "scale(1.1) rotate(-4deg)";
    };

    const onLeave = () => {
        if (!ref.current) return;
        ref.current.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
        ref.current.style.transform = "scale(1) rotate(0deg)";
    };

    const onTap = () => {
        if (!ref.current) return;
        const currentTransform = ref.current.style.transform;
        ref.current.style.transition = "all 0.1s ease-out";
        ref.current.style.transform = `${currentTransform} scale(0.95)`;
        setTimeout(() => {
            if (ref.current) {
                ref.current.style.transition = "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
                ref.current.style.transform = currentTransform;
            }
        }, 120);
    };

    return { ref, onEnter, onLeave, onTap };
};
