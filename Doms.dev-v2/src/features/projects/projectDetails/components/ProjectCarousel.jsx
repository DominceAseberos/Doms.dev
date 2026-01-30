import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useButtonMotion } from '../../../../hooks/useButtonMotion';

/**
 * CarouselButton - Subcomponent for motion buttons
 */
const CarouselButton = ({ onClick, children, className, style, positionStyles }) => {
    const { ref, onEnter, onLeave, onTap } = useButtonMotion();
    return (
        <button
            ref={ref}
            onClick={(e) => {
                onTap();
                onClick(e);
            }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className={`${className} ${positionStyles}`}
            style={style}
        >
            {children}
        </button>
    );
};

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
    }, [images, nextImage, prevImage]);

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
                                <CarouselButton
                                    onClick={prevImage}
                                    positionStyles="absolute left-4 top-1/2 -translate-y-1/2"
                                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                                    style={{
                                        background: 'rgb(var(--contrast-rgb))',
                                        color: 'rgb(0,0,0)'
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </CarouselButton>

                                <CarouselButton
                                    onClick={nextImage}
                                    positionStyles="absolute right-4 top-1/2 -translate-y-1/2"
                                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                                    style={{
                                        background: 'rgb(var(--contrast-rgb))',
                                        color: 'rgb(0,0,0)'
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </CarouselButton>

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
