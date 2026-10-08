import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

// Import images from the assets index
import { NotFoundIc, arrowBackIc } from '../../public/assets/index';

const NotFound = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <img src={NotFoundIc.src} alt="Not Found" className="not-found-icon" />
      <button className="back-home-button" onClick={() => router.push('/')}>
        <img src={arrowBackIc.src} alt="Back" className="back-icon" />
        {t("Back to Home")}
      </button>
    </div>
  );
};

export default NotFound;
