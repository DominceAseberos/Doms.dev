import React from 'react';

const ExpandedProjectOverlay = ({ project, onClose }) => {
    return (
        <>
            <button className="ep-close" onClick={onClose}>✕</button>
            <div className="ep-inner">
                <span className="ep-tag">Project</span>
                <h2 className="ep-title">{project.title}</h2>
                <p className="ep-type">{project.type}</p>
                <div className="ep-divider" />
                <p className="ep-desc" style={{ whiteSpace: 'pre-wrap' }}>{project.desc}</p>
                <div className="ep-pills">
                    {project.tech.map((t, i) => (
                        <span className="ep-pill" key={i}>{t}</span>
                    ))}
                </div>
                <a href="#" className="ep-cta">View Live Site <span className="arrow">↗</span></a>
            </div>
            <div className="ep-image" style={{ backgroundImage: `url(${project.image})` }} />
        </>
    );
};

export default ExpandedProjectOverlay;
