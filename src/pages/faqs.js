// src/pages/faqs.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "@/components/Layout";
import BannerTitle from "@/components/BannerTitle";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Faqs = ({
  faqData,
  introductionData,
  landingSettingsData,
  locale,
  isLoading,
}) => {
  // Inline styles for chevron customization
  const chevronStyles = `
    .accordion-button::after {
      content: "\\25BC"; /* Unicode chevron down */
      color: var(--primary-color) !important;
      font-size: 1em !important;
      display: inline-block !important;
      transition: color 0.2s ease !important;
      background-image: none !important;
    }
    .accordion-button:not(.collapsed)::after {
     content: "\\25BC"; /* Unicode chevron down */
      color: var(--heading-text-color) !important;
      font-size: 1em !important;
       font-size: 1em !important;
      display: inline-block !important;
      transition: color 0.2s ease !important;
      background-image: none !important;
    }
  `;
  const { i18n } = useTranslation();
  const [open, setOpen] = useState("");

  const faqIntroduction = introductionData?.find(
    (intro) => intro.page_key === "faqs"
  );

  const toggle = (id) => {
    setOpen(open === id ? "" : id);
  };

  const pageTitle =
    i18n.language === "ar" ? "هاتساين | الأسئلة الشائعة" : "HaatSign | FAQs";
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
      ? extractPlainText(faqIntroduction?.description_ar)
      : extractPlainText(faqIntroduction?.description_en);
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
  const currentUrl = `${domain}/faqs`;

  return (
    <MainLayout>
      <style>{chevronStyles}</style>
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
        <link rel="alternate" hreflang="ar" href={`${domain}/faqs`} />
        <link rel="alternate" hreflang="en" href={`${domain}/en/faqs`} />
        <link rel="alternate" hreflang="x-default" href={`${domain}/faqs`} />

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
            name: "HaatSign FAQs",
            url: currentUrl,
          })}
        </script>

     
      </Head>

      <BannerTitle
        title={
          isLoading ? (
            <Skeleton width={200} />
          ) : i18n.language === "ar" ? (
            faqIntroduction?.title_ar
          ) : (
            faqIntroduction?.title_en || "Frequently Asked Questions"
          )
        }
        description={
          isLoading ? (
            <Skeleton width={300} />
          ) : i18n.language === "ar" ? (
            faqIntroduction?.sub_title_ar
          ) : (
            faqIntroduction?.sub_title_en
          )
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
              {[1, 2, 3].map((item) => (
                <div key={`skeleton-${item}`} className="col-md-12 mb-4">
                  <Skeleton height={50} />
                  <Skeleton count={3} className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            {faqIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    i18n.language === "ar"
                      ? faqIntroduction.description_ar
                      : faqIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}

            <Accordion open={open} toggle={toggle}>
              {faqData.map((faq) => (
                <AccordionItem key={faq.id}>
                  <AccordionHeader targetId={faq.id.toString()}>
                    {i18n.language === "ar" ? faq.question_ar : faq.question_en}
                  </AccordionHeader>
                  <AccordionBody accordionId={faq.id.toString()}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          i18n.language === "ar"
                            ? faq.answer_ar
                            : faq.answer_en,
                      }}
                    />
                  </AccordionBody>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </MotionDiv>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const [faqsResponse, introductionResponse, landingSettingsResponse] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/faqs`, {
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
        faqData: faqsResponse.data.data,
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
        faqData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default Faqs;
