// src/App.js
import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Import configuration and services
import './i18n/i18n';
import config from './config/config';
import routes from './config/routes';
import { injectGlobalStyles } from './styles/globalStyles';
import analyticsService from './services/analytics';
import storageService from './services/storage';

// Import common components
import AppLayout from './common/components/layout/AppLayout';
import { Spinner, Alert } from './common/components/ui';

// Import context providers
import { AppProvider } from './common/context/AppContext';
import { BookingProvider } from './features/booking/context/BookingContext';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LocationSelection = lazy(() => import('./features/locations/components/LocationSelection'));
const QuotePage = lazy(() => import('./features/quotes/components/QuotePage'));
const ContactPage = lazy(() => import('./features/booking/components/ContactPage'));
const BookingResult = lazy(() => import('./features/booking/components/BookingResult'));
const PaymentCancellation = lazy(() => import('./features/booking/components/PaymentCancellation'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

/**
 * Language Layout component to handle language routing and context
 */
const LanguageLayout = () => {
    const { lang } = useParams();

    useEffect(() => {
        // Import i18n dynamically to avoid circular dependencies
        import('./i18n/i18n').then(({ default: i18n }) => {
            if (lang && routes.patterns.lang.test(lang)) {
                i18n.changeLanguage(lang);

                // Store user's language preference
                storageService.setPreference('language', lang);

                // Track language selection
                analyticsService.trackUserAction('language_selected', 'navigation', { language: lang });
            }
        });
    }, [lang]);

    return (
        <AppLayout>
            <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/location" element={<LocationSelection />} />
                    <Route path="/quote" element={<QuotePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/booking-result" element={<BookingResult />} />
                    <Route path="/booking-cancel" element={<PaymentCancellation />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    {/* Catch-all route for invalid paths within language */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </AppLayout>
    );
};

/**
 * Redirect component for handling non-prefixed paths
 */
const RedirectToDefaultLanguage = () => {
    const defaultLanguage = storageService.getPreference('language', config.defaults.language);

    useEffect(() => {
        analyticsService.trackPageView('redirect_to_default_language', {
            default_language: defaultLanguage,
            current_path: window.location.pathname
        });
    }, [defaultLanguage]);

    return <Navigate to={`/${defaultLanguage}${window.location.pathname}${window.location.search}`} replace />;
};

/**
 * Loading fallback component for page transitions
 */
const PageLoadingFallback = () => (
    <div className="page-loading">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
                <Spinner size="large" />
                <p className="mt-3 text-muted">Loading...</p>
            </div>
        </div>
    </div>
);

/**
 * 404 Not Found page component
 */
const NotFoundPage = () => {
    const { lang } = useParams();

    useEffect(() => {
        analyticsService.trackPageView('404_not_found', {
            path: window.location.pathname,
            language: lang
        });
    }, [lang]);

    return (
        <div className="not-found-page">
            <div className="container">
                <div className="text-center py-5">
                    <h1 className="display-1 font-weight-bold text-primary">404</h1>
                    <h2 className="mb-4">Page Not Found</h2>
                    <p className="text-muted mb-4">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <a href={routes.generate.home(lang)} className="btn btn-primary">
                            Go Home
                        </a>
                        <a href={routes.generate.contact(lang)} className="btn btn-outline">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Error Fallback component for error boundaries
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    useEffect(() => {
        // Track errors to analytics
        analyticsService.trackError(error, {
            component: 'App',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }, [error]);

    return (
        <div className="error-fallback">
            <div className="container">
                <div className="text-center py-5">
                    <Alert variant="error" title="Something went wrong">
                        <p className="mb-3">We're sorry, but something unexpected happened.</p>
                        {config.isDevelopment && (
                            <details className="text-left mt-3">
                                <summary className="cursor-pointer text-sm font-weight-medium">
                                    Error Details (Development Mode)
                                </summary>
                                <pre className="mt-2 p-3 bg-light rounded text-xs overflow-auto">
                  {error.message}
                                    {error.stack}
                </pre>
                            </details>
                        )}
                        <div className="mt-4">
                            <button onClick={resetErrorBoundary} className="btn btn-primary mr-3">
                                Try Again
                            </button>
                            <button onClick={() => window.location.reload()} className="btn btn-outline">
                                Reload Page
                            </button>
                        </div>
                    </Alert>
                </div>
            </div>
        </div>
    );
};

/**
 * Main App component
 */
function App() {
    useEffect(() => {
        // Initialize global styles
        injectGlobalStyles();

        // Initialize analytics
        if (config.features.enableAnalytics) {
            analyticsService.initialize({
                googleAnalyticsId: config.apiKeys.googleAnalytics,
                // Add other analytics providers as needed
            });
        }

        // Track app initialization
        analyticsService.trackPageView('app_initialized', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
        // Set up global error handling
        window.addEventListener('error', (event) => {
            analyticsService.trackError(event.error || new Error(event.message), {
                type: 'javascript_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Set up unhandled promise rejection tracking
        window.addEventListener('unhandledrejection', (event) => {
            analyticsService.trackError(new Error(event.reason), {
                type: 'unhandled_promise_rejection'
            });
        });

        // Cleanup function
        return () => {
            analyticsService.cleanup();
        };
    }, []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppProvider>
                <BookingProvider>
                    <Router>
                        <Routes>
                            {/* Root path redirects to default language */}
                            <Route path="/" element={<Navigate to={`/${config.defaults.language}`} replace />} />

                            {/* All language-prefixed routes */}
                            <Route path="/:lang/*" element={<LanguageLayout />} />

                            {/* Fallback: redirect non-prefixed paths to default language */}
                            <Route path="/*" element={<RedirectToDefaultLanguage />} />
                        </Routes>
                    </Router>
                </BookingProvider>
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;