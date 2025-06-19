// Enhanced Testimonials with Real Trustpilot API Integration
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaQuoteLeft,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaArrowRight,
  FaExclamationTriangle
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useTrustpilotReviews } from '../hooks/useTrustpilotReviews';
import { useTestimonials } from '../hooks/useTestimonials';
import './Testimonials.css';

/**
 * Enhanced Testimonials component with real Trustpilot API integration
 * Features open design without cards and authentic reviews
 */
const Testimonials = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState(0);

  // Get real Trustpilot data
  const {
    reviews,
    businessData,
    loading,
    error,
    refetch
  } = useTrustpilotReviews();

  // Fallback testimonials and FAQs
  const { faqs } = useTestimonials();

  const toggleFAQ = useCallback((index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  }, [openFAQIndex]);

  const handleGetQuote = useCallback(() => {
    navigate(`/${lang}/contact`);
  }, [navigate, lang]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="testimonials-container">
      {/* Section Header */}


      {/* Trustpilot Business Overview */}
      <TrustpilotOverview businessData={businessData} loading={loading} />

      {/* Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      {/* FAQ Section */}
      <FAQSection
        faqs={faqs}
        openIndex={openFAQIndex}
        onToggle={toggleFAQ}
      />

      {/* Call to Action */}
      <div className="testimonials-cta">
        <h3>{t('testimonials.cta.title', 'Ready to Join Our Happy Customers?')}</h3>
        <p>{t('testimonials.cta.subtitle', 'Get your free quote today and experience our award-winning service')}</p>
        <button
          onClick={handleGetQuote}
          className="cta-button"
          aria-label={t('common.getQuote', 'Get free quote')}
        >
          <FaArrowRight />
          {t('testimonials.cta.button', 'Get Your Free Quote')}
        </button>
      </div>
    </div>
  );
};

/**
 * Trustpilot business overview with stats and score
 */
const TrustpilotOverview = ({ businessData, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="trustpilot-section">
        <div className="testimonials-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Trustpilot data...</p>
        </div>
      </div>
    );
  }

  const {
    trustScore = 4.8,
    numberOfReviews = 1247,
    stars = 5
  } = businessData || {};

  return (
    <section className="trustpilot-section">
      <div className="trustpilot-header">
        <div className="trustpilot-logo-container">
          <img
            src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg"
            alt="Trustpilot"
            className="trustpilot-logo"
          />
          <div className="trustpilot-badge">Verified Reviews</div>
        </div>

        <div className="trustpilot-score-display">
          <div className="score-section">
            <div className="trustpilot-rating">{trustScore.toFixed(1)}</div>
            <div className="trustpilot-stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="trustpilot-star"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(stars) ? "#00b67a" : "#ddd"}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="trust-stats">
        <div className="trust-stat">
          <div className="trust-stat-number">98%</div>
          <div className="trust-stat-label">Customer Satisfaction</div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-number">5000+</div>
          <div className="trust-stat-label">Successful Moves</div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-number">10+</div>
          <div className="trust-stat-label">Years Experience</div>
        </div>
      </div>
    </section>
  );
};

/**
 * Reviews section with loading and error states
 */
const ReviewsSection = ({ reviews, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="testimonials-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading customer reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="testimonials-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Unable to load reviews</h3>
        <p>We're having trouble connecting to Trustpilot. Please try again.</p>
        <button onClick={onRetry} className="cta-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials-grid">
        {reviews.map((review, index) => (
          <ReviewItem key={review.id || index} {...review} />
        ))}
      </div>
    </section>
  );
};

/**
 * Individual review item with open design
 */
const ReviewItem = ({
                      title,
                      text,
                      stars,
                      consumer,
                      createdAt,
                      isVerified = true
                    }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate avatar for consumer
  const generateAvatar = (name) => {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688'];
    const colorIndex = name.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${colors[colorIndex].substring(1)}&color=fff&size=120&bold=true&format=svg`;
  };

  return (
    <div className="testimonial-item">
      <div className="testimonial-quote">
        <span className="quote-mark">"</span>
        {title && (
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 1rem 0'
          }}>
            {title}
          </h4>
        )}
        <p className="testimonial-text">{text}</p>
      </div>

      <div className="testimonial-rating">
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < stars ? 'star filled' : 'star'}
            />
          ))}
        </div>
        <span className="rating-score">{stars}/5</span>
      </div>

      <div className="testimonial-author">
        <img
          src={generateAvatar(consumer.displayName)}
          alt={`${consumer.displayName} profile picture`}
          className="author-avatar"
          loading="lazy"
        />
        <div className="author-details">
          <h4 className="author-name">{consumer.displayName}</h4>
          {consumer.countryCode && (
            <p className="author-location">
              {getCountryName(consumer.countryCode)}
            </p>
          )}
          <div className="review-source">
            {isVerified && (
              <div className="trustpilot-verified">
                Verified Review
              </div>
            )}
            <span className="review-date">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * FAQ section component with open design
 */
const FAQSection = ({ faqs, openIndex, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div className="faq-section">
      <div className="section-header">
        <h2>{t('faq.title', 'Frequently Asked Questions')}</h2>
        <p className="section-subtitle">
          {t('faq.subtitle', 'Find answers to common questions about our moving services')}
        </p>
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
 * Individual FAQ item with smooth animations
 */
const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <div
        className="faq-question"
        onClick={() => onToggle(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(index);
          }
        }}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h5>{faq.question}</h5>
        <span className="toggle-icon">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <div
        className={`faq-answer ${isOpen ? 'open' : ''}`}
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
};

// Helper functions
const getCountryName = (countryCode) => {
  const countries = {
    'GB': 'United Kingdom',
    'US': 'United States',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'IE': 'Ireland'
  };
  return countries[countryCode] || countryCode;
};

// PropTypes
TrustpilotOverview.propTypes = {
  businessData: PropTypes.shape({
    trustScore: PropTypes.number,
    numberOfReviews: PropTypes.number,
    stars: PropTypes.number
  }),
  loading: PropTypes.bool.isRequired
};

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    consumer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      countryCode: PropTypes.string
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    isVerified: PropTypes.bool
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

ReviewItem.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired,
  consumer: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    countryCode: PropTypes.string
  }).isRequired,
  createdAt: PropTypes.string.isRequired,
  isVerified: PropTypes.bool
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