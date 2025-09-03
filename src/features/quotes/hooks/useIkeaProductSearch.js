// src/features/quotes/hooks/useIkeaProductSearch.js
// IMPORTANT: Create this file at: src/features/quotes/hooks/useIkeaProductSearch.js

import { useState, useCallback, useEffect } from 'react';
import { ikeaProductService } from '../services/ikeaProductService';

export const useIkeaProductSearch = (options = {}) => {
  const {
    autoSearch = false,
    debounceMs = 300,
    maxResults = 12,
    initialQuery = ''
  } = options;

  // Search state
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected products state
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState(null);

  const searchProducts = useCallback(async (query, searchOptions = {}) => {
    if (!query || query.trim().length < 2) {
      setProducts([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await ikeaProductService.searchProducts(query.trim(), {
        maxResults,
        ...searchOptions
      });

      if (results.success) {
        setProducts(results.products);
      } else {
        throw new Error(results.error || 'Search failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to search products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [maxResults]);

  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term);
    setError(null);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set up debounced search if auto search is enabled
    if (autoSearch && term.trim().length >= 2) {
      const timer = setTimeout(() => {
        searchProducts(term);
      }, debounceMs);
      setDebounceTimer(timer);
    } else if (!term.trim()) {
      setProducts([]);
      setHasSearched(false);
    }
  }, [autoSearch, debounceMs, searchProducts, debounceTimer]);

  const triggerSearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
    }
  }, [searchTerm, searchProducts]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setProducts([]);
    setError(null);
    setHasSearched(false);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
  }, [debounceTimer]);

  const retrySearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
    }
  }, [searchTerm, searchProducts]);

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
        return [...prev, {
          ...product,
          quantity,
          addedAt: Date.now()
        }];
      }
    });
  }, []);

  const removeProduct = useCallback((productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const updateProductQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSelectedProducts(prev => {
      return prev.map(product =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      );
    });
  }, [removeProduct]);

  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  // Calculate totals
  const totalValue = selectedProducts.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);

  const totalQuantity = selectedProducts.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Auto search on initial query
  useEffect(() => {
    if (initialQuery && autoSearch) {
      searchProducts(initialQuery);
    }
  }, [initialQuery, autoSearch, searchProducts]);

  return {
    // Search state
    searchTerm,
    products,
    isLoading,
    error,
    hasSearched,

    // Selected products state
    selectedProducts,
    totalValue,
    totalQuantity,

    // Search methods
    handleSearchTermChange,
    triggerSearch,
    clearSearch,
    retrySearch,
    searchProducts,

    // Product management methods
    addProduct,
    removeProduct,
    updateProductQuantity,
    clearSelection,

    // Utility methods
    isProductSelected: (productId) => selectedProducts.some(p => p.id === productId),
    getSelectedProduct: (productId) => selectedProducts.find(p => p.id === productId),
    getProductQuantity: (productId) => {
      const product = selectedProducts.find(p => p.id === productId);
      return product ? product.quantity : 0;
    }
  };
};