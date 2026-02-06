import { useState } from 'react';

/**
 * Custom hook for carousel image navigation
 * @param {number} imageCount - Total number of images in carousel
 * @returns {Object} Carousel state and controls
 */
export const useCarousel = (imageCount = 0) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === imageCount - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? imageCount - 1 : prev - 1
        );
    };

    return {
        currentImageIndex,
        nextImage,
        prevImage
    };
};
