import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';

const Home = () => {
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <HeroSection />
            </div>
        </div>
    );
};

export default Home;
