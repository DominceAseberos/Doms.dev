import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import ProjectSection from '../components/ProjectSection';
import MoreProjectsSection from '../components/MoreProjectsSection';
import LabSection from '../components/LabSection';

const Home = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <HeroSection />
                <ProjectSection />
                <MoreProjectsSection />
                <LabSection />
            </div>
        </div>
    );
};

export default Home;
