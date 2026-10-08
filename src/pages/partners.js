// src/pages/partners.js
import React from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BannerTitle from "@/components/BannerTitle";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Partners = ({
  partnerData,
  introductionData,
  landingSettingsData,
  locale,
  isLoading,
}) => {
  const { t, i18n } = useTranslation();
  const partnerIntroduction = introductionData?.find(
    (intro) => intro.page_key === "partners"
  );

  const pageTitle =
    i18n.language === "ar" ? "هاتساين | الشركاء" : "HaatSign | Partners";
  function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  const metaDescription =
    i18n.language === "ar"
      ? extractPlainText(partnerIntroduction?.description_ar)
      : extractPlainText(partnerIntroduction?.description_en);
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
  const currentUrl = `${domain}/partners`;

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
        <link rel="alternate" hreflang="ar" href={`${domain}/partners`} />
        <link rel="alternate" hreflang="en" href={`${domain}/en/partners`} />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/partners`}
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
            name: "HaatSign Partners",
            url: currentUrl,
          })}
        </script>

        
      </Head>

      <BannerTitle
        title={
          i18n.language === "ar"
            ? partnerIntroduction?.title_ar
            : partnerIntroduction?.title_en || t("Partners")
        }
        description={
          i18n.language === "ar"
            ? partnerIntroduction?.sub_title_ar
            : partnerIntroduction?.sub_title_en
        }
      />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="container my-5">
            <div className="row">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={`skeleton-${item}`}
                  className="col-6 col-md-4 col-lg-3 mb-4 text-center"
                >
                  <Skeleton height={150} containerClassName="d-block" />
                  <Skeleton width={100} containerClassName="d-block mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            {partnerIntroduction && (
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    i18n.language === "ar"
                      ? partnerIntroduction.description_ar
                      : partnerIntroduction.description_en,
                }}
              />
            )}

            <h2 className="text-center mb-4">{t("Our Partners")}</h2>
            {partnerData?.length > 0 ? (
              <div className="row justify-content-center">
                {partnerData.map((partner) => (
                  <div
                    key={partner.id}
                    className="col-6 col-md-4 col-lg-3 mb-4 text-center"
                  >
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={
                          partner.logo_url || "https://via.placeholder.com/150"
                        }
                        alt={
                          i18n.language === "ar"
                            ? partner.name_ar
                            : partner.name_en || t("Partner Logo")
                        }
                        className="img-fluid rounded"
                        width={200}
                        height={150}
                        style={{ objectFit: "contain" }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <h5 className="mt-2">
                        {i18n.language === "ar"
                          ? partner.name_ar
                          : partner.name_en}
                      </h5>
                    </MotionDiv>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center my-5">
                <p>
                  {i18n.language === "ar"
                    ? "لم يتم العثور على شركاء"
                    : t("No partners found")}
                </p>
              </div>
            )}
          </div>
        )}
      </MotionDiv>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const [partnersResponse, introductionResponse, landingSettingsResponse] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/partners`, {
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
        partnerData: partnersResponse.data.data,
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
        ...(await serverSideTranslations(locale, ["common"])),
        partnerData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60,
    };
  }
}

export default Partners;
