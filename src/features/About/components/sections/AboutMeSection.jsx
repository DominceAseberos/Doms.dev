import React from 'react';
import AINodes from '../ui/AINodes';
import AIWebIntegration from '../ui/AIWebIntegration';
import ScrollTypewriter from '../ui/ScrollTypewriter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const highlightsList = ['Computer', 'Science', 'Artificial', 'Intelligence', 'front-end', 'full-stack', 'AI', 'integration', 'Large', 'Language', 'Models', '(LLMs)'];

export default function AboutMeSection({ about, socials }) {
    const sentences = about.intro ? (about.intro.match(/[^.!?]+[.!?]+/g) || [about.intro]) : [];
    
    // Split: First 2 sentences, then middle sentence, then the rest
    const firstPart = sentences.slice(0, 2).map(s => s.trim()).join(' ');
    const secondPart = sentences.slice(2, 3).map(s => s.trim()).join(' ');
    const thirdPart = sentences.slice(3).map(s => s.trim()).join(' ');

    return (
        <section className="ns-section" id="about">
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0', paddingBottom: '10vh' }}>
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>About</p>
                <div className="ns-about-grid">
                    <div className="ns-about-main lit-content-block lit-transparent">
                        
                        {/* FIRST PART - Scroll Scrubbed Typewriter */}
                        {firstPart.length > 0 && (
                            <ScrollTypewriter 
                                text={firstPart} 
                                highlights={highlightsList} 
                                className="ns-lyrics-text"
                                style={{ margin: 0 }} 
                                scrollStart="top 85%"
                                scrollEnd="center 45%"
                            />
                        )}

                        {/* AI NETWORK VISUALIZATION */}
                        <AINodes />

                        {/* SECOND PART - Scroll Scrubbed Typewriter */}
                        {secondPart.length > 0 && (
                            <ScrollTypewriter 
                                text={secondPart} 
                                highlights={highlightsList} 
                                className="ns-lyrics-text"
                                style={{ margin: 0 }} 
                                scrollStart="top 85%"
                                scrollEnd="center 50%"
                            />
                        )}

                        {/* AI WEB INTEGRATION */}
                        <AIWebIntegration />

                        {/* THIRD PART - Scroll Scrubbed Typewriter */}
                        {thirdPart.length > 0 && (
                            <ScrollTypewriter 
                                text={thirdPart} 
                                highlights={highlightsList} 
                                className="ns-lyrics-text"
                                style={{ margin: 0 }} 
                                scrollStart="top 85%"
                                scrollEnd="center 50%"
                            />
                        )}

                        {/* WORKFLOW BUTTON */}
                        <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
                            <a href="/about#workflow" className="ui-button primary" style={{ 
                                padding: '16px 32px', 
                                fontSize: '1.1rem',
                                borderRadius: '30px',
                                background: 'transparent',
                                border: '2px solid var(--accent)',
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(195, 255, 54, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            >
                                View My Workflow
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
