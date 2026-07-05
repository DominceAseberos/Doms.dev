import React from 'react';
import HoverDrawBorder from '../ui/HoverDrawBorder';

const isPlaceholderImage = (src) => typeof src === 'string' && /placehold\.co|placeholder/i.test(src);

const STICKY_STYLES = [
    { bg: '#f1968d', tapeColor: 'rgba(180, 190, 150, 0.7)', tapePos: 'center', rotation: '-2deg' },
    { bg: '#f4c798', tapeColor: 'rgba(160, 120, 120, 0.7)', tapePos: 'center', rotation: '1deg' },
    { bg: '#fbf0d9', tapeColor: 'rgba(200, 180, 160, 0.7)', tapePos: 'left-fold', rotation: '2deg' },
    { bg: '#e9a1c1', tapeColor: 'rgba(150, 190, 200, 0.7)', tapePos: 'corners', rotation: '-1deg' },
];

const extractTechStack = (project) => {
    let tech = [];
    if (project.contentSections) {
        project.contentSections.forEach(sec => {
            sec.columns?.forEach(col => {
                col.blocks?.forEach(blk => {
                    if (blk.type === 'chips') {
                        tech = tech.concat(blk.items);
                    }
                });
            });
        });
    }
    if (tech.length > 0) return [...new Set(tech)];
    
    // Fallbacks for projects without chips defined
    if (project.id === 'project-serveflow') return ["React", "Vite", "TypeScript", "IndexedDB", "Zustand"];
    if (project.id === 'project-catsy') return ["FastAPI", "React", "Flutter", "PostgreSQL"];
    if (project.id === 'project-vayora') return ["React 18", "Framer Motion", "Tailwind CSS"];
    if (project.id === 'project-bananaai') return ["NextJS", "Framer Motion", "Tailwind CSS"];
    
    return [];
};

export default function ProjectsSection({ projects = [] }) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="ns-section" id="projects" style={{ borderTop: 'none', paddingTop: '40px' }}>
            <div className="ns-projects-header ns-reveal">
                <div>
                    <p className="ui-sub-label ns-section-label">Selected Work</p>
                    <h2 className="ns-section-heading">Projects</h2>
                </div>
                <a href="/projects" className="btn-ghost ns-btn" style={{ padding: '10px 24px', fontSize: '0.75rem', minHeight: '40px' }}>View All →</a>
            </div>
            <div className="ns-projects-grid">
                {projects.map((p, index) => {
                    const style = STICKY_STYLES[index % STICKY_STYLES.length];
                    return (
                    <a key={p.id} href={`/projects/${p.id}`} className="ns-project-card ns-reveal lit-content-block" style={{
                        backgroundColor: style.bg,
                        color: '#1a1a1a', // force dark text for pastel backgrounds
                        transform: `rotate(${style.rotation})`,
                        boxShadow: '3px 8px 15px rgba(0,0,0,0.15)',
                        borderRadius: '2px',
                        border: 'none',
                        position: 'relative',
                        overflow: 'visible',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        margin: '1rem' // space for rotations and tapes
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = `rotate(0deg) scale(1.02) translateY(-5px)`;
                        e.currentTarget.style.boxShadow = '5px 12px 20px rgba(0,0,0,0.2)';
                        const modal = e.currentTarget.querySelector('.ns-project-tech-modal');
                        if (modal) modal.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = `rotate(${style.rotation})`;
                        e.currentTarget.style.boxShadow = '3px 8px 15px rgba(0,0,0,0.15)';
                        const modal = e.currentTarget.querySelector('.ns-project-tech-modal');
                        if (modal) modal.style.opacity = '0';
                    }}>
                        {/* Tech Stack Hover Modal */}
                        <div className="ns-project-tech-modal" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(20, 20, 20, 0.95)',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            zIndex: 20,
                            borderRadius: '2px',
                            padding: '2rem',
                            backdropFilter: 'blur(4px)',
                            pointerEvents: 'none' // lets clicks pass through to the anchor
                        }}>
                            <h4 style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '1.25rem', textTransform: 'uppercase', color: '#aaa' }}>Tech Stack</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {extractTechStack(p).map(tech => (
                                    <span key={tech} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.85rem', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{tech}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tape Elements */}
                        {style.tapePos === 'center' && (
                            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: '45px', height: '24px', backgroundColor: style.tapeColor, zIndex: 10 }}></div>
                        )}
                        {style.tapePos === 'left-fold' && (
                            <>
                                <div style={{ position: 'absolute', top: '-10px', left: '10%', transform: 'rotate(-5deg)', width: '45px', height: '24px', backgroundColor: style.tapeColor, zIndex: 10 }}></div>
                                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '0', height: '0', borderBottom: '35px solid var(--bg)', borderLeft: '35px solid rgba(0,0,0,0.15)', zIndex: 10 }}></div>
                                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '0', height: '0', borderTop: '35px solid #dcb38a', borderRight: '35px solid transparent', zIndex: 11 }}></div>
                            </>
                        )}
                        {style.tapePos === 'corners' && (
                            <>
                                <div style={{ position: 'absolute', top: '-10px', left: '-10px', transform: 'rotate(-45deg)', width: '45px', height: '20px', backgroundColor: style.tapeColor, zIndex: 10 }}></div>
                                <div style={{ position: 'absolute', top: '-10px', right: '-10px', transform: 'rotate(45deg)', width: '45px', height: '20px', backgroundColor: style.tapeColor, zIndex: 10 }}></div>
                            </>
                        )}

                        {(p.mainImage || p.desktopImage) && !isPlaceholderImage(p.mainImage || p.desktopImage) ? (
                            <div className="ns-project-img-wrap" style={{ borderRadius: '2px 2px 0 0', overflow: 'hidden' }}>
                                <img src={p.mainImage || p.desktopImage} alt={p.title} className="ns-project-img" loading="lazy" />
                            </div>
                        ) : (
                            <div className="ns-project-img-placeholder" style={{ borderRadius: '2px 2px 0 0' }}>
                                <span style={{ color: '#1a1a1a' }}>{p.projectType || 'Case Study'}</span>
                                <strong style={{ color: '#1a1a1a' }}>{p.title}</strong>
                            </div>
                        )}
                        <div className="ns-project-info">
                            <div className="ns-project-meta">
                                <span className="ui-sub-label ns-project-type" style={{ color: '#555' }}>{p.projectType}</span>
                                <span className="ns-project-arrow" style={{ color: '#1a1a1a' }}>↗</span>
                            </div>
                            <h3 className="ns-project-title" style={{ color: '#1a1a1a' }}>{p.title}</h3>
                            <p className="ns-project-desc ui-body-copy" style={{ color: '#333' }}>{p.shortDescription}</p>
                        </div>
                    </a>
                )})}
            </div>
        </section>
    );
}
