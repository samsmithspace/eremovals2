// src/features/quotes/components/SameDayQuote.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GoogleMapComponent from '../../locations/components/GoogleMapComponent';
// FIXED: Changed from './IkeaProductSearch' to './IkeaProductService'
// since the actual file is named IkeaProductService.js
import IkeaProductSearch from './IkeaProductService';
import './SameDayQuote.css';

const SameDayQuote = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  // Form state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVanSize, setSelectedVanSize] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [urgency, setUrgency] = useState('within-4-hours');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Enhanced categories with IKEA-specific options
  const categories = [
    { id: 'ikea', name: 'IKEA Items', icon: '🛋️', basePrice: 60, hasProductSearch: true },
    { id: 'furniture', name: 'Furniture & Home Items', icon: '🪑', basePrice: 70 },
    { id: 'construction', name: 'Construction Material', icon: '🔨', basePrice: 80 },
    { id: 'appliances', name: 'Appliances', icon: '🔌', basePrice: 75 },
    { id: 'single-item', name: 'Single Item - Miscellaneous', icon: '📋', basePrice: 45 }
  ];

  // Van sizes configuration
  const vanSizes = [
    { id: 'small', name: 'Small Van', icon: '🚐', capacity: 'Up to 3m³', multiplier: 1.0 },
    { id: 'medium', name: 'Medium Van', icon: '🚚', capacity: 'Up to 6m³', multiplier: 1.3 },
    { id: 'large', name: 'Large Van', icon: '🚛', capacity: 'Up to 10m³', multiplier: 1.6 },
    { id: 'extra-large', name: 'Extra Large Van', icon: '🚚', capacity: 'Up to 15m³', multiplier: 2.0 },
    { id: 'luton', name: 'Luton Van', icon: '🚛', capacity: 'Up to 20m³', multiplier: 2.5 }
  ];

  // Urgency options
  const urgencyOptions = [
    { id: 'within-2-hours', name: 'Within 2 Hours', multiplier: 1.5 },
    { id: 'within-4-hours', name: 'Within 4 Hours', multiplier: 1.2 },
    { id: 'same-day', name: 'Same Day (Any Time)', multiplier: 1.0 }
  ];

  // Calculate estimated price including IKEA products
  useEffect(() => {
    if (selectedCategory && selectedVanSize && urgency) {
      const category = categories.find(c => c.id === selectedCategory);
      const vanSize = vanSizes.find(v => v.id === selectedVanSize);
      const urgencyOption = urgencyOptions.find(u => u.id === urgency);

      if (category && vanSize && urgencyOption) {
        const basePrice = category.basePrice;
        const sizeMultiplier = vanSize.multiplier;
        const urgencyMultiplier = urgencyOption.multiplier;

        // Calculate base delivery price
        let calculatedPrice = Math.round(basePrice * sizeMultiplier * urgencyMultiplier);

        // Add IKEA products value if any
        if (selectedProducts.length > 0) {
          const productsValue = selectedProducts.reduce((total, product) => {
            return total + (product.price * product.quantity);
          }, 0);

          // Add products value + small handling fee (5%)
          calculatedPrice += Math.round(productsValue + (productsValue * 0.05));
        }

        setEstimatedPrice(calculatedPrice);
      }
    }
  }, [selectedCategory, selectedVanSize, urgency, selectedProducts]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setErrors(prev => ({ ...prev, category: null }));

    // Clear IKEA products if switching away from IKEA category
    if (categoryId !== 'ikea') {
      setSelectedProducts([]);
    }
  };

  const handleVanSizeSelect = (vanSizeId) => {
    setSelectedVanSize(vanSizeId);
    setErrors(prev => ({ ...prev, vanSize: null }));
  };

  const handlePickupLocationSelected = (location) => {
    const locationString = typeof location === 'string' ? location : location.formatted_address || location.name;
    setPickupLocation(locationString);
    setErrors(prev => ({ ...prev, pickupLocation: null }));
  };

  const handleDeliveryLocationSelected = (location) => {
    const locationString = typeof location === 'string' ? location : location.formatted_address || location.name;
    setDeliveryLocation(locationString);
    setErrors(prev => ({ ...prev, deliveryLocation: null }));
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleProductsChange = (products) => {
    setSelectedProducts(products);

    // Auto-update item details with product information
    if (products.length > 0) {
      const productSummary = products.map(p =>
        `${p.quantity}x ${p.name} (£${p.price} each)`
      ).join('\n');
      setItemDetails(productSummary);
    } else if (selectedCategory === 'ikea') {
      setItemDetails('');
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!selectedCategory) newErrors.category = 'Please select a category';
        if (!selectedVanSize) newErrors.vanSize = 'Please select a van size';
        if (selectedCategory === 'ikea' && selectedProducts.length === 0) {
          newErrors.products = 'Please select at least one IKEA product';
        }
        break;
      case 2:
        if (!pickupLocation) newErrors.pickupLocation = 'Please enter pickup location';
        if (!deliveryLocation) newErrors.deliveryLocation = 'Please enter delivery location';
        if (pickupLocation === deliveryLocation && pickupLocation) {
          newErrors.sameLocation = 'Pickup and delivery locations cannot be the same';
        }
        break;
      case 3:
        if (!contactInfo.name) newErrors.name = 'Name is required';
        if (!contactInfo.phone) newErrors.phone = 'Phone number is required';
        if (!contactInfo.email) newErrors.email = 'Email is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitQuote = async () => {
    if (!validateStep(3)) return;

    try {
      // Prepare enhanced quote data with IKEA products
      const quoteData = {
        category: selectedCategory,
        vanSize: selectedVanSize,
        pickupLocation,
        deliveryLocation,
        itemDetails,
        selectedProducts: selectedProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image: p.image,
          dimensions: p.dimensions,
          category: p.category
        })),
        urgency,
        contactInfo,
        estimatedPrice,
        productsValue: selectedProducts.reduce((total, p) => total + (p.price * p.quantity), 0),
        deliveryOnlyPrice: estimatedPrice - (selectedProducts.reduce((total, p) => total + (p.price * p.quantity), 0) * 1.05)
      };

      console.log('Enhanced quote request:', quoteData);

      // Navigate to confirmation or contact page
      navigate(`/${lang}/contact`, {
        state: {
          serviceType: 'same-day-delivery-enhanced',
          quoteData
        }
      });
    } catch (error) {
      console.error('Error submitting enhanced quote:', error);
    }
  };

  return (
    <div className="same-day-quote enhanced-version">
      {/* Header Section */}
      <div className="quote-header">
        <div className="container">
          <h1 className="quote-title">Same Day Delivery & IKEA Collection</h1>
          <p className="quote-subtitle">
            Fast, reliable same-day delivery across Scotland. Now with integrated IKEA product selection and collection service.
          </p>

          {/* Progress Indicator */}
          <div className="progress-indicator">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                <span className="step-number">{step}</span>
                <span className="step-label">
                  {step === 1 && 'Service & Products'}
                  {step === 2 && 'Locations'}
                  {step === 3 && 'Contact & Quote'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quote-content">
        <div className="container">

          {/* Step 1: Enhanced Service Selection with IKEA Products */}
          {currentStep === 1 && (
            <div className="quote-step">
              <h2 className="step-title">What do you need delivered?</h2>

              {/* Category Selection */}
              <div className="selection-section">
                <h3>Select Category</h3>
                <div className="category-grid">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-card ${selectedCategory === category.id ? 'selected' : ''} ${category.hasProductSearch ? 'ikea-special' : ''}`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-price">From £{category.basePrice}</span>
                      {category.hasProductSearch && (
                        <span className="category-badge">Product Search</span>
                      )}
                    </button>
                  ))}
                </div>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>

              {/* IKEA Product Search - Show only when IKEA category is selected */}
              {selectedCategory === 'ikea' && (
                <div className="ikea-products-section">
                  <h3>Select IKEA Products</h3>
                  <div className="ikea-search-container">
                    <IkeaProductSearch
                      onProductsChange={handleProductsChange}
                      initialProducts={selectedProducts}
                    />
                  </div>
                  {errors.products && <div className="error-message">{errors.products}</div>}

                  {/* Products Summary */}
                  {selectedProducts.length > 0 && (
                    <div className="products-summary">
                      <h4>Selected Products Summary</h4>
                      <div className="summary-stats">
                        <div className="stat">
                          <span className="stat-label">Total Items:</span>
                          <span className="stat-value">
                            {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}
                          </span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Products Value:</span>
                          <span className="stat-value">
                            £{selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Van Size Selection */}
              <div className="selection-section">
                <h3>Select Van Size</h3>
                <div className="van-size-grid">
                  {vanSizes.map(van => (
                    <button
                      key={van.id}
                      className={`van-card ${selectedVanSize === van.id ? 'selected' : ''}`}
                      onClick={() => handleVanSizeSelect(van.id)}
                    >
                      <span className="van-icon">{van.icon}</span>
                      <span className="van-name">{van.name}</span>
                      <span className="van-capacity">{van.capacity}</span>
                    </button>
                  ))}
                </div>
                {errors.vanSize && <div className="error-message">{errors.vanSize}</div>}
              </div>

              {/* Urgency Selection */}
              <div className="selection-section">
                <h3>When do you need this delivered?</h3>
                <div className="urgency-options">
                  {urgencyOptions.map(option => (
                    <label key={option.id} className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value={option.id}
                        checked={urgency === option.id}
                        onChange={(e) => setUrgency(e.target.value)}
                      />
                      <span className="option-label">{option.name}</span>
                      {option.multiplier > 1 && (
                        <span className="price-modifier">+{Math.round((option.multiplier - 1) * 100)}%</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="step-actions">
                <button
                  className="btn-primary"
                  onClick={handleNextStep}
                  disabled={!selectedCategory || !selectedVanSize || (selectedCategory === 'ikea' && selectedProducts.length === 0)}
                >
                  Next: Locations
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location Selection */}
          {currentStep === 2 && (
            <div className="quote-step">
              <h2 className="step-title">Where are we picking up and delivering?</h2>

              <div className="location-section">
                <div className="location-input-group">
                  <h3>📍 Pickup Location</h3>
                  <p className="location-help">
                    {selectedCategory === 'ikea'
                      ? 'We can collect from IKEA stores or your specified location'
                      : 'Enter the address where we should collect your items'
                    }
                  </p>
                  <GoogleMapComponent
                    onPlaceSelected={handlePickupLocationSelected}
                    selectedLocation={pickupLocation}
                  />
                  {errors.pickupLocation && <div className="error-message">{errors.pickupLocation}</div>}
                </div>

                <div className="location-input-group">
                  <h3>🚩 Delivery Location</h3>
                  <p className="location-help">
                    Where should we deliver your items?
                  </p>
                  <GoogleMapComponent
                    onPlaceSelected={handleDeliveryLocationSelected}
                    selectedLocation={deliveryLocation}
                  />
                  {errors.deliveryLocation && <div className="error-message">{errors.deliveryLocation}</div>}
                </div>
              </div>

              {errors.sameLocation && <div className="error-message">{errors.sameLocation}</div>}

              {/* Item Details */}
              <div className="details-section">
                <h3>Additional Details</h3>
                <textarea
                  className="item-details-input"
                  placeholder={selectedCategory === 'ikea'
                    ? "Any special instructions for collection or delivery? (automatically filled with selected products)"
                    : "Describe your items, special handling requirements, or any other details..."
                  }
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  rows={6}
                  readOnly={selectedCategory === 'ikea' && selectedProducts.length > 0}
                />
                {selectedCategory === 'ikea' && selectedProducts.length > 0 && (
                  <p className="field-note">
                    Product details automatically filled from your IKEA selection above
                  </p>
                )}
              </div>

              <div className="step-actions">
                <button className="btn-secondary" onClick={handlePrevStep}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleNextStep}
                  disabled={!pickupLocation || !deliveryLocation}
                >
                  Next: Get Quote
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Enhanced Quote */}
          {currentStep === 3 && (
            <div className="quote-step">
              <h2 className="step-title">Contact Details & Your Quote</h2>

              {/* Enhanced Quote Summary */}
              {estimatedPrice && (
                <div className="quote-summary enhanced">
                  <h3>Your Estimated Quote</h3>
                  <div className="quote-details">
                    <div className="quote-row">
                      <span>Service:</span>
                      <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </div>
                    <div className="quote-row">
                      <span>Van Size:</span>
                      <span>{vanSizes.find(v => v.id === selectedVanSize)?.name}</span>
                    </div>
                    <div className="quote-row">
                      <span>Urgency:</span>
                      <span>{urgencyOptions.find(u => u.id === urgency)?.name}</span>
                    </div>
                    <div className="quote-row">
                      <span>From:</span>
                      <span>{pickupLocation}</span>
                    </div>
                    <div className="quote-row">
                      <span>To:</span>
                      <span>{deliveryLocation}</span>
                    </div>

                    {/* IKEA Products Breakdown */}
                    {selectedProducts.length > 0 && (
                      <>
                        <div className="quote-section-header">
                          <h4>IKEA Products ({selectedProducts.reduce((sum, p) => sum + p.quantity, 0)} items)</h4>
                        </div>
                        {selectedProducts.map((product, index) => (
                          <div key={product.id} className="quote-row product-row">
                            <span>{product.quantity}x {product.name}</span>
                            <span>£{(product.price * product.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="quote-row subtotal">
                          <span>Products Subtotal:</span>
                          <span>£{selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}</span>
                        </div>
                        <div className="quote-row">
                          <span>Handling Fee (5%):</span>
                          <span>£{(selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0) * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="quote-row">
                          <span>Delivery Service:</span>
                          <span>£{(estimatedPrice - (selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0) * 1.05)).toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    <div className="quote-total">
                      <span>Estimated Total:</span>
                      <span className="price">£{estimatedPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div className="contact-form">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="07XXX XXXXXX"
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>

                  <div className="form-group full-width">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-secondary" onClick={handlePrevStep}>
                  Back
                </button>
                <button
                  className="btn-primary large"
                  onClick={handleSubmitQuote}
                  disabled={!contactInfo.name || !contactInfo.phone || !contactInfo.email}
                >
                  Get My Enhanced Quote
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Enhanced Trust Indicators */}
      <div className="trust-section">
        <div className="container">
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>Same Day Delivery</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛋️</span>
              <span>IKEA Collection Service</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>Fully Insured</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">📱</span>
              <span>Live Tracking</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⭐</span>
              <span>5-Star Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SameDayQuote;