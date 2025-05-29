// src/App.js - Fixed version with BookingProvider
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
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
    <I18nextProvider i18n={i18n}>
      <BookingProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Router>
            <div className="App">
              <Routes>
                {/* Root redirect to English */}
                <Route path="/" element={<Navigate to="/en" replace />} />

                {/* Language-specific routes with AppLayout wrapper */}
                <Route path="/:lang/*" element={
                  <LanguageWrapper>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/location" element={<LocationSelection />} />
                        <Route path="/quote" element={<QuotePage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/booking-result" element={<BookingResult />} />
                        <Route path="/booking-cancel" element={<PaymentCancellation />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                      </Routes>
                    </AppLayout>
                  </LanguageWrapper>
                } />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/en" replace />} />
              </Routes>
            </div>
          </Router>
        </Suspense>
      </BookingProvider>
    </I18nextProvider>
  );
}

export default App;