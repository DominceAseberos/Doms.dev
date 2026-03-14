import React, { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import portfolioData from '../../../data/portfolioData.json';
import '../Projects.css';
import './ProjectTabs.css';

const categories = [
    {
        id: 'portfolio',
        label: 'Portfolio',
        filter: () => true
    },
    {
        id: 'landing',
        label: 'Landing Pages',
        filter: (project) => project.projectType.toLowerCase().includes('platform') || project.projectType.toLowerCase().includes('productivity')
    },
    {
        id: 'fullstack',
        label: 'Full Stack',
        filter: (project) => project.projectType.toLowerCase().includes('platform') || project.projectType.toLowerCase().includes('community')
    },
    {
        id: 'ai',
        label: 'AI',
        filter: (project) => project.projectType.toLowerCase().includes('ai')
    }
];

const ProjectTabs = ({ onView }) => {
    const [activeTab, setActiveTab] = useState('portfolio');

    const projects = useMemo(() => {
        return portfolioData.projects.map((p) => ({
            ...p,
            dateCreated: new Date(p.dateCreated).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short'
            })
        }));
    }, []);

    const tabProjects = useMemo(() => {
        const category = categories.find((cat) => cat.id === activeTab);
        return category ? projects.filter(category.filter) : projects;
    }, [activeTab, projects]);

    return (
        <div className="project-tabs">
            <div className="project-tabs-header">
                <div className="project-tabs-title">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#f2ede6]">Projects</h2>
                    <p className="ui-body-copy text-base md:text-lg max-w-2xl mt-4">
                        Browse a curated set of work. Toggle a category to surface the projects that match your interests.
                    </p>
                </div>

                <div className="project-tabs-nav">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`project-tab-button ${cat.id === activeTab ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="project-grid">
                {tabProjects.length === 0 ? (
                    <div className="project-empty">No projects found for this category.</div>
                ) : (
                    tabProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} onView={onView} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectTabs;
