const fs = require('fs');

let svg1 = fs.readFileSync('c:/Projects/Portfolio/Doms.dev/src/assets/contact-curved-top-right-to-botton.svg', 'utf8');
let svg2 = fs.readFileSync('c:/Projects/Portfolio/Doms.dev/src/assets/contact-curved-bottom-left-to-botton.svg', 'utf8');

// clean
svg1 = svg1.replace(/<\?xml.*?\?>/g, '').replace(/xmlns=".*?"/g, '');
svg2 = svg2.replace(/<\?xml.*?\?>/g, '').replace(/xmlns=".*?"/g, '');

// update SVGs for React
svg1 = svg1.replace('<svg ', '<svg className="ns-squiggle ns-squiggle-1" ref={svg1Ref} style={{ position: "absolute", top: "-15%", right: "-5%", width: "65%", height: "auto", zIndex: 0, opacity: 0, pointerEvents: "none" }} ').replace(/fill="black"/g, 'fill="var(--ns-text)"');
svg2 = svg2.replace('<svg ', '<svg className="ns-squiggle ns-squiggle-2" ref={svg2Ref} style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "65%", height: "auto", zIndex: 0, opacity: 0, pointerEvents: "none" }} ').replace(/fill="black"/g, 'fill="var(--ns-text)"');

const jsx = `import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSquiggles() {
    const containerRef = useRef(null);
    const svg1Ref = useRef(null);
    const svg2Ref = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const path1 = svg1Ref.current?.querySelector('path');
        const path2 = svg2Ref.current?.querySelector('path');
        
        if (!path1 || !path2) return;

        const l1 = path1.getTotalLength() || 10000;
        const l2 = path2.getTotalLength() || 10000;

        gsap.set([svg1Ref.current, svg2Ref.current], { opacity: 1 });
        
        gsap.set(path1, {
            strokeDasharray: l1,
            strokeDashoffset: l1,
            fill: 'transparent',
            stroke: 'var(--ns-text)',
            strokeWidth: 2
        });
        
        gsap.set(path2, {
            strokeDasharray: l2,
            strokeDashoffset: l2,
            fill: 'transparent',
            stroke: 'var(--ns-text)',
            strokeWidth: 2
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 60%',
                once: true
            }
        });

        tl.to(path1, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut'
        })
        .to(path1, {
            fill: 'var(--ns-text)',
            duration: 0.5,
            ease: 'power2.inOut'
        }, '-=0.5');

        tl.to(path2, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut'
        }, '-=0.2')
        .to(path2, {
            fill: 'var(--ns-text)',
            duration: 0.5,
            ease: 'power2.inOut'
        }, '-=0.5');

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
            ${svg1}
            ${svg2}
        </div>
    );
}
`;

fs.writeFileSync('c:/Projects/Portfolio/Doms.dev/src/features/About/components/ui/ContactSquiggles.jsx', jsx);
console.log('Squiggles component generated successfully.');
