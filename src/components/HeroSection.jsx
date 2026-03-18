import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import DisplayName from './DisplayName';
import landingDataDefault from '../data/landingData.json';

import useThemeStore from '../store/useThemeStore';

const STORAGE_KEY = 'landingData';

const getLandingData = () => {
    if (typeof window === 'undefined') return landingDataDefault;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return landingDataDefault;
    
    try {
        const parsed = JSON.parse(stored);
        // Merge defaults with stored data to ensure new properties are picked up
        return {
            ...landingDataDefault,
            ...parsed,
            hero: { 
                ...landingDataDefault.hero, 
                ...parsed.hero,
                buttons: landingDataDefault.hero.buttons.map((btn, i) => ({
                    ...btn,
                    ...(parsed.hero && parsed.hero.buttons && parsed.hero.buttons[i] ? parsed.hero.buttons[i] : {})
                }))
            },
            metrics: landingDataDefault.metrics.map((m, i) => ({
                ...m,
                ...(parsed.metrics && parsed.metrics[i] ? parsed.metrics[i] : {})
            }))
        };
    } catch (e) {
        return landingDataDefault;
    }
};

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
    const heroRef = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';
    const [landingData, setLandingData] = useState(() => getLandingData());

    useEffect(() => {
        const handleStorage = () => {
            setLandingData(getLandingData());
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(() => setLandingData(getLandingData()), 1000);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    useGSAP(() => {
        gsap.to(heroRef.current, {
            yPercent: 30, // Moves down 30% while normal scroll moves up 100%, creating parallax
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }, { scope: heroRef });

    return (
        <section className="hero" ref={heroRef}>
            <div className="marquee-wrap">
                <div className="marquee-track">
                    {landingData.hero.marquee.map((word, i) => (
                        <React.Fragment key={i}>
                            <span>{word}</span><span>·</span>
                        </React.Fragment>
                    ))}
                    {landingData.hero.marquee.map((word, i) => (
                        <React.Fragment key={`dup-${i}`}>
                            <span>{word}</span><span>·</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="hero-left">
                <div className="v-label">{landingData.hero.kicker}</div>

                <DisplayName showKicker kickerText={landingData.hero.displayKicker} />

                <p className={`ui-body-copy text-sm md:text-base tracking-[0.02em] max-w-lg mt-8 mb-12 ${isLight ? 'opacity-70' : 'opacity-80'}`}>
                    {landingData.hero.bio}
                </p>

                <div className="hero-cta">
                    {landingData.hero.buttons.map((btn, i) => (
                        btn.variant === 'primary' ? (
                            <Link key={i} to={btn.link} className="btn-primary">{btn.label}</Link>
                        ) : (
                            <Link key={i} to={btn.link} className="btn-ghost inline-block text-center decoration-0">{btn.label}</Link>
                        )
                    ))}
                </div>
            </div>

            <div className="hero-right">
                <div className="tags-grid">
                    {landingData.tags.map((tag, i) => (
                        <div key={i} className={`tag-grid-item ${i === 0 ? 'active' : ''}`}>{tag}</div>
                    ))}
                </div>

                <div className="metrics">
                    {landingData.metrics.map((metric, i) => (
                        <div key={i} className="metric">
                            <div className="metric-val">{metric.value}<sup>{metric.unit}</sup></div>
                            <div className="metric-lbl">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
