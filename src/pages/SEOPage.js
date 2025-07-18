// src/pages/SEOPage.js - Fixed SEO Content Page
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * SEO page with rich content for search engines
 */
const SEOPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  // Get current URL
  const currentUrl = window.location.origin;
  const currentPath = window.location.pathname;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Professional Removal Services Scotland | Eremovals</title>
        <meta
          name="description"
          content="Professional removal services across Scotland. House relocations, student moves, office removals, secure storage, and man and van services. Fully insured with 4.8-star rating."
        />
        <meta
          name="keywords"
          content="removal services scotland, house relocations, student moves, office removals, man and van, professional movers, edinburgh removals, glasgow removals, scotland moving company"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${currentUrl}${currentPath}`} />

        {/* Structured Data for Services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Professional Removal Services Scotland",
            "description": "Comprehensive removal and moving services across Scotland including house relocations, student moves, and office removals",
            "provider": {
              "@type": "LocalBusiness",
              "name": "Eremovals",
              "url": currentUrl,
              "telephone": "+447404228217",
              "email": "eremovalsscot@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Edinburgh",
                "addressRegion": "Scotland",
                "addressCountry": "GB"
              }
            },
            "areaServed": [
              "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling", "Scotland"
            ],
            "serviceType": [
              "House Relocations",
              "Student Moves",
              "Office Removals",
              "Man and Van Services",
              "Storage Solutions",
              "Packing Services"
            ]
          })}
        </script>
      </Helmet>

      {/* Visible Content for Users */}
      <div className="seo-page-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Professional Removal Services Scotland</h1>

        <div className="hero-section" style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#666' }}>
            Leading removal company providing comprehensive moving services across Scotland.
            Specializing in house relocations, student moves, office removals, and secure storage solutions
            with over 10 years of experience and a 4.8-star customer rating.
          </p>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Our Removal Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            <div className="service-card">
              <h3>House Relocations</h3>
              <p>Complete home moving services with professional packing, secure transport, and careful handling of your belongings. Perfect for families relocating across Scotland.</p>
              <ul>
                <li>Professional packing services</li>
                <li>Furniture protection and assembly</li>
                <li>Local and long-distance moves</li>
                <li>Comprehensive insurance coverage</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Student Moves</h3>
              <p>Affordable moving solutions designed for students and young professionals. Flexible scheduling around academic terms with budget-friendly rates.</p>
              <ul>
                <li>Student-friendly pricing from £50</li>
                <li>University halls specialists</li>
                <li>End-of-term storage options</li>
                <li>Same-day service available</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Office Removals</h3>
              <p>Business relocation services with minimal downtime. Expert handling of office equipment, documents, and furniture with detailed project planning.</p>
              <ul>
                <li>Minimal business disruption</li>
                <li>IT equipment specialists</li>
                <li>Secure document handling</li>
                <li>Weekend and evening moves</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Man and Van Services</h3>
              <p>Flexible, cost-effective solutions for smaller moves, single items, and urgent deliveries across Scotland with same-day availability.</p>
              <ul>
                <li>Same-day availability</li>
                <li>Competitive hourly rates</li>
                <li>Experienced drivers</li>
                <li>Scotland-wide coverage</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Storage Solutions</h3>
              <p>Secure, climate-controlled storage facilities for short-term and long-term needs with 24/7 monitored security.</p>
              <ul>
                <li>24/7 monitored security</li>
                <li>Climate-controlled options</li>
                <li>Flexible access hours</li>
                <li>Various unit sizes available</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Packing Services</h3>
              <p>Professional packing and unpacking services with quality materials and expert techniques for fragile and valuable items.</p>
              <ul>
                <li>Professional packing materials</li>
                <li>Fragile item specialists</li>
                <li>Unpacking services available</li>
                <li>Custom packing solutions</li>
              </ul>
            </div>

          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Service Areas Across Scotland</h2>
          <p>Based in Edinburgh, we provide professional removal services throughout Scotland:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h4>Major Cities</h4>
              <ul>
                <li>Edinburgh removal services</li>
                <li>Glasgow removal services</li>
                <li>Aberdeen removal services</li>
                <li>Dundee removal services</li>
              </ul>
            </div>
            <div>
              <h4>Central Scotland</h4>
              <ul>
                <li>Stirling removal services</li>
                <li>Perth removal services</li>
                <li>Falkirk removal services</li>
                <li>Livingston removal services</li>
              </ul>
            </div>
            <div>
              <h4>Highlands & Islands</h4>
              <ul>
                <li>Inverness removal services</li>
                <li>Fort William removal services</li>
                <li>Oban removal services</li>
                <li>Isle of Skye removal services</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Why Choose Eremovals?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h4>✅ Fully Insured</h4>
              <p>Comprehensive insurance coverage for complete peace of mind</p>
            </div>
            <div>
              <h4>⭐ 4.8-Star Rating</h4>
              <p>Excellent customer reviews and trusted by 1000+ satisfied customers</p>
            </div>
            <div>
              <h4>💰 Transparent Pricing</h4>
              <p>No hidden fees, clear quotes, and competitive rates</p>
            </div>
            <div>
              <h4>🏆 10+ Years Experience</h4>
              <p>Experienced team with proven track record of successful moves</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Get Your Free Quote Today</h2>
          <p>Ready to move? Contact us for a free, no-obligation quote tailored to your specific needs.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href="tel:+447404228217" style={{
              background: '#fa7731',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              📞 Call: 07404 228217
            </a>
            <a href="mailto:eremovalsscot@gmail.com" style={{
              background: '#333',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              ✉️ Email Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default SEOPage;