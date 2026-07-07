import React from 'react';
import { getTechIcon } from '../../utils/techIcons';

export default function TechStackSection({ techStack = [], compact = false }) {
    if (!techStack || techStack.length === 0) return null;

    if (compact) {
        // Flatten all tech items and remove duplicates
        const allItems = [...new Set(techStack.flatMap(g => g.items || []))];
        
        const mid = Math.ceil(allItems.length / 2);
        const row1 = allItems.slice(0, mid);
        const row2 = allItems.slice(mid);

        // Render a single track chunk
        const renderTrack = (rowItems, rowKey) => (
            <div key={rowKey} style={{ display: 'flex', gap: '4rem', paddingRight: '4rem' }}>
                {rowItems.map((item, idx) => {
                    const Icon = getTechIcon(item);
                    if (!Icon) return null;
                    return (
                        <div key={`${item}-${idx}`} className="ns-tech-icon-carousel lit-content-block lit-transparent" title={item} style={{
                            width: '45px',
                            height: '45px',
                            flexShrink: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'var(--ns-body-color)'
                        }}>
                            {Icon}
                        </div>
                    );
                })}
            </div>
        );

        return (
            <section className="ns-section" id="stack" style={{ overflowX: 'clip' }}>
                <style>
                {`
                @keyframes marqueeLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marqueeRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .ns-tech-icon-carousel svg {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                .ns-tech-icon-carousel:hover svg {
                    transform: scale(1.4);
                }
                `}
                </style>
                
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Technical Skills</p>
                <h2 className="ns-section-heading ns-reveal">Technology Stack</h2>
                
                <div className="ns-reveal" style={{
                    position: 'relative',
                    width: '100vw',
                    left: '50%',
                    transform: 'translateX(-50%)', // Completely horizontal
                    padding: '2rem 0',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2.5rem'
                }}>
                    {/* Row 1: moves left */}
                    <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeLeft 60s linear infinite' }}>
                        {renderTrack(row1, 'r1-1')}
                        {renderTrack(row1, 'r1-2')}
                        {renderTrack(row1, 'r1-3')}
                        {renderTrack(row1, 'r1-4')}
                    </div>

                    {/* Row 2: moves right */}
                    <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeRight 60s linear infinite' }}>
                        {renderTrack(row2, 'r2-1')}
                        {renderTrack(row2, 'r2-2')}
                        {renderTrack(row2, 'r2-3')}
                        {renderTrack(row2, 'r2-4')}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="ns-section" id="stack">
            <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Technical Skills</p>
            <h2 className="ns-section-heading ns-reveal">Technology Stack</h2>
            <div className="ns-stack-grid">
                {techStack.map((group) => (
                    <div key={group.group} className="ns-stack-group ns-reveal lit-content-block lit-transparent">
                        <h3 className="ns-stack-group-title">{group.group}</h3>
                        <div className="ns-pill-group">
                            {(group.items || []).map((item) => {
                                const Icon = getTechIcon(item);
                                return (
                                    <div key={item} className="ns-tech-item ns-tech-reveal">
                                        {Icon && (
                                            <div className="ns-tech-icon" data-tech={item.toLowerCase().replace(/\s+/g, '-')}>
                                                {Icon}
                                            </div>
                                        )}
                                        <span className="ns-pill" style={{ textAlign: 'center', width: 'max-content' }}>
                                            {item}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
