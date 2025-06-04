// src/features/booking/components/PaymentCancellation.js
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../common/components/ui';

/**
 * Component displayed when payment is cancelled
 * Prevents back navigation and shows cancellation message
 */
const PaymentCancellation = () => {
    const { t } = useTranslation();

    useEffect(() => {
        // Prevent the user from using the back button to go to the previous page
        const preventBackNavigation = () => {
            window.history.pushState(null, '', window.location.href);
        };

        preventBackNavigation();

        const handlePopState = () => {
            preventBackNavigation();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="cancellation-container">
            <Alert
                variant="warning"
                title={t('paymentCancelled', 'Payment Cancelled')}
                className="cancellation-alert"
            >
                <p>{t('paymentCancelledMessage', 'Your payment has been canceled.')}</p>
            </Alert>

            <div className="cancellation-content">
                <p>
                    {t('emailInstructionsMessage', 'We have emailed you with further instructions. If you wish to continue placing your order or amend it, please use the link provided in the email.')}
                </p>

                <p>
                    {t('questionsContactMessage', 'If you have any questions, feel free to reach out to our support team.')}
                </p>

                <div className="contact-section">
                    <p>
                        {t('needAssistance', 'If you need assistance, feel free to')}{' '}
                        <a
                            href="https://wa.me/+447404228217?text=Hello,%20I%20have%20a%20question%20about%20my%20payment%20cancellation."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-link"
                        >
                            {t('contactUsWhatsApp', 'contact us on WhatsApp')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancellation;