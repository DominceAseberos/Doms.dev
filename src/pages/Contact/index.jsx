import React from 'react';
import './Contact.css';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import ContactSection from '../../components/ContactSection';

const ContactPage = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <ContactSection />
            </div>
        </div>
    );
};

export default ContactPage;
