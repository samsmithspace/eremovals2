// src/features/quotes/services/ikeaProductService.js
// Updated to use your existing backend

class IkeaProductService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes for frontend cache
    this.backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  async searchProducts(query, options = {}) {
    const { maxResults = 12 } = options;

    try {
      // Create cache key
      const cacheKey = JSON.stringify({ query, options });
      const cached = this.cache.get(cacheKey);

      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        console.log(`📦 Using frontend cached data for "${query}"`);
        return cached.data;
      }

      console.log(`🔍 Fetching IKEA products from backend: "${query}"`);

      // Call your backend IKEA API
      const response = await fetch(
        `${this.backendUrl}/api/ikea/search?q=${encodeURIComponent(query)}&limit=${maxResults}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Backend returned ${result.products?.length || 0} products`);

        // Cache the results
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      } else {
        throw new Error(result.error || 'Backend search failed');
      }

    } catch (error) {
      console.warn('🚨 Backend IKEA search failed, using fallback:', error.message);

      // Fallback to frontend mock data if backend is unavailable
      return this.getFrontendFallback(query, maxResults);
    }
  }

  /**
   * Frontend fallback when backend is unavailable
   */
  async getFrontendFallback(query, maxResults) {
    console.log(`📦 Using frontend fallback for: "${query}"`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const fallbackProducts = [
      {
        id: 'billy-bookcase-white-80263850',
        name: 'BILLY bookcase, white, 80x28x202 cm',
        price: 50,
        currency: '£',
        category: 'Bookcases & shelving units',
        image: 'https://www.ikea.com/gb/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/billy-bookcase-white-00263850/',
        dimensions: { width: 80, depth: 28, height: 202, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      },
      {
        id: 'kallax-shelf-white-20275814',
        name: 'KALLAX shelf unit, white, 77x147 cm',
        price: 70,
        currency: '£',
        category: 'Shelving units',
        image: 'https://www.ikea.com/gb/en/images/products/kallax-shelf-unit-white__0644559_pe702939_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/kallax-shelf-unit-white-20275814/',
        dimensions: { width: 77, depth: 39, height: 147, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      },
      {
        id: 'malm-bed-frame-white-00394482',
        name: 'MALM bed frame, high, white stained oak veneer, Standard Double',
        price: 179,
        currency: '£',
        category: 'Bed frames',
        image: 'https://www.ikea.com/gb/en/images/products/malm-bed-frame-high-white-stained-oak-veneer__0749131_pe745499_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/malm-bed-frame-high-white-stained-oak-veneer-00394482/',
        dimensions: { width: 156, depth: 209, height: 97, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      },
      {
        id: 'hemnes-chest-3-drawers-80359851',
        name: 'HEMNES chest of 3 drawers, white stain, 108x96 cm',
        price: 120,
        currency: '£',
        category: 'Chests of drawers',
        image: 'https://www.ikea.com/gb/en/images/products/hemnes-chest-of-3-drawers-white-stain__0318306_pe515336_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/hemnes-chest-of-3-drawers-white-stain-80359851/',
        dimensions: { width: 108, depth: 50, height: 96, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      },
      {
        id: 'poang-armchair-birch-99305641',
        name: 'POÄNG armchair, birch veneer/Knisa light beige',
        price: 95,
        currency: '£',
        category: 'Armchairs',
        image: 'https://www.ikea.com/gb/en/images/products/poaeng-armchair-birch-veneer-knisa-light-beige__0177280_pe328883_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/poaeng-armchair-birch-veneer-knisa-light-beige-s99305641/',
        dimensions: { width: 68, depth: 83, height: 100, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      },
      {
        id: 'friheten-sofa-bed-grey-69216757',
        name: 'FRIHETEN corner sofa-bed with storage, Skiftebo dark grey',
        price: 399,
        currency: '£',
        category: 'Sofa-beds',
        image: 'https://www.ikea.com/gb/en/images/products/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey__0175610_pe328883_s5.jpg',
        link: 'https://www.ikea.com/gb/en/p/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey-s69216757/',
        dimensions: { width: 230, depth: 88, height: 88, unit: 'cm' },
        scraped: false,
        method: 'frontend_fallback'
      }
    ];

    // Filter based on search query
    const filtered = fallbackProducts
      .filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.id.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, maxResults);

    return {
      success: true,
      query,
      products: filtered,
      total: filtered.length,
      hasMore: false,
      scraped: false,
      method: 'frontend_fallback',
      scrapedAt: new Date().toISOString()
    };
  }

  async getPopularCategories() {
    try {
      // Try to get from backend first
      const response = await fetch(`${this.backendUrl}/api/ikea/categories`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.categories;
        }
      }
    } catch (error) {
      console.warn('Backend categories unavailable, using fallback');
    }

    // Fallback categories
    return [
      { id: 'billy', name: 'BILLY', icon: '📚', searchTerm: 'billy' },
      { id: 'kallax', name: 'KALLAX', icon: '📦', searchTerm: 'kallax' },
      { id: 'malm', name: 'MALM', icon: '🛏️', searchTerm: 'malm' },
      { id: 'hemnes', name: 'HEMNES', icon: '🗄️', searchTerm: 'hemnes' },
      { id: 'poang', name: 'POÄNG', icon: '🪑', searchTerm: 'poang' },
      { id: 'lack', name: 'LACK', icon: '📺', searchTerm: 'lack' }
    ];
  }

  async getProductById(productId) {
    try {
      const response = await fetch(`${this.backendUrl}/api/ikea/products/${productId}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.product;
        }
      }
    } catch (error) {
      console.warn('Backend product fetch failed:', error);
    }

    return null;
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Frontend IKEA cache cleared');
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      backendUrl: this.backendUrl
    };
  }

  // Test backend connection
  async testConnection() {
    try {
      const response = await fetch(`${this.backendUrl}/api/ikea/health`);
      const result = await response.json();
      console.log('🔗 Backend connection test:', result);
      return result;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const ikeaProductService = new IkeaProductService();