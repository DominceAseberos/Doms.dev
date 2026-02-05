import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import strings from '@shared/config/adminStrings.json';
import { useProjects } from '@admin/hooks/useProjects';
import ProjectForm from '@admin/components/ProjectForm';
import AdminProjectCard from '@admin/components/AdminProjectCard';

const ProjectsManager = () => {
    const { projects, fetchProjects, saveProject, deleteProject } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const navigate = useNavigate();
    const gridRef = useRef(null);

    useEffect(() => {
        fetchProjects(true);
    }, [fetchProjects]);

    useEffect(() => {
        if (projects.length > 0) {
            gsap.fromTo(".project-card-admin",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [projects]);

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
            images: [], // Carousel images
            project_type: 'Personal',
            date_created: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProject(null);
    };

    const handleSave = async (projectData) => {
        const success = await saveProject(projectData);
        if (success) {
            handleCloseModal();
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-6 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest hover:border-white/10 cursor-pointer group text-white"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {strings.common.backToAdmin}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-lg hover:brightness-110 active:brightness-90 bg-primary text-black shadow-primary/20"
                    >
                        <Plus size={14} /> {strings.common.newProject}
                    </button>
                </div>

                <header className="space-y-1 border-l-4 border-primary pl-6">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {strings.projects.titlePrefix}<br />
                        <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">{strings.projects.titleSuffix}</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-mono">
                        {strings.projects.subtitle}
                    </p>
                </header>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {projects.map((project) => (
                        <AdminProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleOpenModal}
                            onDelete={deleteProject}
                        />
                    ))}

                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4 py-12 hover:bg-white/[0.04] hover:border-white/10 transition-all group lg:min-h-[400px] cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-20 group-hover:opacity-60 transition-opacity">Deploy New Instance</span>
                    </button>
                </div>
            </div>

            <ProjectForm
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                project={currentProject}
            />
        </div>
    );
};

export default ProjectsManager;
