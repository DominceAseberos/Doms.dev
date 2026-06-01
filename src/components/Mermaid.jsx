import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const Mermaid = ({ chart, isLight }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.initialize({
                startOnLoad: false,
                theme: isLight ? 'default' : 'dark',
                securityLevel: 'loose',
            });
            
            const renderChart = async () => {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (e) {
                    console.error("Mermaid parsing failed", e);
                }
            };
            renderChart();
        }
    }, [chart, isLight]);

    return <div ref={ref} className="mermaid flex justify-center my-8 overflow-x-auto w-full" />;
};

export default Mermaid;
