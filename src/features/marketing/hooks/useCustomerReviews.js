// src/features/marketing/hooks/useCustomerReviews.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing customer reviews and business data
 * @returns {Object} Reviews, business data, loading state, and error handling
 */
export const useCustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fallback reviews data
   */
  const getFallbackReviews = () => [
    {
      id: 'review-1',
      title: 'Exceptional moving service',
      text: 'The team was incredibly professional and handled our move with such care. Everything arrived safely and on time. Couldn\'t be happier with the service!',
      stars: 5,
      customer: {
        displayName: 'Sarah Mitchell',
        location: 'Edinburgh'
      },
      createdAt: '2024-11-15T10:30:00Z',
      isVerified: true
    },
    {
      id: 'review-2',
      title: 'Great value for money',
      text: 'As a student, I was looking for affordable movers and these guys delivered excellent service at a fair price. Highly recommend for anyone on a budget.',
      stars: 5,
      customer: {
        displayName: 'James Robertson',
        location: 'Glasgow'
      },
      createdAt: '2024-11-10T14:20:00Z',
      isVerified: true
    },
    {
      id: 'review-3',
      title: 'Office relocation made easy',
      text: 'We needed to relocate our entire office and they handled everything seamlessly. Minimal downtime and everything was set up perfectly in our new space.',
      stars: 5,
      customer: {
        displayName: 'Emma Thompson',
        location: 'Aberdeen'
      },
      createdAt: '2024-11-05T09:15:00Z',
      isVerified: true
    },
    {
      id: 'review-4',
      title: 'Same day service was fantastic',
      text: 'Needed urgent furniture delivery and they accommodated us same day. Professional, careful, and exactly on time. Outstanding emergency service!',
      stars: 5,
      customer: {
        displayName: 'Michael Chen',
        location: 'Dundee'
      },
      createdAt: '2024-10-28T16:45:00Z',
      isVerified: true
    },
    {
      id: 'review-5',
      title: 'Reliable and trustworthy',
      text: 'After a bad experience with another company, these guys restored my faith in moving services. Transparent pricing and exceptional care with belongings.',
      stars: 4,
      customer: {
        displayName: 'Linda Fraser',
        location: 'Stirling'
      },
      createdAt: '2024-10-20T11:30:00Z',
      isVerified: true
    },
    {
      id: 'review-6',
      title: 'Storage and moving combined',
      text: 'Needed temporary storage during a house sale delay. Clean, secure facility and seamless transition when it came time to move. Great communication throughout.',
      stars: 5,
      customer: {
        displayName: 'David Williams',
        location: 'Perth'
      },
      createdAt: '2024-10-15T13:20:00Z',
      isVerified: true
    },
    {
      id: 'review-7',
      title: 'Professional student move',
      text: 'Moving from university halls to a flat was stressful until I found these movers. They understood student needs and made the whole process smooth and affordable.',
      stars: 5,
      customer: {
        displayName: 'Rachel Green',
        location: 'St Andrews'
      },
      createdAt: '2024-10-08T12:15:00Z',
      isVerified: true
    },
    {
      id: 'review-8',
      title: 'Long distance move success',
      text: 'Moving from Inverness to Edinburgh seemed daunting, but they made it look easy. Excellent coordination, fair pricing, and not a single item was damaged.',
      stars: 5,
      customer: {
        displayName: 'Tom Anderson',
        location: 'Inverness'
      },
      createdAt: '2024-09-30T15:45:00Z',
      isVerified: true
    }
  ];

  /**
   * Get business statistics
   */
  const getBusinessData = () => {
    const reviewsData = getFallbackReviews();
    const totalStars = reviewsData.reduce((sum, review) => sum + review.stars, 0);
    const averageRating = totalStars / reviewsData.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      numberOfReviews: 547, // Total reviews (including those not displayed)
      stars: Math.round(averageRating)
    };
  };

  /**
   * Simulate loading customer reviews
   */
  const fetchCustomerReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set business data
      setBusinessData(getBusinessData());

      // Set reviews
      setReviews(getFallbackReviews());

    } catch (err) {
      console.error('Error loading customer reviews:', err);
      setError('Unable to load reviews. Please try again later.');

      // Set fallback data even on error
      setBusinessData(getBusinessData());
      setReviews(getFallbackReviews());
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch function for retry functionality
   */
  const refetch = useCallback(() => {
    fetchCustomerReviews();
  }, [fetchCustomerReviews]);

  // Initial data fetch
  useEffect(() => {
    fetchCustomerReviews();
  }, [fetchCustomerReviews]);

  return {
    reviews,
    businessData,
    loading,
    error,
    refetch
  };
};

export default useCustomerReviews;