// src/pages/company-files.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/components/Layout';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import BannerTitle from '@/components/BannerTitle';
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Link from 'next/link';

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const CompanyFiles = ({ filesData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { t, i18n } = useTranslation();
  const companyFilesIntroduction = introductionData?.find(
    (intro) => intro.page_key === 'company_files'
  );

  const pageTitle = i18n.language === 'ar' ? 'هاتساين | ملفات الشركة' : 'HaatSign | Company Files';
  const metaDescription =
    i18n.language === 'ar'
      ? companyFilesIntroduction?.sub_title_ar
      : companyFilesIntroduction?.sub_title_en ||
      'Access and download important company files and documents.';
  const localeCode = i18n.language === 'ar' ? 'ar_SA' : 'en_US';
  const logoUrl =
    'https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png';

  // Extract keywords from landing settings
  const landingSettings =
    landingSettingsData && landingSettingsData.length > 0
      ? landingSettingsData[0]
      : {};
  const keywords = landingSettings.default_seo_key_words || "";

  // SSR-safe canonical and OpenGraph URL
  const domain = "https://landing.haatsign.sa";
  const currentUrl = `${domain}/company-files`;

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
          href={`${domain}/company-files`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/company-files`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/company-files`}
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
            name: "HaatSign Company Files",
            url: currentUrl,
          })}
        </script>


      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === 'ar' ? companyFilesIntroduction?.title_ar : companyFilesIntroduction?.title_en || "Company Files")}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === 'ar' ? companyFilesIntroduction?.sub_title_ar : companyFilesIntroduction?.sub_title_en)}
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
                <div key={`skeleton-${item}`} className="col-md-4 mb-4">
                  <Skeleton height={200} />
                  <Skeleton count={3} className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            {companyFilesIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html: i18n.language === 'ar'
                    ? companyFilesIntroduction.description_ar
                    : companyFilesIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}
            <div className="row">
              {filesData.map((file) => (
                <MotionDiv
                  key={file.id}
                  className="col-md-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card h-100">
                    <div className="card-body d-flex align-items-start">
                      <div className={`file-icon ${i18n.language === 'ar' ? 'ms-3' : 'me-3'}`}>
                        <i className="far fa-file-pdf fa-2x"></i>
                      </div>
                      <div className="file-content">
                        <h5 className="card-title">
                          {i18n.language === 'ar' ? file.title_ar : file.title_en}
                        </h5>
                        <p className="card-text text-muted">
                          {new Date(file.created_at).toLocaleDateString(i18n.language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {file.url ? (
                          <Link
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn download-button mt-2"
                          >
                            <i className="fas fa-download"></i> {t('Download')}
                          </Link>
                        ) : (
                          <button className="btn download-button mt-2" disabled >
                            <i className={`fas fa-ban `} style={i18n.language === 'ar' ? { marginLeft: '5px' } : { marginRight: '5px' }}></i> {i18n.language === 'ar' ? 'غير متوفر' : 'Unavailable'}
                          </button>
                        )}

                      </div>
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
    const [filesResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/company-files`, {
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
        filesData: filesResponse.data.data,
        introductionData: introductionResponse.data.data,
        landingSettingsData: landingSettingsResponse.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: false,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        filesData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default CompanyFiles;


