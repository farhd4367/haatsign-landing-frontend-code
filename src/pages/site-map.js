// src/pages/site-map.js
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
import Link from "next/link";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const SiteMap = ({ siteMapData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { t, i18n } = useTranslation();
  const siteMapIntroduction = introductionData?.find(
    (intro) => intro.page_key === 'site-map'
  );

  // Recursive tree rendering
  const renderTree = (nodes, level = 0) => {
    const isArabic = i18n.language === 'ar';
    return (
      <ul
        className="list-unstyled"
        style={{
          paddingLeft: isArabic ? 0 : `${level * 20}px`,
          paddingRight: isArabic ? `${level * 20}px` : 0,
          listStyleType: 'circle',
          direction: isArabic ? 'rtl' : 'ltr'
        }}
      >
        {nodes.map((node) => {
          const title = isArabic ? node.title_ar : node.title_en;
          const hasLink = typeof node.link === "string" && node.link.trim() !== "";
          
          // <li key={node.id} style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
          //   <Link href={node.link} className="read-more">
          //     {isArabic ? node.title_ar : node.title_en}
          //   </Link>
          //   {node.children_recursive && node.children_recursive.length > 0 && renderTree(node.children_recursive, level + 1)}
          // </li>

          return (
          <li
            key={node.id || `${title}-${level}`}
            style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}
          >
            {hasLink ? (
              <Link href={node.link} className="read-more">
                {title}
              </Link>
            ) : (
              <span>{title}</span>
            )}

            {node.children_recursive &&
              node.children_recursive.length > 0 &&
              renderTree(node.children_recursive, level + 1)}
          </li>
        );
          
      })}
      </ul>
    );
  };

  const pageTitle = i18n.language === 'ar' ? 'هاتساين | خريطة الموقع' : 'HaatSign | Sitemap';
   function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  const metaDescription =
    i18n.language === 'ar'
      ? extractPlainText(siteMapIntroduction?.description_ar)
      : extractPlainText(siteMapIntroduction?.description_en);
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
  const currentUrl = `${domain}/site-map`;

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
          href={`${domain}/site-map`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/site-map`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/site-map`}
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
            name: "HaatSign Sitemap",
            url: currentUrl,
          })}
        </script>

      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === 'ar' ? siteMapIntroduction?.title_ar : siteMapIntroduction?.title_en || t('Sitemap'))}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === 'ar' ? siteMapIntroduction?.sub_title_ar : siteMapIntroduction?.sub_title_en)}
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="container my-5">
            <div className="row">
              <div className="col-md-12">
                <Skeleton height={50} />
                <Skeleton count={3} className="mt-2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            {siteMapIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html: i18n.language === 'ar'
                    ? siteMapIntroduction.description_ar
                    : siteMapIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}

            {siteMapData.length > 0 ? (
              renderTree(siteMapData)
            ) : (
              <p>
                {i18n.language === 'ar'
                  ? 'لا توجد عناصر في خريطة الموقع.'
                  : t('No sitemap items found.')}
              </p>
            )}
          </div>
        )}
      </MotionDiv>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const [siteMapResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/site-maps`, {
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
        siteMapData: siteMapResponse.data.data,
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
        siteMapData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default SiteMap;
