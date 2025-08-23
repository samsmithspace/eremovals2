// src/features/quotes/components/IkeaProductService.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaTimes,
  FaRedo,
  FaRuler
} from 'react-icons/fa';
import { useIkeaProductSearch } from '../hooks/useIkeaProductSearch';
import { ikeaProductService } from '../services/ikeaProductService';
import { Button, Spinner } from 'common/components/ui';
import './IkeaProductSearch.css';

/**
 * IKEA Product Search Component
 * Allows customers to search and select IKEA products for delivery
 */
const IkeaProductService = ({ onProductsChange, initialProducts = [] }) => {
  const { t } = useTranslation();
  const [showSelected, setShowSelected] = useState(false);

  const {
    searchTerm,
    products,
    isLoading,
    error,
    hasSearched,
    selectedProducts,
    totalValue,
    totalQuantity,
    handleSearchTermChange,
    triggerSearch,
    clearSearch,
    retrySearch,
    addProduct,
    removeProduct,
    updateProductQuantity,
    clearSelection
  } = useIkeaProductSearch({
    autoSearch: true,
    debounceMs: 500,
    maxResults: 12
  });

  // Get popular categories for quick search
  const popularCategories = ikeaProductService.getPopularCategories();

  // Handle product selection changes
  React.useEffect(() => {
    if (onProductsChange) {
      onProductsChange(selectedProducts);
    }
  }, [selectedProducts, onProductsChange]);

  const handleCategorySearch = (category) => {
    handleSearchTermChange(category.searchTerm);
  };

  const handleQuantityChange = (productId, change) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (product) {
      const newQuantity = Math.max(0, product.quantity + change);
      updateProductQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price, currency = '£') => {
    return `${currency}${price.toFixed(2)}`;
  };

  const formatDimensions = (dimensions) => {
    if (!dimensions) return null;

    if (dimensions.width && dimensions.depth && dimensions.height) {
      return `${dimensions.width}×${dimensions.depth}×${dimensions.height} ${dimensions.unit}`;
    }

    if (dimensions.size) {
      return `${dimensions.size} ${dimensions.unit}`;
    }

    return null;
  };

  return (
    <div className="ikea-product-search">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-title">
          <h3>🛋️ Search IKEA Products</h3>
          <p>Find and select IKEA furniture for your same-day delivery</p>
        </div>

        {selectedProducts.length > 0 && (
          <div className="selected-summary">
            <button
              className="selected-toggle"
              onClick={() => setShowSelected(!showSelected)}
            >
              <FaShoppingCart />
              <span>{totalQuantity} items (£{totalValue.toFixed(2)})</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="search-input-section">
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search IKEA products (e.g., BILLY bookcase, KALLAX storage)"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && triggerSearch()}
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <Button
            onClick={triggerSearch}
            disabled={!searchTerm.trim() || isLoading}
            className="search-btn"
          >
            {isLoading ? <Spinner size="sm" /> : <FaSearch />}
          </Button>
        </div>

        {/* Popular Categories */}
        <div className="popular-categories">
          <span className="categories-label">Popular:</span>
          <div className="category-chips">
            {popularCategories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                className="category-chip"
                onClick={() => handleCategorySearch(category)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Products Panel */}
      {showSelected && selectedProducts.length > 0 && (
        <div className="selected-products-panel">
          <div className="selected-header">
            <h4>Selected Products ({totalQuantity})</h4>
            <div className="selected-actions">
              <span className="total-price">Total: £{totalValue.toFixed(2)}</span>
              <button
                className="clear-all-btn"
                onClick={clearSelection}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="selected-products-list">
            {selectedProducts.map((product) => (
              <div key={product.id} className="selected-product-item">
                <div className="selected-product-info">
                  <img
                    src={product.image || '/api/placeholder/60/60'}
                    alt={product.name}
                    className="selected-product-image"
                  />
                  <div className="selected-product-details">
                    <h5>{product.name}</h5>
                    <span className="selected-product-price">
                      {formatPrice(product.price)} each
                    </span>
                  </div>
                </div>

                <div className="selected-product-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="quantity-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{product.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="quantity-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    onClick={() => removeProduct(product.id)}
                    className="remove-btn"
                    aria-label="Remove product"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="search-results">
        {/* Loading State */}
        {isLoading && (
          <div className="search-loading">
            <Spinner size="lg" />
            <p>Searching IKEA products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="search-error">
            <div className="error-content">
              <h4>Search Error</h4>
              <p>{error}</p>
              <Button onClick={retrySearch} variant="outline">
                <FaRedo /> Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !isLoading && !error && products.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h4>No Products Found</h4>
              <p>Try searching for popular IKEA products like BILLY, KALLAX, or MALM</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && !isLoading && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addProduct}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                selectedQuantity={
                  selectedProducts.find(p => p.id === product.id)?.quantity || 0
                }
                onQuantityChange={(quantity) =>
                  updateProductQuantity(product.id, quantity)
                }
                formatPrice={formatPrice}
                formatDimensions={formatDimensions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Product Card Component
 */
const ProductCard = ({
                       product,
                       onAdd,
                       isSelected,
                       selectedQuantity,
                       onQuantityChange,
                       formatPrice,
                       formatDimensions
                     }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAdd(product, 1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(0, selectedQuantity + change);
    onQuantityChange(newQuantity);
  };

  const dimensions = formatDimensions(product.dimensions);

  // FIXED: ESLint errors - changed let to const for variables that are never reassigned
  const calculateDeliveryFee = (selectedProducts, totalValue) => {
    if (selectedProducts.length === 0) return 0;

    const baseFee = 2.50;                                    // Line 237 - FIXED: let -> const
    const handlingFee = Math.max(1.00, totalValue * 0.05);  // Line 238 - FIXED: let -> const
    const itemFee = selectedProducts.length * 0.50;         // Line 239 - FIXED: let -> const

    return baseFee + handlingFee + itemFee;
  };

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''}`}>
      {/* Product Image */}
      <div className="product-image-container">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>🛋️</span>
          </div>
        )}

        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="product-link-overlay"
            aria-label="View on IKEA website"
          >
            <FaExternalLinkAlt />
          </a>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h4 className="product-name" title={product.name}>
          {product.name}
        </h4>

        <div className="product-meta">
          {dimensions && (
            <div className="product-dimensions">
              <FaRuler className="dimension-icon" />
              <span>{dimensions}</span>
            </div>
          )}

          <div className="product-category">
            {product.category}
          </div>
        </div>

        <div className="product-price">
          <span className="price-amount">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="price-label">each</span>
        </div>
      </div>

      {/* Product Actions */}
      <div className="product-actions">
        {!isSelected ? (
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <FaPlus />
            <span>Add to Order</span>
          </button>
        ) : (
          <div className="quantity-controls-card">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="quantity-btn-card"
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>

            <span className="quantity-display-card">
              {selectedQuantity}
            </span>

            <button
              onClick={() => handleQuantityChange(1)}
              className="quantity-btn-card"
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>
          </div>
        )}
      </div>

      {/* Selected Badge */}
      {isSelected && (
        <div className="selected-badge">
          <FaShoppingCart />
          <span>{selectedQuantity}</span>
        </div>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
    dimensions: PropTypes.object,
    category: PropTypes.string
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectedQuantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  formatDimensions: PropTypes.func.isRequired
};

IkeaProductService.propTypes = {
  onProductsChange: PropTypes.func,
  initialProducts: PropTypes.array
};

export default IkeaProductService;