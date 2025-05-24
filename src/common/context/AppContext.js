// src/common/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Initial state
const initialState = {
    theme: 'light',
    notifications: [],
    isLoading: false,
    error: null
};

// Action types
export const APP_ACTIONS = {
    SET_THEME: 'SET_THEME',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
    switch (action.type) {
        case APP_ACTIONS.SET_THEME:
            return {
                ...state,
                theme: action.payload
            };
        case APP_ACTIONS.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
            };
        case APP_ACTIONS.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.id !== action.payload)
            };
        case APP_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case APP_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case APP_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const AppContext = createContext();

/**
 * App Provider component
 * Provides global application state and actions to all children
 */
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            dispatch({ type: APP_ACTIONS.SET_THEME, payload: savedTheme });
        }
    }, []);

    // Save theme to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('theme', state.theme);
    }, [state.theme]);

    // Auto-dismiss notifications after 5 seconds
    useEffect(() => {
        const timers = state.notifications.map(notification => {
            return setTimeout(() => {
                dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: notification.id });
            }, 5000);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [state.notifications]);

    // Helper functions
    const setTheme = (theme) => {
        dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
    };

    const addNotification = (notification) => {
        dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification });
    };

    const removeNotification = (id) => {
        dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
    };

    const setLoading = (isLoading) => {
        dispatch({ type: APP_ACTIONS.SET_LOADING, payload: isLoading });
    };

    const setError = (error) => {
        dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
    };

    const clearError = () => {
        dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
    };

    const value = {
        ...state,
        setTheme,
        addNotification,
        removeNotification,
        setLoading,
        setError,
        clearError
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Custom hook to use the AppContext
 * @returns {Object} App context value
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default AppContext;