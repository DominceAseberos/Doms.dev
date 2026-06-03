import React, { useEffect } from 'react';


import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import NarrativeSection from './components/NarrativeSection';
import useLoadingStore from '../../store/useLoadingStore';

const AboutPage = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);

    useEffect(() => {
        if (!isLoading) {
            window.scrollTo(0, 0);
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            }
        }
    }, [isLoading]);

    return (
        <div className="about-home relative min-h-screen">

            <ParticleBackground />
            <NavBar />
            <div className="relative z-10">
                <NarrativeSection />
            </div>
        </div>
    );
};

export default AboutPage;
