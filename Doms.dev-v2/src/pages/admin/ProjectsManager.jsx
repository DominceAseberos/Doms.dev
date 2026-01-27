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

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentProject.id) {
                await projectService.updateProject(currentProject.id, currentProject);
            } else {
                await projectService.createProject(currentProject);
            }
            fetchProjects();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save project:', err);
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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-3 rounded-full flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-lg"
                        style={{ background: 'rgb(var(--contrast-rgb))', color: '#000' }}
                    >
                        <Plus size={14} /> New Project
                    </button>
                </div>

                <header className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        PROJECTS MANAGER
                    </h1>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-mono">
                        Manage your portfolio grid
                    </p>
                </header>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card-admin rounded-2xl border border-white/5 bg-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col"
                        >
                            <div className="aspect-video w-full bg-black/40 relative group">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-baseline">
                                    <span className="text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-white/70">
                                        {project.project_type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
                                            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono opacity-40">#{project.display_order}</span>
                                        </div>
                                        <p className="text-[10px] opacity-50 font-mono uppercase">{project.date_created}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {project.stacks?.slice(0, 2).map(s => (
                                            <div key={s} className="opacity-40"><IconWrapper name={s} /></div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs opacity-60 line-clamp-2 leading-relaxed">
                                    {project.short_description}
                                </p>
                                <div className="mt-auto pt-4 flex gap-2 border-t border-white/5">
                                    <button
                                        onClick={() => handleOpenModal(project)}
                                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-colors"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-8 space-y-8 animate-in fade-in zoom-in duration-300"
                        style={{ background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))` }}
                    >
                        <header className="flex justify-between items-baseline border-b border-white/5 pb-4">
                            <h2 className="text-2xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                                {currentProject?.id ? 'EDIT PROJECT' : 'NEW PROJECT'}
                            </h2>
                            <button onClick={handleCloseModal} className="opacity-40 hover:opacity-100 transition-opacity">
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Project Title</label>
                                    <input
                                        type="text"
                                        value={currentProject.title}
                                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                        placeholder="Awesome Project"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Project Type</label>
                                    <select
                                        value={currentProject.project_type}
                                        onChange={(e) => setCurrentProject({ ...currentProject, project_type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                    >
                                        <option value="Real Project">Real Project</option>
                                        <option value="Experiment">Experiment</option>
                                        <option value="Concept">Concept</option>
                                        <option value="Open Source">Open Source</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Short Description</label>
                                <textarea
                                    value={currentProject.short_description}
                                    onChange={(e) => setCurrentProject({ ...currentProject, short_description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none"
                                    placeholder="A brief overview of the project..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Project Image (Upload or URL)</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={currentProject.image_url}
                                                onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                                placeholder="https://..."
                                            />
                                            <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                        </div>
                                        <label className="flex items-center justify-center p-3 h-full aspect-square bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50">
                                            <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                            {uploading ? <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" /> : <Upload size={18} className="opacity-60" />}
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Creation Year</label>
                                    <input
                                        type="text"
                                        value={currentProject.date_created}
                                        onChange={(e) => setCurrentProject({ ...currentProject, date_created: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Display Order</label>
                                    <input
                                        type="number"
                                        value={currentProject.display_order || 0}
                                        onChange={(e) => setCurrentProject({ ...currentProject, display_order: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Tech Stack (Select multiple)</label>
                                <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-xl max-h-40 overflow-y-auto no-scrollbar">
                                    {availableStacks.map(stack => (
                                        <button
                                            key={stack}
                                            type="button"
                                            onClick={() => toggleStack(stack)}
                                            className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider border transition-all flex items-center gap-2 ${currentProject.stacks?.includes(stack)
                                                ? 'bg-white/20 border-white/40 text-white'
                                                : 'bg-white/5 border-white/5 text-white/40 opacity-40 hover:opacity-100'
                                                }`}
                                        >
                                            <IconWrapper name={stack} />
                                            {stack}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Live Link</label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={currentProject.live_preview_link}
                                            onChange={(e) => setCurrentProject({ ...currentProject, live_preview_link: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                            placeholder="https://..."
                                        />
                                        <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Documentation Link</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={currentProject.full_documentation}
                                            onChange={(e) => setCurrentProject({ ...currentProject, full_documentation: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30"
                                            placeholder="/project/..."
                                        />
                                        <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 disabled:opacity-50"
                                style={{ background: 'rgb(var(--contrast-rgb))', color: '#000' }}
                            >
                                <Save size={16} />
                                {isSaving ? 'Synchronizing...' : 'Save Project Instance'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
