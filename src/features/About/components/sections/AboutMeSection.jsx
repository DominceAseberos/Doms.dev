import React from 'react';
import educationHatSvg from '../../../../assets/education-hat copy.svg';
import workflowIconSvg from '../../../../assets/workflow-icon.svg';
import aboutMeSvg from '../../../../assets/about-me.svg';
import useThemeStore from '../../../../store/useThemeStore';

const highlightsList = ['Computer', 'Science', 'Artificial', 'Intelligence', 'front-end', 'full-stack', 'AI', 'integration', 'Large', 'Language', 'Models', '(LLMs)'];

export default function AboutMeSection({ about }) {
    const theme = useThemeStore((state) => state.theme);
    const [isEduHovered, setIsEduHovered] = React.useState(false);
    const [isAboutHovered, setIsAboutHovered] = React.useState(false);
    const [isWorkflowHovered, setIsWorkflowHovered] = React.useState(false);

    const fullBio = about.intro || "I am Domince. A Computer Science student specializing in Artificial Intelligence, crafting intelligent web applications and AI systems.";

    const renderFormattedBio = (text, highlights) => {
        if (!text) return null;
        const words = text.split(/(\s+)/);
        return (
            <p 
                style={{ 
                    margin: 0, 
                    textAlign: 'center', 
                    fontSize: 'clamp(1.2rem, 2.2vw, 1.85rem)', 
                    fontWeight: 500, 
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em'
                }}
            >
                {words.map((word, i) => {
                    const cleanWord = word.replace(/[.,!?]/g, '');
                    const isHighlight = highlights.some(h => cleanWord === h || word === h);
                    if (isHighlight) {
                        return <span key={i} style={{ color: 'var(--accent)', fontWeight: 700 }}>{word}</span>;
                    }
                    return <span key={i}>{word}</span>;
                })}
            </p>
        );
    };

    return (
        <section className="ns-section" id="about-intro" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning style={{ marginBottom: '1.5rem' }}>About</p>
                
                {/* Unified Modern Bio Container */}
                <div 
                    className="ns-reveal" 
                    style={{ 
                        width: '100%',
                        padding: 'clamp(2rem, 5vw, 3.5rem)',
                        borderRadius: '24px',
                        background: 'var(--ns-card-bg)',
                        border: '1px solid var(--ns-card-border)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
                        marginBottom: 'clamp(3rem, 6vw, 4.5rem)'
                    }}
                >
                    {renderFormattedBio(fullBio, highlightsList)}
                </div>

                {/* 3 Interactive Action Buttons */}
                <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(0.8rem, 2.5vw, 2rem)' }}>
                    {/* Button 1: About Me */}
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
                                width: 'clamp(30px, 5vw, 45px)',
                                filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                opacity: 0.95,
                                zIndex: 10,
                                pointerEvents: 'none',
                                transform: `translateX(-50%) translateY(${isAboutHovered ? '-10px' : '0px'}) rotate(-5deg)`,
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        />
                        <a href="/about#about" className="btn-ghost ns-btn ns-nav-btn" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            position: 'relative',
                            zIndex: 1,
                            padding: '0.8rem 1.6rem',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>
                            About Me
                        </a>
                    </div>

                    {/* Button 2: My Workflow */}
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
                                width: 'clamp(36px, 6vw, 55px)',
                                filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                opacity: 0.95,
                                zIndex: 10,
                                pointerEvents: 'none',
                                transform: `translateX(-50%) translateY(${isWorkflowHovered ? '-10px' : '0px'}) rotate(3deg)`,
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        />
                        <a href="/about#workflow" className="btn-ghost ns-btn ns-nav-btn" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            position: 'relative',
                            zIndex: 1,
                            padding: '0.8rem 1.6rem',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>
                            My Workflow
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>

                    {/* Button 3: Education */}
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
                                width: 'clamp(42px, 7vw, 65px)',
                                filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)',
                                opacity: 0.95,
                                zIndex: 10,
                                pointerEvents: 'none',
                                transform: `translateX(-50%) translateY(${isEduHovered ? '-10px' : '0px'}) rotate(5deg)`,
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                        />
                        <a href="/about#education" className="btn-ghost ns-btn ns-nav-btn" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            position: 'relative',
                            zIndex: 1,
                            padding: '0.8rem 1.6rem',
                            borderRadius: '12px',
                            fontWeight: 600
                        }}>
                            Education
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
