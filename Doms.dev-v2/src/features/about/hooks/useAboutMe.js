import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { usePortfolioData } from '../../../hooks/usePortfolioData';

export const useAboutMe = () => {
    const [expandedImage, setExpandedImage] = useState(null); // null, 'hero', 'education', 'resume'
    const [isDataReady, setIsDataReady] = useState(false);
    const [revealReady, setRevealReady] = useState(false);
    const { profile, education, contacts, techStack, isLoading } = usePortfolioData();

    // Refs for animations
    const heroCardRef = useRef(null);
    const identityCardRef = useRef(null);
    const educationCardRef = useRef(null);
    const resumeCardRef = useRef(null);
    const mdIconStack = useRef(null);
    const feedCard = useRef(null);
    const footerRef = useRef(null);
    const textAboutMeRef = useRef(null);
    const textFeedRef = useRef(null);
    const backButtonRef = useRef(null);
    const cvButtonRef = useRef(null);
    const effectsCardRef = useRef(null);

    // Track when data is ready
    useEffect(() => {
        if (!isLoading && profile && education && techStack) {
            setIsDataReady(true);
        }
    }, [isLoading, profile, education, techStack]);

    // Callback when loader finishes fading out
    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    const handleImageExpand = (imageType) => {
        setExpandedImage(imageType);
        gsap.to('.page-content', {
            filter: 'blur(8px)',
            duration: 0.3,
        });
        gsap.fromTo('.expanded-image-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    };

    const handleImageClose = () => {
        gsap.to('.page-content', {
            filter: 'blur(0px)',
            duration: 0.3,
        });
        gsap.to('.expanded-image-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => setExpandedImage(null)
        });
    };

    return {
        // State
        expandedImage,
        isDataReady,
        revealReady,

        // Data
        profile,
        education,
        contacts,
        techStack,

        // Refs
        heroCardRef,
        identityCardRef,
        educationCardRef,
        resumeCardRef,
        mdIconStack,
        feedCard,
        feedCard,
        footerRef,
        textAboutMeRef,
        textFeedRef,
        backButtonRef,
        cvButtonRef,
        effectsCardRef,

        // Handlers
        handleLoadComplete,
        handleImageExpand,
        handleImageClose
    };
};
