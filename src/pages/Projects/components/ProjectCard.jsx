import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onView }) => {
    const t = project.theme || {};
    const cardImage = project.images?.[0] || project.image || '/assets/projects/cover/BananaLeaf.png';

    return (
        <div
            className={`pg-card ${t.gridClass || 'pg-half'}`}
            data-cat={t.cat || 'all'}
            style={{
                '--c1': t.c1 || '#111',
                '--c2': t.c2 || '#1a1a1a',
                '--glow': t.glow || 'rgba(200,255,62,.06)',
            }}
            onClick={() => onView?.(project)}
        >
            {/* ── Visual zone ── */}
            <div className="pg-vis">
                <div className="pg-vis-bg"></div>
                <div className="pg-glow"></div>
                <img src={cardImage} alt={`${project.title} preview`} className="pg-cover" loading="lazy" />
                <div className="pg-vignette"></div>
                <div className="pg-date pg-label-lg">{project.displayDate}</div>
            </div>

            {/* ── Info zone ── */}
            <div className="pg-info">
                <span className="pg-num pg-label-lg">{project.num}</span>
                <div className="pg-name pg-title-lg">{project.title}</div>
                <span className="pg-type pg-label-lg">{project.displayType || t.displayType || project.projectType}</span>
                {project.shortDescription && (
                    <p className="pg-desc pg-subtitle-lg line-clamp-2 opacity-60">
                        {project.shortDescription}
                    </p>
                )}
                <div className="pg-pills">
                    {project.stacks?.map((s) => (
                        <span key={s} className="pg-pill pg-pill-lg">{s}</span>
                    ))}
                </div>
                <div className="pg-arrow">↗</div>
            </div>

            {/* ── Hover overlay ── */}
            <div className="pg-overlay">
                <span className="ov-tag pg-label-lg">{project.displayType || t.displayType || project.projectType} · {project.overlayDate}</span>
                <div className="ov-title pg-title-lg">{project.title}</div>
                <p className="ov-desc pg-subtitle-lg">{project.shortDescription || t.ovDesc}</p>
                <div className="ov-pills">
                    {project.stacks?.map((s) => (
                        <span key={s} className="ov-pill pg-pill-lg">{s}</span>
                    ))}
                </div>
                <a
                    href={project.livePreviewLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ov-link pg-label-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    View Details ↗
                </a>
            </div>
        </div>
    );
};

export default ProjectCard;
