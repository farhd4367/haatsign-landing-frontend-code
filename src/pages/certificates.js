// src/pages/certificates.js
import React from "react";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "@/components/Layout";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import BannerTitle from "@/components/BannerTitle";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Link from "next/link";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const Certificates = ({ certificateData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { t, i18n } = useTranslation();
  const certificateIntroduction = introductionData?.find(
    (intro) => intro.page_key === "certificates"
  );

  const pageTitle =
    i18n.language === "ar" ? "هاتساين | الشهادات" : "HaatSign | Certificates";
   function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
    const metaDescription =
    i18n.language === "ar"
      ? extractPlainText(certificateIntroduction?.description_ar)
      : extractPlainText(certificateIntroduction?.description_en);
  const localeCode = i18n.language === "ar" ? "ar_SA" : "en_US";
  const logoUrl =
    "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

  // Extract keywords from landing settings
  const landingSettings =
    landingSettingsData && landingSettingsData.length > 0
      ? landingSettingsData[0]
      : {};
  const keywords = landingSettings.default_seo_key_words || "";

  // SSR-safe canonical and OpenGraph URL
  const domain = "https://landing.haatsign.sa";
  const currentUrl = `${domain}/certificates`;

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
          href={`${domain}/certificates`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/certificates`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/certificates`}
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
            name: "HaatSign Certificates",
            url: currentUrl,
          })}
        </script>

      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === "ar" ? certificateIntroduction?.title_ar : certificateIntroduction?.title_en || t("Certificates"))}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === "ar" ? certificateIntroduction?.sub_title_ar : certificateIntroduction?.sub_title_en)}
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
            {certificateIntroduction && (
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    i18n.language === "ar"
                      ? certificateIntroduction.description_ar
                      : certificateIntroduction.description_en,
                }}
              />
            )}

            <div className="row">
              {certificateData.map((certificate) => (
                <MotionDiv
                  key={certificate.id}
                  className="col-md-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card h-100 d-flex flex-column">
                    <div className="card-img-top" style={{ position: 'relative', width: '100%', height: '200px' }}>
                      <Image
                        src={certificate.certificate_url || "https://via.placeholder.com/150"}
                        alt={certificate.title || "Placeholder"}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-center">
                        {certificate.title || t("No Title Available")}
                      </h5>
                      <Link
                        href={certificate.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn haat-btn mt-auto"
                      >
                        {t("View Certificate")}
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
    const [certificatesResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/certificates`, {
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
        ...(await serverSideTranslations(locale, ["common"])),
        certificateData: certificatesResponse.data.data,
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
        ...(await serverSideTranslations(locale, ["common"])),
        certificateData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default Certificates;
