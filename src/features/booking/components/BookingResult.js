// src/features/booking/components/BookingResult.js
import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { bookingService } from '../services/bookingService';
import { Spinner, Alert } from '../../../common/components/ui';
import { useLocalStorage } from '../../../common/hooks/useLocalStorage';

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
    const [localStorage, setLocalStorage] = useLocalStorage();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const bookingId = searchParams.get('bookingId');

                if (!bookingId) {
                    throw new Error('No booking ID found in URL');
                }

                // Check if message has already been sent to avoid duplicate notifications
                const messageSentKey = `messageSent_${bookingId}`;
                const messageSent = localStorage.getItem(messageSentKey);

                // Fetch booking details
                const data = await bookingService.getBookingById(bookingId);
                setBookingDetails(data.booking);

                // Send booking confirmation if not already sent
                if (!messageSent) {
                    await bookingService.sendBookingConfirmation(bookingId);
                    setLocalStorage(messageSentKey, 'true');
                }

            } catch (err) {
               // console.error('Error fetching booking details:', err);
                setError(err.message || 'Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [searchParams, localStorage, setLocalStorage]);

    if (loading) {
        return (
            <div className="booking-result-loading">
                <Spinner size="large" />
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
            </div>

            <div className="thank-you-message">
                <p>{t('thankYouMessage', 'Thank you for choosing our service! We truly appreciate your trust in us for your removal needs.')}</p>
                <p>{t('teamDedicatedMessage', 'Our team is dedicated to providing you with a seamless experience, and we are excited to assist you on the day of your move.')}</p>
            </div>

            <div className="follow-up-message">
                <p>{t('questionsMessage', 'If you have any questions or need to make changes to your booking, please do not hesitate to reach out.')}</p>
                <p>{t('smoothExperienceMessage', 'We\'re here to make sure everything goes smoothly for you.')}</p>
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