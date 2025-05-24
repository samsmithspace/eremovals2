// src/setupTests.js
/**
 * Test configuration and setup
 * This file is automatically loaded by Create React App before running tests
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Configure testing library
configure({
    testIdAttribute: 'data-testid',
    asyncUtilTimeout: 5000
});

// Mock global objects that might not be available in test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia (for responsive components)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock fetch for API testing
global.fetch = jest.fn();

// Mock localStorage and sessionStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};

const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});

// Mock Google Maps API
global.google = {
    maps: {
        Map: jest.fn(() => ({
            setCenter: jest.fn(),
            setZoom: jest.fn(),
        })),
        Marker: jest.fn(() => ({
            setPosition: jest.fn(),
            setMap: jest.fn(),
        })),
        LatLng: jest.fn((lat, lng) => ({ lat, lng })),
        Size: jest.fn((width, height) => ({ width, height })),
        Point: jest.fn((x, y) => ({ x, y })),
        InfoWindow: jest.fn(() => ({
            open: jest.fn(),
            close: jest.fn(),
            setContent: jest.fn(),
        })),
        places: {
            Autocomplete: jest.fn(() => ({
                addListener: jest.fn(),
                getPlace: jest.fn(() => ({
                    geometry: {
                        location: {
                            lat: jest.fn(() => 55.953251),
                            lng: jest.fn(() => -3.188267),
                        },
                    },
                    formatted_address: 'Test Address, Edinburgh, UK',
                    address_components: [
                        {
                            long_name: 'EH1 1YZ',
                            types: ['postal_code']
                        }
                    ]
                })),
            })),
            PlacesService: jest.fn(),
        },
        DistanceMatrixService: jest.fn(() => ({
            getDistanceMatrix: jest.fn((options, callback) => {
                const mockResponse = {
                    rows: [{
                        elements: [{
                            status: 'OK',
                            distance: { text: '5.2 mi', value: 8370 },
                            duration: { text: '15 mins', value: 900 }
                        }]
                    }]
                };
                callback(mockResponse, 'OK');
            }),
        })),
        TravelMode: {
            DRIVING: 'DRIVING',
            WALKING: 'WALKING',
            TRANSIT: 'TRANSIT',
            BICYCLING: 'BICYCLING',
        },
        UnitSystem: {
            METRIC: 0,
            IMPERIAL: 1,
        },
    },
};

// Mock Stripe
global.Stripe = jest.fn(() => ({
    redirectToCheckout: jest.fn(() => Promise.resolve()),
    createToken: jest.fn(() => Promise.resolve({ token: 'mock_token' })),
}));

// Console error/warning suppression for known issues in tests
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
    // Suppress specific known warnings in tests
    if (
        typeof args[0] === 'string' &&
        (
            args[0].includes('Warning: ReactDOM.render is deprecated') ||
            args[0].includes('Warning: componentWillReceiveProps') ||
            args[0].includes('act(...) is not supported')
        )
    ) {
        return;
    }
    originalError.call(console, ...args);
};

console.warn = (...args) => {
    // Suppress specific known warnings in tests
    if (
        typeof args[0] === 'string' &&
        (
            args[0].includes('componentWillReceiveProps') ||
            args[0].includes('findDOMNode is deprecated')
        )
    ) {
        return;
    }
    originalWarn.call(console, ...args);
};

// Custom test utilities
export const createMockComponent = (name, props = {}) => {
    return jest.fn(({ children, ...componentProps }) => {
        return React.createElement(
            'div',
            {
                'data-testid': `mock-${name.toLowerCase()}`,
                'data-props': JSON.stringify({ ...props, ...componentProps }),
            },
            children
        );
    });
};

export const mockApiResponse = (data, status = 200) => {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        json: jest.fn(() => Promise.resolve(data)),
        text: jest.fn(() => Promise.resolve(JSON.stringify(data))),
    });
};

export const mockApiError = (message, status = 500) => {
    return Promise.reject(new Error(message));
};

// Test cleanup
afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();

    // Reset fetch mock
    if (global.fetch) {
        global.fetch.mockClear();
    }

    // Clear storage mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
});

// Global test setup
beforeAll(() => {
    // Increase test timeout for integration tests
    jest.setTimeout(10000);
});

afterAll(() => {
    // Restore original console methods
    console.error = originalError;
    console.warn = originalWarn;
});