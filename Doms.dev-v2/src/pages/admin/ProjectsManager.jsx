import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { projectService } from '../../services/projectService';
import { getAvailableIconNames, getIconByName } from '../../utils/IconRegistry';
import { Plus, Edit2, Trash2, ArrowLeft, ExternalLink, BookOpen, X, Save, Image as ImageIcon, Upload } from 'lucide-react';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Tech Stack available options
    const availableStacks = getAvailableIconNames().filter(name =>
        !['Github', 'Linkedin', 'Mail', 'ExternalLink', 'MessageCircle', 'Facebook', 'Youtube'].includes(name)
    );

    const navigate = useNavigate();
    const gridRef = useRef(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".project-card-admin",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading, projects]);

    const handleOpenModal = (project = null) => {
        setCurrentProject(project || {
            title: '',
            short_description: '',
            image_url: '',
            live_preview_link: '',
            github_link: '',
            full_documentation: '',
            stacks: [],
            documentation_files: [],
            project_type: 'Real Project',
            date_created: new Date().getFullYear().toString()
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProject(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `proj_${Date.now()}`;
            const publicUrl = await projectService.uploadProjectImage(file, fileName);
            setCurrentProject({ ...currentProject, image_url: publicUrl });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please check your storage bucket permissions.');
        } finally {
            setUploading(false);
        }
    };

    const toggleStack = (stack) => {
        const stacks = currentProject.stacks || [];
        if (stacks.includes(stack)) {
            setCurrentProject({ ...currentProject, stacks: stacks.filter(s => s !== stack) });
        } else {
            setCurrentProject({ ...currentProject, stacks: [...stacks, stack] });
        }
    };

    const addDocFile = () => {
        const docs = currentProject.documentation_files || [];
        setCurrentProject({
            ...currentProject,
            documentation_files: [...docs, { label: '', path: '', type: 'link' }]
        });
    };

    const updateDocFile = (index, field, value) => {
        const docs = [...(currentProject.documentation_files || [])];
        docs[index] = { ...docs[index], [field]: value };
        setCurrentProject({ ...currentProject, documentation_files: docs });
    };

    const removeDocFile = (index) => {
        const docs = [...(currentProject.documentation_files || [])];
        docs.splice(index, 1);
        setCurrentProject({ ...currentProject, documentation_files: docs });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Clean up empty documentation files before saving
            const cleanedDocs = (currentProject.documentation_files || []).filter(d => d.label.trim() && d.path.trim());
            const projectToSave = { ...currentProject, documentation_files: cleanedDocs.length > 0 ? cleanedDocs : null };

            if (currentProject.id) {
                await projectService.updateProject(currentProject.id, projectToSave);
            } else {
                await projectService.createProject(projectToSave);
            }
            fetchProjects();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save project:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            try {
                await projectService.deleteProject(id);
                fetchProjects();
            } catch (err) {
                console.error('Failed to delete project:', err);
            }
        }
    };

    const IconWrapper = ({ name }) => {
        const Icon = getIconByName(name);
        return <Icon size={12} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Admin
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-lg hover:brightness-110"
                        style={{ background: 'rgb(var(--contrast-rgb))', color: '#000' }}
                    >
                        <Plus size={14} /> New Project
                    </button>
                </div>

                <header className="space-y-2 border-l-4 border-[rgb(var(--contrast-rgb))] pl-6">
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        PROJECTS<br />MANAGER
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-mono">
                        System Configuration / Portfolio Grid
                    </p>
                </header>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card-admin rounded-2xl border border-white/5 bg-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col shadow-2xl"
                            style={{
                                background: `linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`
                            }}
                        >
                            <div className="aspect-video w-full bg-black/40 relative group overflow-hidden">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-baseline">
                                    <span className="text-[9px] uppercase font-black tracking-widest px-2.5 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-white">
                                        {project.project_type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-xl font-bold tracking-tight text-white/90">{project.title}</h3>
                                        <span className="text-[10px] font-mono opacity-20">#{project.display_order}</span>
                                    </div>
                                    <p className="text-[10px] opacity-40 font-mono uppercase tracking-wider">{project.date_created}</p>
                                </div>

                                <p className="text-xs opacity-50 line-clamp-2 leading-relaxed font-inter">
                                    {project.short_description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 opacity-60">
                                    {project.stacks?.slice(0, 4).map(s => (
                                        <div key={s} className="w-6 h-6 rounded bg-white/5 flex items-center justify-center border border-white/5 hover:border-white/20 transition-colors" title={s}>
                                            <IconWrapper name={s} />
                                        </div>
                                    ))}
                                    {project.stacks?.length > 4 && <span className="text-[8px] self-end opacity-40">+{project.stacks.length - 4}</span>}
                                </div>

                                <div className="mt-auto pt-5 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(project)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-[0.15em] transition-all active:scale-95"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Project Ghost Card */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4 py-12 hover:bg-white/[0.04] hover:border-white/10 transition-all group lg:min-h-[400px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-20 group-hover:opacity-60 transition-opacity">Deploy New Instance</span>
                    </button>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={handleCloseModal} />
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-8 space-y-10 animate-in fade-in zoom-in duration-300 no-scrollbar"
                        style={{ background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb), 0.8), rgba(var(--box-Linear-2-rgb), 0.9))` }}
                    >
                        <header className="flex justify-between items-center border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                                    {currentProject?.id ? 'EDIT INSTANCE' : 'NEW DEPLOYMENT'}
                                </h2>
                                <p className="text-[9px] uppercase tracking-widest opacity-40">Configuration Node: {currentProject?.id || 'Pending'}</p>
                            </div>
                            <button onClick={handleCloseModal} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="space-y-8">
                            {/* BASIC INFO */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Core Identity</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Project Title</label>
                                        <input
                                            type="text"
                                            value={currentProject.title}
                                            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors"
                                            placeholder="System Designation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Project Classification</label>
                                        <select
                                            value={currentProject.project_type}
                                            onChange={(e) => setCurrentProject({ ...currentProject, project_type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors appearance-none"
                                        >
                                            <option value="Real Project">Real Project</option>
                                            <option value="Experiment">Experiment</option>
                                            <option value="Concept">Concept</option>
                                            <option value="Open Source">Open Source</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Data Overview</label>
                                    <textarea
                                        value={currentProject.short_description}
                                        onChange={(e) => setCurrentProject({ ...currentProject, short_description: e.target.value })}
                                        rows={2}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors resize-none"
                                        placeholder="System summary..."
                                        required
                                    />
                                </div>
                            </section>

                            {/* MEDIA & ASSETS */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Visual Assets</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Primary Image</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={currentProject.image_url}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors"
                                                    placeholder="Asset URL"
                                                />
                                                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                            </div>
                                            <label className="flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 active:scale-95 group">
                                                <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                                {uploading ? <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin" /> : <Upload size={20} className="opacity-40 group-hover:opacity-100" />}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Timeline</label>
                                            <input
                                                type="text"
                                                value={currentProject.date_created}
                                                onChange={(e) => setCurrentProject({ ...currentProject, date_created: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors text-center font-mono"
                                                placeholder="YYYY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Priority</label>
                                            <input
                                                type="number"
                                                value={currentProject.display_order || 0}
                                                onChange={(e) => setCurrentProject({ ...currentProject, display_order: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors text-center font-mono"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* TECH STACK */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Stack Configuration</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl max-h-48 overflow-y-auto no-scrollbar">
                                    {availableStacks.map(stack => (
                                        <button
                                            key={stack}
                                            type="button"
                                            onClick={() => toggleStack(stack)}
                                            className={`px-4 py-2 rounded-full text-[9px] uppercase font-black tracking-widest border transition-all flex items-center gap-2 active:scale-95 ${currentProject.stacks?.includes(stack)
                                                ? 'bg-white/10 border-white/20 text-white shadow-lg'
                                                : 'bg-transparent border-white/5 text-white/20 hover:border-white/20 hover:text-white/40'
                                                }`}
                                        >
                                            <IconWrapper name={stack} />
                                            {stack}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* CONNECTIVITY */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Node Connectivity</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Live Endpoint</label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                value={currentProject.live_preview_link}
                                                onChange={(e) => setCurrentProject({ ...currentProject, live_preview_link: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors"
                                                placeholder="https://preview"
                                            />
                                            <ExternalLink size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Source Repository</label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                value={currentProject.github_link}
                                                onChange={(e) => setCurrentProject({ ...currentProject, github_link: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors"
                                                placeholder="https://github"
                                            />
                                            <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Internal Documentation Path</label>
                                    <input
                                        type="text"
                                        value={currentProject.full_documentation}
                                        onChange={(e) => setCurrentProject({ ...currentProject, full_documentation: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[rgb(var(--contrast-rgb))] transition-colors"
                                        placeholder="/project/internal-id"
                                    />
                                </div>
                            </section>

                            {/* DYNAMIC DOCUMENTATION FILES */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="h-px flex-1 bg-white/5"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Resource Bundles</span>
                                    <div className="h-px flex-1 bg-white/5"></div>
                                </div>

                                <div className="space-y-4">
                                    {(currentProject.documentation_files || []).map((file, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-3 p-5 bg-white/[0.03] border border-white/5 rounded-2xl animate-in slide-in-from-right-2 duration-300">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[8px] uppercase font-bold tracking-widest opacity-30 ml-1">Resource Label</label>
                                                <input
                                                    type="text"
                                                    value={file.label}
                                                    onChange={(e) => updateDocFile(idx, 'label', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                                                    placeholder="e.g. Technical Manual"
                                                />
                                            </div>
                                            <div className="flex-[2] space-y-2">
                                                <label className="text-[8px] uppercase font-bold tracking-widest opacity-30 ml-1">Endpoint Path</label>
                                                <input
                                                    type="text"
                                                    value={file.path}
                                                    onChange={(e) => updateDocFile(idx, 'path', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30 font-mono"
                                                    placeholder="URL or Local Path"
                                                />
                                            </div>
                                            <div className="flex-shrink-0 space-y-2">
                                                <label className="text-[8px] uppercase font-bold tracking-widest opacity-30 ml-1">Type</label>
                                                <select
                                                    value={file.type}
                                                    onChange={(e) => updateDocFile(idx, 'type', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                                                >
                                                    <option value="link">Link</option>
                                                    <option value="file">File</option>
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDocFile(idx)}
                                                className="mt-5 md:mt-6 p-2 h-10 w-10 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center border border-red-500/10"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addDocFile}
                                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 hover:bg-white/[0.02] transition-all"
                                    >
                                        <Plus size={14} /> Attach Resource Bundle
                                    </button>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.4em] text-xs transition-all active:scale-95 disabled:opacity-50 shadow-2xl hover:brightness-110 active:brightness-90"
                                style={{ background: 'rgb(var(--contrast-rgb))', color: '#000' }}
                            >
                                <Save size={18} />
                                {isSaving ? 'Processing Protocol...' : 'Sync Instance to Cloud'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
