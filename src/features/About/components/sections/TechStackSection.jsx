import React from 'react';
import { getTechIcon } from '../../utils/techIcons';

export default function TechStackSection({ techStack = [] }) {
    if (!techStack || techStack.length === 0) return null;

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
