// src/features/booking/components/BookingResult.js - FIXED duplicate prevention
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { bookingService } from '../services/bookingService';
import { Spinner, Alert } from '../../../common/components/ui';
import './BookingResult.css';

/**
 * Component to display booking confirmation details after successful payment
 */
const BookingResult = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emailStatus, setEmailStatus] = useState({ sent: false, error: null });

    // ✅ ADD: Prevent multiple concurrent API calls
    const isProcessingRef = useRef(false);
    const processedBookingsRef = useRef(new Set());

    // FIXED: Safe localStorage access with fallback
    const getFromLocalStorage = (key) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
            return null;
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return null;
        }
    };

    const setToLocalStorage = (key, value) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting localStorage:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const bookingId = searchParams.get('bookingId');

                if (!bookingId) {
                    throw new Error('No booking ID found in URL');
                }

                // ✅ PREVENT DUPLICATE PROCESSING
                if (isProcessingRef.current || processedBookingsRef.current.has(bookingId)) {
                    console.log('BookingResult: Already processing or processed this booking:', bookingId);
                    return;
                }

                isProcessingRef.current = true;
                processedBookingsRef.current.add(bookingId);

                console.log('BookingResult: Fetching details for bookingId:', bookingId);

                // Check if message has already been sent
                const messageSentKey = `messageSent_${bookingId}`;
                const messageSent = getFromLocalStorage(messageSentKey);

                console.log('BookingResult: Message sent status:', messageSent);

                // Fetch booking details
                const data = await bookingService.getBookingById(bookingId);
                console.log('BookingResult: Booking data received:', data);

                setBookingDetails(data.booking);

                // ✅ IMPROVED: Better duplicate check with timestamp
                const now = Date.now();
                const lastSentTime = getFromLocalStorage(`${messageSentKey}_timestamp`);
                const timeSinceLastSent = lastSentTime ? (now - parseInt(lastSentTime)) : Infinity;

                // Only send if not sent in the last 5 minutes (300000 ms)
                const shouldSend = !messageSent || timeSinceLastSent > 300000;

                if (shouldSend) {
                    console.log('BookingResult: Sending booking confirmation...');
                    try {
                        const confirmationResponse = await bookingService.sendBookingConfirmation(bookingId);

                        // ✅ Set both the flag and timestamp
                        console.log('BookingResult: Confirmation API response:', confirmationResponse);
                        setToLocalStorage(messageSentKey, 'true');
                        setToLocalStorage(`${messageSentKey}_timestamp`, now.toString());
                        console.log('BookingResult: Confirmation sent successfully');
                        setEmailStatus({ sent: true, error: null });

                    } catch (confirmationError) {
                        console.error('BookingResult: Error sending confirmation:', confirmationError);

                        const errorMessage = confirmationError.message || 'Failed to send confirmation email';
                        setEmailStatus({ sent: false, error: errorMessage });

                        console.warn('BookingResult: Email confirmation failed but continuing to show booking details');
                    }
                } else {
                    console.log('BookingResult: Confirmation already sent recently, skipping');
                    setEmailStatus({ sent: true, error: null });
                }

            } catch (err) {
                console.error('BookingResult: Error fetching booking details:', err);
                setError(err.message || 'Failed to load booking details');
            } finally {
                setLoading(false);
                isProcessingRef.current = false;
            }
        };

        // ✅ ADD: Debounce to prevent rapid successive calls
        const timeoutId = setTimeout(fetchBookingDetails, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchParams]);

    // ✅ ADD: Cleanup on unmount
    useEffect(() => {
        return () => {
            isProcessingRef.current = false;
        };
    }, []);

    if (loading) {
        return (
          <div className="booking-result-loading">
              <Spinner size="lg" />
              <p>{t('loadingBookingDetails', 'Loading booking details...')}</p>
          </div>
        );
    }

    if (error) {
        return (
          <Alert variant="error" title={t('error', 'Error')}>
              {error}
          </Alert>
        );
    }

    if (!bookingDetails) {
        return (
          <Alert variant="warning" title={t('noBookingFound', 'No Booking Found')}>
              {t('noBookingDetailsAvailable', 'No booking details available.')}
          </Alert>
        );
    }

    return (
      <div className="booking-container">
          <div className="booking-header">
              <h1>{t('bookingConfirmation', 'Booking Confirmation')}</h1>
          </div>

          {/* Email status notification */}
          {emailStatus.error && (
            <Alert variant="warning" title={t('emailNotification', 'Email Notification')}>
                {t('emailFailedButBookingSuccess', 'Your booking was successful, but we had trouble sending the confirmation email. Please save your booking details below.')}
                <br />
                <small>Error: {emailStatus.error}</small>
            </Alert>
          )}

          <div className="booking-info">
              <div className="booking-detail">
                  <strong>{t('bookingId', 'Booking ID')}:</strong>
                  <span>{bookingDetails._id}</span>
              </div>

              <div className="booking-detail">
                  <strong>{t('customerName', 'Name')}:</strong>
                  <span>{bookingDetails.name}</span>
              </div>

              <div className="booking-detail">
                  <strong>{t('email', 'Email')}:</strong>
                  <span>{bookingDetails.email}</span>
              </div>

              <div className="booking-detail">
                  <strong>{t('scheduledTime', 'Scheduled Time')}:</strong>
                  <span>{bookingDetails.date}, {bookingDetails.time}</span>
              </div>

              <div className="booking-detail">
                  <strong>{t('pickupLocation', 'Pick Up')}:</strong>
                  <span>{bookingDetails.startLocation}</span>
              </div>

              <div className="booking-detail">
                  <strong>{t('destination', 'Destination')}:</strong>
                  <span>{bookingDetails.destinationLocation}</span>
              </div>

              {bookingDetails.price && (
                <div className="booking-detail">
                    <strong>{t('paidAmount', 'Amount Paid')}:</strong>
                    <span>£{Number(bookingDetails.price).toFixed(2)}</span>
                </div>
              )}

              {bookingDetails.paymentStatus && (
                <div className="booking-detail">
                    <strong>{t('paymentStatus', 'Payment Status')}:</strong>
                    <span className="payment-status-success">
                            {t('paymentSuccessful', 'Payment Successful')} ✅
                        </span>
                </div>
              )}

              <div className="booking-detail">
                  <strong>{t('emailConfirmation', 'Email Confirmation')}:</strong>
                  <span className={emailStatus.sent && !emailStatus.error ? 'success-badge' : 'warning-badge'}>
                        {emailStatus.sent && !emailStatus.error
                          ? `${t('emailSent', 'Sent Successfully')} ✅`
                          : `${t('emailFailed', 'Failed to Send')} ⚠️`
                        }
                    </span>
              </div>
          </div>

          <div className="thank-you-message">
              <p>{t('thankYouMessage', 'Thank you for choosing our service! We truly appreciate your trust in us for your removal needs.')}</p>
              <p>{t('teamDedicatedMessage', 'Our team is dedicated to providing you with a seamless experience, and we are excited to assist you on the day of your move.')}</p>
          </div>

          <div className="follow-up-message">
              <p>{t('questionsMessage', 'If you have any questions or need to make changes to your booking, please do not hesitate to reach out.')}</p>
              <p>{t('smoothExperienceMessage', 'We\'re here to make sure everything goes smoothly for you.')}</p>
              {emailStatus.error && (
                <p><strong>{t('saveBookingDetails', 'Please save your booking details above as the confirmation email could not be sent.')}</strong></p>
              )}
          </div>

          <div className="contact-us">
              <p>
                  {t('needAssistance', 'If you need assistance, feel free to')}{' '}
                  <a
                    href="https://wa.me/+447404228217?text=Hello,%20I%20have%20a%20question%20about%20my%20booking."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                      {t('contactUsWhatsApp', 'contact us on WhatsApp')}
                  </a>
              </p>
          </div>
      </div>
    );
};

export default BookingResult;