import React from 'react';
import { GithubIcon, LinkedInIcon } from '../../utils/techIcons';
import ContactSquiggles from '../ui/ContactSquiggles';
import landingData from '../../../../data/landingData.json';

export default function ContactSection({ contact = {}, socials = [], projects = [], theme }) {
    return (
        <>
        <section className="ns-contact-section" id="contact" style={{ position: 'relative', overflowX: 'clip', paddingBottom: '3rem' }}>
            <ContactSquiggles />
            <div className="ns-contact-header lit-content-block lit-transparent" style={{ position: 'relative', zIndex: 1 }}>
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Contact</p>
                <h2 className="ns-section-heading ns-reveal">{contact.heading || "Open to Opportunities"}</h2>
                {contact.subtext && (
                    <p className="ui-body-copy ns-contact-sub ns-reveal" suppressHydrationWarning>{contact.subtext}</p>
                )}
                <div className="ns-contact-cta-wrapper ns-reveal" style={{ position: 'relative', display: 'inline-block', marginTop: '10rem' }}>
                    <img
                        src="/assets/GIF/tobe-sleep.gif"
                        alt="toby sleeping"
                        className="ns-cat-sleep-vid"
                        style={{ opacity: theme === 'dark' ? 1 : 0 }}
                    />
                    <img
                        src="/assets/GIF/tobe-peek.gif"
                        alt="cat peeking"
                        className="ns-cat-peek"
                        style={{ opacity: theme === 'light' ? 1 : 0 }}
                    />
                    <a href="/contact" className="btn-primary ns-contact-cta" style={{ margin: 0, position: 'relative', zIndex: 2 }}>
                        Start a Conversation
                    </a>
                </div>
            </div>
        </section>

            <footer style={{
                width: '100vw',
                marginLeft: 'calc(50% - 50vw)',
                padding: '2rem 1rem 1rem',
                zIndex: 2,
                borderTop: '1px solid var(--ns-section-border)',
                background: 'transparent'
            }} suppressHydrationWarning>

                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'clamp(1.5rem, 4vw, 2.5rem)', textAlign: 'left' }}>
                    
                    {/* NAVIGATION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '120px' }}>
                        <h4 style={{ margin: 0, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--white)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Navigation</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <a href="/" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Home</a>
                            <a href="#about" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>About</a>
                            <a href="#contact" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Contact</a>
                            <a href="#projects" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Projects</a>
                        </div>
                    </div>

                    {/* SECTIONS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '120px' }}>
                        <h4 style={{ margin: 0, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--white)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Sections</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <a href="#about" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>About Me</a>
                            <a href="#workflow" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Workflow</a>
                            <a href="#education" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Education</a>
                            <a href="#certifications" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>Certifications</a>
                        </div>
                    </div>

                    {/* PROJECT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '120px' }}>
                        <h4 style={{ margin: 0, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--white)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Project</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {projects && projects.slice(0, 3).map((p, idx) => (
                                <a key={idx} href={`/projects/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>{p.title}</a>
                            ))}
                            <a href="/projects" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>See More ↗</a>
                        </div>
                    </div>

                    {/* DEV LOG */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '120px' }}>
                        <h4 style={{ margin: 0, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: 'var(--white)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Dev Log</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>AI Integration</a>
                            <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>UI Architecture</a>
                            <a href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.6}>See More ↗</a>
                        </div>
                    </div>

                    {/* SOCIAL LINKS (Chunked to max 4 per column) */}
                    {socials && socials.length > 0 && (
                        Array.from({ length: Math.ceil(socials.length / 4) }).map((_, colIndex) => (
                            <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '120px' }}>
                                <h4 style={{ margin: 0, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', color: colIndex === 0 ? 'var(--white)' : 'transparent', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9, pointerEvents: 'none' }}>
                                    Social Links
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {socials.slice(colIndex * 4, colIndex * 4 + 4).map((social, idx) => (
                                        <a 
                                            key={idx} 
                                            href={social.href} 
                                            target={social.external ? '_blank' : '_self'} 
                                            rel="noreferrer" 
                                            style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s', opacity: 0.6 }} 
                                            onMouseEnter={e => e.currentTarget.style.opacity=1} 
                                            onMouseLeave={e => e.currentTarget.style.opacity=0.6}
                                        >
                                            {social.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </footer>
        </>
    );
}
