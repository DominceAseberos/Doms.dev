import { useEffect, useRef } from 'react';

/**
 * useAudioReactive
 * A performant hook that applies audio-reactive styles to a DOM element.
 * It leverages CSS variables updated by the Visualizer to avoid React re-renders.
 * 
 * @param {string} category - The audio band to react to (foundation, creativity, melody, etc.)
 * @param {object} options - Scaling and glow intensity factors
 */
export const useAudioReactive = (category = 'presence', { scale = 0.1, glow = 8, externalRef = null } = {}) => {
    const internalRef = useRef(null);
    const ref = externalRef || internalRef;

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;
        const varName = `--music-${category}`;

        // Apply CSS-based reactivity. 
        // The values of --music-* variables are updated on :root by useVisualizer.js
        el.style.setProperty('--audio-intensity', `var(${varName}, 0)`);

        // We use inline styles that reference the intensity variable
        // This ensures the browser handles the "animation" without triggering React updates
        el.style.transform = `scale(calc(1 + var(--audio-intensity) * ${scale}))`;
        el.style.filter = `drop-shadow(0 0 calc(var(--audio-intensity) * ${glow}px) rgb(var(--contrast-rgb) / 0.6))`;

        // Add a very subtle transition for smoothness if needed, 
        // though the visualizer data is already somewhat smoothed.
        el.style.transition = 'transform 0.05s ease-out, filter 0.1s ease-out';
    }, [category, scale, glow]);

    return ref;
};
