import React from 'react';
import './Projects.css';
import { Helmet } from 'react-helmet-async';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import ProjectTabs from './components/ProjectTabs';

const ProjectsPage = () => {
    return (
        <div className="relative min-h-screen">
            <Helmet>
                <title>Projects - Domince Aseberos</title>
                <meta name="description" content="Explore my selected works, projects, and creative web development experiments." />
            </Helmet>
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <ProjectTabs />
            </div>
        </div>
    );
};

export default ProjectsPage;
