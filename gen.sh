#!/bin/bash

# Set the root directory to 'src'
ROOT_DIR="src"

# Create main directories
mkdir -p $ROOT_DIR/features/{booking,locations,quotes,inventory,scheduling,marketing}/{components,hooks,services}
mkdir -p $ROOT_DIR/features/{booking,locations,quotes}/context
mkdir -p $ROOT_DIR/common/{components/{layout,ui,modals},hooks,utils,context}
mkdir -p $ROOT_DIR/i18n/locales/{en,zh}
mkdir -p $ROOT_DIR/{styles,services,config,assets/{images,icons}}

# Create files for booking feature
touch $ROOT_DIR/features/booking/components/{BookingForm.js,BookingResult.js,BookingSummary.js,PaymentCancellation.js}
touch $ROOT_DIR/features/booking/hooks/{useBookingForm.js,usePaymentProcessing.js}
touch $ROOT_DIR/features/booking/services/bookingService.js
touch $ROOT_DIR/features/booking/context/BookingContext.js

# Create files for locations feature
touch $ROOT_DIR/features/locations/components/{LocationSelection.js,LocationSummary.js,GoogleMapComponent.js}
touch $ROOT_DIR/features/locations/hooks/{useLocationSearch.js,useAddressLookup.js}
touch $ROOT_DIR/features/locations/services/locationService.js

# Create files for quotes feature
touch $ROOT_DIR/features/quotes/components/{QuotePage.js,QuoteSummary.js,QuoteActions.js,PromotionCode.js}
touch $ROOT_DIR/features/quotes/hooks/{useQuoteCalculation.js,usePromoCode.js}
touch $ROOT_DIR/features/quotes/services/quoteService.js

# Create files for inventory feature
touch $ROOT_DIR/features/inventory/components/{MoveOptions.js,BoxSelection.js,FurnitureSelection.js,ApplianceSelection.js,SpecialItems.js}
touch $ROOT_DIR/features/inventory/hooks/useInventoryForm.js
touch $ROOT_DIR/features/inventory/services/inventoryService.js

# Create files for scheduling feature
touch $ROOT_DIR/features/scheduling/components/DateTimePicker.js
touch $ROOT_DIR/features/scheduling/hooks/useAvailableTimeSlots.js
touch $ROOT_DIR/features/scheduling/services/schedulingService.js

# Create files for marketing feature
touch $ROOT_DIR/features/marketing/components/{HeroSection.js,ServiceOverview.js,Testimonials.js}
touch $ROOT_DIR/features/marketing/hooks/useTestimonials.js

# Create files for common components
touch $ROOT_DIR/common/components/layout/{Header.js,Footer.js,AppLayout.js}
touch $ROOT_DIR/common/components/ui/{Button.js,FormInput.js,SelectInput.js,Spinner.js,Alert.js}
touch $ROOT_DIR/common/components/modals/{ConfirmationModal.js,ErrorModal.js}

# Create files for common hooks
touch $ROOT_DIR/common/hooks/{useForm.js,useApi.js,useLocalStorage.js}

# Create files for common utils
touch $ROOT_DIR/common/utils/{apiUtils.js,dateUtils.js,validationUtils.js,errorHandling.js}

# Create files for common context
touch $ROOT_DIR/common/context/{AppContext.js,AuthContext.js}

# Create files for i18n
touch $ROOT_DIR/i18n/locales/en/translation.json
touch $ROOT_DIR/i18n/locales/zh/translation.json
touch $ROOT_DIR/i18n/i18n.js

# Create files for styles
touch $ROOT_DIR/styles/{theme.js,globalStyles.js,variables.css}

# Create files for services
touch $ROOT_DIR/services/{api.js,analytics.js,storage.js}

# Create files for config
touch $ROOT_DIR/config/{routes.js,config.js}

# Create main app files
touch $ROOT_DIR/{App.js,index.js,setupTests.js}

# Add content to template files
cat > $ROOT_DIR/common/hooks/useForm.js << 'EOF'
import { useState } from 'react';

/**
 * Custom hook for managing form state
 * @param {Object} initialValues - Initial form values
 * @return {Array} [values, handleChange, resetForm]
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
EOF

cat > $ROOT_DIR/common/utils/apiUtils.js << 'EOF'
/**
 * Handle API response errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise} - Resolved response or rejected error
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || response.statusText);
  }
  return response;
};

/**
 * Create HTTP request with consistent headers and error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise resolving to parsed JSON response
 */
export const fetchApi = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  await handleApiResponse(response);
  
  return response.json();
};
EOF

cat > $ROOT_DIR/config/config.js << 'EOF'
/**
 * Application configuration
 */
const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  getAddressApiKey: process.env.REACT_APP_GETADDRESS_API_KEY,
  stripeKey: process.env.REACT_APP_STRIPKEY,
  isDevelopment: process.env.REACT_APP_MODE === 'develop',
};

export default config;
EOF

cat > $ROOT_DIR/App.js << 'EOF'
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
// Import your page components here

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Define your routes here */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
EOF

# Make the script executable
chmod +x generate_structure.sh

echo "React application structure created successfully!"