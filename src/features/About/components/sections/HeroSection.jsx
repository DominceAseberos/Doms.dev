import React, { forwardRef } from 'react';
import AnimatedHandwritingText from '../../../../components/AnimatedHandwritingText';
import ProfileMorphCard from '../../../../components/ProfileMorphCard';
import humanPortrait from '../../../../assets/human-cutout.png';
import animePortrait from '../../../../assets/anime-cutout.png';
import useThemeStore from '../../../../store/useThemeStore';
import githubSvg from '../../../../assets/github.svg';
import linkedinSvg from '../../../../assets/linkedin.svg';
import emailSvg from '../../../../assets/email.svg';

const HeroSection = forwardRef(({ hero, resumeUrl, totalProjectsCount, nameTimeline, onOpenResume }, ref) => {
    const theme = useThemeStore((state) => state.theme);
    return (
        <section ref={ref} className="ns-hero-section" id="hero">
            <div className="ns-hero-inner">
                <div className="ns-hero-text lit-content-block lit-transparent" suppressHydrationWarning>
                    {hero.role && (
                        <div className="ns-reveal" suppressHydrationWarning>
                            <p className="ns-hero-location">{hero.role}</p>
                        </div>
                    )}
                    <h1 className="ns-hero-name" suppressHydrationWarning>
                        {(() => {
                            const nameParts = (hero.fullName || 'Domince Aseberos').split(' ');
                            const first = nameParts[0];
                            const last = nameParts.slice(1).join(' ');

                            const DOMINCE_DUR = 3.0;
                            const ASEBEROS_DUR = 3.0;

                            // Overlap slightly to remove the "pause" feeling caused by the easing curve
                            const OVERLAP = 2;

                            return (
                                <>
                                    <AnimatedHandwritingText
                                        text={first}
                                        className="name-first"
                                        fontUrl="/fonts/PermanentMarker.ttf"
                                        strokeWidth={3}
                                        strokeColor="currentColor"
                                        duration={DOMINCE_DUR}
                                        fillColor="transparent"
                                        sharedTimeline={nameTimeline}
                                        timelinePosition={0}
                                    />
                                    {last && (
                                        <AnimatedHandwritingText
                                            text={last}
                                            className="name-last"
                                            fontUrl="/fonts/PermanentMarker.ttf"
                                            strokeWidth={3}
                                            strokeColor="currentColor"
                                            duration={ASEBEROS_DUR}
                                            fillColor="transparent"
                                            sharedTimeline={nameTimeline}
                                            timelinePosition={DOMINCE_DUR - OVERLAP}
                                        />
                                    )}
                                </>
                            );
                        })()}
                    </h1>

                    <div className="ns-hero-actions ns-reveal">
                        {resumeUrl && (
                            <button
                                onClick={(e) => { e.preventDefault(); onOpenResume(); }}
                                className="btn-primary ns-btn"
                            >
                                View CV
                            </button>
                        )}
                        <a href="/projects" className="btn-ghost ns-btn">
                            Projects
                        </a>

                        <div className="hero-socials ns-reveal" style={{ display: 'flex', gap: '1rem', marginLeft: '0.5rem', alignItems: 'center' }}>
                            {[
                                { src: githubSvg, alt: 'GitHub', href: hero.githubUrl || 'https://github.com/DominceAseberos' },
                                { src: linkedinSvg, alt: 'LinkedIn', href: hero.linkedinUrl || 'https://www.linkedin.com/in/dominceaseberos/' },
                                { src: emailSvg, alt: 'Email', href: 'mailto:daseberos@gmail.com' },
                            ].map((social, i) => (
                                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img 
                                        src={typeof social.src === 'object' ? social.src.src : social.src} 
                                        alt={social.alt} 
                                        style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            filter: theme === 'dark' ? 'invert(1)' : 'invert(0)',
                                            transition: 'transform 0.2s ease, filter 0.2s ease',
                                            cursor: 'pointer'
                                        }} 
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {(hero.metrics || []).length > 0 && (
                        <div className="ns-metrics ns-reveal">
                            {hero.location && (
                                <React.Fragment>
                                    <div className="ns-metric" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '0' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                            <img 
                                                src="https://flagcdn.com/ph.svg" 
                                                alt="Philippines Flag" 
                                                style={{ opacity: 1, zIndex: 0, width: '54px', borderRadius: '4px' }} 
                                            />
                                            <span className="ns-metric-val" style={{ opacity: 0, pointerEvents: 'none', margin: 0, userSelect: 'none', width: '0px' }}>&nbsp;</span>
                                        </div>
                                        <span className="ns-metric-lbl" style={{ marginTop: '0.25rem' }}>{hero.location}</span>
                                    </div>
                                    <div className="ns-metric-div" />
                                </React.Fragment>
                            )}
                            {hero.metrics.map((m, i) => {
                                let displayValue = m.value;
                                if (m.label && m.label.toLowerCase() === 'projects shipped') {
                                    displayValue = totalProjectsCount;
                                }
                                
                                const getMetricIcon = (label) => {
                                    const l = label.toLowerCase();
                                    if (l.includes('project')) {
                                        return (
                                            <svg style={{ opacity: 0.9, flexShrink: 0 }} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--ns-metric-val)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        );
                                    }
                                    if (l.includes('year') || l.includes('code')) {
                                        return (
                                            <svg style={{ opacity: 0.9, flexShrink: 0 }} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--ns-metric-val)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="16 18 22 12 16 6"></polyline>
                                                <polyline points="8 6 2 12 8 18"></polyline>
                                            </svg>
                                        );
                                    }
                                    return null;
                                };

                                return (
                                    <React.Fragment key={i}>
                                        {i > 0 && <div className="ns-metric-div" />}
                                        <div className="ns-metric" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '0' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                                {getMetricIcon(m.label)}
                                                <span className="ns-metric-val" style={{ margin: 0 }}>{displayValue}<sup>{m.unit}</sup></span>
                                            </div>
                                            <span className="ns-metric-lbl" style={{ marginTop: '0.25rem' }}>{m.label}</span>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="ns-hero-card ns-reveal lit-content-block">
                    <ProfileMorphCard realSrc={humanPortrait} animeSrc={animePortrait} alt="Domince portrait" />
                </div>
            </div>
        </section>
    );
});

export default HeroSection;
