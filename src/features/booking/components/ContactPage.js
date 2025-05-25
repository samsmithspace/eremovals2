import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <div className="container">
        <h1>{t('contact', 'Contact Us')}</h1>
        <div className="contact-content">
          <p>Email: eremovalsscot@gmail.com</p>
          <p>Phone: 07404 228217</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;