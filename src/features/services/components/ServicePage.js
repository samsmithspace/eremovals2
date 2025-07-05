// src/features/services/components/ServicePage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaWhatsapp
} from 'react-icons/fa';
import { Button } from '../../../common/components/ui';
import { accessibleScrollToTop } from '../../../common/utils/scrollUtils';
import './ServicePage.css';

/**
 * Professional service page component
 * Displays detailed information about specific services
 */
const ServicePage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Extract service type from current path
  const currentPath = window.location.pathname;
  const serviceType = currentPath.split('/services/')[1];

  // Scroll to top when component mounts or service type changes
  useEffect(() => {
    accessibleScrollToTop();
  }, [serviceType]);

  // Service configurations
  const serviceConfigs = {
    domestic: {
      title: 'Domestic Removals',
      subtitle: 'Professional Home Moving Services',
      icon: '🏠',
      heroImage: '/assets/images/domestic-removals.jpg',
      description: 'Complete home relocation services with professional packing, safe transport, and careful handling of your belongings.',
      features: [
        'Full house relocations',
        'Professional packing service',
        'Fragile item specialists',
        'Furniture disassembly/assembly',
        'Secure transportation',
        'Insurance coverage included',
        'Flexible scheduling',
        'Post-move cleanup'
      ],
      benefits: [
        'Stress-free moving experience',
        'Professional trained team',
        'Transparent pricing',
        'Fully insured service',
        'Customer satisfaction guarantee'
      ],
      process: [
        {
          step: 1,
          title: 'Free Survey',
          description: 'We visit your home to assess requirements and provide accurate quote'
        },
        {
          step: 2,
          title: 'Planning',
          description: 'Detailed moving plan tailored to your specific needs and timeline'
        },
        {
          step: 3,
          title: 'Packing',
          description: 'Professional packing with high-quality materials to protect your items'
        },
        {
          step: 4,
          title: 'Moving Day',
          description: 'Careful loading, secure transport, and safe delivery to your new home'
        },
        {
          step: 5,
          title: 'Unpacking',
          description: 'Optional unpacking service to help you settle into your new home'
        }
      ],
      pricing: {
        startingPrice: '£200',
        description: 'Prices vary based on house size, distance, and additional services required'
      },
      testimonials: [
        {
          name: 'Sarah Mitchell',
          location: 'Edinburgh',
          text: 'Absolutely fantastic service! The team handled our 4-bedroom house move with incredible care and professionalism.',
          rating: 5
        },
        {
          name: 'James Robertson',
          location: 'Glasgow',
          text: 'From packing to unpacking, everything was seamless. Highly recommend for any house move.',
          rating: 5
        }
      ]
    },
    office: {
      title: 'Office Removals',
      subtitle: 'Business Relocation Specialists',
      icon: '🏢',
      heroImage: '/assets/images/office-removals.jpg',
      description: 'Minimize business downtime with our professional office relocation services, including IT equipment handling and project management.',
      features: [
        'Detailed project planning',
        'IT equipment specialists',
        'Secure document handling',
        'Furniture disassembly/assembly',
        'Weekend/evening moves',
        'Minimal downtime guarantee',
        'Employee workstation setup',
        'Waste disposal service'
      ],
      benefits: [
        'Minimal business disruption',
        'Professional project management',
        'Specialized IT handling',
        'Flexible scheduling',
        'Comprehensive insurance'
      ],
      process: [
        {
          step: 1,
          title: 'Site Survey',
          description: 'Comprehensive assessment of current and new office spaces'
        },
        {
          step: 2,
          title: 'Project Planning',
          description: 'Detailed timeline and logistics plan to minimize business impact'
        },
        {
          step: 3,
          title: 'Pre-Move Setup',
          description: 'Preparation of new office space and IT infrastructure planning'
        },
        {
          step: 4,
          title: 'Moving Day',
          description: 'Coordinated move with specialized teams for different equipment types'
        },
        {
          step: 5,
          title: 'Setup & Testing',
          description: 'Complete setup and testing to ensure business continuity'
        }
      ],
      pricing: {
        startingPrice: '£300',
        description: 'Competitive rates for businesses of all sizes with transparent pricing'
      },
      testimonials: [
        {
          name: 'Emma Thompson',
          location: 'Aberdeen',
          text: 'Our office relocation was completed over the weekend with zero downtime. Exceptional service!',
          rating: 5
        },
        {
          name: 'David Williams',
          location: 'Dundee',
          text: 'Professional team handled our sensitive IT equipment with great care. Highly recommended.',
          rating: 5
        }
      ]
    },
    packing: {
      title: 'Packing Services',
      subtitle: 'Professional Packing Solutions',
      icon: '📦',
      heroImage: '/assets/images/packing-service.jpg',
      description: 'Expert packing services using premium materials to ensure your belongings are safely protected during transport.',
      features: [
        'Professional packing materials',
        'Fragile item specialists',
        'Custom crating service',
        'Inventory management',
        'Labeling system',
        'Unpacking service',
        'Wardrobe boxes',
        'Specialty item handling'
      ],
      benefits: [
        'Time-saving solution',
        'Professional protection',
        'Reduced damage risk',
        'Organized moving process',
        'Insurance benefits'
      ],
      process: [
        {
          step: 1,
          title: 'Assessment',
          description: 'Evaluation of items requiring packing and special handling needs'
        },
        {
          step: 2,
          title: 'Material Supply',
          description: 'Provision of high-quality packing materials and specialized boxes'
        },
        {
          step: 3,
          title: 'Professional Packing',
          description: 'Systematic packing with proper techniques for different item types'
        },
        {
          step: 4,
          title: 'Labeling & Inventory',
          description: 'Clear labeling and detailed inventory for easy unpacking'
        },
        {
          step: 5,
          title: 'Unpacking Service',
          description: 'Optional unpacking and placement service at your new location'
        }
      ],
      pricing: {
        startingPrice: '£25/hour',
        description: 'Hourly rates for professional packing teams with all materials included'
      },
      testimonials: [
        {
          name: 'Linda Fraser',
          location: 'Stirling',
          text: 'The packing team was incredibly thorough. Not a single item was damaged during our move.',
          rating: 5
        },
        {
          name: 'Michael Chen',
          location: 'Perth',
          text: 'Professional packing service saved us so much time and stress. Worth every penny!',
          rating: 5
        }
      ]
    },
    storage: {
      title: 'Storage Solutions',
      subtitle: 'Secure Storage Facilities',
      icon: '🏪',
      heroImage: '/assets/images/storage-facility.jpg',
      description: 'Clean, secure, and accessible storage facilities for short-term and long-term needs with flexible access options.',
      features: [
        '24/7 monitored security',
        'Climate-controlled units',
        'Various unit sizes',
        'Flexible access hours',
        'Integrated moving service',
        'Inventory management',
        'Individual unit alarms',
        'Professional storage advice'
      ],
      benefits: [
        'Peace of mind security',
        'Flexible storage periods',
        'Convenient access',
        'Climate protection',
        'Competitive pricing'
      ],
      process: [
        {
          step: 1,
          title: 'Consultation',
          description: 'Assessment of storage needs and unit size requirements'
        },
        {
          step: 2,
          title: 'Unit Selection',
          description: 'Choose the perfect unit size and features for your needs'
        },
        {
          step: 3,
          title: 'Move-In',
          description: 'Professional transportation and placement of items in storage'
        },
        {
          step: 4,
          title: 'Ongoing Access',
          description: 'Convenient access to your stored items when needed'
        },
        {
          step: 5,
          title: 'Move-Out',
          description: 'Seamless retrieval and delivery when you need your items back'
        }
      ],
      pricing: {
        startingPrice: '£15/week',
        description: 'Competitive weekly rates with no long-term commitments required'
      },
      testimonials: [
        {
          name: 'Rachel Green',
          location: 'Inverness',
          text: 'Clean, secure facility with excellent access. Perfect for our temporary storage needs.',
          rating: 5
        },
        {
          name: 'Tom Anderson',
          location: 'Falkirk',
          text: 'Great storage solution during our house sale. Professional service throughout.',
          rating: 5
        }
      ]
    },
    international: {
      title: 'International Removals',
      subtitle: 'Worldwide Moving Services',
      icon: '🌍',
      heroImage: '/assets/images/international-removals.jpg',
      description: 'Professional international moving services with comprehensive customs handling, secure shipping, and worldwide delivery.',
      features: [
        'Worldwide shipping network',
        'Customs documentation',
        'Secure containerized transport',
        'Door-to-door service',
        'Pet relocation services',
        'Temporary storage abroad',
        'Insurance coverage',
        'Real-time tracking'
      ],
      benefits: [
        'Global expertise',
        'Hassle-free customs',
        'Secure international transport',
        'Comprehensive insurance',
        'Multilingual support'
      ],
      process: [
        {
          step: 1,
          title: 'Consultation',
          description: 'Detailed assessment of international moving requirements and destination'
        },
        {
          step: 2,
          title: 'Documentation',
          description: 'Complete customs paperwork and shipping documentation'
        },
        {
          step: 3,
          title: 'Packing & Collection',
          description: 'Professional international packing and collection from your home'
        },
        {
          step: 4,
          title: 'Shipping',
          description: 'Secure containerized shipping with real-time tracking'
        },
        {
          step: 5,
          title: 'Delivery',
          description: 'Customs clearance and delivery to your new international address'
        }
      ],
      pricing: {
        startingPrice: '£1,500',
        description: 'Comprehensive international moving packages with transparent pricing'
      },
      testimonials: [
        {
          name: 'Amanda Clarke',
          location: 'Now in Sydney',
          text: 'Our move from Edinburgh to Australia was seamless. Professional service from start to finish.',
          rating: 5
        },
        {
          name: 'Robert Chen',
          location: 'Now in Toronto',
          text: 'Excellent international moving service. Everything arrived safely and on time.',
          rating: 5
        }
      ]
    }
  };

  const service = serviceConfigs[serviceType];

  if (!service) {
    return (
      <div className="service-page-error">
        <h1>Service Not Found</h1>
        <p>The requested service page could not be found.</p>
        <Button onClick={() => navigate(`/${lang}`)}>
          Return Home
        </Button>
      </div>
    );
  }

  const handleGetQuote = () => {
    navigate(`/${lang}/contact`, {
      state: { serviceType, serviceName: service.title }
    });
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+447404228217';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/447404228217', '_blank');
  };

  return (
    <div className="service-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="service-hero-background">
          <div className="service-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="service-hero-content">
            <div className="service-hero-text">
              <div className="service-icon">{service.icon}</div>
              <h1 className="service-title">{service.title}</h1>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="service-description">{service.description}</p>

              <div className="service-hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetQuote}
                  className="cta-button"
                >
                  <FaQuoteLeft />
                  Get Free Quote
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCallNow}
                  className="call-button"
                >
                  <FaPhone />
                  Call Now
                </Button>
              </div>

              <div className="service-hero-stats">
                <div className="stat-item">
                  <FaStar className="stat-icon" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="stat-item">
                  <FaCheckCircle className="stat-icon" />
                  <span>Fully Insured</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span>Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="service-features">
        <div className="container">
          <div className="section-header">
            <h2>What's Included</h2>
            <p>Comprehensive service features designed for your peace of mind</p>
          </div>

          <div className="features-grid">
            {service.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="service-process">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>Simple, transparent steps from start to finish</p>
          </div>

          <div className="process-timeline">
            {service.process.map((step, index) => (
              <div key={index} className="process-step">
                <div className="process-number">{step.step}</div>
                <div className="process-content">
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-description">{step.description}</p>
                </div>
                {index < service.process.length - 1 && (
                  <div className="process-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Why Choose Our {service.title}?</h2>
              <div className="benefits-list">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <FaCheckCircle className="benefit-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-info">
                <div className="price-display">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">{service.pricing.startingPrice}</span>
                </div>
                <p className="price-description">{service.pricing.description}</p>
              </div>
            </div>

            <div className="benefits-image">
              <div className="benefits-placeholder">
                <span className="benefits-icon">{service.icon}</span>
                <h3>Professional Service</h3>
                <p>Trusted by thousands of customers across Scotland</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="service-testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real feedback from satisfied customers</p>
          </div>

          <div className="testimonials-grid">
            {service.testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-text">"{testimonial.text}"</p>

                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-filled" />
                    ))}
                  </div>

                  <div className="testimonial-author">
                    <div className="author-info">
                      <strong className="author-name">{testimonial.name}</strong>
                      <span className="author-location">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Get your free, no-obligation quote today and experience our professional service</p>

            <div className="cta-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetQuote}
                className="cta-primary"
              >
                <FaArrowRight />
                Get Free Quote
              </Button>

              <div className="cta-contact-options">
                <button className="contact-option" onClick={handleCallNow}>
                  <FaPhone className="contact-icon" />
                  <div className="contact-details">
                    <span className="contact-label">Call Now</span>
                    <span className="contact-value">07404 228217</span>
                  </div>
                </button>

                <button className="contact-option" onClick={handleWhatsApp}>
                  <FaWhatsapp className="contact-icon whatsapp" />
                  <div className="contact-details">
                    <span className="contact-label">WhatsApp</span>
                    <span className="contact-value">Message Us</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="cta-guarantee">
              <FaCheckCircle className="guarantee-icon" />
              <span>Free quotes • No hidden fees • Fully insured service</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;