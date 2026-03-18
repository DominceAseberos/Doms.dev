import React from 'react';
import { FiFolder } from 'react-icons/fi';
import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';
import useThemeStore from '../../../store/useThemeStore';

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
    onAddField = null,
    onUpdateField = null,
    onSave = null,
    saveStatus = null,  // null | 'saving' | 'saved' | 'error'
}) => {
    const { theme } = useThemeStore();
    const isLight = theme === 'light';

    const fileInputRef = React.useRef(null);
    const assetInputRef = React.useRef(null);
    const [uploading, setUploading] = React.useState(null); // 'mainImage' | 'galleryImage' | 'asset:[group]'
    
    // Helper for in-place text editing
    const EditableText = ({ value, onSave, className = "", multiline = false, placeholder = "Click to edit..." }) => {
        if (!isAdminPreview) return <span className={className}>{value || placeholder}</span>;
        
        return (
            <span 
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                    const nextValue = e.target.innerText.trim();
                    if (nextValue !== value) onSave(nextValue);
                }}
                className={`${className} cursor-text ${isLight ? 'hover:bg-black/5 focus:bg-black/10' : 'hover:bg-white/5 focus:bg-white/10'} px-1 -mx-1 rounded transition-colors outline-none min-w-[20px] inline-block`}
                data-placeholder={placeholder}
            >
                {value}
            </span>
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
                    const currentAssets = { ...project.assets };
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
            <ParticleBackground />
            <NavBar />

            {/* Hidden File Inputs for Admin Uploads */}
            {isAdminPreview && (
                <>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <input type="file" ref={assetInputRef} className="hidden" onChange={handleFileUpload} />
                </>
            )}

            <main className="cs-page relative z-10" ref={rootRef}>
                {topQuickNav}

                <section className="cs-shell cs-landing-top cs-animate text-center">
                    <p className="cs-overline">{project.projectType || 'Landing Page'}</p>
                    <h1 className="cs-title cs-title--center">
                        {project.title}
                    </h1>
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
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => triggerUpload('mainImage')}
                                    disabled={!!uploading}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 ${
                                        isLight ? 'bg-black text-white' : 'bg-[#c8ff3e] text-black'
                                    }`}
                                >
                                    {uploading === 'mainImage' ? 'Syncing...' : (heroMedia ? 'Change Hero' : 'Add Hero')}
                                </button>
                                {heroMedia && (
                                    <button 
                                        onClick={async () => {
                                            await deleteUploadedFile(heroMedia);
                                            onUpdateField('mainImage', '');
                                        }}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        Remove Hero
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

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
                                        ? 'bg-black/5 border-black/10 text-black/20 hover:border-[#86af26] hover:text-[#86af26]' 
                                        : 'bg-white/5 border-white/20 text-white/20 hover:border-[#c8ff3e] hover:text-[#c8ff3e]'
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
                        <article className="cs-detail-col">
                            <p className="cs-overline">About</p>
                            <div className="cs-detail-body">
                                <EditableText 
                                    value={project.shortDescription} 
                                    onSave={(val) => onUpdateField('shortDescription', val)} 
                                />
                            </div>
                        </article>

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
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        </article>

                        <article className="cs-detail-col">
                            <p className="cs-overline">Credits</p>
                            <div className="cs-detail-table">
                                <div className="cs-detail-row">
                                    <span>Design</span>
                                    <span><EditableText value={project.credits?.design} onSave={(val) => onUpdateField('credits.design', val)} /></span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Code</span>
                                    <span><EditableText value={project.credits?.code} onSave={(val) => onUpdateField('credits.code', val)} /></span>
                                </div>
                            </div>
                        </article>
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
                            <button 
                                onClick={() => {
                                    const val = prompt("Enter new stack (e.g. React):");
                                    if (val) onUpdateField('stacks', [...(project.stacks || []), val]);
                                }}
                                className={`cs-chip border-dashed transition-all ${
                                    isLight 
                                        ? 'border-black/20 text-black/40 hover:border-black hover:text-black' 
                                        : 'border-[#c8ff3e]/40 text-[#c8ff3e]/60 hover:border-[#c8ff3e] hover:text-[#c8ff3e]'
                                }`}
                            >
                                + Add Tool
                            </button>
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
                                        ? 'bg-black/5 border-black/10 text-black/30 hover:border-black hover:text-black' 
                                        : 'bg-white/5 border-white/10 text-white/20 hover:border-[#c8ff3e] hover:text-[#c8ff3e]'
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
                                        <div className={`p-4 text-center text-[10px] italic ${isLight ? 'text-black/20' : 'text-white/10'}`}>Folder is empty</div>
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
                                        : 'border-white/10 text-white/20 hover:border-[#c8ff3e] hover:text-[#c8ff3e]'
                                }`}
                            >
                                + Create New Asset Folder
                            </button>
                        )}

                        {(!project.assets || Object.keys(project.assets).length === 0) && !isAdminPreview && (
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
