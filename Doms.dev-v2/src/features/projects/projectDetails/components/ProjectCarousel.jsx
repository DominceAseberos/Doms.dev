import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * ProjectCarousel component - displays image carousel with navigation and touch support
 */
const ProjectCarousel = ({
    images = [],
    title,
    currentImageIndex,
    nextImage,
    prevImage,
}) => {
    const carouselRef = useRef(null);
    const buttonsRef = useRef([]);

    const { contextSafe } = useGSAP({ scope: carouselRef });

    const handleHover = contextSafe((target) => {
        gsap.to(target, {
            rotation: -2,
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    const handleLeave = contextSafe((target) => {
        gsap.to(target, {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Handle touch swipe gestures
    useEffect(() => {
        if (!carouselRef.current || !images || images.length <= 1) return;

        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            if (touchStartX - touchEndX > 50) {
                nextImage();
            }
            if (touchEndX - touchStartX > 50) {
                prevImage();
            }
        };

        const carousel = carouselRef.current;
        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchmove', handleTouchMove);
        carousel.addEventListener('touchend', handleTouchEnd);

        return () => {
            carousel?.removeEventListener('touchstart', handleTouchStart);
            carousel?.removeEventListener('touchmove', handleTouchMove);
            carousel?.removeEventListener('touchend', handleTouchEnd);
        };
    }, [images, nextImage, prevImage]); // Fixed dependencies to avoid infinite loop

    if (!images || images.length === 0) return null;

    return (
        <div className="project-card">
            <div
                className="rounded-2xl overflow-hidden p-6 h-full"
                style={{
                    background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                    border: '1px solid rgba(var(--contrast-rgb), 0.1)'
                }}
            >
                <div className="card-content h-full flex flex-col justify-center">
                    <div
                        ref={carouselRef}
                        className="aspect-video w-full rounded-xl overflow-hidden relative group bg-black/20"
                    >
                        <img
                            src={images[currentImageIndex]}
                            alt={`${title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop';
                            }}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    ref={(el) => (buttonsRef.current[0] = el)}
                                    onClick={prevImage}
                                    onMouseEnter={() => handleHover(buttonsRef.current[0])}
                                    onMouseLeave={() => handleLeave(buttonsRef.current[0])}
                                    onTouchStart={() => handleHover(buttonsRef.current[0])}
                                    onTouchEnd={() => handleLeave(buttonsRef.current[0])}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                                    style={{
                                        background: 'rgb(var(--contrast-rgb))',
                                        color: 'rgb(0,0,0)'
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    ref={(el) => (buttonsRef.current[1] = el)}
                                    onClick={nextImage}
                                    onMouseEnter={() => handleHover(buttonsRef.current[1])}
                                    onMouseLeave={() => handleLeave(buttonsRef.current[1])}
                                    onTouchStart={() => handleHover(buttonsRef.current[1])}
                                    onTouchEnd={() => handleLeave(buttonsRef.current[1])}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                                    style={{
                                        background: 'rgb(var(--contrast-rgb))',
                                        color: 'rgb(0,0,0)'
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </button>

                                <div
                                    className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        background: 'rgba(var(--contrast-rgb), 0.9)',
                                        color: 'rgb(var(--body-Linear-rgb))'
                                    }}
                                >
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCarousel;
