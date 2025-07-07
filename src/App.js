// src/App.js - Fixed for SEO while preserving existing functionality
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
                  {/* Direct homepage route for SEO - serves content immediately */}
                  <Route
                    path="/"
                    element={
                      <AppLayout>
                        <HomePage />
                      </AppLayout>
                    }
                  />

                  {/* Language-specific routes with CORRECTED nested routing */}
                  <Route path="/:lang/*" element={
                    <LanguageWrapper>
                      <AppLayout>
                        <Routes>
                          {/* Core pages */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/location" element={<LocationSelection />} />
                          <Route path="/quote" element={<QuotePage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/booking-result" element={<BookingResult />} />
                          <Route path="/booking-cancel" element={<PaymentCancellation />} />
                          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                          <Route path="/services" element={<SEOPage />} />

                          {/* Service-specific routes */}
                          <Route path="/services/domestic" element={<ServicePage />} />
                          <Route path="/services/office" element={<ServicePage />} />
                          <Route path="/services/packing" element={<ServicePage />} />
                          <Route path="/services/storage" element={<ServicePage />} />
                          <Route path="/services/international" element={<ServicePage />} />

                          {/* SEO-friendly service routes within language */}
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

                          {/* Location-specific routes within language */}
                          <Route path="/removal-services-edinburgh" element={<ServicePage />} />
                          <Route path="/removal-services-glasgow" element={<ServicePage />} />
                          <Route path="/removal-services-aberdeen" element={<ServicePage />} />
                          <Route path="/removal-services-dundee" element={<ServicePage />} />
                          <Route path="/house-relocations-edinburgh" element={<ServicePage />} />
                          <Route path="/house-relocations-glasgow" element={<ServicePage />} />
                          <Route path="/office-removals-edinburgh" element={<ServicePage />} />
                          <Route path="/office-removals-glasgow" element={<ServicePage />} />
                          <Route path="/student-moves-edinburgh" element={<ServicePage />} />
                          <Route path="/student-moves-glasgow" element={<ServicePage />} />
                          <Route path="/packing-services-edinburgh" element={<ServicePage />} />
                          <Route path="/secure-storage-edinburgh" element={<ServicePage />} />

                          {/* Catch-all for unmatched routes within language */}
                          <Route path="*" element={<Navigate to={`/${useParams().lang || 'en'}`} replace />} />
                        </Routes>
                      </AppLayout>
                    </LanguageWrapper>
                  } />

                  {/* SEO-friendly top-level routes (without language prefix) */}
                  <Route
                    path="/removal-services"
                    element={
                      <AppLayout>
                        <SEOPage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/house-relocations"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/office-removals"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/student-moves"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/packing-services"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/secure-storage"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/international-removals"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/same-day-move"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <AppLayout>
                        <ContactPage />
                      </AppLayout>
                    }
                  />

                  {/* Location-specific SEO routes at top level */}
                  <Route
                    path="/removal-services-edinburgh"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/removal-services-glasgow"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/house-relocations-edinburgh"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  <Route
                    path="/office-removals-glasgow"
                    element={
                      <AppLayout>
                        <ServicePage />
                      </AppLayout>
                    }
                  />

                  {/* Final fallback - redirect unknown routes to homepage */}
                  <Route path="*" element={<Navigate to="/" replace />} />
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