import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Contact.css';
import CityscapeContact from './components/CityscapeContact';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';

const ContactPage = () => {
    return (
        <div className="relative min-h-screen">
            <Helmet>
                <title>Domince Aseberos — Creative Full Stack Developer</title>
                <link rel="canonical" href="https://www.dominceaseberos.tech/contact" />
            </Helmet>
            <ParticleBackground />
            <NavBar />
            <div className="relative z-10">
                <CityscapeContact />
            </div>
        </div>
    );
};

export default ContactPage;
