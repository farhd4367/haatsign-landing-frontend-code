// src/pages/tutorials.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import BannerTitle from '@/components/BannerTitle';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/components/Layout';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const Tutorials = ({ tutorialData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { i18n } = useTranslation();
  const tutorialIntroduction = introductionData?.find(
    (intro) => intro.page_key === 'tutorials'
  );

  const pageTitle = i18n.language === 'ar' ? 'هاتساين | الدروس التعليمية' : 'HaatSign | Tutorials';
  const metaDescription =
    i18n.language === 'ar'
      ? tutorialIntroduction?.sub_title_ar
      : tutorialIntroduction?.sub_title_en || 'Explore our tutorials to learn more about our products and services.';
  const localeCode = i18n.language === 'ar' ? 'ar_SA' : 'en_US';
  const logoUrl = 'https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png';

  // Extract keywords from landing settings
  const landingSettings =
    landingSettingsData && landingSettingsData.length > 0
      ? landingSettingsData[0]
      : {};
  const keywords = landingSettings.default_seo_key_words || "";

  // SSR-safe canonical and OpenGraph URL
  const domain = "https://landing.haatsign.sa";
  const currentUrl = `${domain}/tutorials`;

  return (
    <MainLayout>
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical & Alternate URLs */}
        <link rel="canonical" href={currentUrl} />
        <link
          rel="alternate"
          hreflang="ar"
          href={`${domain}/tutorials`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/tutorials`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/tutorials`}
        />

        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HaatSign" />
        <meta property="og:locale" content={localeCode} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="twitter:creator" content="@HaatSign" />
        <meta name="twitter:site" content="@HaatSign" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "HaatSign Tutorials",
            url: currentUrl,
          })}
        </script>

        
      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === 'ar' ? tutorialIntroduction?.title_ar : tutorialIntroduction?.title_en || "Tutorials")}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === 'ar' ? tutorialIntroduction?.sub_title_ar : tutorialIntroduction?.sub_title_en)}
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="container my-5">
            <div className="row">
              {[1, 2, 3].map((item) => (
                <div key={`skeleton-${item}`} className="col-md-6 mb-4">
                  <Skeleton height={200} />
                  <Skeleton count={3} className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            {tutorialIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html: i18n.language === 'ar'
                    ? tutorialIntroduction.description_ar
                    : tutorialIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}

            <div className="row">
              {tutorialData.map((tutorial) => (
                <MotionDiv
                  key={tutorial.id}
                  className="col-md-6 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card tutorial-card h-100">
                    <div className="card-body">
                      <div className="video-wrapper" dangerouslySetInnerHTML={{ __html: tutorial.link }} />
                      <h3 className="tutorial-title">
                        {i18n.language === 'ar' ? tutorial.title_ar : tutorial.title_en}
                      </h3>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        )}
      </MotionDiv>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const [tutorialsResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/landing-toturials`, {
        headers: getDefaultHeaders(),
      }),
      axios.get(`${API_BASE_URL}/get-page-introduction`, {
        headers: getDefaultHeaders(),
      }),
      axios.get(`${API_BASE_URL}/general-setting`, {
        headers: getDefaultHeaders(),
      }),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        tutorialData: tutorialsResponse.data.data,
        introductionData: introductionResponse.data.data,
        landingSettingsData: landingSettingsResponse.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: false,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        tutorialData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60,
    };
  }
}

export default Tutorials;
