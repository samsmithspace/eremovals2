// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import config from './config/config';
import storageService from './services/storage';
import reportWebVitals from './reportWebVitals';

// Import global CSS
import './styles/variables.css';

/**
 * Initialize application performance monitoring
 */
const initializePerformanceMonitoring = () => {
    // Web Vitals reporting
    reportWebVitals((metric) => {
        // Track performance metrics
        if (window.gtag) {
            window.gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id,
                non_interaction: true,
            });
        }

        // Store performance data locally for debugging
        if (config.isDevelopment) {
            console.log('Performance Metric:', metric);
        }
    });

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
        try {
            // Monitor long tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) { // Tasks longer than 50ms
                        console.warn('Long Task detected:', entry);
                    }
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });

            // Monitor layout shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.value > 0.1) { // Significant layout shifts
                        console.warn('Layout Shift detected:', entry);
                    }
                });
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
            console.warn('Performance monitoring setup failed:', error);
        }
    }
};

/**
 * Check for critical browser features
 */
const checkBrowserSupport = () => {
    const requiredFeatures = [
        'fetch',
        'Promise',
        'localStorage',
        'sessionStorage'
    ];

    const missingFeatures = requiredFeatures.filter(feature => !(feature in window));

    if (missingFeatures.length > 0) {
        console.warn('Missing browser features:', missingFeatures);

        // Show a warning for unsupported browsers
        const warningMessage = `
      Your browser doesn't support some features required by this application.
      Please update your browser for the best experience.
      Missing: ${missingFeatures.join(', ')}
    `;

        if (confirm(warningMessage + '\n\nContinue anyway?')) {
            return true;
        } else {
            document.body.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
          <h1>Browser Not Supported</h1>
          <p>Please update your browser to use this application.</p>
          <p>Required features: ${requiredFeatures.join(', ')}</p>
        </div>
      `;
            return false;
        }
    }

    return true;
};

/**
 * Application initialization
 */
const initializeApp = () => {
    // Check browser support first
    if (!checkBrowserSupport()) {
        return;
    }

    // Set up error handling before React renders
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);

        // Store error info for debugging
        const errorInfo = {
            message: event.error?.message || event.message,
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        storageService.setSession('last_error', errorInfo);
    });

    // Initialize performance monitoring
    if (!config.isDevelopment || config.features.enablePerformanceMonitoring) {
        initializePerformanceMonitoring();
    }

    // Clean up expired cache entries
    storageService.cleanup();

    // Get React root element
    const container = document.getElementById('root');

    if (!container) {
        console.error('Root element not found');
        return;
    }

    // Create React 18 root
    const root = createRoot(container);

    // Render the app
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

    // Store app initialization timestamp
    storageService.setSession('app_initialized', new Date().toISOString());

    // Development helpers
    if (config.isDevelopment) {
        // Make services available globally for debugging
        window.appDebug = {
            config,
            storageService,
            clearStorage: () => {
                storageService.clearLocal();
                storageService.clearSession();
                console.log('Storage cleared');
            },
            getStorageInfo: () => storageService.getStorageInfo()
        };

        console.log('🚀 App initialized in development mode');
        console.log('🛠️ Debug tools available at window.appDebug');
    }
};

// Start the application
initializeApp();