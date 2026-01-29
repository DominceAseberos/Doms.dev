import React, { useRef } from 'react';
import { useAudioReactive } from '../features/about/hooks/useAudioReactive';

const FrequencyDot = ({ category, label, color = 'rgb(var(--contrast-rgb))' }) => {
    const dotRef = useAudioReactive(category, { scale: 0.8, glow: 15 });

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                ref={dotRef}
                className="w-3 h-3 rounded-full transition-colors duration-300"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}44`
                }}
            />
            <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold" style={{ color }}>
                {label}
            </span>
        </div>
    );
};

const FrequencyCircles = () => {
    return (
        <div className="flex items-center gap-4 py-2 px-1">
            <FrequencyDot category="foundation" label="Bass" />
            <FrequencyDot category="creativity" label="Mid" />
            <FrequencyDot category="interaction" label="High" />
            <FrequencyDot category="activity" label="Lead" />
            <FrequencyDot category="sparkle" label="Air" />
        </div>
    );
};

export default FrequencyCircles;
