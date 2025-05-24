// src/config/routes.js
/**
 * Application routes configuration
 * Centralizes route definitions for easier management
 */
const routes = {
    // Public routes
    public: {
        home: '/:lang',
        location: '/:lang/location',
        quote: '/:lang/quote',
        contact: '/:lang/contact',
        termsAndConditions: '/:lang/terms-and-conditions',
        bookingResult: '/:lang/booking-result',
        bookingCancel: '/:lang/booking-cancel'
    },

    // Route parameter patterns for validation
    patterns: {
        lang: /^(en|zh)$/,
        bookingId: /^[a-f\d]{24}$/i
    },

    // Route generation helpers
    generate: {
        /**
         * Generate a path with the given language and optional params
         * @param {string} routeName - Name of the route
         * @param {string} lang - Language code
         * @param {Object} params - Route parameters
         * @returns {string} Generated route path
         */
        path: (routeName, lang = 'en', params = {}) => {
            const route = routes.public[routeName];
            if (!route) throw new Error(`Route "${routeName}" not found`);

            // Replace :lang with actual language
            let path = route.replace(':lang', lang);

            // Replace other params
            Object.entries(params).forEach(([key, value]) => {
                path = path.replace(`:${key}`, value);
            });

            return path;
        },

        /**
         * Generate home route for the given language
         * @param {string} lang - Language code
         * @returns {string} Home route path
         */
        home: (lang = 'en') => routes.generate.path('home', lang),

        /**
         * Generate location selection route for the given language
         * @param {string} lang - Language code
         * @returns {string} Location selection route path
         */
        location: (lang = 'en') => routes.generate.path('location', lang),

        /**
         * Generate quote route for the given language
         * @param {string} lang - Language code
         * @returns {string} Quote route path
         */
        quote: (lang = 'en') => routes.generate.path('quote', lang)
    },

    // URL query parameter names
    queryParams: {
        bookingId: 'bookingId',
        locationType: 'locationType',
        redirectUrl: 'redirectUrl'
    }
};

export default routes;