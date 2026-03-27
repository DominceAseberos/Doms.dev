import React from 'react';
import useThemeStore from '../store/useThemeStore';
import ReactMarkdown from 'react-markdown';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ContentBuilder } from '../pages/Projects/components/builder/ContentBuilder';

const ExpandedProjectOverlay = ({ project, onClose }) => {
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';
    const primaryUrl = project.primaryBtnUrl || `/projects/${project.id}`;
    const primaryLabel = project.primaryBtnLabel || 'View Details';
    const secondaryUrl = project.secondaryBtnUrl || project.liveUrl || project.livePreviewLink;
    const secondaryLabel = project.secondaryBtnLabel || 'Live View';
    const githubUrl = project.githubUrl || project.githubLink;
    const githubLabel = project.githubBtnLabel || 'GitHub';

    return (
        <>
            <button className="ep-close" onClick={onClose}>✕</button>
            <div className={`ep-inner ${isLight ? 'ep-inner-light' : 'ep-inner-dark'}`}> 
                <span className="ep-tag">{project.projectType || 'Project'}</span>
                <h2 className={`ep-title ${isLight ? 'ep-title-light' : ''}`}>{project.title}</h2>
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
                    {/* Full Case Study Link */}
                    <Link to={`/projects/${project.id}`} className="ep-cta" onClick={onClose}>
                        <FiExternalLink size={16} /> View Full Case Study
                    </Link>

                    {/* Secondary Link (Live) */}
                    {secondaryUrl && (
                        secondaryUrl.startsWith('/') ? (
                            <Link to={secondaryUrl} className={`ep-cta ep-cta-secondary${isLight ? ' ep-cta-secondary-light' : ''}`} style={isLight ? { background: 'transparent', border: '1px solid #232726', color: '#232726' } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} onClick={onClose}>
                                <FiExternalLink size={16} /> {secondaryLabel}
                            </Link>
                        ) : (
                            <a href={secondaryUrl} target="_blank" rel="noopener noreferrer" className={`ep-cta ep-cta-secondary${isLight ? ' ep-cta-secondary-light' : ''}`} style={isLight ? { background: 'transparent', border: '1px solid #232726', color: '#232726' } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                                <FiExternalLink size={16} /> {secondaryLabel}
                            </a>
                        )
                    )}
                </div>

                {/* Vertical Content Sections (First 2 sections) */}
                {project.contentSections && project.contentSections.length > 0 && (
                    <div 
                        className="ep-content-builder-wrap mt-12 pt-8" 
                        style={{ borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <ContentBuilder 
                            sections={project.contentSections.slice(0, 3)}
                            onUpdateSections={() => {}}
                            isAdminPreview={false}
                            projectId={project.id}
                        />
                    </div>
                )}
            </div>
            <div className="ep-image" style={{ backgroundImage: `url(${project.image || project.mainImage})` }} />
        </>
    );
};

export default ExpandedProjectOverlay;
