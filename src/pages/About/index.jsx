import React, { useEffect, useRef } from 'react';
import './css/About.css';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import AboutSection from '../../components/AboutSection';
import EducationSection from './components/EducationSection';
import GithubContributionSection from './components/GithubContributionSection';
import FeedSection from './components/FeedSection';
import useLoadingStore from '../../store/useLoadingStore';

const AboutPage = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!isLoading) {
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        }
    }, [isLoading]);

    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <AboutSection ref={sectionRef} />
                <EducationSection />
                <GithubContributionSection />
                <FeedSection />
            </div>
        </div>
    );
};

export default AboutPage;
