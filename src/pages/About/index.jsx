import React, { useEffect, useRef } from 'react';
import './css/About.css';
import { Helmet } from 'react-helmet-async';

import ParticleBackground from '../../components/ParticleBackground';
import NavBar from '../../components/NavBar';
import AboutSection from '../../components/AboutSection';
import EducationSection from './components/EducationSection';
import GithubContributionSection from './components/GithubContributionSection';
import FeedSection from './components/FeedSection';
import AboutSocialFooter from './components/AboutSocialFooter';
import NarrativeSection from './components/NarrativeSection';
import useLoadingStore from '../../store/useLoadingStore';

const AboutPage = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const sectionRef = useRef(null);
    const narrativeRef = useRef(null);

    useEffect(() => {
        if (!isLoading) {
            window.scrollTo(0, 0);
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            }
        }
    }, [isLoading]);

    return (
        <div className="relative min-h-screen">
            <Helmet>
                <title>About - Domince Aseberos</title>
                <meta name="description" content="Learn more about Domince Aseberos, a creative developer with a passion for web animation, design systems, and frontend architecture." />
            </Helmet>
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <AboutSection ref={sectionRef} narrativeRef={narrativeRef} />
                <NarrativeSection ref={narrativeRef} />
                <EducationSection />
                <GithubContributionSection />
                <FeedSection />
                <AboutSocialFooter />
            </div>
        </div>
    );
};

export default AboutPage;
