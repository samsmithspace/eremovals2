
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaQuoteLeft, FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useTestimonials } from '../hooks/useTestimonials';
import './Testimonials.css';
/**
 * Testimonials and FAQ component
 */
const Testimonials = () => {
    const { t } = useTranslation();
    const [openFAQIndex, setOpenFAQIndex] = useState(0);
    const { testimonials, faqs } = useTestimonials();

    const toggleFAQ = (index) => {
        setOpenFAQIndex(openFAQIndex === index ? null : index);
    };

    return (
        <div className="testimonials-container">
            {/* Testimonials Section */}
            <TestimonialsSection testimonials={testimonials} />

            {/* FAQ Section */}
            <FAQSection
                faqs={faqs}
                openIndex={openFAQIndex}
                onToggle={toggleFAQ}
            />
        </div>
    );
};

/**
 * Testimonials showcase section
 */
const TestimonialsSection = ({ testimonials }) => {
    const { t } = useTranslation();

    return (
        <section className="testimonials-section">
            <div className="section-header">
                <h2>{t('whatCustomersSay')}</h2>
                <div className="section-divider"></div>
            </div>

            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                ))}
            </div>
        </section>
    );
};

/**
 * Individual testimonial card
 */
const TestimonialCard = ({ name, text, location, rating }) => {
    const avatarUrl = generateAvatarUrl(name);

    return (
        <div className="testimonial-card">
            <div className="quote-icon">
                <FaQuoteLeft />
            </div>

            <div className="testimonial-content">
                <p>{text}</p>
                <StarRating rating={rating} />
            </div>

            <div className="testimonial-author">
                <img
                    src={avatarUrl}
                    alt={name}
                    className="author-avatar"
                />
                <div className="author-info">
                    <h4>{name}</h4>
                    {location && <p className="author-location">{location}</p>}
                </div>
            </div>
        </div>
    );
};

/**
 * Star rating component
 */
const StarRating = ({ rating }) => {
    return (
        <div className="rating">
            {[...Array(5)].map((_, i) => (
                <FaStar
                    key={i}
                    className={i < Math.floor(rating) ? 'star filled' : i < rating ? 'star half-filled' : 'star'}
                />
            ))}
        </div>
    );
};

/**
 * FAQ section component
 */
const FAQSection = ({ faqs, openIndex, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="faq-section">
            <div className="section-header">
                <h2>{t('frequentlyAskedQuestions')}</h2>
                <div className="section-divider"></div>
            </div>

            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        faq={faq}
                        index={index}
                        isOpen={openIndex === index}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Individual FAQ item
 */
const FAQItem = ({ faq, index, isOpen, onToggle }) => {
    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => onToggle(index)}>
                <h5>{faq.question}</h5>
                <span className="toggle-icon">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
            </div>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                <p>{faq.answer}</p>
            </div>
        </div>
    );
};

// Helper functions
const generateAvatarUrl = (name) => {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688'];
    const colorIndex = name.length % colors.length;
    return `https://ui-avatars.com/api/?name=${initials}&background=${colors[colorIndex].substring(1)}&color=fff&size=100`;
};

const generateRating = (name) => {
    const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (seed % 2 === 0) ? 5 : 4.5;
};

// PropTypes
TestimonialsSection.propTypes = {
    testimonials: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        location: PropTypes.string,
        rating: PropTypes.number
    })).isRequired
};

TestimonialCard.propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    location: PropTypes.string,
    rating: PropTypes.number
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired
};

FAQSection.propTypes = {
    faqs: PropTypes.arrayOf(PropTypes.shape({
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired
    })).isRequired,
    openIndex: PropTypes.number,
    onToggle: PropTypes.func.isRequired
};

FAQItem.propTypes = {
    faq: PropTypes.shape({
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default Testimonials;