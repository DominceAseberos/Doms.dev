import React, { useRef } from 'react';
import { X, FileText } from 'lucide-react';
import PageLoader from '@app/components/PageLoader';
import umtcLogo from '@/assets/umtc-logo.png';
import heroImage from '@/assets/hero-image.png';
import WaterDroplet from '@app/components/WaterDroplet';

// About Feature Components
import {
    AboutMeHero,
    AboutMeIdentity,
    AboutMeEducation,
    AboutMeResume,
    AboutMeTechStack,
    AboutMeFooter,
    AboutMeStatusCard,
    BackButton,
    DownloadCVButton,
    TextAboutMe,
    TextFeed,
    EffectsCard
} from '../features/about';

// Custom Hooks
import { useAboutMe } from '../features/about/hooks/useAboutMe';
import { useAboutMeAnimation } from '../features/about/hooks/useAboutMeAnimation';

const AboutMePage = () => {
    const dropletRef = useRef([]);

    // 1. Logic & State Hook
    const {
        expandedImage,
        isDataReady,
        revealReady,
        profile,
        education,
        contacts,
        techStack,
        heroCardRef,
        identityCardRef,
        educationCardRef,
        resumeCardRef,
        mdIconStack,
        feedCard,
        footerRef,
        textAboutMeRef,
        textFeedRef,
        backButtonRef,
        cvButtonRef,
        effectsCardRef,
        handleLoadComplete,
        handleImageExpand,
        handleImageClose
    } = useAboutMe();

    // 2. Animation Hook
    useAboutMeAnimation({
        revealReady,
        heroCardRef,
        identityCardRef,
        feedCard,
        mdIconStack,
        educationCardRef,
        resumeCardRef,
        footerRef,
        textAboutMeRef,
        textFeedRef,
        backButtonRef,
        cvButtonRef,
        effectsCardRef,
        dropletRef // Pass ref
    });

    return (
        <div className="relative min-h-screen bg-dashboard-main overflow-x-hidden selection:bg-blue-500/30">
            <WaterDroplet ref={dropletRef} />
            <PageLoader
                isLoading={!isDataReady}
                onLoadComplete={handleLoadComplete}
                minDisplayTime={600}
            />
            <div
                className="w-full py-2 px-4 md:px-2 md:h-screen md:py-8 md:pb-8"
                style={{
                    background: `linear-gradient(to bottom, rgb(var(--body-Linear-1-rgb)), rgb(var(--body-Linear-2-rgb)))`,
                    opacity: revealReady ? 1 : 0,
                    transition: 'opacity 0.2s ease-out'
                }}
            >

                {/* ================== MOBILE LAYOUT ===================== */}
                <div className="md:hidden lg:hidden 
            flex flex-col gap-8 page-content max-w-2xl mx-auto items-center">
                    <div className="flex flex-start w-full">
                        <BackButton />
                    </div>
                    <div className="mobile-reveal-card w-full h-24">
                        <EffectsCard effectsCardRef={effectsCardRef} />

                    </div>
                    <div className="mobile-reveal-card w-full">
                        <TextAboutMe textAboutMeRef={textAboutMeRef} />
                    </div>
                    {/* Strictly hidden wrappers for manual mobile sequence */}
                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />
                    </div>



                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <div className="w-full flex justify-center">
                            <DownloadCVButton profile={profile} />
                        </div>
                    </div>

                    <div className="mobile-reveal-card w-full">
                        <TextFeed textFeedRef={textFeedRef} />

                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <div className="w-full
                rounded-2xl p-6 border border-white/5"
                            style={{
                                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                            }}
                        >
                            <AboutMeFooter footerRef={footerRef} contacts={contacts} profile={profile} />
                        </div>
                    </div>

                </div>

                {/* ================== BIG SCREEN LAYOUT ===================== */}

                <div className="hidden md:flex items-center justify-center min-h-screen w-full p-4 lg:p-8">
                    <div className="w-full max-w-7xl h-fit grid grid-cols-2 gap-4 lg:gap-6">
                        {/* LEFT COLUMN */}
                        <div className="col-span-1 flex flex-col gap-2 lg:gap-4 h-full">
                            {/* Top Section */}

                            <div className="flex flex-row gap-2  ">
                                <div ref={backButtonRef} className="w-1/2 h-full">
                                    <BackButton />
                                </div>
                                <div className="w-1/2 ">
                                    <EffectsCard effectsCardRef={effectsCardRef} />
                                </div>
                            </div>



                            <div className="w-full flex-shrink-0">
                                <TextFeed textFeedRef={textFeedRef} />
                            </div>
                            {/* Middle Section (Status) */}
                            <div className="flex-1 min-h-[200px] flex flex-col">
                                <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />
                            </div>

                            {/* Bottom Section (Footer) */}
                            <div className="flex-shrink-0 flex flex-col gap-2 lg:gap-4">
                                <div ref={cvButtonRef} className="w-full">
                                    <DownloadCVButton profile={profile} />
                                </div>
                                <div
                                    ref={footerRef}
                                    className="w-full rounded-2xl p-6 border border-white/5"
                                    style={{
                                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                                    }}
                                >
                                    <AboutMeFooter contacts={contacts} profile={profile} />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="col-span-1 flex flex-col gap-2 lg:gap-4 h-full">
                            {/* Top Section */}
                            <div className="w-full flex-shrink-0">
                                <TextAboutMe textAboutMeRef={textAboutMeRef} />
                            </div>

                            {/* Middle Section (Images/Cards) - Fills available space */}
                            <div className="flex-1 min-h-0 flex flex-col gap-2 lg:gap-4 justify-center">
                                <div className="flex flex-row justify-between gap-2 lg:gap-4 min-h-[5rem] flex-shrink-0">
                                    <div className="w-full ">
                                        <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />
                                    </div>
                                    <div className="w-full ">
                                        <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2 lg:gap-4 justify-between h-40 flex-shrink-0">
                                    <div className="w-[65%] h-full">
                                        <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />
                                    </div>
                                    <div className="w-[33%] h-full">
                                        <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="w-full flex-shrink-0">
                                <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />
                            </div>
                        </div>
                    </div>
                </div>





                {/* Expanded Image Modal */}
                {
                    expandedImage && (
                        <div
                            className="fixed top-0 inset-0 z-50 flex items-center justify-center p-4"
                            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
                        >
                            <div className="expanded-image-container relative max-w-2xl w-full md:max-w-xl ">
                                <div
                                    className="aspect-square rounded-2xl overflow-hidden"
                                    style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        {expandedImage === 'hero' && (
                                            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                                        )}
                                        {expandedImage === 'education' && (
                                            <img src={umtcLogo} alt="University of Mindanao" className="w-full h-full object-contain p-8 bg-white" />
                                        )}
                                        {expandedImage === 'resume' && (
                                            <FileText size={120} style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }} />
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleImageClose}
                                    className="absolute -top-12 right-0 p-2 md:top-0 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                                    style={{
                                        background: 'rgb(var(--contrast-rgb))',
                                        color: '#000'
                                    }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >
        </div>
    );
};

export default AboutMePage;
