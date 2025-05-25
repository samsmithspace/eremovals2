// src/features/booking/context/BookingContext.js
import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const BookingContext = createContext();

const initialState = {
  currentBooking: null,
  bookingHistory: [],
  loading: false,
  error: null
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookingHistory: [...state.bookingHistory, action.payload]
      };
    case 'CLEAR_CURRENT_BOOKING':
      return { ...state, currentBooking: null };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setCurrentBooking = (booking) => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  const addBooking = (booking) => {
    dispatch({ type: 'ADD_BOOKING', payload: booking });
  };

  const clearCurrentBooking = () => {
    dispatch({ type: 'CLEAR_CURRENT_BOOKING' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setCurrentBooking,
    addBooking,
    clearCurrentBooking
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

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
