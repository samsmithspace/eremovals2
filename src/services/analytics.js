// src/services/analytics.js
import config from '../config/config';

/**
 * Analytics service for tracking user interactions and events
 * Provides a consistent interface for various analytics providers
 */
class AnalyticsService {
    constructor() {
        this.isInitialized = false;
        this.providers = new Set();
        this.eventQueue = [];
        this.userProperties = {};
    }

    /**
     * Initialize analytics service
     * @param {Object} options - Configuration options
     */
    async initialize(options = {}) {
        if (this.isInitialized) {
           // console.warn('Analytics service already initialized');
            return;
        }

        try {
            // Initialize Google Analytics if configured
            if (options.googleAnalyticsId) {
                await this.initializeGoogleAnalytics(options.googleAnalyticsId);
            }

            // Initialize other providers as needed
            if (options.mixpanelToken) {
                await this.initializeMixpanel(options.mixpanelToken);
            }

            // Process queued events
            this.processEventQueue();

            this.isInitialized = true;
          //  console.log('Analytics service initialized');
        } catch (error) {
           // console.error('Failed to initialize analytics:', error);
        }
    }

    /**
     * Track an event
     * @param {string} eventName - Name of the event
     * @param {Object} properties - Event properties
     * @param {Object} options - Tracking options
     */
    track(eventName, properties = {}, options = {}) {
        const event = {
            name: eventName,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                ...this.userProperties
            },
            options
        };

        if (!this.isInitialized) {
            this.eventQueue.push(event);
            return;
        }

        this.sendEvent(event);
    }

    /**
     * Track page view
     * @param {string} pageName - Name of the page
     * @param {Object} properties - Additional properties
     */
    trackPageView(pageName, properties = {}) {
        this.track('page_view', {
            page_name: pageName,
            ...properties
        });
    }

    /**
     * Track user action
     * @param {string} action - Action type
     * @param {string} category - Action category
     * @param {Object} properties - Additional properties
     */
    trackUserAction(action, category = 'user_interaction', properties = {}) {
        this.track('user_action', {
            action,
            category,
            ...properties
        });
    }

    /**
     * Track business events
     * @param {string} eventType - Type of business event
     * @param {Object} data - Event data
     */
    trackBusinessEvent(eventType, data = {}) {
        const businessEvents = {
            quote_requested: 'Quote Requested',
            booking_created: 'Booking Created',
            payment_initiated: 'Payment Initiated',
            payment_completed: 'Payment Completed',
            promo_code_applied: 'Promo Code Applied'
        };

        const eventName = businessEvents[eventType] || eventType;

        this.track(eventName, {
            event_type: eventType,
            ...data
        });
    }

    /**
     * Set user properties
     * @param {Object} properties - User properties to set
     */
    setUserProperties(properties) {
        this.userProperties = {
            ...this.userProperties,
            ...properties
        };

        // Update user properties in analytics providers
        this.providers.forEach(provider => {
            if (provider.setUserProperties) {
                provider.setUserProperties(properties);
            }
        });
    }

    /**
     * Identify user
     * @param {string} userId - User identifier
     * @param {Object} traits - User traits
     */
    identify(userId, traits = {}) {
        this.setUserProperties({
            user_id: userId,
            ...traits
        });

        this.track('user_identified', {
            user_id: userId,
            ...traits
        });
    }

    /**
     * Track error events
     * @param {Error} error - Error object
     * @param {Object} context - Additional context
     */
    trackError(error, context = {}) {
        this.track('error_occurred', {
            error_message: error.message,
            error_stack: error.stack,
            error_name: error.name,
            ...context
        });
    }

    /**
     * Track performance metrics
     * @param {string} metricName - Name of the metric
     * @param {number} value - Metric value
     * @param {Object} properties - Additional properties
     */
    trackPerformance(metricName, value, properties = {}) {
        this.track('performance_metric', {
            metric_name: metricName,
            metric_value: value,
            ...properties
        });
    }

    /**
     * Initialize Google Analytics
     * @param {string} trackingId - GA tracking ID
     */
    async initializeGoogleAnalytics(trackingId) {
        try {
            // Load Google Analytics script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', trackingId);

            this.providers.add({
                name: 'google_analytics',
                track: (event) => {
                    gtag('event', event.name, event.properties);
                }
            });

          //  console.log('Google Analytics initialized');
        } catch (error) {
         //   console.error('Failed to initialize Google Analytics:', error);
        }
    }

    /**
     * Initialize Mixpanel (example of another provider)
     * @param {string} token - Mixpanel token
     */
    async initializeMixpanel(token) {
        // Implementation would depend on Mixpanel SDK
       // console.log('Mixpanel initialization would go here');
    }

    /**
     * Send event to all providers
     * @param {Object} event - Event to send
     */
    sendEvent(event) {
        this.providers.forEach(provider => {
            try {
                provider.track(event);
            } catch (error) {
              //  console.error(`Failed to track event with ${provider.name}:`, error);
            }
        });

        // Log in development
        if (config.isDevelopment) {
          //  console.log('Analytics Event:', event);
        }
    }

    /**
     * Process queued events
     */
    processEventQueue() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.sendEvent(event);
        }
    }

    /**
     * Get current session information
     * @returns {Object} Session information
     */
    getSessionInfo() {
        return {
            session_id: this.getSessionId(),
            referrer: document.referrer,
            landing_page: this.getLandingPage(),
            session_start: this.getSessionStart()
        };
    }

    /**
     * Generate or get session ID
     * @returns {string} Session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Get landing page from session
     * @returns {string} Landing page URL
     */
    getLandingPage() {
        let landingPage = sessionStorage.getItem('analytics_landing_page');
        if (!landingPage) {
            landingPage = window.location.href;
            sessionStorage.setItem('analytics_landing_page', landingPage);
        }
        return landingPage;
    }

    /**
     * Get session start time
     * @returns {string} Session start timestamp
     */
    getSessionStart() {
        let sessionStart = sessionStorage.getItem('analytics_session_start');
        if (!sessionStart) {
            sessionStart = new Date().toISOString();
            sessionStorage.setItem('analytics_session_start', sessionStart);
        }
        return sessionStart;
    }

    /**
     * Clean up analytics service
     */
    cleanup() {
        this.eventQueue = [];
        this.providers.clear();
        this.isInitialized = false;
    }
}

// Create and export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;

// Export the class for testing
export { AnalyticsService };
