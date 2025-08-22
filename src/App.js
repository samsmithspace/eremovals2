// src/App.js - FIXED VERSION - Add SameDayQuote import
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
import StudentMovesEdinburghLanding from './pages/landing/StudentMovesEdinburghLanding';

// FIXED: Add the missing SameDayQuote import
import SameDayQuote from './features/quotes/components/SameDayQuote';

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
      <a href="/en" style={{ color: '#fa7731' }}>Return to Home</a>
    </div>
  </AppLayout>
);

// Placeholder components for missing pages
const AboutPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>About Eremovals</h1>
      <p>Professional removal services across Scotland with over 10 years of experience.</p>
    </div>
  </AppLayout>
);

const BlogPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Moving Tips & News</h1>
      <p>Latest news and helpful tips for your move.</p>
    </div>
  </AppLayout>
);

const TestimonialsPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Customer Testimonials</h1>
      <p>Read what our customers say about our removal services.</p>
    </div>
  </AppLayout>
);

const PrivacyPolicyPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
      <p>How we handle and protect your personal information.</p>
    </div>
  </AppLayout>
);

const CookiePolicyPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Cookie Policy</h1>
      <p>Information about how we use cookies on our website.</p>
    </div>
  </AppLayout>
);

const CareersPage = () => (
  <AppLayout>
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Careers</h1>
      <p>Join our professional removal team. Current opportunities and how to apply.</p>
    </div>
  </AppLayout>
);

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
                  {/* FIXED: Root homepage redirects to /en */}
                  <Route
                    path="/"
                    element={<Navigate to="/en" replace />}
                  />

                  {/* FIXED: All direct routes (without language) redirect to /en versions */}
                  <Route path="/services" element={<Navigate to="/en/services" replace />} />
                  <Route path="/removal-services" element={<Navigate to="/en/removal-services" replace />} />
                  <Route path="/house-relocations" element={<Navigate to="/en/house-relocations" replace />} />
                  <Route path="/office-removals" element={<Navigate to="/en/office-removals" replace />} />
                  <Route path="/student-moves" element={<Navigate to="/en/student-moves" replace />} />
                  <Route path="/packing-services" element={<Navigate to="/en/packing-services" replace />} />
                  <Route path="/secure-storage" element={<Navigate to="/en/secure-storage" replace />} />
                  <Route path="/international-removals" element={<Navigate to="/en/international-removals" replace />} />
                  <Route path="/same-day-move" element={<Navigate to="/en/same-day-move" replace />} />
                  <Route path="/same-day-quote" element={<Navigate to="/en/same-day-quote" replace />} />
                  <Route path="/contact" element={<Navigate to="/en/contact" replace />} />
                  <Route path="/about" element={<Navigate to="/en/about" replace />} />
                  <Route path="/blog" element={<Navigate to="/en/blog" replace />} />
                  <Route path="/testimonials" element={<Navigate to="/en/testimonials" replace />} />
                  <Route path="/reviews" element={<Navigate to="/en/reviews" replace />} />
                  <Route path="/careers" element={<Navigate to="/en/careers" replace />} />
                  <Route path="/privacy-policy" element={<Navigate to="/en/privacy-policy" replace />} />
                  <Route path="/cookie-policy" element={<Navigate to="/en/cookie-policy" replace />} />
                  <Route path="/terms-and-conditions" element={<Navigate to="/en/terms-and-conditions" replace />} />

                  {/* FIXED: All location-specific redirects */}
                  <Route path="/removal-services-edinburgh" element={<Navigate to="/en/removal-services-edinburgh" replace />} />
                  <Route path="/removal-services-glasgow" element={<Navigate to="/en/removal-services-glasgow" replace />} />
                  <Route path="/removal-services-aberdeen" element={<Navigate to="/en/removal-services-aberdeen" replace />} />
                  <Route path="/removal-services-dundee" element={<Navigate to="/en/removal-services-dundee" replace />} />
                  <Route path="/house-relocations-edinburgh" element={<Navigate to="/en/house-relocations-edinburgh" replace />} />
                  <Route path="/house-relocations-glasgow" element={<Navigate to="/en/house-relocations-glasgow" replace />} />
                  <Route path="/house-relocations-aberdeen" element={<Navigate to="/en/house-relocations-aberdeen" replace />} />
                  <Route path="/office-removals-edinburgh" element={<Navigate to="/en/office-removals-edinburgh" replace />} />
                  <Route path="/office-removals-glasgow" element={<Navigate to="/en/office-removals-glasgow" replace />} />
                  <Route path="/office-removals-aberdeen" element={<Navigate to="/en/office-removals-aberdeen" replace />} />
                  <Route path="/student-moves-edinburgh" element={<Navigate to="/en/student-moves-edinburgh" replace />} />
                  <Route path="/student-moves-glasgow" element={<Navigate to="/en/student-moves-glasgow" replace />} />
                  <Route path="/student-moves-aberdeen" element={<Navigate to="/en/student-moves-aberdeen" replace />} />
                  <Route path="/student-moves-dundee" element={<Navigate to="/en/student-moves-dundee" replace />} />
                  <Route path="/packing-services-edinburgh" element={<Navigate to="/en/packing-services-edinburgh" replace />} />
                  <Route path="/packing-services-glasgow" element={<Navigate to="/en/packing-services-glasgow" replace />} />
                  <Route path="/secure-storage-edinburgh" element={<Navigate to="/en/secure-storage-edinburgh" replace />} />
                  <Route path="/secure-storage-glasgow" element={<Navigate to="/en/secure-storage-glasgow" replace />} />

                  {/* FIXED: Only language-specific routes remain - these are the canonical versions */}
                  <Route path="/:lang/*" element={
                    <LanguageWrapper>
                      <AppLayout>
                        <Routes>
                          {/* Core pages with language */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/location" element={<LocationSelection />} />
                          <Route path="/quote" element={<QuotePage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/same-day-quote" element={<SameDayQuote />} />
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
                          <Route path="/landing/student-moves-edinburgh" element={<StudentMovesEdinburghLanding />} />

                          {/* 404 for unmatched routes within language */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppLayout>
                    </LanguageWrapper>
                  } />

                  {/* Final catch-all for completely unmatched routes */}
                  <Route path="*" element={<Navigate to="/en" replace />} />
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