import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import portfolioDataDefault from '../../data/portfolioData.json';

const STORAGE_KEY = 'portfolioData';

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return portfolioDataDefault;
    
    const parsed = JSON.parse(stored);
    
    // THE FIX: If projects were deleted from the JSON file manually, 
    // we should respect that deletion instead of showing stale localStorage projects.
    const fileProjectIds = new Set(portfolioDataDefault.projects.map(p => p.id));
    const mergedProjects = portfolioDataDefault.projects.map(fp => {
        const lp = parsed.projects?.find(p => p.id === fp.id);
        return lp || fp; // Prefer local edits if ID matches, else use file version
    });

    return {
        categories: parsed.categories || portfolioDataDefault.categories || [],
        projects: mergedProjects
    };
};

const PROJECT_TEMPLATES = {
    'Landing Page': {
        projectType: 'Landing Page',
        images: [],
        mainImage: '',
        galleryImages: [],
        assets: { desktop: '', tablet: '', mobile: '' },
        stacks: ['React', 'Tailwind CSS', 'GSAP'],
    },
    'Default': {
        projectType: '',
        images: [],
        stacks: [],
    }
};

const emptyNewProject = PROJECT_TEMPLATES.Default;

const inputCls = 'w-full px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none';

const Field = ({ label, children }) => (
    <div className="mb-3">
        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</label>
        {children}
    </div>
);

const ImageStrip = ({ images = [], onRemove }) =>
    images.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-2">
            {images.map((img, idx) => (
                <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-14 h-14 object-cover rounded-lg border border-white/10" />
                    <button
                        onClick={() => onRemove(idx)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >×</button>
                </div>
            ))}
        </div>
    ) : null;

const ImageAdder = ({ inputId, onAdd }) => (
    <div className="flex gap-2">
        <input
            type="text"
            placeholder="Image URL…"
            id={inputId}
            className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-[#111] border border-white/10 rounded-lg focus:border-[#c8ff3e] outline-none placeholder-gray-700"
        />
        <button
            onClick={() => {
                const el = document.getElementById(inputId);
                if (el?.value.trim()) { onAdd(el.value.trim()); el.value = ''; }
            }}
            className="shrink-0 px-3 py-1.5 text-xs bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors"
        >Add</button>
    </div>
);

// ── Project card — always fully expanded ─────────────────────────────────────
const ProjectCard = ({ project, categories, realIndex, onUpdate, onAddImage, onRemoveImage, onRemove }) => {
    const [saved, setSaved] = useState(false);
    const descRef = React.useRef(null);

    // Local draft — now includes images
    const [draft, setDraft] = useState({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        projectType: project.projectType || '',
        images: [...(project.images || [])],
    });

    // Sync draft if project prop changes externally (e.g. after save)
    React.useEffect(() => {
        setDraft({
            title: project.title || '',
            shortDescription: project.shortDescription || '',
            projectType: project.projectType || '',
            images: [...(project.images || [])],
            mainImage: project.mainImage || '',
            galleryImages: [...(project.galleryImages || [])],
            assets: { ...(project.assets || {}) },
            stacks: [...(project.stacks || [])],
        });
    }, [project]);

    // Auto-size description textarea
    React.useEffect(() => {
        if (descRef.current) {
            descRef.current.style.height = 'auto';
            descRef.current.style.height = descRef.current.scrollHeight + 'px';
        }
    }, [draft.shortDescription]);

    const hasChanges =
        draft.title !== (project.title || '') ||
        draft.shortDescription !== (project.shortDescription || '') ||
        draft.projectType !== (project.projectType || '') ||
        draft.mainImage !== (project.mainImage || '') ||
        JSON.stringify(draft.images) !== JSON.stringify(project.images || []) ||
        JSON.stringify(draft.galleryImages) !== JSON.stringify(project.galleryImages || []) ||
        JSON.stringify(draft.assets) !== JSON.stringify(project.assets || {}) ||
        JSON.stringify(draft.stacks) !== JSON.stringify(project.stacks || []);

    const handleUpdate = () => {
        onUpdate(realIndex, draft);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <div className={`bg-[#161616] rounded-xl border overflow-hidden transition-all duration-300 ${hasChanges ? 'border-[#c8ff3e]/40 ring-1 ring-[#c8ff3e]/10' : 'border-white/5'}`}>

            {/* Mini header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                {project.images?.[0] ? (
                    <img src={project.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0 border border-white/10" />
                ) : (
                    <div className="w-11 h-11 rounded-lg bg-[#222] shrink-0 flex items-center justify-center text-gray-600 text-lg">📁</div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{draft.title || 'Untitled'}</p>
                    <p className="text-[11px] text-gray-600 truncate">{draft.projectType || 'uncategorized'} · {draft.images?.length ?? 0} img</p>
                </div>
                {/* Unsaved changes indicator */}
                {hasChanges && (
                    <span className="flex items-center gap-1 text-[10px] text-[#c8ff3e] font-medium shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff3e] animate-pulse inline-block" />
                        unsaved
                    </span>
                )}
                {saved && !hasChanges && (
                    <span className="text-[10px] text-green-400 font-medium shrink-0">✓ saved</span>
                )}
            </div>

            {/* Fields */}
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
                <Field label="Title">
                    <input
                        type="text"
                        value={draft.title}
                        className={inputCls}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    />
                </Field>
                <Field label="Description">
                    <textarea
                        ref={descRef}
                        value={draft.shortDescription}
                        rows={1}
                        className={inputCls + ' resize-none overflow-hidden'}
                        onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        onChange={(e) => setDraft((d) => ({ ...d, shortDescription: e.target.value }))}
                    />
                </Field>
                <Field label="Category">
                    <select
                        value={draft.projectType}
                        className={inputCls}
                        onChange={(e) => setDraft((d) => ({ ...d, projectType: e.target.value }))}
                    >
                        <option value="">Select Category...</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </Field>
                {/* NOTE: Stacks, Assets, and Hero Images are now managed in the "Visual Editor" on the Project Details page. */}


                {/* Action row */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleUpdate}
                        disabled={!hasChanges}
                        className={`flex-[2] flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200
                            ${hasChanges
                                ? 'border-white/40 text-white hover:border-white hover:text-white bg-white/5'
                                : 'border-white/10 text-gray-600 cursor-not-allowed bg-transparent'
                            }`}
                    >
                        {hasChanges && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />}
                        Update
                    </button>
                    <Link
                        to={`/admin/projects/${project.id}`}
                        className="flex-1 flex items-center justify-center py-1.5 text-xs font-semibold rounded-lg border border-white/10 text-white/60 hover:border-white/40 hover:text-white transition-all"
                    >
                        View Details
                    </Link>
                    <button
                        onClick={() => onRemove(realIndex)}
                        className="px-3 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                    >Remove</button>
                </div>
            </div>
        </div>
    );
};


// ── Main editor ───────────────────────────────────────────────────────────────
const ProjectEditor = () => {
    const [data, setData] = useState(getStoredData);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newProject, setNewProject] = useState(emptyNewProject);
    const [activeCategory, setActiveCategory] = useState('all');
    const [globalSaved, setGlobalSaved] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    // UPDATED: Sync from disk on mount
    React.useEffect(() => {
        const syncFromDisk = async () => {
            try {
                const res = await fetch('/src/data/portfolioData.json');
                if (res.ok) {
                    const diskData = await res.json();
                    
                    // Logic: diskData is the "source of truth". 
                    // We only want to use localStorage if it has data that isn't on disk yet.
                    // For now, let's just use the merged getStoredData result as initial,
                    // but update it with diskData if it's available.
                    setData(prev => {
                        const stored = localStorage.getItem(STORAGE_KEY);
                        if (!stored) return diskData;
                        
                        const parsed = JSON.parse(stored);
                        // Merge logic: prefer disk for structure, but keep local project edits if they match IDs
                        const mergedProjects = diskData.projects.map(dp => {
                            const lp = parsed.projects?.find(p => p.id === dp.id);
                            return lp || dp;
                        });
                        return { ...diskData, projects: mergedProjects };
                    });
                }
            } catch (e) {
                console.error("Failed to fetch live portfolioData.json", e);
            } finally {
                setLoading(false);
            }
        };
        syncFromDisk();
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    const saveData = async (nd) => {
        setData(nd);
        setGlobalSaved(true);
        setTimeout(() => setGlobalSaved(false), 1200);

        // Always update localStorage to keep the draft/preview in sync
        try { 
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nd)); 
        } catch (e) {
            console.error("Failed to sync to localStorage", e);
        }

        // Try writing to disk via the Vite dev plugin (dev only)
        try {
            const res = await fetch('/__write-json?file=portfolioData.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nd),
            });
            if (!res.ok) throw new Error('write failed');
        } catch (e) {
            console.warn("Cloud/File write failed, but localStorage is updated.", e);
        }
    };

    const updateProject = (index, patch) => {
        const projects = [...data.projects];
        projects[index] = { ...projects[index], ...patch };
        saveData({ ...data, projects });
    };

    const handleAddImage = (index, url) => {
        const proj = data.projects[index];
        updateProject(index, { images: [...(proj.images || []), url] });
        showToast('Image added!');
    };

    const handleRemoveImage = (projIdx, imgIdx) => {
        updateProject(projIdx, { images: data.projects[projIdx].images.filter((_, i) => i !== imgIdx) });
    };

    const handleRemoveProject = (index) => {
        saveData({ ...data, projects: data.projects.filter((_, i) => i !== index) });
        showToast('Project removed');
    };

    const handleSaveNewProject = () => {
        if (!newProject.title.trim()) { showToast('Title is required'); return; }
        const project = { id: `project-${Date.now()}`, ...newProject };
        saveData({ ...data, projects: [...data.projects, project] });
        setShowNewForm(false);
        setNewProject(PROJECT_TEMPLATES.Default);
        showToast('Project added!');
    };

    const applyTemplate = (cat) => {
        const template = PROJECT_TEMPLATES[cat] || PROJECT_TEMPLATES.Default;
        setNewProject(prev => ({
            ...prev,
            ...template,
            title: prev.title, // keep title
            shortDescription: prev.shortDescription, // keep description
            projectType: cat
        }));
    };

    const handleAddCategory = () => {
        const name = newCatName.trim();
        if (!name) return;
        if (data.categories?.includes(name)) { showToast('Already exists'); return; }
        const nc = [...(data.categories || []), name];
        saveData({ ...data, categories: nc });
        setNewCatName('');
        showToast('Category added!');
    };

    const categories = data.categories || [];
    const visibleProjects =
        activeCategory === 'all'
            ? data.projects
            : data.projects.filter((p) => (p.projectType || 'uncategorized') === activeCategory);

    return (
        <div className="min-h-screen w-full bg-[#0e0e0e] text-white flex flex-col">
            {/* Toast */}
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-xl transition-all duration-300 ${toast ? 'opacity-100 translate-y-0 bg-green-600 text-white' : 'opacity-0 -translate-y-2 pointer-events-none bg-transparent'}`}>
                ✓ {toast}
            </div>

            {loading && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-[#c8ff3e] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-medium text-white/60 tracking-wider uppercase">Syncing with Disk...</p>
                    </div>
                </div>
            )}

            {/* Sticky header */}
            <header className="sticky top-0 z-40 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/5 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight">Project Editor</h1>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border transition-all duration-300 ${globalSaved ? 'border-[#c8ff3e] text-[#c8ff3e]' : 'border-white/10 text-gray-600'}`}>
                        {globalSaved ? '✓ saved' : `${data.projects.length} total`}
                    </span>
                </div>

                {/* Category pills */}
                <div className="hidden sm:flex gap-1.5 flex-wrap">
                    {['all', ...categories].map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeCategory === cat ? 'bg-[#c8ff3e] text-black border-[#c8ff3e] font-bold' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}`}>
                            {cat === 'all' ? `All (${data.projects.length})` : cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { if(confirm('Reset all changes and sync with portfolioData.json?')) { localStorage.removeItem(STORAGE_KEY); window.location.reload(); } }}
                        className="px-3 py-1.5 text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                    >Reset</button>

                    <div className="flex bg-[#161616] border border-white/10 rounded-lg p-0.5">
                        <input
                            type="text"
                            value={newCatName}
                            placeholder="New category..."
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            className="bg-transparent px-3 py-1.5 text-xs outline-none w-32 focus:w-48 transition-all"
                        />
                        <button
                            onClick={handleAddCategory}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-md text-xs font-bold transition-colors"
                        >Add</button>
                    </div>

                    <button
                        onClick={() => setShowNewForm((v) => !v)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#c8ff3e] text-black text-sm font-bold rounded-lg hover:bg-white transition-colors shrink-0"
                    >
                        <span className="text-base leading-none">{showNewForm ? '×' : '+'}</span>
                        {showNewForm ? 'Cancel' : 'Add Project'}
                    </button>
                </div>
            </header>

            {/* Mobile category pills */}
            <div className="sm:hidden flex gap-1.5 flex-wrap px-4 pt-3">
                {['all', ...categories].map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeCategory === cat ? 'bg-[#c8ff3e] text-black border-[#c8ff3e] font-bold' : 'border-white/10 text-gray-500'}`}>
                        {cat === 'all' ? `All (${data.projects.length})` : cat}
                    </button>
                ))}
            </div>

            <main className="flex-1 p-4 sm:p-6">
                {/* New project form */}
                {showNewForm && (
                    <div className="mb-5 p-5 bg-[#161616] rounded-xl border border-[#c8ff3e]/20">
                        <h2 className="text-xs font-bold text-[#c8ff3e] uppercase tracking-widest mb-4">New Project</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                            <Field label="Title">
                                <input type="text" value={newProject.title} className={inputCls} placeholder="Project name"
                                    onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} />
                            </Field>
                            <Field label="Category">
                                <select
                                    value={newProject.projectType}
                                    className={inputCls}
                                    onChange={(e) => applyTemplate(e.target.value)}
                                >
                                    <option value="">Select Category...</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Short Description">
                                    <textarea value={newProject.shortDescription} rows={1} className={inputCls + ' resize-none'}
                                        onChange={(e) => setNewProject((p) => ({ ...p, shortDescription: e.target.value }))} />
                                </Field>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-4">
                                <Field label="Images">
                                    <ImageStrip images={newProject.images} onRemove={(i) => setNewProject((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} />
                                    <ImageAdder inputId="new-proj-img" onAdd={(url) => setNewProject((p) => ({ ...p, images: [...p.images, url] }))} />
                                </Field>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-4">
                                <p className="text-[10px] text-gray-500 italic mt-2">
                                    Additional details (Tech Stack, Assets, Gallery) can be edited via "View Details" after creation.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleSaveNewProject} className="flex-1 bg-[#c8ff3e] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors uppercase tracking-widest text-xs">Create Project</button>
                            <button onClick={() => setShowNewForm(false)} className="px-6 py-2 bg-white/5 text-gray-400 font-bold rounded-lg hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Full-screen project grid */}
                {visibleProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                        <span className="text-5xl mb-3">📂</span>
                        <p>No projects yet. Click <strong className="text-gray-400">Add Project</strong> to start.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 auto-rows-min">
                        {visibleProjects.map((project) => {
                            const realIndex = data.projects.findIndex((p) => p.id === project.id);
                            return (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    categories={categories}
                                    realIndex={realIndex}
                                    onUpdate={updateProject}
                                    onAddImage={handleAddImage}
                                    onRemoveImage={handleRemoveImage}
                                    onRemove={handleRemoveProject}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProjectEditor;
