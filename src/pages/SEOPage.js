// src/pages/SEOPage.js - Complete Fixed SEO Content Page with Proper Canonicals
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * SEO page with rich content for search engines
 * FIXED: Proper canonical URL handling to prevent duplicate content issues
 */
const SEOPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  // FIXED: Always canonicalize to /en/ version to prevent duplicates
  const getCanonicalUrl = () => {
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;

    // Remove language prefix and always use /en/ as canonical
    const pathWithoutLang = currentPath.replace(/^\/(en|zh)/, '');
    return `${baseUrl}/en${pathWithoutLang}`;
  };

  // FIXED: Generate proper hreflang URLs
  const getHreflangUrls = () => {
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|zh)/, '');

    return {
      en: `${baseUrl}/en${pathWithoutLang}`,
      zh: `${baseUrl}/zh${pathWithoutLang}`,
      default: `${baseUrl}/en${pathWithoutLang}`
    };
  };

  const hreflangUrls = getHreflangUrls();
  const canonicalUrl = getCanonicalUrl();

  return (
    <>
      {/* FIXED: Proper SEO Meta Tags with Canonical */}
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

        {/* FIXED: Always canonical to /en/ version */}
        <link rel="canonical" href={canonicalUrl} />

        {/* FIXED: Proper hreflang implementation */}
        <link rel="alternate" hreflang="en" href={hreflangUrls.en} />
        <link rel="alternate" hreflang="zh" href={hreflangUrls.zh} />
        <link rel="alternate" hreflang="x-default" href={hreflangUrls.default} />

        {/* Enhanced Structured Data for Services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Professional Removal Services Scotland",
            "description": "Comprehensive removal and moving services across Scotland including house relocations, student moves, and office removals",
            "url": canonicalUrl,
            "provider": {
              "@type": "LocalBusiness",
              "name": "Eremovals",
              "url": "https://eremovals.uk",
              "telephone": "+447404228217",
              "email": "eremovalsscot@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Edinburgh",
                "addressRegion": "Scotland",
                "addressCountry": "GB"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1247",
                "bestRating": "5",
                "worstRating": "1"
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
            ],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": "50",
              "description": "Starting from £50 for student moves"
            }
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
              <h3>House Relocations Scotland</h3>
              <p>Complete home moving services with professional packing, secure transport, and careful handling of your belongings. Perfect for families relocating across Scotland.</p>
              <ul>
                <li>Professional packing services</li>
                <li>Furniture protection and assembly</li>
                <li>Local and long-distance moves</li>
                <li>Comprehensive insurance coverage</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Student Moves Edinburgh & Glasgow</h3>
              <p>Affordable moving solutions designed for students and young professionals. Flexible scheduling around academic terms with budget-friendly rates from £50.</p>
              <ul>
                <li>Student-friendly pricing from £50</li>
                <li>University halls specialists</li>
                <li>End-of-term storage options</li>
                <li>Same-day service available</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Office Removals Scotland</h3>
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
              <h3>Secure Storage Solutions</h3>
              <p>Climate-controlled storage facilities for short-term and long-term needs with 24/7 monitored security throughout Scotland.</p>
              <ul>
                <li>24/7 monitored security</li>
                <li>Climate-controlled options</li>
                <li>Flexible access hours</li>
                <li>Various unit sizes available</li>
              </ul>
            </div>

            <div className="service-card">
              <h3>Professional Packing Services</h3>
              <p>Expert packing and unpacking services with quality materials and specialist techniques for fragile and valuable items.</p>
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
          <h2>Scotland Removal Services Coverage</h2>
          <p>Based in Edinburgh, we provide professional removal services throughout Scotland:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h4>Major Cities - Removal Services</h4>
              <ul>
                <li>Edinburgh removal services</li>
                <li>Glasgow removal services</li>
                <li>Aberdeen removal services</li>
                <li>Dundee removal services</li>
              </ul>
            </div>
            <div>
              <h4>Central Scotland Coverage</h4>
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
          <h2>Why Choose Eremovals Scotland?</h2>
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
          <h2>Removal Services by Location</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            <div className="location-service">
              <h3>Edinburgh Removal Services</h3>
              <p>Comprehensive removal services in Scotland's capital including:</p>
              <ul>
                <li>Student moves near Edinburgh University</li>
                <li>House relocations across Edinburgh</li>
                <li>Office removals in Edinburgh business district</li>
                <li>Packing services Edinburgh</li>
              </ul>
            </div>

            <div className="location-service">
              <h3>Glasgow Removal Services</h3>
              <p>Professional moving services throughout Glasgow and surrounding areas:</p>
              <ul>
                <li>Student moves University of Glasgow</li>
                <li>House relocations Glasgow</li>
                <li>Commercial office removals</li>
                <li>Same-day delivery services</li>
              </ul>
            </div>

            <div className="location-service">
              <h3>Aberdeen Removal Services</h3>
              <p>Reliable removal services in the Granite City:</p>
              <ul>
                <li>Student moves Aberdeen University</li>
                <li>Oil industry office relocations</li>
                <li>Secure storage Aberdeen</li>
                <li>Long-distance moves from Aberdeen</li>
              </ul>
            </div>

            <div className="location-service">
              <h3>Dundee Removal Services</h3>
              <p>Expert moving services in Dundee and Tayside:</p>
              <ul>
                <li>University of Dundee student moves</li>
                <li>House relocations Dundee</li>
                <li>Business removals</li>
                <li>Storage solutions Dundee</li>
              </ul>
            </div>

          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Frequently Asked Questions - Scotland Removals</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>How much do removal services cost in Scotland?</h4>
              <p>Our removal services start from £50 for student moves and £200 for full house relocations. Final costs depend on distance, volume, and additional services required. We provide free, detailed quotes with no hidden fees.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>Do you provide removal services throughout Scotland?</h4>
              <p>Yes, we cover all of Scotland including Edinburgh, Glasgow, Aberdeen, Dundee, Stirling, Highlands, and Islands. We also offer UK-wide moving services for long-distance relocations.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>Are you insured for removal services?</h4>
              <p>Yes, we carry comprehensive insurance including public liability and goods-in-transit coverage. All our removal services are fully insured for your peace of mind.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>Do you offer same-day removal services?</h4>
              <p>Yes, we provide same-day removal services for urgent moves and deliveries across Scotland, subject to availability. Contact us for immediate assistance.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>What areas in Scotland do you serve?</h4>
              <p>We provide removal services throughout Scotland including all major cities (Edinburgh, Glasgow, Aberdeen, Dundee), central Scotland (Stirling, Perth, Falkirk), and the Highlands and Islands (Inverness, Fort William, Skye).</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>Do you specialize in student moves?</h4>
              <p>Yes, we specialize in affordable student moves with flexible scheduling around academic terms. Our student-friendly pricing starts from £50, and we're experts in university halls relocations across Scotland.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>What makes your house relocations different?</h4>
              <p>Our house relocations include professional packing, furniture protection, comprehensive insurance, and careful handling. We offer both local and long-distance moves with experienced teams and transparent pricing.</p>
            </div>

            <div className="faq-item" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h4>Do you provide storage solutions?</h4>
              <p>Yes, we offer secure, climate-controlled storage facilities with 24/7 monitoring. Perfect for temporary storage during house moves or long-term storage needs. Various unit sizes available across Scotland.</p>
            </div>

          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Professional Moving Services Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>🏠 House Relocations</h4>
              <p>Complete home moving services with professional packing and care for all your belongings.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>🎓 Student Moves</h4>
              <p>Budget-friendly student moving services with flexible scheduling around academic terms.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>🏢 Office Removals</h4>
              <p>Business relocations with minimal downtime and expert handling of office equipment.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>📦 Packing Services</h4>
              <p>Professional packing with quality materials and expert techniques for fragile items.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>🏪 Storage Solutions</h4>
              <p>Secure, climate-controlled storage with 24/7 monitoring and flexible access.</p>
            </div>

            <div className="feature-card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4>🚐 Man and Van</h4>
              <p>Flexible, cost-effective solutions for smaller moves and urgent deliveries.</p>
            </div>

          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Get Your Free Scotland Removal Services Quote</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Ready to move? Contact Scotland's trusted removal company for a free, no-obligation quote tailored to your specific needs.
            Over 1000+ successful moves completed with 4.8-star customer rating.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href="tel:+447404228217" style={{
              background: '#fa7731',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              📞 Call: 07404 228217
            </a>
            <a href="mailto:eremovalsscot@gmail.com" style={{
              background: '#333',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              ✉️ Email: eremovalsscot@gmail.com
            </a>
            <a href="https://wa.me/447404228217" target="_blank" rel="noopener noreferrer" style={{
              background: '#25d366',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              💬 WhatsApp: 07404 228217
            </a>
          </div>
        </section>

        <section style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: '#fef3f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Emergency Removal Services Scotland</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Need urgent removal services? We provide emergency and same-day moving services across Scotland.
            Whether it's a last-minute student move, urgent office relocation, or emergency house clearance,
            our team is ready to help 24/7.
          </p>
          <ul style={{ marginBottom: '1.5rem' }}>
            <li>24/7 emergency removal services</li>
            <li>Same-day availability Scotland-wide</li>
            <li>Urgent student accommodation moves</li>
            <li>Emergency office relocations</li>
            <li>Last-minute house clearances</li>
          </ul>
          <p style={{ fontWeight: 'bold', color: '#dc2626' }}>
            Call now for immediate assistance: 07404 228217
          </p>
        </section>

      </div>
    </>
  );
};

export default SEOPage;