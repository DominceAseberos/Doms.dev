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
        
        // Safely merge marquee from stored data
        const marquee = (parsed.hero && parsed.hero.marquee && parsed.hero.marquee.length > 0) 
            ? parsed.hero.marquee 
            : landingDataDefault.hero.marquee;
            
        // Safely merge tags from stored data
        const tags = (parsed.tags && parsed.tags.length > 0)
            ? parsed.tags
            : landingDataDefault.tags;
            
        // Safely merge metrics from stored data
        const metrics = (parsed.metrics && parsed.metrics.length > 0)
            ? parsed.metrics
            : landingDataDefault.metrics;
            
        // Safely merge buttons
        const buttons = (parsed.hero && parsed.hero.buttons && parsed.hero.buttons.length > 0)
            ? parsed.hero.buttons
            : landingDataDefault.hero.buttons;
            
        // Safely merge kicker and bio
        const kicker = (parsed.hero && parsed.hero.kicker) || landingDataDefault.hero.kicker;
        const bio = (parsed.hero && parsed.hero.bio) || landingDataDefault.hero.bio;
        const displayKicker = (parsed.hero && parsed.hero.displayKicker) || landingDataDefault.hero.displayKicker;
        
        return {
            hero: {
                marquee,
                kicker,
                displayKicker,
                bio,
                buttons
            },
            tags,
            metrics
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
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const checkData = () => {
            const newData = getLandingData();
            setLandingData(newData);
        };
        
        // Check immediately
        checkData();
        
        // Check every 500ms for changes
        const interval = setInterval(checkData, 500);
        
        // Listen for storage events (from other tabs)
        window.addEventListener('storage', checkData);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkData);
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
