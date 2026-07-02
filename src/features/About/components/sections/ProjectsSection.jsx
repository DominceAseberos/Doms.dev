import React from 'react';

const isPlaceholderImage = (src) => typeof src === 'string' && /placehold\.co|placeholder/i.test(src);

export default function ProjectsSection({ projects = [] }) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="ns-section" id="projects">
            <div className="ns-projects-header ns-reveal">
                <div>
                    <p className="ui-sub-label ns-section-label">Selected Work</p>
                    <h2 className="ns-section-heading">Projects</h2>
                </div>
                <a href="/projects" className="ns-view-all">View All →</a>
            </div>
            <div className="ns-projects-grid">
                {projects.map((p) => (
                    <a key={p.id} href={`/projects/${p.id}`} className="ns-project-card ns-reveal lit-content-block">
                        {(p.mainImage || p.desktopImage) && !isPlaceholderImage(p.mainImage || p.desktopImage) ? (
                            <div className="ns-project-img-wrap">
                                <img src={p.mainImage || p.desktopImage} alt={p.title} className="ns-project-img" loading="lazy" />
                            </div>
                        ) : (
                            <div className="ns-project-img-placeholder">
                                <span>{p.projectType || 'Case Study'}</span>
                                <strong>{p.title}</strong>
                            </div>
                        )}
                        <div className="ns-project-info">
                            <div className="ns-project-meta">
                                <span className="ui-sub-label ns-project-type">{p.projectType}</span>
                                <span className="ns-project-arrow">↗</span>
                            </div>
                            <h3 className="ns-project-title">{p.title}</h3>
                            <p className="ns-project-desc ui-body-copy">{p.shortDescription}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
