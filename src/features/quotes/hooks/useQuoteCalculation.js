// src/features/quotes/hooks/useQuoteCalculation.js
import { useState, useCallback } from 'react';
import { quoteService } from '../services/quoteService';

/**
 * Hook for managing quote calculations
 * @returns {Object} Quote calculation functionality and state
 */
export const useQuoteCalculation = () => {
    const [quote, setQuote] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState(null);

    const calculateQuote = useCallback(async (quoteData) => {
        setIsCalculating(true);
        setError(null);

        try {
            const result = await quoteService.calculateQuote(quoteData);
            setQuote(result);
            return result;
        } catch (err) {
            const errorMessage = err.message || 'Failed to calculate quote';
            setError(errorMessage);
           // console.error('Quote calculation error:', err);
            throw err;
        } finally {
            setIsCalculating(false);
        }
    }, []);

    const resetQuote = useCallback(() => {
        setQuote(null);
        setError(null);
        setIsCalculating(false);
    }, []);

    const updateQuote = useCallback((updatedData) => {
        setQuote(prevQuote => ({
            ...prevQuote,
            ...updatedData
        }));
    }, []);

    return {
        quote,
        isCalculating,
        error,
        calculateQuote,
        resetQuote,
        updateQuote
    };
};