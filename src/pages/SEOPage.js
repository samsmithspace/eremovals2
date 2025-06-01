// src/pages/SEOPage.js - Invisible SEO Content Page
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Invisible SEO page with rich content for search engines
 * This page is hidden from users but crawlable by search engines
 */
const SEOPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  // SEO content structure
  const seoServices = [
    {
      title: 'Man and Van Services',
      slug: 'man-and-van',
      description: 'Professional man and van services across Scotland. Affordable, reliable moving solutions for small moves, single items, and urgent deliveries.',
      keywords: 'man and van, man with van, small moves, single item delivery, urgent transport',
      content: `
        Our man and van service provides flexible, cost-effective moving solutions perfect for smaller relocations. 
        Whether you need to move a single piece of furniture, transport student belongings, or handle an urgent delivery, 
        our experienced drivers and well-equipped vans are ready to help. We serve Edinburgh, Glasgow, Aberdeen, and 
        throughout Scotland with same-day availability often possible.
      `,
      features: [
        'Same-day availability',
        'Competitive hourly rates',
        'Experienced drivers',
        'Fully insured service',
        'Scotland-wide coverage'
      ]
    },
    {
      title: 'Student Removals',
      slug: 'student-removals',
      description: 'Specialist student moving services. Affordable university moves, halls of residence relocations, and student storage solutions across Scotland.',
      keywords: 'student removals, university moves, halls of residence, student storage, affordable moving',
      content: `
        We specialize in student removals, understanding the unique needs and budget constraints of university life. 
        Our student-friendly services include moves between halls of residence, shared accommodation relocations, 
        end-of-term storage solutions, and international student moves. With flexible scheduling around exam periods 
        and competitive student rates, we make university transitions stress-free.
      `,
      features: [
        'Student discount rates',
        'Flexible scheduling',
        'End-of-term storage',
        'Halls of residence specialists',
        'International student moves'
      ]
    },
    {
      title: 'Storage Solutions',
      slug: 'storage',
      description: 'Secure storage facilities in Scotland. Short-term and long-term storage, climate-controlled units, and integrated moving and storage services.',
      keywords: 'storage solutions, secure storage, climate controlled, self storage, moving storage',
      content: `
        Our comprehensive storage solutions provide secure, accessible facilities for all your belongings. 
        From short-term storage during house moves to long-term solutions for business inventory, our clean, 
        dry, and monitored facilities offer peace of mind. Climate-controlled options available for sensitive items. 
        Convenient access hours and integrated moving services make storage simple and stress-free.
      `,
      features: [
        '24/7 monitored security',
        'Climate-controlled options',
        'Flexible access hours',
        'Various unit sizes',
        'Integrated moving service'
      ]
    },
    {
      title: 'Furniture Delivery',
      slug: 'furniture-delivery',
      description: 'Professional furniture delivery services. Same-day delivery, white glove service, assembly options, and fragile item specialists across Scotland.',
      keywords: 'furniture delivery, same day delivery, white glove service, furniture assembly, fragile delivery',
      content: `
        Our furniture delivery service ensures your valuable items arrive safely and on time. 
        Specializing in both retail furniture delivery and private relocations, we handle everything from 
        delicate antiques to modern flat-pack furniture. Our two-man delivery teams provide white glove service 
        including unpacking, positioning, and basic assembly. Same-day and scheduled delivery options available.
      `,
      features: [
        'White glove delivery service',
        'Furniture assembly included',
        'Same-day delivery options',
        'Fragile item specialists',
        'Retail partnership program'
      ]
    },
    {
      title: 'Commercial Removals',
      slug: 'commercial-removals',
      description: 'Business relocation experts. Office moves, commercial storage, IT equipment relocation, and minimal downtime business moving services.',
      keywords: 'commercial removals, office moves, business relocation, IT equipment moving, commercial storage',
      content: `
        Our commercial removal service minimizes business downtime while ensuring a smooth transition to your new premises. 
        We specialize in office relocations, retail moves, and industrial transfers with detailed planning and 
        project management. Services include IT equipment handling, secure document transport, furniture disassembly/reassembly, 
        and weekend/evening moves to reduce business impact.
      `,
      features: [
        'Detailed project planning',
        'Minimal downtime guarantee',
        'IT equipment specialists',
        'Secure document handling',
        'Flexible scheduling options'
      ]
    },
    {
      title: 'Home Removals',
      slug: 'home-removals',
      description: 'Complete home moving services. Full house relocations, packing services, fragile item care, and family moving specialists across Scotland.',
      keywords: 'home removals, house moving, family moves, packing services, residential relocation',
      content: `
        Our home removal service takes the stress out of family relocations with comprehensive moving solutions. 
        From initial survey and packing to careful transport and unpacking at your new home, we handle every detail. 
        Specialized services for families include child-friendly scheduling, fragile item protection, 
        and connections to local services at your destination. Full insurance coverage and transparent pricing included.
      `,
      features: [
        'Complete packing services',
        'Family moving specialists',
        'Fragile item protection',
        'Full insurance coverage',
        'Transparent pricing'
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Professional Moving Services Scotland | Eremovals</title>
        <meta
          name="description"
          content="Professional moving services across Scotland. Man and van, student removals, storage solutions, furniture delivery, commercial moves, and home relocations. Fully insured and reliable."
        />
        <meta
          name="keywords"
          content="moving services scotland, man and van, student removals, storage solutions, furniture delivery, commercial removals, home moves, edinburgh movers, glasgow removals"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://yoursite.com/${lang}/services`} />

        {/* Structured Data for Services */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Eremovals",
            "description": "Professional removal and moving services across Scotland",
            "url": "https://yoursite.com",
            "telephone": "+447404228217",
            "email": "eremovalsscot@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Edinburgh",
              "addressRegion": "Scotland",
              "addressCountry": "GB"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "55.953251",
              "longitude": "-3.188267"
            },
            "areaServed": [
              "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling", "Scotland"
            ],
            "serviceType": [
              "Man and Van Services",
              "Student Removals",
              "Storage Solutions",
              "Furniture Delivery",
              "Commercial Removals",
              "Home Removals"
            ]
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <div className="seo-content">
          <h1>Professional Moving Services Scotland - Eremovals</h1>
          <p>
            Leading removal company providing comprehensive moving services across Scotland.
            Specializing in residential moves, commercial relocations, student removals,
            and secure storage solutions with over 10 years of experience.
          </p>

          {/* Service Sections */}
          {seoServices.map((service, index) => (
            <section key={service.slug} className="seo-service-section">
              <h2>{service.title} in Scotland</h2>
              <p>{service.description}</p>
              <div className="seo-content-detail">
                <p>{service.content}</p>
              </div>

              <h3>{service.title} Features</h3>
              <ul>
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              {/* Location-specific content */}
              <h3>{service.title} Coverage Areas</h3>
              <p>
                We provide {service.title.toLowerCase()} services throughout Scotland including:
              </p>
              <ul>
                <li>Edinburgh {service.title}</li>
                <li>Glasgow {service.title}</li>
                <li>Aberdeen {service.title}</li>
                <li>Dundee {service.title}</li>
                <li>Stirling {service.title}</li>
                <li>Perth {service.title}</li>
                <li>Inverness {service.title}</li>
                <li>Falkirk {service.title}</li>
              </ul>

              {/* Service-specific keywords */}
              <div className="seo-keywords">
                <p>
                  Related services: {service.keywords}
                </p>
              </div>
            </section>
          ))}

          {/* Additional SEO Content */}
          <section className="seo-additional-content">
            <h2>Why Choose Eremovals for Your Move?</h2>
            <p>
              With over 1000 successful moves and a 4.8-star rating on Trustpilot,
              Eremovals is Scotland's trusted moving partner. Our fully insured,
              professional team provides reliable, affordable moving solutions
              tailored to your specific needs.
            </p>

            <h3>Service Areas</h3>
            <p>
              Based in Edinburgh, we serve all of Scotland including major cities
              and remote areas. Our fleet of modern vehicles and experienced team
              ensure your belongings arrive safely, whether moving locally or
              across the country.
            </p>

            <h3>Customer Guarantee</h3>
            <p>
              We guarantee professional service, transparent pricing, and careful
              handling of your belongings. All moves include comprehensive insurance
              and our customer satisfaction promise.
            </p>
          </section>

          {/* FAQ Section for SEO */}
          <section className="seo-faq">
            <h2>Frequently Asked Questions</h2>

            <div className="seo-faq-item">
              <h3>How much do removal services cost in Scotland?</h3>
              <p>
                Our removal costs vary depending on service type and distance.
                Student moves start from £50, man and van services from £60,
                and full house removals from £200. Contact us for a free,
                no-obligation quote.
              </p>
            </div>

            <div className="seo-faq-item">
              <h3>Do you provide same-day moving services?</h3>
              <p>
                Yes, we offer same-day services for urgent moves, furniture delivery,
                and man and van requirements. Subject to availability, contact us
                early in the day for best availability.
              </p>
            </div>

            <div className="seo-faq-item">
              <h3>What areas of Scotland do you cover?</h3>
              <p>
                We provide moving services throughout Scotland, from the Borders
                to the Highlands. Major service areas include Edinburgh, Glasgow,
                Aberdeen, Dundee, Stirling, Perth, and Inverness.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SEOPage;