import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiFolder } from 'react-icons/fi';
import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';

const CaseStudyTemplate = ({
    project,
    rootRef,
    topQuickNav,
    formattedDate,
    caseStudyConfig,
    coverImage,
    highlightImages,
    sectionLabels,
    uiuxPoints,
    systemDesignPoints,
    assetGroups,
    scoreItems,
    caseStudyFooter
}) => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <main className="cs-page relative z-10" ref={rootRef}>
                {topQuickNav}

                <section className="cs-shell cs-intro cs-animate">
                    <p className="cs-overline">{project.projectType || 'Case Study'}</p>
                    <h1 className="cs-title">{project.title}</h1>
                </section>

                <section className="cs-shell cs-hero cs-animate">
                    <div className="cs-frame">
                        <img src={coverImage} alt={`${project.title} primary visual`} className="cs-main-image" />
                    </div>
                </section>

                <section className="cs-shell cs-highlights cs-animate">
                    <p className="cs-overline">{caseStudyConfig.highlightsOverline}</p>
                    <h2 className="cs-heading">{caseStudyConfig.highlightsHeading}</h2>
                    <div className="cs-grid-2">
                        {highlightImages.map((image, index) => (
                            <article key={image} className="cs-highlight-card">
                                <div className="cs-thumb-wrap">
                                    <img src={image} alt={`${project.title} highlight ${index + 1}`} className="cs-thumb" />
                                </div>
                                <p className="cs-caption">{sectionLabels[index % sectionLabels.length]} • Layout</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-details cs-animate">
                    <div className="cs-details-grid">
                        <article className="cs-detail-col">
                            <p className="cs-overline">About</p>
                            <p className="cs-detail-body">{project.shortDescription}</p>
                        </article>

                        <article className="cs-detail-col">
                            <p className="cs-overline">Site Details</p>
                            <div className="cs-detail-table">
                                <div className="cs-detail-row">
                                    <span>Visit</span>
                                    {project.livePreviewLink ? (
                                        <a href={project.livePreviewLink} target="_blank" rel="noopener noreferrer">Live Site ↗</a>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                                <div className="cs-detail-row">
                                    <span>Platform</span>
                                    <span>{project.projectType || 'Web'}</span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Year</span>
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        </article>

                        <article className="cs-detail-col">
                            <p className="cs-overline">Credits</p>
                            <div className="cs-detail-table">
                                <div className="cs-detail-row">
                                    <span>UI/UX</span>
                                    <span>Domince</span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Code</span>
                                    <span>Domince</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="cs-shell cs-landing-panels cs-animate">
                    <div className="cs-grid-2 cs-grid-2--equal">
                        <article className="cs-panel">
                            <p className="cs-overline">UI/UX</p>
                            <h3 className="cs-heading-sm">Interface & Experience Decisions</h3>
                            <ul className="cs-list">
                                {uiuxPoints.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>

                        <article className="cs-panel">
                            <p className="cs-overline">System Design</p>
                            <h3 className="cs-heading-sm">Section Architecture & Flow</h3>
                            <ul className="cs-list">
                                {systemDesignPoints.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </section>

                <section className="cs-shell cs-landing-tools cs-animate">
                    <p className="cs-overline">Tools Used</p>
                    <div className="cs-chip-wrap">
                        {project.stacks.map((stack) => (
                            <span key={stack} className="cs-chip">{stack}</span>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-assets cs-animate">
                    <p className="cs-overline">Assets</p>
                    <h3 className="cs-heading">Downloadable Asset Folders</h3>
                    <div className="cs-assets-list-wrap">
                        {assetGroups.map((group) => (
                            <article key={`default-${group.view}`} className="cs-asset-folder">
                                <div className="cs-asset-folder__head">
                                    <div className="cs-asset-meta">
                                        <span className="flex items-center gap-2">
                                            <FiFolder size={16} />
                                            <span>{group.label} Assets</span>
                                        </span>
                                    </div>
                                    <span className="cs-asset-count">{group.files.length} files</span>
                                </div>

                                <div className="cs-asset-folder__list">
                                    {group.files.map((source, index) => (
                                        <div key={`default-${source}-${index}`} className="cs-asset-file-row">
                                            <span className="cs-asset-file-name">{source.split('/').pop()}</span>
                                            <a href={source} download className="cs-asset-download">Download</a>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>



                <section className="cs-shell cs-story cs-animate">
                    <p className="cs-overline">{caseStudyConfig.storyOverline}</p>
                    <p className="cs-desc">{caseStudyConfig.storyLeadPrefix} {project.shortDescription}</p>
                    <div className="cs-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.fullDocumentation || ''}</ReactMarkdown>
                    </div>
                </section>

                <section className="cs-shell cs-score cs-animate">
                    <h2 className="cs-heading">{caseStudyConfig.scoreHeading}</h2>
                    <div className="cs-score-grid">
                        {scoreItems.map((item) => (
                            <article key={item.label} className="cs-score-card">
                                <p className="cs-score-label">{item.label}</p>
                                <p className="cs-score-value">{item.value}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {caseStudyFooter}
            </main>
        </div>
    );
};

export default CaseStudyTemplate;
