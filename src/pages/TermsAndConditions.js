import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <div className="terms-page">
      <div className="container">
        <h1>{t('termsAndConditions', 'Terms and Conditions')}</h1>
        <div className="terms-content">
          <p>Terms and conditions content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;