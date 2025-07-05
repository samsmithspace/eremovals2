// src/common/utils/scrollUtils.js

/**
 * Scroll utilities for smooth scrolling behavior
 */

/**
 * Smooth scroll to top of page
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  const defaultOptions = {
    top: 0,
    behavior: 'smooth'
  };

  window.scrollTo({
    ...defaultOptions,
    ...options
  });
};

/**
 * Smooth scroll to element
 * @param {string|Element} element - Element selector or element
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (element, options = {}) => {
  const targetElement = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  if (!targetElement) {
    console.warn('Element not found for scrolling');
    return;
  }

  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };

  targetElement.scrollIntoView({
    ...defaultOptions,
    ...options
  });
};

/**
 * Smooth scroll with offset (useful for fixed headers)
 * @param {string|Element} element - Element selector or element
 * @param {number} offset - Offset in pixels (default: 80px for header)
 */
export const scrollToElementWithOffset = (element, offset = 80) => {
  const targetElement = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  if (!targetElement) {
    console.warn('Element not found for scrolling');
    return;
  }

  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Scroll to top with reduced motion consideration
 */
export const accessibleScrollToTop = () => {
  if (prefersReducedMotion()) {
    window.scrollTo(0, 0);
  } else {
    scrollToTop();
  }
};

/**
 * Get current scroll position
 * @returns {Object} - Current scroll position {x, y}
 */
export const getCurrentScrollPosition = () => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean} - True if element is in viewport
 */
export const isElementInViewport = (element, threshold = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight * (1 - threshold)) &&
    ((rect.top + rect.height) >= windowHeight * threshold);
  const horInView = (rect.left <= windowWidth * (1 - threshold)) &&
    ((rect.left + rect.width) >= windowWidth * threshold);

  return vertInView && horInView;
};

/**
 * Debounced scroll event handler
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounceScroll = (callback, delay = 100) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
};

export default {
  scrollToTop,
  scrollToElement,
  scrollToElementWithOffset,
  prefersReducedMotion,
  accessibleScrollToTop,
  getCurrentScrollPosition,
  isElementInViewport,
  debounceScroll
};