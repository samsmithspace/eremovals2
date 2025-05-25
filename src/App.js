// src/App.js
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

// Import pages
import HomePage from './pages/HomePage';
import LocationSelection from './features/locations/components/LocationSelection';
import QuotePage from './features/quotes/components/QuotePage';
import BookingResult from './features/booking/components/BookingResult';
import PaymentCancellation from './features/booking/components/PaymentCancellation';
import ContactPage from './features/booking/components/ContactPage';
import TermsAndConditions from './pages/TermsAndConditions';

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

function App() {
    useEffect(() => {
        // Set document language attribute
        const handleLanguageChange = (lng) => {
            document.documentElement.lang = lng;
        };

        // Listen for language changes
        i18n.on('languageChanged', handleLanguageChange);

        // Set initial language
        handleLanguageChange(i18n.language || 'en');

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    return (
      <I18nextProvider i18n={i18n}>
          <Suspense fallback={<LoadingSpinner />}>
              <Router>
                  <div className="App">
                      <Routes>
                          {/* Root redirect to English */}
                          <Route path="/" element={<Navigate to="/en" replace />} />

                          {/* Language-specific routes */}
                          <Route path="/:lang" element={<HomePage />} />
                          <Route path="/:lang/location" element={<LocationSelection />} />
                          <Route path="/:lang/quote" element={<QuotePage />} />
                          <Route path="/:lang/contact" element={<ContactPage />} />
                          <Route path="/:lang/booking-result" element={<BookingResult />} />
                          <Route path="/:lang/booking-cancel" element={<PaymentCancellation />} />
                          <Route path="/:lang/terms-and-conditions" element={<TermsAndConditions />} />

                          {/* Fallback route */}
                          <Route path="*" element={<Navigate to="/en" replace />} />
                      </Routes>
                  </div>
              </Router>
          </Suspense>
      </I18nextProvider>
    );
}

export default App;