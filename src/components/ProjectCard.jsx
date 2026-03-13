import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onView }) => {
    return (
        <div className="project-card" onClick={() => onView(project)}>
            <div className="project-card-image" style={{ backgroundImage: `url(${project.image})` }} />
            <div className="project-card-body">
                <div className="project-card-meta">
                    <span className="project-card-type">{project.type}</span>
                    <span className="project-card-date">{project.dateCreated}</span>
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.shortDescription}</p>
                <div className="project-card-cta">View Details ↗</div>
            </div>
        </div>
    );
};

export default ProjectCard;
