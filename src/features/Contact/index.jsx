import React from 'react';

import './Contact.css';
import CityscapeContact from './components/CityscapeContact';

import ParticleBackground from '../../components/ParticleBackground';

const ContactPage = () => {
    return (
        <div className="relative min-h-screen">

            <ParticleBackground />
            <div className="relative z-10">
                <CityscapeContact />
            </div>
        </div>
    );
};

export default ContactPage;
