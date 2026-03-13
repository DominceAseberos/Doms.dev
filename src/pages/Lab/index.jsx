import React from 'react';
import './Lab.css';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import LabSection from '../../components/LabSection';
import ContactSection from '../../components/ContactSection';

const LabPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <LabSection />
                <ContactSection />
            </div>
        </div>
    );
};

export default LabPage;
