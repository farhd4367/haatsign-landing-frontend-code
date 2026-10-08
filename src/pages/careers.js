// src/pages/careers.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from '@/components/Layout';
import BannerTitle from '@/components/BannerTitle';
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const Careers = ({ jobData, introductionData, landingSettingsData, locale, isLoading }) => {
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
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState('');

  const partnerIntroduction = introductionData?.find(
    (intro) => intro.page_key === 'careers'
  );

  const toggle = (id) => {
    setOpen(open === id ? '' : id);
  };

  const pageTitle = i18n.language === 'ar' ? 'هاتساين | الوظائف' : 'HaatSign | Careers';
   function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  const metaDescription =
    i18n.language === 'ar'
      ? extractPlainText(partnerIntroduction?.description_ar) || 'Join our team and help us build innovative solutions for the future.'
      : extractPlainText(partnerIntroduction?.description_en) || 'Join our team and help us build innovative solutions for the future.';
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
  const currentUrl = `${domain}/careers`;

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
        <link
          rel="alternate"
          hreflang="ar"
          href={`${domain}/careers`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/careers`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/careers`}
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
            name: "HaatSign Careers",
            url: currentUrl,
          })}
        </script>

        
      </Head>

      <BannerTitle
        title={isLoading ? <Skeleton width={200} /> : (i18n.language === 'ar' ? partnerIntroduction?.title_ar : partnerIntroduction?.title_en || "Careers")}
        description={isLoading ? <Skeleton width={300} /> : (i18n.language === 'ar' ? partnerIntroduction?.sub_title_ar : partnerIntroduction?.sub_title_en)}
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
            {partnerIntroduction && (
              <div
                dangerouslySetInnerHTML={{
                  __html: i18n.language === 'ar'
                    ? partnerIntroduction.description_ar
                    : partnerIntroduction.description_en,
                }}
                className="mb-4"
              />
            )}
            <Accordion open={open} toggle={toggle}>
              {jobData.map((job) => (
                <AccordionItem key={job.id}>
                  <AccordionHeader targetId={job.id.toString()}>
                    {i18n.language === 'ar'
                      ? job.title_ar
                      : job.title_en || t('No Title Available')}
                  </AccordionHeader>
                  <AccordionBody accordionId={job.id.toString()}>
                    <p>
                      <strong>{t('Department')}:</strong>{' '}
                      {i18n.language === 'ar' ? job.department_ar : job.department_en || t('No Department Available')}
                    </p>
                    <p>
                      <strong>{t('Job Reference')}:</strong>{' '}
                      {job.job_reference || t('No Reference Available')}
                    </p>
                    <p>
                      <strong>{t('Report To')}:</strong>{' '}
                      {i18n.language === 'ar' ? job.report_to_ar : job.report_to_en || t('No Report To Available')}
                    </p>
                    <div>
                      <strong>{t('Requirements')}:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: i18n.language === 'ar' ? job.requirements_ar : job.requirements_en || t('No Requirements Available'),
                        }}
                      />
                    </div>
                    <div>
                      <strong>{t('Job Description')}:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: i18n.language === 'ar' ? job.job_description_ar : job.job_description_en || t('No Description Available'),
                        }}
                      />
                    </div>
                    <p>
                      <strong>{t('Location')}:</strong>{' '}
                      {i18n.language === 'ar' ? job.location_ar : job.location_en || t('No Location Available')}
                    </p>
                    <div>
                      <strong>{t('Responsibilities')}:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: i18n.language === 'ar' ? job.responsibilities_ar : job.responsibilities_en || t('No Responsibilities Available'),
                        }}
                      />
                    </div>
                    <p>
                      <strong>{t('Experience')}:</strong>{' '}
                      {i18n.language === 'ar' ? job.experience?.name_ar : job.experience?.name_en || t('No Experience Info Available')}
                    </p>
                    <p>
                      <strong>{t('Employment Type')}:</strong>{' '}
                      {i18n.language === 'ar' ? job.employee_type?.name_ar : job.employee_type?.name_en || t('No Employment Type Available')}
                    </p>
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
    const [jobsResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/jobs`, {
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
        jobData: jobsResponse.data.data,
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
        jobData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default Careers;
