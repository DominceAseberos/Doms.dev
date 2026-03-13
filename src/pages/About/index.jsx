import React from 'react';
import './About.css';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import AboutSection from '../../components/AboutSection';
import ContactSection from '../../components/ContactSection';

const AboutPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <AboutSection />
                <ContactSection />
            </div>
        </div>
    );
};

export default AboutPage;
