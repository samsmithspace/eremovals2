// src/pages/landing/StudentMovesEdinburghLanding.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShieldAlt, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import './LandingPage.css';

/**
 * Landing Page Example: Student Moves Edinburgh
 * Focused conversion page for Google Ads / Facebook Ads targeting students
 */
const StudentMovesEdinburghLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveDate: '',
    fromAddress: '',
    toAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirect to quote page or success page
      navigate('/en/quote', { state: { formData, service: 'student-move' } });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* SEO Meta Tags - Specific to this landing page */}
      <Helmet>
        <title>Student Moves Edinburgh - From £50 | Book Online Today</title>
        <meta
          name="description"
          content="Affordable student moves in Edinburgh from £50. University specialists with same-day availability. Book your student relocation online now - Free quote!"
        />
        <meta
          name="keywords"
          content="student moves edinburgh, university moves, cheap student removals, edinburgh student relocation, university halls moves"
        />
        <link rel="canonical" href="https://eremovals.uk/landing/student-moves-edinburgh" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Minimal Header - No navigation to avoid distractions */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <h1>Eremovals</h1>
            <span>Professional Student Moves</span>
          </div>
          <div className="urgent-contact">
            <a href="tel:+447404228217" className="urgent-call-btn">
              <FaPhoneAlt />
              Call Now: 07404 228217
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Above the fold conversion focus */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <h1 className="hero-headline">
                Student Moves in Edinburgh <span className="highlight">From £50</span>
              </h1>
              <p className="hero-subheadline">
                Stress-free university moves with same-day availability.
                Trusted by 500+ Edinburgh students this year.
              </p>

              {/* Trust Indicators */}
              <div className="trust-indicators">
                <div className="trust-item">
                  <FaStar className="star" />
                  <span>4.8/5 Rating (200+ Reviews)</span>
                </div>
                <div className="trust-item">
                  <FaShieldAlt className="shield" />
                  <span>Fully Insured & Licensed</span>
                </div>
                <div className="trust-item">
                  <FaCheckCircle className="check" />
                  <span>Same Day Availability</span>
                </div>
              </div>

              {/* Benefits List */}
              <ul className="benefits-list">
                <li>✅ Student-friendly pricing from £50</li>
                <li>✅ University halls specialists</li>
                <li>✅ Flexible scheduling around exams</li>
                <li>✅ Safe handling of electronics & books</li>
                <li>✅ End-of-term storage available</li>
              </ul>
            </div>

            {/* Quote Form - Primary CTA */}
            <div className="hero-right">
              <div className="quote-form-card">
                <h2>Get Instant Quote</h2>
                <p>Free estimate in 60 seconds</p>

                <form onSubmit={handleSubmit} className="quote-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="date"
                      name="moveDate"
                      placeholder="Moving Date"
                      value={formData.moveDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="fromAddress"
                      placeholder="Moving From (Edinburgh area)"
                      value={formData.fromAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="toAddress"
                      placeholder="Moving To (Edinburgh area)"
                      value={formData.toAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Getting Quote...' : 'Get Free Quote Now'}
                  </button>

                  <p className="form-disclaimer">
                    No spam. Instant quote. Free estimate.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="container">
          <h2>What Edinburgh Students Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>"Perfect for student moves! They understood my budget and were super flexible with timing around my exams."</p>
              <cite>- Sarah, Edinburgh University</cite>
            </div>
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>"Moved from Pollock Halls to my flat in Marchmont. Quick, careful with my stuff, and great price!"</p>
              <cite>- James, Heriot-Watt</cite>
            </div>
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>"Last-minute booking for end of semester. They fit me in same day and saved my deposit!"</p>
              <cite>- Emma, Edinburgh College of Art</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <h2>How It Works - 3 Simple Steps</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Get Quote</h3>
              <p>Fill the form above for instant pricing</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Move</h3>
              <p>Choose your date & time online</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>We Move You</h3>
              <p>Professional team handles everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="coverage-area">
        <div className="container">
          <h2>Edinburgh Areas We Serve</h2>
          <div className="areas-grid">
            <div className="area-group">
              <h4>University Areas</h4>
              <ul>
                <li>Pollock Halls</li>
                <li>Blackfriars Court</li>
                <li>Edinburgh University</li>
                <li>Heriot-Watt University</li>
              </ul>
            </div>
            <div className="area-group">
              <h4>Student Districts</h4>
              <ul>
                <li>Marchmont</li>
                <li>Tollcross</li>
                <li>Bruntsfield</li>
                <li>Newington</li>
              </ul>
            </div>
            <div className="area-group">
              <h4>City Areas</h4>
              <ul>
                <li>Old Town</li>
                <li>New Town</li>
                <li>Leith</li>
                <li>Canongate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="secondary-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Book Your Student Move?</h2>
            <p>Join 500+ Edinburgh students who chose us this year</p>
            <div className="cta-buttons">
              <a href="tel:+447404228217" className="cta-btn primary">
                Call Now: 07404 228217
              </a>
              <button
                onClick={() => document.querySelector('.quote-form-card').scrollIntoView()}
                className="cta-btn secondary"
              >
                Get Online Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal, no distracting links */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <h3>Eremovals - Student Moves Edinburgh</h3>
              <p>Professional, affordable, reliable</p>
            </div>
            <div className="footer-right">
              <div className="contact-info">
                <p>📞 07404 228217</p>
                <p>✉️ eremovalsscot@gmail.com</p>
                <p>📍 Serving all Edinburgh areas</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Eremovals. Licensed & Insured Removal Company.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default StudentMovesEdinburghLanding;