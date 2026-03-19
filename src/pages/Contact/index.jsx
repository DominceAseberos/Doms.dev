import React from 'react';
import './Contact.css';
import CityscapeContact from './components/CityscapeContact';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';

const ContactPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />
            <div className="relative z-10">
                <CityscapeContact />
            </div>
        </div>
    );
};

export default ContactPage;
