// src/features/quotes/services/ikeaProductService.js
import { fetchApi } from 'common/utils/apiUtils';

/**
 * Service for IKEA product-related operations
 */
export const ikeaProductService = {
  /**
   * Search for IKEA products
   * @param {string} searchTerm - Search term
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} Array of products
   */
  searchProducts: async (searchTerm, limit = 10) => {
    try {
      // Mock data for now - replace with actual API call
      const mockProducts = [
        {
          id: 'billy-bookcase-white',
          name: 'BILLY Bookcase, white',
          price: 60,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/billy-bookcase-white-00263850/',
          dimensions: { width: 80, depth: 28, height: 202, unit: 'cm' },
          category: 'Storage & organisation'
        },
        {
          id: 'kallax-shelving-unit',
          name: 'KALLAX Shelving unit, white',
          price: 45,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/kallax-shelving-unit-white-20275814/',
          dimensions: { width: 77, depth: 39, height: 77, unit: 'cm' },
          category: 'Storage & organisation'
        },
        {
          id: 'malm-bed-frame',
          name: 'MALM Bed frame, high, white',
          price: 179,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/malm-bed-frame-high-white-00266743/',
          dimensions: { width: 156, depth: 209, height: 97, unit: 'cm' },
          category: 'Beds & mattresses'
        },
        {
          id: 'hemnes-chest-drawers',
          name: 'HEMNES Chest of 3 drawers, white stain',
          price: 120,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/hemnes-chest-of-3-drawers-white-stain-80318581/',
          dimensions: { width: 108, depth: 50, height: 96, unit: 'cm' },
          category: 'Chests & other furniture'
        },
        {
          id: 'expedit-shelving-unit',
          name: 'EXPEDIT Shelving unit, white',
          price: 85,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/expedit-shelving-unit-white-17132739/',
          dimensions: { width: 149, depth: 39, height: 149, unit: 'cm' },
          category: 'Storage & organisation'
        },
        {
          id: 'lack-side-table',
          name: 'LACK Side table, white',
          price: 12,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/lack-side-table-white-20011408/',
          dimensions: { width: 55, depth: 55, height: 45, unit: 'cm' },
          category: 'Tables & desks'
        },
        {
          id: 'ivar-shelf-unit',
          name: 'IVAR Shelf unit, pine',
          price: 65,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/ivar-shelf-unit-pine-89085454/',
          dimensions: { width: 80, depth: 30, height: 124, unit: 'cm' },
          category: 'Storage & organisation'
        },
        {
          id: 'friheten-sofa-bed',
          name: 'FRIHETEN Corner sofa-bed with storage',
          price: 399,
          currency: '£',
          image: '/api/placeholder/300/300',
          link: 'https://www.ikea.com/gb/en/p/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey-s59175806/',
          dimensions: { width: 230, depth: 151, height: 66, unit: 'cm' },
          category: 'Sofas & armchairs'
        }
      ];

      // Filter products based on search term
      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return filteredProducts.slice(0, limit);

      // TODO: Replace with actual API call
      // const response = await fetchApi(`/api/ikea/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
      // return response.products || [];

    } catch (error) {
      console.error('Error searching IKEA products:', error);
      throw new Error('Failed to search IKEA products');
    }
  },

  /**
   * Get popular product categories
   * @returns {Array} Array of popular categories
   */
  getPopularCategories: () => {
    return [
      {
        id: 'bookcases',
        name: 'Bookcases',
        icon: '📚',
        searchTerm: 'BILLY bookcase'
      },
      {
        id: 'storage',
        name: 'Storage',
        icon: '📦',
        searchTerm: 'KALLAX'
      },
      {
        id: 'beds',
        name: 'Beds',
        icon: '🛏️',
        searchTerm: 'MALM bed'
      },
      {
        id: 'desks',
        name: 'Desks',
        icon: '🪑',
        searchTerm: 'desk'
      },
      {
        id: 'sofas',
        name: 'Sofas',
        icon: '🛋️',
        searchTerm: 'sofa'
      },
      {
        id: 'tables',
        name: 'Tables',
        icon: '🪑',
        searchTerm: 'table'
      },
      {
        id: 'wardrobes',
        name: 'Wardrobes',
        icon: '👔',
        searchTerm: 'wardrobe'
      },
      {
        id: 'chairs',
        name: 'Chairs',
        icon: '🪑',
        searchTerm: 'chair'
      }
    ];
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (productId) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetchApi(`/api/ikea/products/${productId}`);
      return response.product;
    } catch (error) {
      console.error('Error fetching IKEA product:', error);
      throw new Error('Failed to fetch product details');
    }
  },

  /**
   * Get product availability
   * @param {string} productId - Product ID
   * @param {string} storeCode - Store code (e.g., 'GB_Edinburgh')
   * @returns {Promise<Object>} Availability information
   */
  getProductAvailability: async (productId, storeCode = 'GB_Edinburgh') => {
    try {
      // TODO: Replace with actual API call
      const response = await fetchApi(`/api/ikea/availability/${productId}?store=${storeCode}`);
      return {
        available: response.available,
        quantity: response.quantity,
        store: response.store,
        lastUpdated: response.lastUpdated
      };
    } catch (error) {
      console.error('Error checking product availability:', error);
      return {
        available: true, // Default to available
        quantity: 'Unknown',
        store: storeCode,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  /**
   * Calculate collection fee for IKEA products
   * @param {Array} products - Array of selected products
   * @param {string} storeLocation - IKEA store location
   * @returns {Object} Collection fee details
   */
  calculateCollectionFee: (products, storeLocation = 'Edinburgh') => {
    const totalValue = products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);

    const totalItems = products.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);

    // Base collection fee structure
    let baseFee = 15; // Base collection fee
    let handlingFee = totalValue * 0.02; // 2% handling fee
    let itemFee = Math.max(0, (totalItems - 5) * 2); // £2 per item over 5

    // Store-specific adjustments
    const storeMultipliers = {
      'Edinburgh': 1.0,
      'Glasgow': 1.1,
      'Aberdeen': 1.2
    };

    const multiplier = storeMultipliers[storeLocation] || 1.0;

    const totalFee = Math.round((baseFee + handlingFee + itemFee) * multiplier);

    return {
      baseFee,
      handlingFee: Math.round(handlingFee * 100) / 100,
      itemFee,
      storeMultiplier: multiplier,
      totalFee,
      breakdown: {
        collection: baseFee,
        handling: Math.round(handlingFee * 100) / 100,
        extraItems: itemFee,
        storeAdjustment: Math.round((totalFee - (baseFee + handlingFee + itemFee)) * 100) / 100
      }
    };
  },

  /**
   * Format product for display
   * @param {Object} rawProduct - Raw product data
   * @returns {Object} Formatted product
   */
  formatProduct: (rawProduct) => {
    return {
      id: rawProduct.id || rawProduct.productId,
      name: rawProduct.name || rawProduct.title,
      price: parseFloat(rawProduct.price) || 0,
      currency: rawProduct.currency || '£',
      image: rawProduct.image || rawProduct.imageUrl,
      link: rawProduct.link || rawProduct.url,
      dimensions: rawProduct.dimensions || null,
      category: rawProduct.category || 'General',
      description: rawProduct.description || '',
      availability: rawProduct.availability || 'Unknown'
    };
  },

  /**
   * Validate product selection
   * @param {Array} products - Selected products
   * @returns {Object} Validation result
   */
  validateSelection: (products) => {
    const errors = [];

    if (!products || products.length === 0) {
      errors.push('At least one product must be selected');
    }

    products.forEach((product, index) => {
      if (!product.id) {
        errors.push(`Product ${index + 1} is missing ID`);
      }

      if (!product.name) {
        errors.push(`Product ${index + 1} is missing name`);
      }

      if (!product.price || product.price <= 0) {
        errors.push(`Product ${index + 1} has invalid price`);
      }

      if (!product.quantity || product.quantity <= 0) {
        errors.push(`Product ${index + 1} has invalid quantity`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Get estimated delivery time for IKEA collection
   * @param {string} storeLocation - IKEA store location
   * @param {string} deliveryLocation - Delivery address
   * @returns {Object} Estimated delivery time
   */
  getEstimatedDeliveryTime: (storeLocation = 'Edinburgh', deliveryLocation) => {
    // Base collection time from IKEA (1-2 hours)
    const collectionTime = 1.5;

    // Estimated travel time (simplified calculation)
    const travelTime = 0.5; // 30 minutes average

    // Processing time
    const processingTime = 0.5;

    const totalTime = collectionTime + travelTime + processingTime;

    return {
      collectionTime,
      travelTime,
      processingTime,
      totalTime,
      estimatedDelivery: `${Math.ceil(totalTime)}-${Math.ceil(totalTime + 1)} hours`,
      breakdown: {
        collection: `${collectionTime} hours`,
        travel: `${travelTime} hours`,
        processing: `${processingTime} hours`
      }
    };
  }
};

export default ikeaProductService;