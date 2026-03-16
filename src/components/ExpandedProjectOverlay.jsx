import React from 'react';
import useThemeStore from '../store/useThemeStore';
import ReactMarkdown from 'react-markdown';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const ExpandedProjectOverlay = ({ project, onClose }) => {
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';
    return (
        <>
            <button className="ep-close" onClick={onClose}>✕</button>
            <div className={`ep-inner ${isLight ? 'ep-inner-light' : 'ep-inner-dark'}`}> 
                <span className="ep-tag">Project</span>
                <h2 className="ep-title">{project.title}</h2>
                <h2 className={`ep-title ${isLight ? 'ep-title-light' : ''}`}>{project.title}</h2>
                <p className={`ep-type ${isLight ? 'ep-type-light' : ''}`}>{project.type}</p>
                <div className="ep-divider" />
                <div className="ep-desc-markdown">
                    <ReactMarkdown>{project.desc || ''}</ReactMarkdown>
                </div>
                <div className="ep-pills">
                    {project.tech.map((t, i) => (
                        <span className="ep-pill" key={i}>{t}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="ep-cta">
                            <FiExternalLink size={16} /> View Live Site 
                        </a>
                    )}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`ep-cta ep-cta-secondary${isLight ? ' ep-cta-secondary-light' : ''}`} style={isLight ? { background: 'transparent', border: '1px solid #232726', color: '#232726' } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                            <FiExternalLink size={16} /> More Details
                        </a>
                    )}
                </div>
            </div>
            <div className="ep-image" style={{ backgroundImage: `url(${project.image})` }} />
        </>
    );
};

export default ExpandedProjectOverlay;
