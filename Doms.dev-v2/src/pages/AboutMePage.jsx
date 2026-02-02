import React from 'react';
import { X, FileText } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import umtcLogo from '../assets/umtc-logo.png';
import heroImage from '../assets/hero-image.png';

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
    TextFeed
} from '../features/about';

// Custom Hooks
import { useAboutMe } from '../features/about/hooks/useAboutMe';
import { useAboutMeAnimation } from '../features/about/hooks/useAboutMeAnimation';

const AboutMePage = () => {

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
        cvButtonRef
    });

    return (
        <>
            <PageLoader
                isLoading={!isDataReady}
                onLoadComplete={handleLoadComplete}
                minDisplayTime={600}
            />
            <div
                className="min-h-screen w-full py-2 px-4 md:px-2"
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
                    {/* Strictly hidden wrappers for manual mobile sequence */}
                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />
                    </div>

                    <div className="mobile-reveal-card w-full" style={{ opacity: 0 }}>
                        <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />
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

                <div className="
            hidden md:grid md:cols-span-12 lg:cols-span-12 p-4 gap-4
            ">
                    {/* ===================== */}
                    <div className="md:col-span-4 lg:col-span-2 md:h-60 md:w-full lg:h-60 " >
                        <div className="flex flex-col gap-4 w-full h-full">
                            <div ref={backButtonRef} className="w-full">
                                <BackButton />
                            </div>

                            <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />

                        </div>

                    </div>


                    <div className="md:col-span-4 lg:col-span-2 md:h-60 md:w-full lg:h-60 " >
                        <div className="flex flex-col gap-2 w-full h-full">
                            <TextAboutMe textAboutMeRef={textAboutMeRef} />

                            <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />

                        </div>
                    </div>


                    {/* ================ */}
                    <div className="md:col-span-4 lg:col-span-2 md:h-40 md:w-full lg:h-60">
                        <div className="grid grid-cols-5 gap-4 h-full">
                            <div className="col-span-1 h-full">
                                <TextFeed textFeedRef={textFeedRef} />
                            </div>
                            <div className="col-span-4 h-full">
                                <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />
                            </div>

                        </div>
                    </div>


                    {/* ============== */}
                    <div className="md:col-span-2 lg:col-span-2  md:h-20 md:w-full lg:h-60 aspect-square">
                        <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />

                    </div>


                    <div className="md:col-span-2 lg:col-span-2  md:h-40 md:w-full  lg:h-60">
                        <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />
                    </div>


                    <div className="md:col-span-2 lg:col-span-2  md:h-40 md:w-full lg:h-60">

                        <div className="flex flex-col  justify-between gap-2 w-full h-full " >

                            <div className="flex-1 min-h-0 w-full">
                                <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />
                            </div>


                            <div ref={cvButtonRef} className="w-full">
                                <DownloadCVButton profile={profile} />
                            </div>

                        </div>



                    </div>

                    <div
                        ref={footerRef}
                        className="md:col-span-4 lg:col-span-6 w-full rounded-2xl p-6 border border-white/5"
                        style={{
                            background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                        }}
                    >
                        <AboutMeFooter contacts={contacts} profile={profile} />
                    </div>

                </div >




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
        </>
    );
};

export default AboutMePage;
