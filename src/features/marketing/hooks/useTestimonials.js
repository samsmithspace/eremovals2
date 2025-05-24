// src/features/marketing/hooks/useTestimonials.js
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook for managing testimonials and FAQ data
 * @returns {Object} Testimonials and FAQ data with computed ratings
 */
export const useTestimonials = () => {
    const { t } = useTranslation();

    const testimonials = useMemo(() => {
        const rawTestimonials = t('testimonials', { returnObjects: true });

        return rawTestimonials.map(testimonial => ({
            ...testimonial,
            rating: generateRating(testimonial.name)
        }));
    }, [t]);

    const faqs = useMemo(() => {
        return t('faqs', { returnObjects: true });
    }, [t]);

    return {
        testimonials,
        faqs
    };
};

// Helper function to generate consistent ratings
const generateRating = (name) => {
    const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (seed % 2 === 0) ? 5 : 4.5;
};

export default useTestimonials;