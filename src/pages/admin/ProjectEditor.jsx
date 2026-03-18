import React, { useState } from 'react';
import portfolioDataDefault from '../../data/portfolioData.json';

const STORAGE_KEY = 'portfolioData';

const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : portfolioDataDefault;
};

const emptyNewProject = {
    title: '',
    shortDescription: '',
    images: [],
    projectType: '',
    mainImage: '',
    galleryImages: [],
    assets: { desktop: null, tablet: null, mobile: null },
};

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
const ProjectCard = ({ project, realIndex, onUpdate, onAddImage, onRemoveImage, onRemove }) => {
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
        });
    }, [project.title, project.shortDescription, project.projectType, project.images]);

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
        JSON.stringify(draft.images) !== JSON.stringify(project.images || []);

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
                    <input
                        type="text"
                        value={draft.projectType}
                        className={inputCls}
                        onChange={(e) => setDraft((d) => ({ ...d, projectType: e.target.value }))}
                    />
                </Field>
                <Field label={`Images (${draft.images?.length ?? 0})`}>
                    <ImageStrip images={draft.images} onRemove={(i) => setDraft(d => ({ ...d, images: d.images.filter((_, idx) => idx !== i) }))} />
                    <ImageAdder inputId={`img-${project.id}`} onAdd={(url) => setDraft(d => ({ ...d, images: [...d.images, url] }))} />
                </Field>

                {/* Action row */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleUpdate}
                        disabled={!hasChanges}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200
                            ${hasChanges
                                ? 'border-white/40 text-white hover:border-white hover:text-white bg-white/5'
                                : 'border-white/10 text-gray-600 cursor-not-allowed bg-transparent'
                            }`}
                    >
                        {hasChanges && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />}
                        Update
                    </button>
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
    const [toast, setToast] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newProject, setNewProject] = useState(emptyNewProject);
    const [activeCategory, setActiveCategory] = useState('all');
    const [globalSaved, setGlobalSaved] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    const saveData = async (nd) => {
        setData(nd);
        setGlobalSaved(true);
        setTimeout(() => setGlobalSaved(false), 1200);

        // Try writing to disk via the Vite dev plugin (dev only)
        try {
            const res = await fetch('/__write-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nd),
            });
            if (!res.ok) throw new Error('write failed');
        } catch {
            // Fallback to localStorage (production or plugin unavailable)
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nd)); }
            catch { showToast('Failed to save!'); }
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
        setNewProject(emptyNewProject);
        showToast('Project added!');
    };

    const categories = Array.from(new Set(data.projects.map((p) => p.projectType || 'uncategorized')));
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

                <button
                    onClick={() => setShowNewForm((v) => !v)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#c8ff3e] text-black text-sm font-bold rounded-lg hover:bg-white transition-colors shrink-0"
                >
                    <span className="text-base leading-none">{showNewForm ? '×' : '+'}</span>
                    {showNewForm ? 'Cancel' : 'Add Project'}
                </button>
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
                                <input type="text" value={newProject.projectType} className={inputCls} placeholder="e.g. app, landing page"
                                    onChange={(e) => setNewProject((p) => ({ ...p, projectType: e.target.value }))} />
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
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button onClick={handleSaveNewProject} className="px-4 py-2 bg-[#c8ff3e] text-black text-sm font-bold rounded-lg hover:bg-white transition-colors">Save Project</button>
                            <button onClick={() => { setShowNewForm(false); setNewProject(emptyNewProject); }} className="px-4 py-2 bg-[#252525] text-gray-400 text-sm rounded-lg hover:bg-[#333] transition-colors">Discard</button>
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
