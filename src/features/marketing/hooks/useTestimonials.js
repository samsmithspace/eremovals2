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
        // Get testimonials from translation or use fallback data
        const rawTestimonials = t('testimonials.items', { returnObjects: true });

        // Check if rawTestimonials is an array, if not provide fallback
        const testimonialsArray = Array.isArray(rawTestimonials) ? rawTestimonials : [
            {
                name: "Nina",
                location: "Edinburgh",
                text: "The team was incredibly helpful during my move. They handled everything with care, and the entire process was stress-free. I'll definitely be using their services again.",
            },
            {
                name: "Josh",
                location: "Glasgow",
                text: "I had to relocate on short notice, and they managed to fit me in. The movers were punctual, professional, and got everything done faster than I expected. Highly recommend!",
            },
            {
                name: "Prescott",
                location: "Aberdeen",
                text: "I was worried about my fragile items, but they packed everything so securely. Not a single item was damaged during the move. Great experience overall.",
            },
            {
                name: "Calvin",
                location: "Dundee",
                text: "Super efficient and friendly crew! They made what could have been a stressful day really easy for us. It's rare to find a company this reliable these days.",
            }
        ];

        return testimonialsArray.map(testimonial => ({
            ...testimonial,
            rating: generateRating(testimonial.name)
        }));
    }, [t]);

    const faqs = useMemo(() => {
        const rawFaqs = t('faqs.items', { returnObjects: true });

        // Check if rawFaqs is an array, if not provide fallback
        return Array.isArray(rawFaqs) ? rawFaqs : [
            {
                question: "How much does your service cost?",
                answer: "Our pricing depends on the type and size of the move, distance, and additional services required. We provide free, no-obligation quotes tailored to your specific needs. Contact us for a detailed estimate."
            },
            {
                question: "What areas do you serve?",
                answer: "We are based in Edinburgh and provide services throughout Scotland. We also offer nationwide moving services for long-distance relocations. Contact us to confirm service availability in your area."
            },
            {
                question: "Can I change my moving date after booking?",
                answer: "Yes, you can reschedule your move as long as you provide at least 72 hours advance notice. Changes made with less notice may incur additional fees. We'll do our best to accommodate your new preferred date."
            },
            {
                question: "Do you provide packing materials?",
                answer: "Yes, we offer a full range of packing materials including boxes, bubble wrap, packing paper, and tape. We can also provide professional packing services to ensure your items are properly protected."
            },
            {
                question: "Are my belongings insured during the move?",
                answer: "Yes, we carry comprehensive insurance coverage for your belongings during the move. We also offer additional insurance options for high-value items. Details will be provided in your booking confirmation."
            },
            {
                question: "How far in advance should I book?",
                answer: "We recommend booking at least 2-3 weeks in advance, especially during peak moving seasons (summer months and weekends). However, we can often accommodate last-minute bookings based on availability."
            }
        ];
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