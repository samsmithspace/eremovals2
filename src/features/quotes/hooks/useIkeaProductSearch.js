// src/features/quotes/hooks/useIkeaProductSearch.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { ikeaProductService } from '../services/ikeaProductService';

/**
 * Hook for managing IKEA product search functionality
 * @param {Object} options - Search options
 * @returns {Object} Search state and methods
 */
export const useIkeaProductSearch = (options = {}) => {
  const {
    initialSearchTerm = '',
    autoSearch = true,
    debounceMs = 300,
    maxResults = 10
  } = options;

  // State management
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Refs for cleanup and debouncing
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  /**
   * Perform product search
   * @param {string} term - Search term
   * @param {boolean} force - Force search even if loading
   */
  const searchProducts = useCallback(async (term, force = false) => {
    if (!term || term.trim().length < 2) {
      setProducts([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    if (isLoading && !force) {
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await ikeaProductService.searchProducts(term.trim(), maxResults);

      setProducts(results);
      setHasSearched(true);

      // Generate search suggestions based on results
      const newSuggestions = results
        .slice(0, 5)
        .map(product => extractSearchSuggestion(product.name))
        .filter(Boolean);

      setSuggestions([...new Set(newSuggestions)]);

    } catch (err) {
      console.error('Product search error:', err);
      setError(err.message || 'Search failed');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, maxResults]);

  /**
   * Debounced search function
   */
  const debouncedSearch = useCallback((term) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchProducts(term);
    }, debounceMs);
  }, [searchProducts, debounceMs]);

  /**
   * Handle search term change
   * @param {string} term - New search term
   */
  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term);

    if (autoSearch) {
      debouncedSearch(term);
    }
  }, [autoSearch, debouncedSearch]);

  /**
   * Add product to selection
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   */
  const addProduct = useCallback((product, quantity = 1) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(p => p.id === product.id);

      if (existingIndex >= 0) {
        // Update existing product quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        // Add new product
        return [...prev, { ...product, quantity }];
      }
    });
  }, []);

  /**
   * Remove product from selection
   * @param {string} productId - Product ID to remove
   */
  const removeProduct = useCallback((productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  /**
   * Update product quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateProductQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, quantity } : p
      )
    );
  }, [removeProduct]);

  /**
   * Clear all selected products
   */
  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  /**
   * Get total value of selected products
   * @returns {number} Total price
   */
  const getTotalValue = useCallback(() => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }, [selectedProducts]);

  /**
   * Get total quantity of selected products
   * @returns {number} Total quantity
   */
  const getTotalQuantity = useCallback(() => {
    return selectedProducts.reduce((total, product) => {
      return total + product.quantity;
    }, 0);
  }, [selectedProducts]);

  /**
   * Search by category
   * @param {string} categorySearchTerm - Category search term
   */
  const searchByCategory = useCallback((categorySearchTerm) => {
    setSearchTerm(categorySearchTerm);
    searchProducts(categorySearchTerm, true);
  }, [searchProducts]);

  /**
   * Manual search trigger
   */
  const triggerSearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchProducts(searchTerm, true);
    }
  }, [searchTerm, searchProducts]);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setProducts([]);
    setError(null);
    setHasSearched(false);
    setSuggestions([]);
  }, []);

  /**
   * Retry last search
   */
  const retrySearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchProducts(searchTerm, true);
    }
  }, [searchTerm, searchProducts]);

  // Initial search effect
  useEffect(() => {
    if (initialSearchTerm && autoSearch) {
      debouncedSearch(initialSearchTerm);
    }
  }, [initialSearchTerm, autoSearch, debouncedSearch]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Search state
    searchTerm,
    products,
    isLoading,
    error,
    hasSearched,
    suggestions,

    // Selected products state
    selectedProducts,
    totalValue: getTotalValue(),
    totalQuantity: getTotalQuantity(),

    // Search methods
    handleSearchTermChange,
    searchProducts,
    searchByCategory,
    triggerSearch,
    clearSearch,
    retrySearch,

    // Selection methods
    addProduct,
    removeProduct,
    updateProductQuantity,
    clearSelection,

    // Utility methods
    getTotalValue,
    getTotalQuantity
  };
};

/**
 * Extract search suggestion from product name
 * @param {string} productName - Product name
 * @returns {string|null} Search suggestion
 */
function extractSearchSuggestion(productName) {
  if (!productName) return null;

  // Extract the main product name (first word usually)
  const words = productName.split(/[\s/]+/);
  const mainWord = words[0];

  // Return if it's a recognized IKEA product name
  const ikeaProducts = ['BILLY', 'KALLAX', 'MALM', 'HEMNES', 'EXPEDIT', 'LACK', 'IVAR'];
  if (ikeaProducts.some(name => mainWord.toUpperCase().includes(name))) {
    return mainWord;
  }

  return null;
}

export default useIkeaProductSearch;