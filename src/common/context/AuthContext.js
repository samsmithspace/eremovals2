// src/common/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create context
const AuthContext = createContext();

/**
 * Authentication Provider component
 * Manages user authentication state and provides auth-related functions
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing user session on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsLoading(true);

                // Example: Check for a saved token in localStorage
                const token = localStorage.getItem('authToken');

                if (token) {
                    // Example: You would typically validate the token with your backend
                    // const user = await validateTokenWithBackend(token);

                    // For now, we'll just simulate a successful login
                    const user = {
                        id: '123',
                        name: 'Demo User',
                        email: 'user@example.com',
                        token
                    };

                    setCurrentUser(user);
                }
            } catch (err) {
                console.error('Authentication error:', err);
                setError(err.message);
                localStorage.removeItem('authToken');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    /**
     * Sign in user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Promise that resolves to the user object
     */
    const signIn = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            // Example: You would make an API call to your backend
            // const response = await api.post('/auth/login', { email, password });

            // For demonstration, we'll simulate a successful login
            const demoResponse = {
                user: {
                    id: '123',
                    name: 'Demo User',
                    email
                },
                token: 'demo-token-123'
            };

            // Save the auth token
            localStorage.setItem('authToken', demoResponse.token);

            // Set the current user
            setCurrentUser({
                ...demoResponse.user,
                token: demoResponse.token
            });

            return demoResponse.user;
        } catch (err) {
            console.error('Sign in error:', err);
            setError(err.message || 'An error occurred during sign in');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        try {
            setIsLoading(true);

            // Example: You might want to notify your backend about the logout
            // await api.post('/auth/logout');

            // Clear auth token and user data
            localStorage.removeItem('authToken');
            setCurrentUser(null);
        } catch (err) {
            console.error('Sign out error:', err);
            setError(err.message || 'An error occurred during sign out');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update the current user's profile
     * @param {Object} profileData - New profile data
     */
    const updateProfile = async (profileData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Example: You would make an API call to your backend
            // const response = await api.put('/user/profile', profileData);

            // For demonstration, we'll simulate a successful update
            const updatedUser = {
                ...currentUser,
                ...profileData
            };

            setCurrentUser(updatedUser);
            return updatedUser;
        } catch (err) {
            console.error('Update profile error:', err);
            setError(err.message || 'An error occurred while updating your profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        error,
        signIn,
        signOut,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Custom hook to use the AuthContext
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;