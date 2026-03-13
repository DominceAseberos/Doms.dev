import React from 'react';
import './Projects.css';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import ProjectTabs from './components/ProjectTabs';

const ProjectsPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <ProjectTabs />
            </div>
        </div>
    );
};

export default ProjectsPage;
