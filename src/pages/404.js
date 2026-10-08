// src/pages/404.js
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import MainLayout from '@/components/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';

const Custom404 = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  // Determine the title based on the current language
  const pageTitle = i18n.language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found';

  return (
    <MainLayout>
      <Head>
        <title>{pageTitle}</title> {/* Set the page title dynamically */}
      </Head>
      <motion.div 
        className="not-found-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image 
          src="/assets/404.png" 
          alt="Not Found" 
          className="not-found-icon"
          width={500}
          height={500}
          priority
        />
        <button 
          className="back-home-button" 
          onClick={() => router.push('/')}
        >
          <Image 
            src="/assets/arrowBack.png" 
            alt="Back" 
            className="back-icon"
            width={24}
            height={24}
          />
          {t("Back to Home")}
        </button>

        <style jsx>{`
          .not-found-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
            padding: 20px;
            margin: 40px 0;
          }

          .back-home-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            transition: background-color 0.3s ease;
          }

          .back-home-button:hover {
            background-color: #8fb857;
          }

          .not-found-icon {
            max-width: 100%;
            height: auto;
            margin-bottom: 20px;
          }

          .back-icon {
            width: 24px;
            height: 24px;
          }

          @media (max-width: 768px) {
            .not-found-container {
              min-height: calc(100vh - 150px);
            }

            .not-found-icon {
              width: 300px;
              height: 300px;
            }
          }
        `}</style>
      </motion.div>
    </MainLayout>
  );
};

export default Custom404;

// Add getStaticProps for internationalization
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
