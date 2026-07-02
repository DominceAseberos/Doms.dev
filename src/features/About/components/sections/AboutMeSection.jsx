import React from 'react';
import LyricsScrubText from '../ui/LyricsScrubText';
import SocialInteractionGrid from '../SocialInteractionGrid';
import HrmsPipelineMotionCards from '../HrmsPipelineMotionCards';

export default function AboutMeSection({ about, socials }) {
    return (
        <section className="ns-section" id="about">
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10vh' }}>
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>About</p>
                <div className="ns-about-grid">
                    <div className="ns-about-main lit-content-block lit-transparent">
                        {about.intro && (
                            <LyricsScrubText
                                text={about.intro}
                                highlights={['Computer', 'Science', 'full-stack', 'engineering', 'mobile', 'apps', 'motion-heavy', 'interfaces', 'AI/ML', 'software']}
                            />
                        )}
                    </div>

                    {/* Socials Column */}
                    {(socials || []).length > 0 && (
                        <aside className="ns-about-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <div className="ns-reveal lit-content-block lit-transparent">
                                <p className="ui-sub-label" style={{ marginBottom: '1.25rem', letterSpacing: '0.22em' }}>Connect</p>
                                <SocialInteractionGrid socials={socials} />
                            </div>
                        </aside>
                    )}
                </div>
            </div>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10vh' }}>
                <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <p className="ui-sub-label ns-section-label" suppressHydrationWarning>Process</p>
                        <LyricsScrubText
                            text="I don't just write code. I design systems. Here is my step-by-step pipeline for turning complex problems into working software."
                            highlights={['design', 'systems', 'step-by-step', 'pipeline', 'complex', 'problems', 'working', 'software']}
                            style={{ marginTop: '0.5rem', maxWidth: '500px' }}
                        />
                    </div>

                    <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', height: '60px', padding: '0 10px' }}>
                        <div style={{ position: 'absolute', left: '20px', right: '20px', top: '24px', height: '2px', background: 'var(--border-color, rgba(160, 168, 208, 0.2))', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', left: '20px', right: '20px', top: '24px', height: '2px', overflow: 'hidden', zIndex: 1 }}>
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #3B82F6, #7C3AED, transparent)', animation: 'flowingLine 2.5s infinite linear' }}></div>
                        </div>

                        {[
                            { name: 'Plan', color: '#7C3AED', delay: '0.41s' },
                            { name: 'Data', color: '#3B82F6', delay: '0.69s' },
                            { name: 'Logic', color: '#06B6D4', delay: '0.97s' },
                            { name: 'Build', color: '#8B5CF6', delay: '1.25s' }
                        ].map((phase) => (
                            <div key={phase.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                                <div style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    border: '3px solid var(--bg-main, #ffffff)',
                                    '--dot-color': phase.color,
                                    '--dot-glow': `${phase.color}66`,
                                    animation: `pulseDot 2.5s infinite linear ${phase.delay}`
                                }}></div>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{phase.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ns-reveal" style={{ marginTop: '3rem' }}>
                    <HrmsPipelineMotionCards />
                </div>
            </div>
        </section>
    );
}
