import React, { useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor, FiTablet, FiSmartphone, FiFolder, FiArrowLeft, FiLink2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';
import useThemeStore from '../../../store/useThemeStore';

const LandingPageTemplate = ({
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

    const activeMedia = useMemo(() => {
        if (!project) return [];
        // Treat project.images as the absolute source of truth if it exists, otherwise use main and gallery separately
        if (project.images && project.images.length > 0) return project.images;
        return project.mainImage ? [project.mainImage, ...(project.galleryImages || [])] : (project.galleryImages || []);
    }, [project]);

    // Use specifically defined properties if available, fallback to the merged array
    const heroMedia = useMemo(() => {
        // If mainImage is explicitly defined (even if empty), respect it over legacy array
        if (project.hasOwnProperty('mainImage')) return project.mainImage || '';
        return project.images?.[0] || '';
    }, [project]);
    const galleryMedia = useMemo(() => {
        // If galleryImages is explicitly defined (even if empty after deletion), respect it.
        // Otherwise fallback to legacy images array.
        if (project.hasOwnProperty('galleryImages')) return project.galleryImages || [];
        return project.images?.slice(1) || [];
    }, [project]);

    const coverImage = useMemo(() => {
        if (!project) return '';
        return project.mainImage || project.images?.[0] || '';
    }, [project]);

    const formattedDate = useMemo(() => {
        if (!project) return '---';
        return new Date(project.dateCreated).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }, [project]);

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

    const analytics = {
        visits: 1240, 
        rating: 9.8    
    };

    const caseStudyFooter = (
        <section className="cs-shell cs-bottom-footer cs-animate">
            <div className="cs-bottom-footer__inner">
                <div className="cs-bottom-footer__left">
                    <p className="cs-overline">Next Phase</p>
                    <h2 className="cs-heading">Interested in the process?</h2>
                    <p className="cs-desc">
                        Every project has a story of challenges and breakthroughs. Let's discuss how we can build something impactful together.
                    </p>
                </div>
                <div className="cs-bottom-footer__actions">
                    <Link to="/contact" className="cs-link-btn">Initiate Collaboration</Link>
                    <Link to="/projects" className="cs-link-btn cs-link-btn--ghost">Explore Full Archive</Link>
                </div>
            </div>
        </section>
    );

    const fileInputRef = React.useRef(null);
    const assetInputRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(null); // 'mainImage' | 'galleryImage' | 'asset:[group]'
    const [isAddingStack, setIsAddingStack] = React.useState(false);
    const [stackInputValue, setStackInputValue] = React.useState('');
    
    // Helper for in-place text editing
    const EditableText = ({ value, onSave, className = "", multiline = false, placeholder = "Click to edit..." }) => {
        if (!isAdminPreview) {
            if (multiline && value) {
                return (
                    <div className={`prose-custom ${className}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {value}
                        </ReactMarkdown>
                    </div>
                );
            }
            return <span className={className}>{value || ""}</span>;
        }
        
        const Tag = multiline ? 'div' : 'span';
        
        return (
            <Tag
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                    const nextValue = e.target.innerText.trim();
                    if (nextValue !== value) onSave(nextValue);
                }}
                className={`${className} cursor-text ${isLight ? 'hover:bg-black/5 focus:bg-black/10' : 'hover:bg-white/5 focus:bg-white/10'} px-2 -mx-2 rounded transition-colors outline-none min-w-[50px] ${multiline ? 'block whitespace-pre-wrap' : 'inline-block'} admin-editable`}
                data-placeholder={placeholder}
            >
                {value}
            </Tag>
        );
    };

    // Physically delete a locally-uploaded file from disk
    const deleteUploadedFile = async (url) => {
        if (!url || !url.startsWith('/assets/uploads/')) return; // Only delete local uploads
        try {
            await fetch(`/__delete-upload?path=${encodeURIComponent(url)}`, { method: 'DELETE' });
        } catch (err) {
            console.warn('Could not delete file from disk:', url, err);
        }
    };

    const triggerUpload = (type) => {
        setUploading(type);
        if (type.startsWith('asset:')) {
            assetInputRef.current?.click();
        } else {
            fileInputRef.current?.click();
        }
        
        // Comprehensive fallback: if 'onCancel' isn't supported, 
        // reset state after window focus returns (with a small delay)
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

        const isAsset = uploading.startsWith('asset:');
        const uploadType = isAsset ? 'assets' : 'imgs';
        
        try {
            const res = await fetch(`/__upload-image?name=${encodeURIComponent(file.name)}&projectId=${project.id}&type=${uploadType}`, {
                method: 'POST',
                body: file
            });
            const data = await res.json();
            if (data.ok) {
                if (isAsset) {
                    const groupName = uploading.split(':')[1];
                    const currentAssets = { ...(project.assets || {}) };
                    if (!currentAssets[groupName]) currentAssets[groupName] = [];
                    currentAssets[groupName] = [...currentAssets[groupName], data.url];
                    onUpdateField('assets', currentAssets);
                } else {
                    onAddField?.(uploading, data.url);
                }
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
            {/* Scoped styles for Markdown rendering */}
            <style dangerouslySetInnerHTML={{ __html: `
                .prose-custom h1, .prose-custom h2, .prose-custom h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; color: inherit; }
                .prose-custom h1 { font-size: 1.5em; border-bottom: 1px solid rgba(128,128,128,0.2); padding-bottom: 0.3em; }
                .prose-custom h2 { font-size: 1.25em; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 0.2em; }
                .prose-custom p { margin-bottom: 1em; line-height: 1.7; opacity: 0.9; }
                .prose-custom ul, .prose-custom ol { margin-bottom: 1em; padding-left: 1.5em; }
                .prose-custom ul { list-style-type: disc; }
                .prose-custom ol { list-style-type: decimal; }
                .prose-custom li { margin-bottom: 0.5em; }
                .prose-custom strong { font-weight: bold; color: inherit; }
                .prose-custom code { background: rgba(128,128,128,0.1); padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em; }

                /* Admin editable empty state */
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

            {/* Hidden File Inputs for Admin Uploads */}
            {isAdminPreview && (
                <>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        onCancel={() => setUploading(null)}
                    />
                    <input 
                        type="file" 
                        ref={assetInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        onCancel={() => setUploading(null)}
                    />
                </>
            )}

            <main className="cs-page relative z-10" ref={rootRef}>
                <section className="cs-shell cs-landing-top cs-animate">
                    <div className="flex justify-between items-center w-full mb-12">
                        <Link to={isAdminPreview ? "/admin/projects" : "/projects"} className="cs-top-link cs-top-link--ghost flex items-center gap-2">
                            <FiArrowLeft size={16} />
                            <span>{isAdminPreview ? "Dashboard" : "Archive"}</span>
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            {/* GitHub Link */}
                            {isAdminPreview ? (
                                <div className="cs-top-link cs-top-link--ghost flex items-center gap-3">
                                    <FiLink2 size={14} className="opacity-40" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">GitHub Link</span>
                                        <input 
                                            type="text"
                                            value={project.githubLink || ''}
                                            onChange={(e) => onUpdateField('githubLink', e.target.value)}
                                            placeholder="Paste GitHub URL..."
                                            className="bg-transparent border-none outline-none text-[11px] w-24 focus:w-48 transition-all"
                                        />
                                    </div>
                                </div>
                            ) : project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="cs-top-link cs-top-link--ghost flex items-center gap-2">
                                    <span>GitHub</span>
                                </a>
                            )}

                            {/* Live Site Link */}
                            {isAdminPreview ? (
                                <div className="cs-top-link flex items-center gap-3">
                                    <FiLink2 size={14} className="opacity-60" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] opacity-60 uppercase tracking-widest font-bold">Live Preview Link</span>
                                        <input 
                                            type="text"
                                            value={project.livePreviewLink || ''}
                                            onChange={(e) => onUpdateField('livePreviewLink', e.target.value)}
                                            placeholder="Paste Live URL..."
                                            className="bg-transparent border-none outline-none text-[11px] w-24 focus:w-48 transition-all text-black"
                                        />
                                    </div>
                                </div>
                            ) : project.livePreviewLink && (
                                <a href={project.livePreviewLink} target="_blank" rel="noopener noreferrer" className="cs-top-link flex items-center gap-2">
                                    <span>Live Preview</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="cs-overline">
                            <EditableText 
                                value={project.projectType} 
                                onSave={(val) => onUpdateField('projectType', val)} 
                                placeholder="Platform Type"
                            />
                        </p>
                        <h1 className="cs-title cs-title--center">
                            <EditableText 
                                value={project.title} 
                                onSave={(val) => onUpdateField('title', val)} 
                                placeholder="Project Title"
                            />
                        </h1>
                    </div>
                </section>

                <section className="cs-shell cs-landing-media cs-animate">
                    {heroMedia ? (
                        <div className="cs-frame relative group">
                            {renderMedia(heroMedia, `${project.title} hero`, 'cs-main-image cs-main-image--landing')}
                            {isAdminPreview && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => triggerUpload('mainImage')}
                                        disabled={!!uploading}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 ${
                                            isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black'
                                        }`}
                                    >
                                        {uploading === 'mainImage' ? 'Syncing...' : 'Change Hero'}
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            await deleteUploadedFile(heroMedia);
                                            onUpdateField('mainImage', '');
                                        }}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        Remove Hero
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
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="text-sm font-medium">{uploading === 'mainImage' ? 'Uploading...' : 'Hero Image Placeholder'}</p>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => triggerUpload('mainImage')}
                                    disabled={!!uploading}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 ${
                                        isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black'
                                    }`}
                                >
                                    {uploading === 'mainImage' ? 'Syncing...' : 'Add Hero'}
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <div className="cs-media-grid mt-6">
                        {galleryMedia.map((source, index) => (
                            <div className="cs-media-item relative group/media" key={`${source}-${index}`}>
                                {renderMedia(source, `${project.title} media ${index + 2}`, 'cs-media-thumb')}
                                {isAdminPreview && (
                                    <button 
                                        onClick={async () => {
                                            await deleteUploadedFile(source);
                                            const next = galleryMedia.filter((_, i) => i !== index);
                                            onUpdateField('galleryImages', next);
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
                </section>

                <section className="cs-shell cs-details cs-animate">
                    <div className="cs-details-grid">
                        {/* Main Content (About) */}
                        <div className="cs-details-main">
                            <article className="cs-detail-col">
                                <p className="cs-overline">About</p>
                                <div className="cs-detail-body">
                                    <EditableText 
                                        value={project.about || project.shortDescription} 
                                        onSave={(val) => onUpdateField('about', val)} 
                                        multiline={true}
                                    />
                                </div>
                            </article>
                        </div>

                        {/* Sticky Sidebar (Site Details & Credits) */}
                        <aside className="cs-details-side">
                            <article className="cs-detail-col">
                                <p className="cs-overline">Site Details</p>
                                <div className="cs-detail-table">
                                    <div className="cs-detail-row">
                                        <span>Visit</span>
                                        {isAdminPreview ? (
                                            <div className="flex flex-col gap-1 w-full">
                                                <EditableText 
                                                    value={project.livePreviewLink || "https://"} 
                                                    onSave={(val) => onUpdateField('livePreviewLink', val)}
                                                    className="text-[#c8ff3e] text-xs underline"
                                                />
                                                <span className="text-[9px] text-white/30 uppercase tracking-tighter">(Edit URL Above)</span>
                                            </div>
                                        ) : (
                                            project.livePreviewLink ? (
                                                <a href={project.livePreviewLink} target="_blank" rel="noopener noreferrer">Live Site ↗</a>
                                            ) : (
                                                <span>N/A</span>
                                            )
                                        )}
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Platform</span>
                                        <span>{project.projectType}</span>
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Year</span>
                                        <span>
                                            <EditableText 
                                                value={project.dateCreated ? new Date(project.dateCreated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : formattedDate} 
                                                onSave={(val) => onUpdateField('dateCreated', val)} 
                                            />
                                        </span>
                                    </div>
                                </div>
                            </article>

                            <article className="cs-detail-col">
                                <p className="cs-overline">Credits</p>
                                <div className="cs-detail-table">
                                    <div className="cs-detail-row">
                                        <span>Design</span>
                                        <span><EditableText value={project.credits?.design || 'Domince'} onSave={(val) => onUpdateField('credits.design', val)} /></span>
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Code</span>
                                        <span><EditableText value={project.credits?.code || 'Domince'} onSave={(val) => onUpdateField('credits.code', val)} /></span>
                                    </div>
                                </div>
                            </article>
                        </aside>
                    </div>
                </section>

                <section className="cs-shell cs-landing-tools cs-animate">
                    <p className="cs-overline">Tech Stack</p>
                    <div className="cs-chip-wrap">
                        {(project.stacks || []).map((stack, idx) => (
                            <div key={stack} className="relative group/chip">
                                <span className="cs-chip">{stack}</span>
                                {isAdminPreview && (
                                    <button 
                                        onClick={() => {
                                            const next = project.stacks.filter((_, i) => i !== idx);
                                            onUpdateField('stacks', next);
                                        }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/chip:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        {isAdminPreview && (
                            isAddingStack ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        autoFocus
                                        type="text"
                                        value={stackInputValue}
                                        onChange={(e) => setStackInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && stackInputValue.trim()) {
                                                onUpdateField('stacks', [...(project.stacks || []), stackInputValue.trim()]);
                                                setStackInputValue('');
                                                setIsAddingStack(false);
                                            }
                                            if (e.key === 'Escape') {
                                                setIsAddingStack(false);
                                                setStackInputValue('');
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!stackInputValue.trim()) setIsAddingStack(false);
                                        }}
                                        className={`cs-chip outline-none min-w-[120px] border ${
                                            isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-[#c8ff3e]/40'
                                        }`}
                                        placeholder="Type & Enter..."
                                    />
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsAddingStack(true)}
                                    className={`cs-chip border-dashed transition-all ${
                                        isLight 
                                            ? 'border-black/20 text-black/40 hover:border-black hover:text-black' 
                                            : 'border-[#c8ff3e]/40 text-[#c8ff3e]/60 hover:border-[#c8ff3e] hover:text-[#c8ff3e]'
                                    }`}
                                >
                                    + Add Tool
                                </button>
                            )
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-system-dynamic cs-animate">
                    <p className="cs-overline">System Design</p>
                    <div className="cs-system-dynamic-grid">
                        {(project.systemDesign || []).map((item, index) => (
                            <article key={index} className="cs-system-item group/sys">
                                <p className="cs-system-key flex justify-between">
                                    <EditableText 
                                        value={item.label} 
                                        onSave={(val) => {
                                            const next = [...project.systemDesign];
                                            next[index].label = val;
                                            onUpdateField('systemDesign', next);
                                        }}
                                    />
                                    {isAdminPreview && (
                                        <button 
                                            onClick={() => {
                                                const next = project.systemDesign.filter((_, i) => i !== index);
                                                onUpdateField('systemDesign', next);
                                            }}
                                            className="opacity-0 group-hover/sys:opacity-100 text-red-500 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    )}
                                </p>
                                <p className="cs-system-value pt-1">
                                    <EditableText 
                                        value={item.value} 
                                        onSave={(val) => {
                                            const next = [...project.systemDesign];
                                            next[index].value = val;
                                            onUpdateField('systemDesign', next);
                                        }}
                                    />
                                </p>
                            </article>
                        ))}
                        {isAdminPreview && (
                            <button 
                                onClick={() => {
                                    const next = [...(project.systemDesign || []), { label: "New Field", value: "Value" }];
                                    onUpdateField('systemDesign', next);
                                }}
                                className={`cs-system-item border-dashed flex items-center justify-center transition-all ${
                                    isLight 
                                        ? 'bg-black/5 border-black/10 text-black/40 hover:border-black hover:text-black' 
                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/40 hover:text-white/80'
                                }`}
                            >
                                + Add Design Token
                            </button>
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-assets-list cs-animate">
                    <p className="cs-overline">Downloadable Assets</p>
                    <div className="cs-assets-list-wrap">
                        {Object.entries(project.assets || {}).map(([groupName, files]) => (
                            <article key={groupName} className="cs-asset-folder group/folder">
                                <div className="cs-asset-folder__head">
                                    <div className="cs-asset-meta">
                                        <FiFolder size={16} />
                                        <EditableText 
                                            value={groupName} 
                                            onSave={(val) => {
                                                const next = { ...project.assets };
                                                next[val] = next[groupName];
                                                delete next[groupName];
                                                onUpdateField('assets', next);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="cs-asset-count">{files.length} files</span>
                                        {isAdminPreview && (
                                            <div className="flex items-center gap-2 opacity-0 group-hover/folder:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => triggerUpload(`asset:${groupName}`)}
                                                    className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                                                        isLight 
                                                            ? 'bg-black text-white hover:bg-black/80' 
                                                            : 'bg-[#c8ff3e] text-black hover:bg-[#b8ef2e]'
                                                    }`}
                                                >
                                                    Upload File
                                                </button>
                                                <button 
                                                    onClick={async () => {
                                                        // Physically delete all files in this group
                                                        const groupFiles = project.assets[groupName] || [];
                                                        for (const url of groupFiles) {
                                                            await deleteUploadedFile(url);
                                                        }
                                                        const next = { ...project.assets };
                                                        delete next[groupName];
                                                        onUpdateField('assets', next);
                                                    }}
                                                    className="text-[10px] text-red-400"
                                                >
                                                    Delete Folder
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="cs-asset-folder__list">
                                    {files.map((source, index) => (
                                        <div key={index} className="cs-asset-file-row group/file">
                                            <span className="cs-asset-file-name truncate max-w-[70%]">{source.split('/').pop()}</span>
                                            <div className="flex items-center gap-3">
                                                <a href={source} download className="cs-asset-download">Download</a>
                                                {isAdminPreview && (
                                                    <button 
                                                        onClick={async () => {
                                                            await deleteUploadedFile(source);
                                                            const next = { ...project.assets };
                                                            next[groupName] = files.filter((_, i) => i !== index);
                                                            onUpdateField('assets', next);
                                                        }}
                                                        className="text-red-500 opacity-0 group-hover/file:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {files.length === 0 && (
                                        <div className={`p-6 text-center text-sm italic ${isLight ? 'text-black/40' : 'text-white/30'}`}>
                                            Folder is empty
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                        
                        {isAdminPreview && (
                            <button 
                                onClick={() => {
                                    // Automatically create folder to avoid confusing browser prompts
                                    onUpdateField('assets', { ...project.assets, ["New Assets"]: [] });
                                }}
                                className={`p-4 border border-dashed rounded-xl transition-all text-xs ${
                                    isLight 
                                        ? 'bg-black/5 border-black/10 text-black/40 hover:border-black hover:text-black' 
                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/40 hover:text-white/80'
                                }`}
                            >
                                + Create New Asset Folder
                            </button>
                        )}

                        {(!project.assets || Object.keys(project.assets).length === 0) && !isAdminPreview && (
                            <div className={`p-10 rounded-2xl text-center italic text-base ${
                                isLight ? 'border border-black/10 bg-black/5 text-black/40' : 'border border-white/10 bg-white/2 text-white/30'
                            }`}>
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
                            <p className="cs-score-value">
                                <EditableText 
                                    value={String(analytics.visits)} 
                                    onSave={(val) => onUpdateField('analytics.visits', parseInt(val) || 0)} 
                                />
                            </p>
                        </article>
                        <article className="cs-analytics-card">
                            <p className="cs-score-label">Rating</p>
                            <p className="cs-score-value">
                                <EditableText 
                                    value={String(analytics.rating)} 
                                    onSave={(val) => onUpdateField('analytics.rating', parseFloat(val) || 0)} 
                                />
                                <span className="text-sm opacity-30"> / 10</span>
                            </p>
                        </article>
                    </div>
                </section>

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

export default LandingPageTemplate;
