import React from 'react';
import { FiFolder } from 'react-icons/fi';
import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';

const LandingPageTemplate = ({
    project,
    rootRef,
    topQuickNav,
    availableViews,
    activeView,
    setActiveView,
    VIEW_META,
    renderMedia,
    heroMedia,
    galleryMedia,
    formattedDate,
    credits,
    systemDesignInfo,
    assetGroups,
    analytics,
    caseStudyFooter,
    isAdminPreview = false,
    onAddField = null, // for adding images/assets
    onSave = null      // for the global save btn in admin
}) => {
    const fileInputRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(null); // 'mainImage' | 'galleryImage'

    const triggerUpload = (type) => {
        setUploading(type);
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=${project.id}`, {
                method: 'POST',
                body: file
            });
            const data = await res.json();
            if (data.ok) {
                // Update the project data using the same callback structure
                onAddField?.(uploading, data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(null);
            e.target.value = '';
        }
    };

    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            {/* Hidden File Input for Admin Uploads */}
            {isAdminPreview && (
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            )}

            <main className="cs-page relative z-10" ref={rootRef}>
                {topQuickNav}

                <section className="cs-shell cs-landing-top cs-animate text-center">
                    <p className="cs-overline">{project.projectType || 'Landing Page'}</p>
                    <h1 className="cs-title cs-title--center">{project.title || "Untitled Project"}</h1>
                </section>

                <section className="cs-shell cs-landing-media cs-animate">
                    <div className="cs-frame relative group">
                        {heroMedia ? (
                            renderMedia(heroMedia, `${project.title} hero`, 'cs-main-image cs-main-image--landing')
                        ) : (
                            <div className="w-full aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 text-white/40 group-hover:border-white/40 transition-colors pointer-events-none">
                                <div className="p-4 rounded-full bg-white/5">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="text-sm font-medium">{uploading === 'mainImage' ? 'Uploading...' : 'Hero Image Placeholder'}</p>
                            </div>
                        )}
                        {isAdminPreview && (
                            <button 
                                onClick={() => triggerUpload('mainImage')}
                                disabled={!!uploading}
                                className="absolute top-4 right-4 bg-[#c8ff3e] text-black px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
                            >
                                {uploading === 'mainImage' ? 'Syncing...' : (heroMedia ? 'Change Hero' : 'Add Hero')}
                            </button>
                        )}
                    </div>

                    <div className="cs-media-grid mt-6">
                        {galleryMedia.map((source, index) => (
                            <div className="cs-media-item" key={`${source}-${index}`}>
                                {renderMedia(source, `${project.title} media ${index + 2}`, 'cs-media-thumb')}
                            </div>
                        ))}
                        {isAdminPreview && (
                            <button 
                                onClick={() => triggerUpload('galleryImage')}
                                disabled={!!uploading}
                                className="cs-media-item aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-white/20 hover:border-[#c8ff3e] hover:text-[#c8ff3e] transition-all group disabled:opacity-50"
                            >
                                <span className="text-2xl font-light group-hover:scale-110 transition-transform">{uploading === 'galleryImage' ? '...' : '+'}</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">
                                    {uploading === 'galleryImage' ? 'Uploading...' : 'Add Gallery Image'}
                                </span>
                            </button>
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-details cs-animate">
                    <div className="cs-details-grid">
                        <article className="cs-detail-col">
                            <p className="cs-overline">About</p>
                            <p className="cs-detail-body">{project.shortDescription || "No description provided yet."}</p>
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
                                    <span>Design</span>
                                    <span>{credits.design}</span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Code</span>
                                    <span>{credits.code}</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="cs-shell cs-landing-tools cs-animate">
                    <p className="cs-overline">Tech Stack</p>
                    <div className="cs-chip-wrap">
                        {(project.stacks || []).length > 0 ? (
                            project.stacks.map((stack) => (
                                <span key={stack} className="cs-chip">{stack}</span>
                            ))
                        ) : (
                            <span className="text-white/20 text-xs italic">No tools listed yet</span>
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-system-dynamic cs-animate">
                    <p className="cs-overline">System Design</p>
                    <div className="cs-system-dynamic-grid">
                        {systemDesignInfo.map((item, index) => (
                            <article key={`${item.label}-${index}`} className="cs-system-item">
                                <p className="cs-system-key">{item.label}</p>
                                <p className="cs-system-value">{item.value}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-assets-list cs-animate">
                    <p className="cs-overline">Assets</p>
                    <div className="cs-assets-list-wrap">
                        {assetGroups.length > 0 ? (
                            assetGroups.map((group) => (
                                <article key={group.view} className="cs-asset-folder">
                                    <div className="cs-asset-folder__head">
                                        <div className="cs-asset-meta">
                                            <FiFolder size={16} />
                                            <span>{group.label} Assets</span>
                                        </div>
                                        <span className="cs-asset-count">{group.files.length} files</span>
                                    </div>

                                    <div className="cs-asset-folder__list">
                                        {group.files.map((source, index) => (
                                            <div key={`${group.view}-${source}-${index}`} className="cs-asset-file-row">
                                                <span className="cs-asset-file-name">{source.split('/').pop()}</span>
                                                <a href={source} download className="cs-asset-download">Download</a>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="p-8 border border-white/5 rounded-2xl bg-white/2 text-center text-white/20 italic text-sm">
                                No downloadable assets linked
                            </div>
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-analytics cs-animate">
                    <p className="cs-overline">Analytics</p>
                    <div className="cs-analytics-grid">
                        <article className="cs-analytics-card">
                            <p className="cs-score-label">Total Visits</p>
                            <p className="cs-score-value">{analytics.visits.toLocaleString()}</p>
                        </article>
                        <article className="cs-analytics-card">
                            <p className="cs-score-label">Rating</p>
                            <p className="cs-score-value">{analytics.rating} / 10</p>
                        </article>
                    </div>
                </section>

                {caseStudyFooter}

                {/* Admin Quick Help */}
                {isAdminPreview && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
                        <button 
                            onClick={onSave}
                            className="px-6 py-3 bg-[#c8ff3e] text-black font-bold rounded-full shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
                        >
                            Update Project Data
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPageTemplate;
