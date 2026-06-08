import React from 'react';
import './Projects.css';
import './Projects.css';

import ParticleBackground from '../../components/ParticleBackground';
import ProjectTabs from './components/ProjectTabs';

const ProjectsPage = () => {
    return (
        <div className="relative min-h-screen">

            <ParticleBackground />

            <div className="relative z-10">
                <ProjectTabs />
            </div>
        </div>
    );
};

export default ProjectsPage;
