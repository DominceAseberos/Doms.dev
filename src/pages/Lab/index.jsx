import React from 'react';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import LabHero from './components/LabHero.jsx';
import LabSection from './components/LabSection.jsx';


const LabPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <main className="relative z-10 pt-20">
                <LabHero />
                <LabSection />
            </main>
        </div>
    );
};

export default LabPage;
