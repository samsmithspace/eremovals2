// src/features/booking/context/BookingContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Booking context for managing booking state across components
 */
const BookingContext = createContext();

// Action types
const BOOKING_ACTIONS = {
    SET_BOOKING_DATA: 'SET_BOOKING_DATA',
    UPDATE_BOOKING_FIELD: 'UPDATE_BOOKING_FIELD',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_BOOKING: 'RESET_BOOKING',
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    SET_PRICE_DATA: 'SET_PRICE_DATA',
    SET_CONTACT_INFO: 'SET_CONTACT_INFO'
};

// Initial state
const initialState = {
    bookingData: {
        startLocation: null,
        destinationLocation: null,
        moveType: null,
        date: null,
        time: null,
        distance: null,
        details: {},
        contactInfo: {
            name: '',
            phone: '',
            email: ''
        }
    },
    pricing: {
        basePrice: 0,
        helperPrice: 0,
        finalPrice: 0,
        discount: 0,
        promoCode: null
    },
    bookingId: null,
    currentStep: 'location', // location, details, summary, contact, payment
    isLoading: false,
    error: null
};

// Reducer function
const bookingReducer = (state, action) => {
    switch (action.type) {
        case BOOKING_ACTIONS.SET_BOOKING_DATA:
            return {
                ...state,
                bookingData: { ...state.bookingData, ...action.payload }
            };

        case BOOKING_ACTIONS.UPDATE_BOOKING_FIELD:
            return {
                ...state,
                bookingData: {
                    ...state.bookingData,
                    [action.field]: action.value
                }
            };

        case BOOKING_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case BOOKING_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case BOOKING_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case BOOKING_ACTIONS.RESET_BOOKING:
            return initialState;

        case BOOKING_ACTIONS.SET_CURRENT_STEP:
            return {
                ...state,
                currentStep: action.payload
            };

        case BOOKING_ACTIONS.SET_PRICE_DATA:
            return {
                ...state,
                pricing: { ...state.pricing, ...action.payload }
            };

        case BOOKING_ACTIONS.SET_CONTACT_INFO:
            return {
                ...state,
                bookingData: {
                    ...state.bookingData,
                    contactInfo: { ...state.bookingData.contactInfo, ...action.payload }
                }
            };

        default:
            return state;
    }
};

/**
 * BookingProvider component to wrap the application with booking context
 */
export const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    // Action creators
    const setBookingData = useCallback((data) => {
        dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_DATA, payload: data });
    }, []);

    const updateBookingField = useCallback((field, value) => {
        dispatch({ type: BOOKING_ACTIONS.UPDATE_BOOKING_FIELD, field, value });
    }, []);

    const setLoading = useCallback((loading) => {
        dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: loading });
    }, []);

    const setError = useCallback((error) => {
        dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: error });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: BOOKING_ACTIONS.CLEAR_ERROR });
    }, []);

    const resetBooking = useCallback(() => {
        dispatch({ type: BOOKING_ACTIONS.RESET_BOOKING });
    }, []);

    const setCurrentStep = useCallback((step) => {
        dispatch({ type: BOOKING_ACTIONS.SET_CURRENT_STEP, payload: step });
    }, []);

    const setPriceData = useCallback((priceData) => {
        dispatch({ type: BOOKING_ACTIONS.SET_PRICE_DATA, payload: priceData });
    }, []);

    const setContactInfo = useCallback((contactInfo) => {
        dispatch({ type: BOOKING_ACTIONS.SET_CONTACT_INFO, payload: contactInfo });
    }, []);

    const value = {
        // State
        ...state,
        // Actions
        setBookingData,
        updateBookingField,
        setLoading,
        setError,
        clearError,
        resetBooking,
        setCurrentStep,
        setPriceData,
        setContactInfo
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

BookingProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Custom hook to use booking context
 */
export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
};

export default BookingContext;