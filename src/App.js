// src/App.js - FIXED VERSION
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { BookingProvider } from './features/booking/context/BookingContext';
import i18n from './i18n/i18n';

// Import pages
import HomePage from './pages/HomePage';
import LocationSelection from './features/locations/components/LocationSelection';
import QuotePage from './features/quotes/components/QuotePage';
import BookingResult from './features/booking/components/BookingResult';
import PaymentCancellation from './features/booking/components/PaymentCancellation';
import ContactPage from './features/booking/components/ContactPage';
import TermsAndConditions from './pages/TermsAndConditions';
import SEOPage from './pages/SEOPage';
import ServicePage from './features/services/components/ServicePage';
import AppLayout from './common/components/layout/AppLayout';

// Import styles
import './styles/variables.css';

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  }}>
    Loading...
  </div>
);

// Language wrapper component to handle language changes
const LanguageWrapper = ({ children }) => {
  const { lang } = useParams();

  useEffect(() => {
    if (lang && ['en', 'zh'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      // Set document language
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return children;
};

// 404 Not Found component
const NotFound = () => (
  <AppLayout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: '#fa7731' }}>Return to Home</a>
    </div>
  </AppLayout>
);

// About page placeholder
const AboutPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>About Eremovals</h1>
      <p>Professional removal services across Scotland with over 10 years of experience.</p>
    </div>
  </AppLayout>
);

// Blog page placeholder
const BlogPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Moving Tips & News</h1>
      <p>Latest news and helpful tips for your move.</p>
    </div>
  </AppLayout>
);

// Testimonials page placeholder
const TestimonialsPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Customer Testimonials</h1>
      <p>Read what our customers say about our removal services.</p>
    </div>
  </AppLayout>
);

// Privacy Policy page placeholder
const PrivacyPolicyPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
      <p>How we handle and protect your personal information.</p>
    </div>
  </AppLayout>
);

// Cookie Policy page placeholder
const CookiePolicyPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Cookie Policy</h1>
      <p>Information about how we use cookies on our website.</p>
    </div>
  </AppLayout>
);

// Careers page placeholder
const CareersPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Careers</h1>
      <p>Join our professional removal team. Current opportunities and how to apply.</p>
    </div>
  </AppLayout>
);

// Reviews page placeholder
const ReviewsPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Customer Reviews</h1>
      <p>Read verified customer reviews and ratings for our removal services.</p>
    </div>
  </AppLayout>
);

function App() {
  useEffect(() => {
    // Set up language change listener
    const handleLanguageChange = (lng) => {
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Set initial language
    handleLanguageChange(i18n.language || 'en');

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <BookingProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Router>
              <div className="App">
                <Routes>
                  {/* FIXED: Direct homepage route for SEO */}
                  <Route
                    path="/"
                    element={
                      <AppLayout>
                        <HomePage />
                      </AppLayout>
                    }
                  />

                  {/* FIXED: Direct SEO routes without language prefix */}
                  <Route path="/services" element={<AppLayout><SEOPage /></AppLayout>} />
                  <Route path="/removal-services" element={<AppLayout><SEOPage /></AppLayout>} />
                  <Route path="/house-relocations" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/office-removals" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/student-moves" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/packing-services" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/secure-storage" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/international-removals" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/same-day-move" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />

                  {/* FIXED: Direct routes for missing pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="/terms-and-conditions" element={<AppLayout><TermsAndConditions /></AppLayout>} />

                  {/* FIXED: Location-specific SEO routes */}
                  <Route path="/removal-services-edinburgh" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/removal-services-glasgow" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/removal-services-aberdeen" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/house-relocations-edinburgh" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/house-relocations-glasgow" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/house-relocations-aberdeen" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/office-removals-glasgow" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/student-moves-edinburgh" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/student-moves-glasgow" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/packing-services-edinburgh" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/secure-storage-edinburgh" element={<AppLayout><ServicePage /></AppLayout>} />
                  <Route path="/secure-storage-glasgow" element={<AppLayout><ServicePage /></AppLayout>} />

                  {/* Language-specific routes */}
                  <Route path="/:lang/*" element={
                    <LanguageWrapper>
                      <AppLayout>
                        <Routes>
                          {/* Core pages with language */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/location" element={<LocationSelection />} />
                          <Route path="/quote" element={<QuotePage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/booking-result" element={<BookingResult />} />
                          <Route path="/booking-cancel" element={<PaymentCancellation />} />
                          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                          <Route path="/services" element={<SEOPage />} />

                          {/* Service-specific routes with language */}
                          <Route path="/services/domestic" element={<ServicePage />} />
                          <Route path="/services/office" element={<ServicePage />} />
                          <Route path="/services/packing" element={<ServicePage />} />
                          <Route path="/services/storage" element={<ServicePage />} />
                          <Route path="/services/international" element={<ServicePage />} />

                          {/* SEO-friendly service routes with language */}
                          <Route path="/removal-services" element={<SEOPage />} />
                          <Route path="/house-relocations" element={<ServicePage />} />
                          <Route path="/office-removals" element={<ServicePage />} />
                          <Route path="/student-moves" element={<ServicePage />} />
                          <Route path="/packing-services" element={<ServicePage />} />
                          <Route path="/secure-storage" element={<ServicePage />} />
                          <Route path="/international-removals" element={<ServicePage />} />
                          <Route path="/same-day-move" element={<ServicePage />} />
                          <Route path="/eco-friendly-disposal" element={<ServicePage />} />
                          <Route path="/professional-movers" element={<ServicePage />} />

                          {/* Additional pages with language */}
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/blog" element={<BlogPage />} />
                          <Route path="/testimonials" element={<TestimonialsPage />} />
                          <Route path="/reviews" element={<ReviewsPage />} />
                          <Route path="/careers" element={<CareersPage />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

                          {/* Location-specific routes with language */}
                          <Route path="/removal-services-edinburgh" element={<ServicePage />} />
                          <Route path="/removal-services-glasgow" element={<ServicePage />} />
                          <Route path="/removal-services-aberdeen" element={<ServicePage />} />
                          <Route path="/removal-services-dundee" element={<ServicePage />} />
                          <Route path="/house-relocations-edinburgh" element={<ServicePage />} />
                          <Route path="/house-relocations-glasgow" element={<ServicePage />} />
                          <Route path="/house-relocations-aberdeen" element={<ServicePage />} />
                          <Route path="/office-removals-edinburgh" element={<ServicePage />} />
                          <Route path="/office-removals-glasgow" element={<ServicePage />} />
                          <Route path="/office-removals-aberdeen" element={<ServicePage />} />
                          <Route path="/student-moves-edinburgh" element={<ServicePage />} />
                          <Route path="/student-moves-glasgow" element={<ServicePage />} />
                          <Route path="/student-moves-aberdeen" element={<ServicePage />} />
                          <Route path="/student-moves-dundee" element={<ServicePage />} />
                          <Route path="/packing-services-edinburgh" element={<ServicePage />} />
                          <Route path="/packing-services-glasgow" element={<ServicePage />} />
                          <Route path="/secure-storage-edinburgh" element={<ServicePage />} />
                          <Route path="/secure-storage-glasgow" element={<ServicePage />} />

                          {/* FIXED: Catch unmatched routes within language to 404 instead of redirecting */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppLayout>
                    </LanguageWrapper>
                  } />

                  {/* FIXED: Final catch-all for completely unmatched routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </Suspense>
        </BookingProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;