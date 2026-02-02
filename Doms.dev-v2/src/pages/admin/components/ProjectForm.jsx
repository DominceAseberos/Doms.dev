import React, { useState, useEffect } from 'react';
import {
    X, Upload, Image as ImageIcon, ExternalLink, BookOpen,
    Eye, EyeOff, Link as LinkIcon, FileText, Plus, Save, Trash2, Calendar, Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MediaPickerModal from '../../../components/MediaPickerModal';
import { projectService } from '../../../services/projectService';
import { getAvailableIconNames, getIconByName } from '../../../utils/IconRegistry';
import { useAdminStore } from '../../../store/adminStore';
import { compressImage } from '../../../utils/imageUtils';

const ProjectForm = ({ isOpen, onClose, onSave, project }) => {
    const [currentProject, setCurrentProject] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [mediaPickerMode, setMediaPickerMode] = useState('single');
    const { setAdminLoading } = useAdminStore();
    const [customStackInput, setCustomStackInput] = useState('');
    const dateInputRef = React.useRef(null);

    // Tech Stack
    const availableStacks = getAvailableIconNames().filter(name =>
        !['Github', 'Linkedin', 'Mail', 'ExternalLink', 'MessageCircle', 'Facebook', 'Youtube'].includes(name)
    );

    useEffect(() => {
        if (project) {
            setCurrentProject(project);
        }
    }, [project, isOpen]);

    if (!isOpen || !currentProject) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(currentProject);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAdminLoading(true, 'UPLOADING ASSET');
        try {
            let uploadFile = file;
            try {
                uploadFile = await compressImage(file);
            } catch (compErr) {
                console.warn('Compression failed, using original', compErr);
            }

            const fileName = `proj_${Date.now()}`;
            const publicUrl = await projectService.uploadProjectImage(uploadFile, fileName);
            setCurrentProject(prev => ({ ...prev, image_url: publicUrl }));
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please check your storage bucket permissions.');
        } finally {
            setAdminLoading(false);
        }
    };

    const openMediaPicker = (mode) => {
        setMediaPickerMode(mode);
        setIsMediaPickerOpen(true);
    };

    const handleMediaSelect = (data) => {
        if (mediaPickerMode === 'single') {
            setCurrentProject(prev => ({ ...prev, image_url: data }));
        } else {
            const currentImages = currentProject.images || [];
            const newImages = [...new Set([...currentImages, ...data])];
            setCurrentProject(prev => ({ ...prev, images: newImages }));
        }
    };

    const removeCarouselImage = (index) => {
        const newImages = [...(currentProject.images || [])];
        newImages.splice(index, 1);
        setCurrentProject({ ...currentProject, images: newImages });
    };

    const toggleStack = (stack) => {
        const stacks = currentProject.stacks || [];
        const exists = stacks.some(s => s.toLowerCase() === stack.toLowerCase());

        if (exists) {
            setCurrentProject({ ...currentProject, stacks: stacks.filter(s => s.toLowerCase() !== stack.toLowerCase()) });
        } else {
            setCurrentProject({ ...currentProject, stacks: [...stacks, stack] });
        }
    };

    const handleAddCustomStack = () => {
        if (!customStackInput.trim()) return;
        const stacks = currentProject.stacks || [];
        const newStack = customStackInput.trim();

        // Prevent duplicates (case-insensitive check)
        if (!stacks.some(s => s.toLowerCase() === newStack.toLowerCase())) {
            setCurrentProject({ ...currentProject, stacks: [...stacks, newStack] });
        }

        setCustomStackInput('');
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

    const IconWrapper = ({ name, className }) => {
        const Icon = getIconByName(name);
        return <Icon size={12} className={className || "text-primary opacity-80"} />;
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl border border-white/10 p-5 md:p-8 space-y-6 md:space-y-10 animate-in fade-in zoom-in duration-300 no-scrollbar admin-modal-gradient"
                >
                    <header className="flex justify-between items-center border-b border-white/5 pb-4 md:pb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-primary">
                                {currentProject?.id ? 'EDIT INSTANCE' : 'NEW DEPLOYMENT'}
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest opacity-40">Configuration Node: {currentProject?.id || 'Pending'}</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer active:scale-95">
                            <X size={20} />
                        </button>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 pb-6 md:pb-10">
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="System Designation"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Project Classification</label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={currentProject.project_type}
                                            onChange={(e) => setCurrentProject({ ...currentProject, project_type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="Type custom classification..."
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {['E-commerce/Platform', 'AI/Research', 'Productivity', 'Personal', 'AI/Utility', 'Open Source', 'Experiment', 'Concept'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setCurrentProject({ ...currentProject, project_type: type })}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-all ${currentProject.project_type === type
                                                        ? 'bg-blue-600 border-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Data Overview</label>
                                <textarea
                                    value={currentProject.short_description}
                                    onChange={(e) => setCurrentProject({ ...currentProject, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
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
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Primary Image (Thumbnail)</label>

                                    {currentProject.image_url && (
                                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 mb-2 group">
                                            <img
                                                src={currentProject.image_url}
                                                alt="Thumbnail Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={currentProject.image_url}
                                                onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="Asset URL"
                                            />
                                            <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openMediaPicker('single')}
                                            className="flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer active:scale-95 group"
                                            title="Select from Library"
                                        >
                                            <BookOpen size={20} className="opacity-40 group-hover:opacity-100" />
                                        </button>
                                        <label className="flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer active:scale-95 group" title="Upload New">
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            <Upload size={20} className="opacity-40 group-hover:opacity-100" />
                                        </label>
                                    </div>
                                </div>

                                {/* Carousel Images */}
                                <div className="col-span-full space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Carousel Images</label>
                                        <button
                                            type="button"
                                            onClick={() => openMediaPicker('multiple')}
                                            className="text-[9px] uppercase font-bold tracking-widest text-primary hover:underline"
                                        >
                                            + Add Multiple
                                        </button>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-2 min-h-[80px]">
                                        {(currentProject.images || []).map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeCarouselImage(idx)}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={16} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => openMediaPicker('multiple')}
                                            className="w-20 h-20 flex-shrink-0 rounded-lg border border-dashed border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white/20 hover:text-white/50"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Timeline</label>
                                        <div className="relative">
                                            <input
                                                ref={dateInputRef}
                                                type="date"
                                                value={currentProject.date_created}
                                                onChange={(e) => setCurrentProject({ ...currentProject, date_created: e.target.value })}
                                                style={{ colorScheme: 'dark' }}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors font-mono appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                                            />
                                            <Calendar
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 cursor-pointer hover:opacity-100 transition-opacity text-white"
                                                onClick={() => dateInputRef.current?.showPicker()}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Priority</label>
                                        <input
                                            type="number"
                                            value={currentProject.display_order || 0}
                                            onChange={(e) => setCurrentProject({ ...currentProject, display_order: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors text-center font-mono"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/5"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Stack Configuration</span>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            {/* ACTIVE STACKS DISPLAY */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Active Stacks</label>
                                <div className="flex flex-wrap gap-2 min-h-[40px]">
                                    {(currentProject.stacks || []).map(stack => (
                                        <button
                                            key={stack}
                                            type="button"
                                            onClick={() => toggleStack(stack)}
                                            className="px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)] flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                        >
                                            <IconWrapper name={stack} className="text-white" />
                                            {stack}
                                            <X size={12} className="opacity-50 hover:opacity-100" />
                                        </button>
                                    ))}
                                    {(currentProject.stacks || []).length === 0 && (
                                        <span className="text-xs text-white/20 italic self-center px-2">No stacks selected</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">Manage Stacks (Search or Add)</label>

                                {/* Search and Add Input */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={customStackInput}
                                            onChange={(e) => setCustomStackInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    // If exact match in library, toggle it. If not, add as custom.
                                                    const match = availableStacks.find(s => s.toLowerCase() === customStackInput.toLowerCase());
                                                    if (match) {
                                                        toggleStack(match);
                                                        setCustomStackInput('');
                                                    } else {
                                                        handleAddCustomStack();
                                                    }
                                                }
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="Search library or type custom name..."
                                        />
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddCustomStack}
                                        disabled={!customStackInput.trim()}
                                        className="px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center text-[10px] uppercase font-bold tracking-wider"
                                    >
                                        <Plus size={14} className="mr-1" /> Add
                                    </button>
                                </div>

                                {/* Filtered Library Grid */}
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl max-h-48 overflow-y-auto no-scrollbar">
                                    <div className="flex flex-wrap gap-2">
                                        {availableStacks
                                            .filter(stack =>
                                                stack.toLowerCase().includes(customStackInput.toLowerCase())
                                            )
                                            .map(stack => (
                                                <button
                                                    key={stack}
                                                    type="button"
                                                    onClick={() => toggleStack(stack)}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-wider border transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${currentProject.stacks?.some(s => s.toLowerCase() === stack.toLowerCase())
                                                        ? 'bg-primary text-black border-primary font-black shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]'
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    <IconWrapper name={stack} className={currentProject.stacks?.some(s => s.toLowerCase() === stack.toLowerCase()) ? "text-black" : "text-white opacity-50"} />
                                                    {stack}
                                                </button>
                                            ))}
                                        {availableStacks.filter(s => s.toLowerCase().includes(customStackInput.toLowerCase())).length === 0 && (
                                            <span className="text-[10px] text-white/20 italic p-2">
                                                "{customStackInput}" not in library. Use 'Add' to create custom tag.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

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
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="https://github"
                                        />
                                        <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] uppercase font-bold tracking-widest opacity-40">Documentation Content (Markdown)</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                                        className={`flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${isPreviewMode ? 'text-primary' : ''}`}
                                    >
                                        {isPreviewMode ? <><EyeOff size={12} /> Edit Mode</> : <><Eye size={12} /> Preview Mode</>}
                                    </button>
                                </div>

                                {isPreviewMode ? (
                                    <div
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 min-h-[150px] overflow-y-auto prose prose-invert prose-sm max-w-none"
                                        style={{ borderColor: 'rgba(var(--contrast-rgb), 0.2)' }}
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {currentProject.full_documentation || "*No documentation content provided yet.*"}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea
                                        value={currentProject.full_documentation}
                                        onChange={(e) => setCurrentProject({ ...currentProject, full_documentation: e.target.value })}
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors resize-y"
                                        placeholder="# Project Specification&#10;&#10;Use markdown to describe your architectural decisions..."
                                    />
                                )}
                            </div>
                        </section>

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
                                            <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateDocFile(idx, 'type', 'link')}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${file.type === 'link' ? 'bg-white/10 text-white' : 'text-white/20'}`}
                                                >
                                                    <LinkIcon size={10} /> Link
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateDocFile(idx, 'type', 'file')}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${file.type === 'file' ? 'bg-white/10 text-white' : 'text-white/20'}`}
                                                >
                                                    <FileText size={10} /> File
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDocFile(idx)}
                                            className="mt-5 md:mt-6 p-2 h-10 w-10 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center border border-red-500/10 cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addDocFile}
                                    className="w-full py-4 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 hover:bg-white/[0.02] transition-all cursor-pointer"
                                >
                                    <Plus size={14} /> Attach Resource Bundle
                                </button>
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.4em] text-xs transition-all active:scale-95 shadow-2xl hover:brightness-110 active:brightness-90 bg-blue-600 text-white shadow-blue-600/20"
                        >
                            <Save size={18} />
                            Sync Instance to Cloud
                        </button>
                    </form>
                </div>
            </div>

            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
                multiple={mediaPickerMode === 'multiple'}
            />
        </>
    );
};

export default ProjectForm;
