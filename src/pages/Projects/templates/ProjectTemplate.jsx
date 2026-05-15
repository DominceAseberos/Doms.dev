import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor, FiTablet, FiSmartphone, FiArrowLeft, FiLink2 } from 'react-icons/fi';
import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';
import useThemeStore from '../../../store/useThemeStore';
import { EditableText } from '../components/EditableText';
import { ContentBuilder } from '../components/builder/ContentBuilder';

const ProjectTemplate = ({
    project,
    rootRef,
    isAdminPreview = false,
    onAddField = null,
    onUpdateField = null,
    onSave = null,
    saveStatus = null,
}) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    const [activeView, setActiveView] = useState('desktop');

    const VIEW_META = {
        desktop: { icon: <FiMonitor size={14} />, label: 'Desktop' },
        tablet: { icon: <FiTablet size={14} />, label: 'Tablet' },
        mobile: { icon: <FiSmartphone size={14} />, label: 'Mobile' }
    };

    const VIEW_IMAGE_FIELD = {
        desktop: 'desktopImage',
        tablet: 'tabletImage',
        mobile: 'mobileImage',
    };

    const VIEW_GALLERY_FIELD = {
        desktop: 'desktopGallery',
        tablet: 'tabletGallery',
        mobile: 'mobileGallery',
    };

    const heroMedia = useMemo(() => {
        const viewField = VIEW_IMAGE_FIELD[activeView];
        const viewImage = project[viewField];
        if (viewImage && viewImage !== '') return viewImage;
        if (isAdminPreview) return '';
        return '';
    }, [project, activeView, isAdminPreview]);

    const galleryMedia = useMemo(() => {
        const galleryField = VIEW_GALLERY_FIELD[activeView];
        const viewGallery = project[galleryField];
        if (viewGallery && viewGallery.length > 0) return viewGallery;
        return [];
    }, [project, activeView, isAdminPreview]);

    const coverImage = useMemo(() => {
        if (!project) return '';
        return project.desktopImage || project.mainImage || project.images?.[0] || '';
    }, [project]);

    const fmtFullDate = (dateStr) => {
        if (!dateStr) return 'TBA';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const renderMedia = (source, alt, className) => {
        if (!source || source === '') return null;
        const isVideo = source.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {
            return (
                <video 
                    src={source} 
                    className={className} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster={coverImage}
                />
            );
        }
        return <img src={source} alt={alt} className={className} loading="lazy" />;
    };

    const caseStudyFooter = (
        <section className="cs-shell cs-bottom-footer cs-animate">
            <div className="cs-bottom-footer__inner">
                <div className="cs-bottom-footer__left">
                    <p className="cs-overline">What's next</p>
                    <h2 className="cs-heading">Have a project in mind?</h2>
                    <p className="cs-desc">
                        I'm available for freelance work and full-time roles. If you'd like to work together, reach out.
                    </p>
                </div>
                <div className="cs-bottom-footer__actions">
                    <Link to="/contact" className="cs-link-btn">Get in Touch</Link>
                    <Link to="/projects" className="cs-link-btn cs-link-btn--ghost">Back to Projects</Link>
                </div>
            </div>
        </section>
    );

    const fileInputRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(null);

    const deleteUploadedFile = async (url) => {
        if (!url || !url.startsWith('/assets/uploads/')) return;
        try {
            await fetch(`/__delete-upload?path=${encodeURIComponent(url)}`, { method: 'DELETE' });
        } catch (err) {
            console.warn('Could not delete file from disk:', url, err);
        }
    };

    const triggerUpload = (type) => {
        setUploading(type);
        fileInputRef.current?.click();
        
        const onFocus = () => {
            setTimeout(() => {
                setUploading(null);
                window.removeEventListener('focus', onFocus);
            }, 500);
        };
        window.addEventListener('focus', onFocus);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=${project.id}&type=imgs`, {
                method: 'POST', body: file
            });
            const data = await res.json();
            if (data.ok) {
                if (uploading === 'galleryImage') {
                    const galleryField = VIEW_GALLERY_FIELD[activeView];
                    const next = [...(project[galleryField] || []), data.url];
                    onUpdateField(galleryField, next);
                } else {
                    onUpdateField(uploading, data.url);
                }
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed. Check console for details.");
        } finally {
            setUploading(null);
            e.target.value = '';
        }
    };

    return (
        <div className="relative min-h-screen">
            <style dangerouslySetInnerHTML={{ __html: `
                .prose-custom h1, .prose-custom h2, .prose-custom h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; color: inherit; }
                .prose-custom h1 { font-size: 1.5em; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 0.3em; }
                .prose-custom h2 { font-size: 1.25em; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 0.2em; }
                .prose-custom p { margin-bottom: 0.6em; line-height: 1.7; opacity: 0.9; }
                .prose-custom ul, .prose-custom ol { margin-bottom: 1em; padding-left: 1.5em; }
                .prose-custom ul { list-style-type: disc; }
                .prose-custom ol { list-style-type: decimal; }
                .prose-custom li { margin-bottom: 0.5em; }
                .prose-custom strong { font-weight: bold; color: inherit; }
                .prose-custom code { background: rgba(128,128,128,0.1); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }

                .admin-editable:empty:before {
                    content: attr(data-placeholder);
                    opacity: 0.4;
                    font-style: italic;
                    pointer-events: none;
                }
                .admin-editable {
                    min-height: 1.2em;
                }
            `}} />
            <ParticleBackground />
            <NavBar />

            {isAdminPreview && (
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".jpg,.jpeg,.png,.gif,.webp,.avif,.svg" 
                    onChange={handleFileUpload} 
                    onCancel={() => setUploading(null)}
                />
            )}

            <main className="cs-page relative z-10" ref={rootRef}>
                <section className="cs-shell cs-landing-top cs-animate">
                    <div className="flex justify-between items-center w-full mb-12">
                        <Link to={isAdminPreview ? "/admin/projects" : "/projects"} className="cs-top-link cs-top-link--ghost flex items-center gap-2">
                            <FiArrowLeft size={16} />
                            <span>{isAdminPreview ? "Dashboard" : "Archive"}</span>
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            {/* Primary Button */}
                            <a 
                                href={isAdminPreview ? undefined : (project.primaryBtnUrl || `/projects/${project.id}`)} 
                                target={isAdminPreview ? undefined : (project.primaryBtnUrl && project.primaryBtnUrl.startsWith('/') ? undefined : "_blank")} 
                                rel="noopener noreferrer" 
                                className="cs-top-link cs-top-link--ghost flex items-center gap-2"
                                onClick={e => isAdminPreview && e.preventDefault()}
                            >
                                <span>{project.primaryBtnLabel || 'View Details'}</span>
                            </a>

                            {/* Secondary Button */}
                            {(project.secondaryBtnUrl || project.liveUrl) && (
                                <a 
                                    href={isAdminPreview ? undefined : (project.secondaryBtnUrl || project.liveUrl)} 
                                    target={isAdminPreview ? undefined : "_blank"} 
                                    rel="noopener noreferrer" 
                                    className="cs-top-link flex items-center gap-2"
                                    onClick={e => isAdminPreview && e.preventDefault()}
                                >
                                    <span>{project.secondaryBtnLabel || 'Live View'}</span>
                                </a>
                            )}

                            {/* GitHub Button */}
                            {(project.githubBtnUrl || project.githubUrl) && (
                                <a 
                                    href={isAdminPreview ? undefined : (project.githubBtnUrl || project.githubUrl)} 
                                    target={isAdminPreview ? undefined : "_blank"} 
                                    rel="noopener noreferrer" 
                                    className="cs-top-link cs-top-link--ghost flex items-center gap-2"
                                    onClick={e => isAdminPreview && e.preventDefault()}
                                >
                                    <span>{project.githubBtnLabel || 'GitHub'}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="cs-overline">
                            <EditableText 
                                value={project.projectType} 
                                onSave={(val) => onUpdateField('projectType', val)} 
                                isAdminPreview={isAdminPreview}
                                placeholder="Platform Type"
                            />
                        </div>
                        <div className="cs-title cs-title--center">
                            <EditableText 
                                value={project.title} 
                                onSave={(val) => onUpdateField('title', val)} 
                                isAdminPreview={isAdminPreview}
                                placeholder="Project Title"
                            />
                        </div>

                        <div className="cs-date mt-2 opacity-60 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            {isAdminPreview ? (
                                <input 
                                    type="date"
                                    value={project.dateCreated ? project.dateCreated.split('T')[0] : ''}
                                    onChange={(e) => onUpdateField('dateCreated', e.target.value)}
                                    className={`bg-transparent border-none outline-none focus:ring-1 focus:ring-[#c8ff3e] rounded px-2 ${isLight ? 'text-black' : 'text-white'}`}
                                />
                            ) : (
                                <span>{fmtFullDate(project.dateCreated)}</span>
                            )}
                        </div>

                        {/* Short Description Intro */}
                        <div className="max-w-[800px] mx-auto mt-8">
                            <EditableText 
                                value={project.shortDescription} 
                                onSave={(val) => onUpdateField('shortDescription', val)} 
                                isAdminPreview={isAdminPreview}
                                multiline={true}
                                className="text-lg md:text-xl font-medium leading-relaxed opacity-80"
                                placeholder="Add a short project introduction..."
                            />
                        </div>

                        <div className="flex items-center justify-center gap-1 mt-10">
                            {Object.entries(VIEW_META).map(([view, meta]) => {
                                const field = VIEW_IMAGE_FIELD[view];
                                const hasImage = !!project[field];
                                const isActive = activeView === view;
                                return (
                                    <button
                                        key={view}
                                        onClick={() => setActiveView(view)}
                                        title={meta.label}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                            isActive
                                                ? isLight
                                                    ? 'bg-black text-white'
                                                    : 'bg-[#c8ff3e] text-black'
                                                : isLight
                                                    ? 'text-black/40 hover:text-black hover:bg-black/10'
                                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {meta.icon}
                                        <span>{meta.label}</span>
                                        {hasImage && (
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                isActive
                                                    ? isLight ? 'bg-white' : 'bg-black'
                                                    : 'bg-[#c8ff3e]'
                                            }`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="cs-shell cs-landing-media cs-animate">
                    {heroMedia ? (
                        <div className="cs-frame relative group">
                            {renderMedia(heroMedia, `${project.title} ${activeView} view`, 'cs-main-image cs-main-image--landing')}
                            {isAdminPreview && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => triggerUpload(VIEW_IMAGE_FIELD[activeView])}
                                        disabled={!!uploading}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 ${
                                            isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black'
                                        }`}
                                    >
                                        {uploading === VIEW_IMAGE_FIELD[activeView] ? 'Syncing...' : `Change ${VIEW_META[activeView].label}`}
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            await deleteUploadedFile(heroMedia);
                                            onUpdateField(VIEW_IMAGE_FIELD[activeView], '');
                                        }}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : isAdminPreview ? (
                        <div className="cs-frame relative group">
                            <div className={`w-full aspect-video rounded-xl flex flex-col items-center justify-center gap-3 transition-colors pointer-events-none ${
                                isLight 
                                    ? 'bg-black/5 border border-dashed border-black/10 text-black/30 group-hover:border-black/30' 
                                    : 'bg-white/5 border border-dashed border-white/20 text-white/40 group-hover:border-white/40'
                            }`}>
                                <div className={`p-4 rounded-full ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                                    {VIEW_META[activeView].icon}
                                </div>
                                <p className="text-sm font-medium">{uploading === VIEW_IMAGE_FIELD[activeView] ? 'Uploading...' : `Upload ${VIEW_META[activeView].label} View`}</p>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => triggerUpload(VIEW_IMAGE_FIELD[activeView])}
                                    disabled={!!uploading}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 ${
                                        isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black'
                                    }`}
                                >
                                    {uploading === VIEW_IMAGE_FIELD[activeView] ? 'Syncing...' : `Add ${VIEW_META[activeView].label}`}
                                </button>
                            </div>
                        </div>
                    ) : !galleryMedia || galleryMedia.length === 0 ? (
                        <div className={`p-12 text-center rounded-2xl border border-dashed ${
                            isLight ? 'bg-black/5 border-black/10' : 'bg-white/2 border-white/10'
                        }`}>
                            <p className="text-sm font-mono uppercase tracking-widest opacity-40">Preview not available for {VIEW_META[activeView].label} view</p>
                            <p className="text-xs opacity-30 mt-2">Switch views or visit the live site to see the full project.</p>
                        </div>
                    ) : null}

                    {galleryMedia && galleryMedia.length > 0 ? (
                        <div className="cs-media-grid mt-6">
                            {galleryMedia.map((source, index) => (
                                <div className="cs-media-item relative group/media" key={`${source}-${index}`}>
                                    {renderMedia(source, `${project.title} media ${index + 2}`, 'cs-media-thumb')}
                                    {isAdminPreview && (
                                        <button 
                                            onClick={async () => {
                                                await deleteUploadedFile(source);
                                                const galleryField = VIEW_GALLERY_FIELD[activeView];
                                                const next = (project[galleryField] || []).filter((_, i) => i !== index);
                                                onUpdateField(galleryField, next);
                                            }}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover/media:opacity-100 transition-opacity shadow-lg"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            {isAdminPreview && (
                                <button 
                                    onClick={() => triggerUpload('galleryImage')}
                                    disabled={!!uploading}
                                    className={`cs-media-item aspect-video border border-dashed flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-50 ${
                                        isLight 
                                            ? 'bg-black/5 border-black/10 text-black/20 hover:border-black/30 hover:text-black/60' 
                                            : 'bg-white/5 border-white/10 text-white/20 hover:border-white/40 hover:text-white/60'
                                    }`}
                                >
                                    <span className="text-2xl font-light group-hover:scale-110 transition-transform">{uploading === 'galleryImage' ? '...' : '+'}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold">
                                        {uploading === 'galleryImage' ? 'Uploading...' : 'Add Gallery Image'}
                                    </span>
                                </button>
                            )}
                        </div>
                    ) : isAdminPreview ? (
                        <div className="cs-media-grid mt-6">
                            <button 
                                onClick={() => triggerUpload('galleryImage')}
                                disabled={!!uploading}
                                className={`cs-media-item aspect-video border border-dashed flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-50 ${
                                    isLight 
                                        ? 'bg-black/5 border-black/10 text-black/20 hover:border-black/30 hover:text-black/60' 
                                        : 'bg-white/5 border-white/10 text-white/20 hover:border-white/40 hover:text-white/60'
                                }`}
                            >
                                <span className="text-2xl font-light group-hover:scale-110 transition-transform">{uploading === 'galleryImage' ? '...' : '+'}</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold">
                                    {uploading === 'galleryImage' ? 'Uploading...' : 'Add Gallery Image'}
                                </span>
                            </button>
                        </div>
                    ) : null}
                </section>

                {/* DYNAMIC CONTENT BUILDER */}
                <ContentBuilder 
                    sections={project.contentSections || []} 
                    onUpdateSections={(sections) => onUpdateField('contentSections', sections)}
                    isAdminPreview={isAdminPreview}
                    projectId={project.id}
                />

                {caseStudyFooter}

                {/* Admin Quick Help */}
                {isAdminPreview && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3">
                        {saveStatus && (
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                                saveStatus === 'saving' ? 'bg-white/10 text-white/60' :
                                saveStatus === 'saved'  ? 'bg-green-500/20 text-green-400' :
                                                          'bg-red-500/20 text-red-400'
                            }`}>
                                {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? '✓ Saved' : '✗ Error'}
                            </span>
                        )}
                        <button 
                            onClick={onSave}
                            className={`px-6 py-3 font-bold rounded-full transition-all text-sm uppercase tracking-wider active:scale-95 ${
                                isLight 
                                    ? 'bg-black text-white hover:bg-black/80 shadow-lg' 
                                    : 'bg-[#c8ff3e] text-black hover:bg-[#b8ef2e] shadow-[0_0_15px_rgba(200,255,62,0.15)] hover:shadow-[0_0_25px_rgba(200,255,62,0.25)]'
                            }`}
                        >
                            Update Project Data
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProjectTemplate;
