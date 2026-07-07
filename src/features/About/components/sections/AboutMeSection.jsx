import React from 'react';
import AINodes from '../ui/AINodes';
import AIWebIntegration from '../ui/AIWebIntegration';
import ScrollTypewriter from '../ui/ScrollTypewriter';
import educationHatSvg from '../../../../assets/education-hat copy.svg';
import workflowIconSvg from '../../../../assets/workflow-icon.svg';
import aboutMeSvg from '../../../../assets/about-me.svg';
import useThemeStore from '../../../../store/useThemeStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const highlightsList = ['Computer', 'Science', 'Artificial', 'Intelligence', 'front-end', 'full-stack', 'AI', 'integration', 'Large', 'Language', 'Models', '(LLMs)'];

export default function AboutMeSection({ about }) {
    const theme = useThemeStore((state) => state.theme);
    const [isEduHovered, setIsEduHovered] = React.useState(false);
    const [isAboutHovered, setIsAboutHovered] = React.useState(false);
    const [isWorkflowHovered, setIsWorkflowHovered] = React.useState(false);
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
                    <div className="ns-about-main">

                        {/* FIRST PART - Scroll Scrubbed Typewriter */}
                        {firstPart.length > 0 && (
                            <ScrollTypewriter
                                text={firstPart}
                                highlights={highlightsList}
                                className="ns-lyrics-text"
                                style={{ margin: 0, textAlign: 'center' }}
                                scrollStart="top 90%"
                                scrollEnd="center 10%"
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
                                style={{ margin: 0, textAlign: 'center' }}
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
                                style={{ margin: 0, textAlign: 'center' }}
                                scrollStart="top 85%"
                                scrollEnd="center 50%"
                            />
                        )}

                        {/* NAVIGATION BUTTONS */}
                        <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(0.4rem, 2vw, 1rem)', marginTop: 'clamp(4rem, 10vw, 8rem)', marginBottom: 'clamp(0.5rem, 3vw, 1.5rem)' }}>
                            <div
                                style={{ position: 'relative', display: 'inline-block' }}
                                onMouseEnter={() => setIsAboutHovered(true)}
                                onMouseLeave={() => setIsAboutHovered(false)}
                            >
                                <img
                                    src={typeof aboutMeSvg === 'object' ? aboutMeSvg.src : aboutMeSvg}
                                    alt="About Me"
                                    style={{
                                        position: 'absolute',
                                        bottom: '110%',
                                        left: '50%',
                                        width: 'clamp(28px, 6vw, 45px)',
                                        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                        opacity: 0.95,
                                        zIndex: 10,
                                        pointerEvents: 'none',
                                        transform: `translateX(-50%) translateY(${isAboutHovered ? '-12px' : '0px'}) rotate(-5deg)`,
                                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                />
                                <a href="/about#about" className="btn-ghost ns-btn ns-nav-btn" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    About Me
                                </a>
                            </div>

                            <div
                                style={{ position: 'relative', display: 'inline-block' }}
                                onMouseEnter={() => setIsWorkflowHovered(true)}
                                onMouseLeave={() => setIsWorkflowHovered(false)}
                            >
                                <img
                                    src={typeof workflowIconSvg === 'object' ? workflowIconSvg.src : workflowIconSvg}
                                    alt="My Workflow"
                                    style={{
                                        position: 'absolute',
                                        bottom: '110%',
                                        left: '50%',
                                        width: 'clamp(35px, 8vw, 55px)',
                                        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                        opacity: 0.95,
                                        zIndex: 10,
                                        pointerEvents: 'none',
                                        transform: `translateX(-50%) translateY(${isWorkflowHovered ? '-12px' : '0px'}) rotate(3deg)`,
                                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                />
                                <a href="/about#workflow" className="btn-ghost ns-btn ns-nav-btn" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    My Workflow
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                            </div>
                            <div
                                style={{ position: 'relative', display: 'inline-block' }}
                                onMouseEnter={() => setIsEduHovered(true)}
                                onMouseLeave={() => setIsEduHovered(false)}
                            >
                                <img
                                    src={typeof educationHatSvg === 'object' ? educationHatSvg.src : educationHatSvg}
                                    alt="Education Hat"
                                    style={{
                                        position: 'absolute',
                                        bottom: '110%',
                                        left: '50%',
                                        width: 'clamp(42px, 10vw, 70px)',
                                        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                        opacity: 0.95,
                                        zIndex: 10,
                                        pointerEvents: 'none',
                                        transform: `translateX(-50%) translateY(${isEduHovered ? '-12px' : '0px'}) rotate(5deg)`,
                                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                />
                                <a href="/about#education" className="btn-ghost ns-btn ns-nav-btn" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    Education
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
