// src/pages/memberships.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MainLayout from '@/components/Layout';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import BannerTitle from '@/components/BannerTitle';
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Link from 'next/link';

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const Memberships = ({ membershipData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { t, i18n } = useTranslation();
  const membershipIntroduction = introductionData?.find(
    (intro) => intro.page_key === 'memberships'
  );

  const pageTitle = i18n.language === 'ar' ? 'هاتساين | العضويات' : 'HaatSign | Memberships';
   function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  const metaDescription =
    i18n.language === 'ar'
      ? extractPlainText(membershipIntroduction?.description_ar)
      : extractPlainText(membershipIntroduction?.description_en);
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
  const currentUrl = `${domain}/memberships`;

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
          href={`${domain}/memberships`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/memberships`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/memberships`}
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
            name: "HaatSign Memberships",
            url: currentUrl,
          })}
        </script>

      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === 'ar' ? membershipIntroduction?.title_ar : membershipIntroduction?.title_en || t('Memberships'))}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === 'ar' ? membershipIntroduction?.sub_title_ar : membershipIntroduction?.sub_title_en)}
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
            {membershipIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    i18n.language === 'ar'
                      ? membershipIntroduction.description_ar
                      : membershipIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}

            <h2 className="memberships-heading text-center mb-4">{t('Our Memberships')}</h2>

            <div className="row">
              {membershipData.map((membership) => (
                <MotionDiv
                  key={membership.id}
                  className="col-md-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card h-100 d-flex flex-column">
                    <div className="card-img-top" style={{ position: 'relative', width: '100%', height: '350px' }}>
                      <Image
                        src={membership.logo || 'https://via.placeholder.com/150'}
                        alt={
                          i18n.language === 'ar'
                            ? membership.title_ar || t('Membership Logo')
                            : membership.title_en || t('Membership Logo')
                        }
                        layout="fill"
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">
                        {i18n.language === 'ar'
                          ? membership.title_ar || t('No Title Available')
                          : membership.title_en || t('No Title Available')}
                      </h5>
                      <p
                        className="card-text flex-grow-1"
                        dangerouslySetInnerHTML={{
                          __html:
                            i18n.language === 'ar'
                              ? membership.description_ar
                              : membership.description_en,
                        }}
                      />
                      <Link
                        href={membership.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn haat-btn mt-auto"
                      >
                        {t('More Info')}
                      </Link>
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
    const [membershipsResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/memberships`, {
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
        membershipData: membershipsResponse.data.data,
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
        membershipData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default Memberships;

