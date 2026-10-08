// // src/pages/pricing.js
// import React, { useEffect, useState } from "react";
// import Head from "next/head";
// import { useTranslation } from "react-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import MainLayout from "@/components/Layout";
// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPlans } from "@/redux/planSlice";
// import { fetchFaqs } from "@/redux/faqsSlice";
// import { fetchPageIntroduction } from "@/redux/pagesIntroductionSlice";
// import { showLoader, hideLoader } from "@/redux/loaderSlice";
// import {
//   Accordion,
//   AccordionBody,
//   AccordionHeader,
//   AccordionItem,
// } from "reactstrap";
// import styles from "@/styles/pricing.module.css";
// import BannerTitle from "@/components/BannerTitle";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { useRouter } from "next/router";
// import Image from 'next/image';
// import axios from "axios";
// import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// const PricingPage = ({ planData, faqData, introductionData, landingSettingsData, locale, isLoading }) => {
//   const { t, i18n } = useTranslation();
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [open, setOpen] = useState("");

//   const [pricingPeriod, setPricingPeriod] = useState("monthly");

//   const toggle = (id) => {
//     setOpen(open === id ? "" : id);
//   };

//   const faqIntroduction = introductionData?.find(
//     (intro) => intro.page_key === "faqs"
//   );

//   // Fix: handle nested API response structure
//   const plans = Array.isArray(planData?.data) ? planData.data : Array.isArray(planData) ? planData : [];

//   const handleOrderNowClick = () => {
//     router.push("/contact-us");
//   };

//   const handlePricingPeriodChange = (period) => {
//     setPricingPeriod(period);
//   };

//   const pageTitle =
//     i18n.language === "ar" ? "هات ساين | الأسعار" : "HaatSign | Pricing";
//   const metaDescription =
//     i18n.language === "ar"
//       ? "استكشف خطط الأسعار لدينا واختر الخيار الأفضل لاحتياجاتك"
//       : "Explore our pricing plans and choose the best option for your needs";
//   const localeCode = i18n.language === "ar" ? "ar_SA" : "en_US";
//   const logoUrl =
//     "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

//   // Extract keywords from landing settings
//   const landingSettings =
//     landingSettingsData && landingSettingsData.length > 0
//       ? landingSettingsData[0]
//       : {};
//   const keywords = landingSettings.default_seo_key_words || "";

//   // Construct the current URL dynamically
//   const currentUrl =
//     typeof window !== "undefined"
//       ? `${window.location.origin}/pricing`
//       : `https://www.haatsign.sa/pricing`;

//   return (
//     <MainLayout>
//       <Head>
//         {/* Primary Meta Tags */}
//         <title>{pageTitle}</title>
//         <meta name="description" content={metaDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content="HaatSign" />
//         <meta name="robots" content="index, follow" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//         {/* Canonical & Alternate URLs */}
//         <link rel="canonical" href={currentUrl} />
//         <link
//           rel="alternate"
//           hreflang="ar"
//           href="https://www.haatsign.sa/ar/pricing"
//         />
//         <link
//           rel="alternate"
//           hreflang="en"
//           href="https://www.haatsign.sa/en/pricing"
//         />
//         <link
//           rel="alternate"
//           hreflang="x-default"
//           href="https://www.haatsign.sa/pricing"
//         />

//         {/* OpenGraph / Facebook */}
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content={currentUrl} />
//         <meta property="og:title" content={pageTitle} />
//         <meta property="og:description" content={metaDescription} />
//         <meta property="og:image" content={logoUrl} />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:site_name" content="HaatSign" />
//         <meta property="og:locale" content={localeCode} />

//         {/* Twitter */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:url" content={currentUrl} />
//         <meta name="twitter:title" content={pageTitle} />
//         <meta name="twitter:description" content={metaDescription} />
//         <meta name="twitter:image" content={logoUrl} />
//         <meta name="twitter:creator" content="@HaatSign" />
//         <meta name="twitter:site" content="@HaatSign" />

//         {/* Schema.org */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebPage",
//             name: "HaatSign Pricing",
//             url: currentUrl,
//           })}
//         </script>

//         {/* Favicons (recommended) */}
//         <link rel="icon" href="/favicon.ico" sizes="any" />
//         <link rel="icon" href="/icon.svg" type="image/svg+xml" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//       </Head>

//       <BannerTitle
//         title={i18n.language === "ar" ? "خطط الأسعار" : "Pricing Plans"}
//         description={i18n.language === "ar" ? "خطط الأسعار والميزات لتوقيع المستندات الرقمية" : "Pricing, Plans and Features for Digital Signature"}
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Pricing Period Tabs */}
//         <div className={styles.pricingTabsContainer}>
//           <div className={styles.pricingTabs}>
//             {isLoading ? (
//               <Skeleton width={100} height={40} style={{ margin: '0 5px' }} />
//             ) : (
//               <>
//                 <button
//                   className={`${styles.tabButton} ${
//                     pricingPeriod === "monthly" ? styles.activeTab : ""
//                   }`}
//                   onClick={() => handlePricingPeriodChange("monthly")}
//                 >
//                   {i18n.language === "ar" ? "شهرياً" : "Monthly"}
//                 </button>
//                 <button
//                   className={`${styles.tabButton} ${
//                     pricingPeriod === "yearly" ? styles.activeTab : ""
//                   }`}
//                   onClick={() => handlePricingPeriodChange("yearly")}
//                 >
//                   {i18n.language === "ar" ? "سنوياً" : "Yearly"}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {isLoading ? (
//           <motion.div
//             className="container my-5"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{
//               duration: 0.5,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//           >
//             <Skeleton count={5} />
//             <div className="row mt-4">
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="col-md-3 mb-4">
//                   <Skeleton height={200} />
//                   <Skeleton count={3} className="mt-2" />
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             className="container mt-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="row justify-content-center">
//               {plans.map((plan) => (
//                 <motion.div
//                   key={plan.id}
//                   className="col-12 col-md-6 col-lg-3 mb-4"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: plan.id * 0.1 }}
//                 >
//                   <div
//                     className={`${styles.pricingCard} ${
//                       plan.recommended === 1 ? styles.popularCard : ""
//                     }`}
//                   >
//                     <div className="p-4">
//                       <h3 className={styles.planName}>
//                         {i18n.language === "ar" ? plan.name_ar : plan.name_en}
//                         {plan.recommended === 1 && (
//                           <span className={styles.popularBadge}>
//                             {i18n.language === "ar"
//                               ? "الأكثر شعبية"
//                               : "Most Popular"}
//                           </span>
//                         )}
//                       </h3>
//                       <div className={styles.priceContainer}>
//                         <span className={styles.price}>
//                           {pricingPeriod === "monthly"
//                             ? plan.price_monthly
//                             : plan.price_yearly}
//                         </span>
//                         <Image
//                           src="/assets/sar.png"
//                           alt="SAR"
//                           className={styles.sarIcon}
//                           width={12}
//                           height={12}
//                           style={i18n.language === 'ar'? {marginRight:'5px'} : {marginLeft:'3px'}}
//                         />
//                         <span className={styles.pricePeriod}>
//                           {pricingPeriod === "monthly"
//                             ? i18n.language === "ar"
//                               ? " /شهرياً"
//                               : " /month"
//                             : i18n.language === "ar"
//                             ? " /سنويًا"
//                             : " /year"}
//                         </span>
//                       </div>

//                       <ul className={styles.featuresList}>
//                         {plan.features
//                           .filter((feature) => feature.pivot.is_boolean !== 1)
//                           .map((feature, index) => (
//                             <li key={index} className={styles.featureItem}>
//                               <i
//                                 className={`bi bi-check2 ${styles.checkIcon}`}
//                               ></i>
//                               <div>
//                                 {feature.pivot.value_en && (
//                                   <span className={styles.featureValue}>
//                                     {i18n.language === "ar"
//                                       ? feature.pivot.value_ar
//                                       : feature.pivot.value_en}
//                                   </span>
//                                 )}
//                                 <span>
//                                   {i18n.language === "ar"
//                                     ? feature.name_ar
//                                     : feature.name_en}
//                                 </span>
//                               </div>
//                             </li>
//                           ))}
//                       </ul>
//                       <button
//                         className={`${styles.actionButton} w-100 mt-4`}
//                         style={{
//                           backgroundColor:
//                             plan.recommended === 1 ? "#a4d264" : "#b0b0b0",
//                           color: plan.recommended === 1 ? "black" : "black",
//                         }}
//                         onClick={handleOrderNowClick}
//                       >
//                         {i18n.language === "ar" ? "اطلب الآن" : "Order Now"}
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <div className={styles.comparisonSection}>
//               <h2 className={styles.comparisonTitle}>
//                 {i18n.language === "ar"
//                   ? "مقارنة الميزات"
//                   : "Feature Comparison"}
//               </h2>
//               <div className={styles.responsiveTableWrapper}>
//                 <table className="table table-bordered comparisonTable" style={{boxShadow:'none'}}>
//                   <thead>
//                     <tr>
//                       <th></th>
//                       {plans.map((plan) => (
//                         <th key={plan.id}>
//                           {i18n.language === "ar" ? plan.name_ar : plan.name_en}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {plans[0]?.features.map((feature, index) => (
//                       <tr key={index}>
//                         <td>
//                           {i18n.language === "ar"
//                             ? feature.name_ar
//                             : feature.name_en}
//                         </td>
//                         {plans.map((plan) => {
//                           const planFeature = plan.features.find(
//                             (f) => f.id === feature.id
//                           );
//                           return (
//                             <td key={plan.id}>
//                               {planFeature?.pivot?.is_boolean === 1 ? (
//                                 <i
//                                   className={`bi bi-check2 ${styles.checkIcon}`}
//                                 ></i>
//                               ) : (
//                                 <span>
//                                   {i18n.language === "ar"
//                                     ? planFeature?.pivot?.value_ar
//                                     : planFeature?.pivot?.value_en}
//                                 </span>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td></td>
//                       {plans.map((plan) => (
//                         <td key={plan.id}>
//                           <button
//                             className={styles.tableButton}
//                             style={{
//                               backgroundColor:
//                                 plan.recommended === 1 ? "#a4d264" : "#b0b0b0",
//                               color: plan.recommended === 1 ? "black" : "black",
//                             }}
//                             onClick={handleOrderNowClick}
//                           >
//                             {i18n.language === "ar" ? "اطلب الآن" : "Order Now"}
//                           </button>
//                         </td>
//                       ))}
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>

//             <div className={styles.faqSection}>
//               <h2 className={`${styles.comparisonTitle} text-center`}>
//                 {i18n.language === "ar"
//                   ? faqIntroduction?.title_ar
//                   : faqIntroduction?.title_en || "Frequently Asked Questions"}
//               </h2>
//               <p className={`${styles.pageSubtitle} text-center`}>
//                 {i18n.language === "ar"
//                   ? faqIntroduction?.sub_title_ar
//                   : faqIntroduction?.sub_title_en}
//               </p>
//               <Accordion open={open} toggle={toggle}>
//                 {faqData.map((faq) => (
//                   <AccordionItem key={faq.id}>
//                     <AccordionHeader targetId={faq.id.toString()}>
//                       {i18n.language === "ar"
//                         ? faq.question_ar
//                         : faq.question_en}
//                     </AccordionHeader>
//                     <AccordionBody accordionId={faq.id.toString()}>
//                       <div
//                         dangerouslySetInnerHTML={{
//                           __html:
//                             i18n.language === "ar"
//                               ? faq.answer_ar
//                               : faq.answer_en,
//                         }}
//                       />
//                     </AccordionBody>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             </div>
//           </motion.div>
//         )}
//       </motion.div>
//     </MainLayout>
//   );
// };

// export async function getStaticProps({ locale }) {
//   try {
//     const [plansResponse, faqsResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
//       axios.get(`${API_BASE_URL}/get-plans`, {
//         headers: getDefaultHeaders(),
//       }),
//       axios.get(`${API_BASE_URL}/faqs`, {
//         headers: getDefaultHeaders(),
//       }),
//       axios.get(`${API_BASE_URL}/get-page-introduction`, {
//         headers: getDefaultHeaders(),
//       }),
//       axios.get(`${API_BASE_URL}/general-setting`, {
//         headers: getDefaultHeaders(),
//       }),
//     ]);

//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ["common"])),
//         planData: plansResponse.data.data,
//         faqData: faqsResponse.data.data,
//         introductionData: introductionResponse.data.data,
//         landingSettingsData: landingSettingsResponse.data.data,
//         locale: locale === "ar" ? "ar_SA" : "en_SA",
//         isLoading: false,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ["common"])),
//         planData: [],
//         faqData: [],
//         introductionData: [],
//         landingSettingsData: [],
//         locale: locale === "ar" ? "ar_SA" : "en_SA",
//         isLoading: true,
//       },
//     };
//   }
// }

// export default PricingPage;




// src/pages/pricing.js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "@/components/Layout";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from 'next/image';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BannerTitle from "@/components/BannerTitle";
import styles from "@/styles/pricing.module.css";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

// Client-only wrapper
const ClientOnly = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : fallback;
};

const PricingPage = ({
  planData,
  faqData,
  introductionData,
  landingSettingsData,
  locale,
  isLoading,
}) => {
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
  const dispatch = null; // Not used in this corrected SSR-safe version
  const router = useRouter();
  const [open, setOpen] = useState("");
  const [pricingPeriod, setPricingPeriod] = useState("monthly");

  const toggle = (id) => {
    setOpen(open === id ? "" : id);
  };

  const faqIntroduction = introductionData?.find(
    (intro) => intro.page_key === "faqs"
  );

  const plans = Array.isArray(planData?.data)
    ? planData.data
    : Array.isArray(planData)
    ? planData
    : [];

  const handleOrderNowClick = () => {
    router.push("/contact-us");
  };

  const handlePricingPeriodChange = (period) => {
    setPricingPeriod(period);
  };

  const pageTitle =
    i18n.language === "ar" ? "هات ساين | الأسعار" : "HaatSign | Pricing";
  const metaDescription =
    i18n.language === "ar"
      ? "استكشف خطط الأسعار لدينا واختر الخيار الأفضل لاحتياجاتك"
      : "Explore our pricing plans and choose the best option for your needs";
  const localeCode = i18n.language === "ar" ? "ar_SA" : "en_US";
  const logoUrl =
    "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

  const landingSettings =
    landingSettingsData && landingSettingsData.length > 0
      ? landingSettingsData[0]
      : {};
  const keywords = landingSettings.default_seo_key_words || "";

  // SSR-safe canonical and OpenGraph URL
  const domain = "https://landing.haatsign.sa";
  const currentUrl = `${domain}/pricing`;

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
  <link rel="alternate" hreflang="ar" href={`${domain}/pricing`} />
  <link rel="alternate" hreflang="en" href={`${domain}/en/pricing`} />
  <link rel="alternate" hreflang="x-default" href={`${domain}/pricing`} />

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
            name: "HaatSign Pricing",
            url: currentUrl,
          })}
        </script>

        
      </Head>

      <BannerTitle
        title={i18n.language === "ar" ? "خطط الأسعار" : "Pricing Plans"}
        description={
          i18n.language === "ar"
            ? "خطط الأسعار والميزات لتوقيع المستندات الرقمية"
            : "Pricing, Plans and Features for Digital Signature"
        }
      />

      {/* Entire dynamic content wrapped in ClientOnly to prevent hydration mismatch */}
      <ClientOnly
        fallback={
          <motion.div className="container my-5">
            <Skeleton count={10} />
          </motion.div>
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Pricing Period Tabs */}
          <div className={styles.pricingTabsContainer}>
            <div className={styles.pricingTabs}>
              <button
                className={`${styles.tabButton} ${
                  pricingPeriod === "monthly" ? styles.activeTab : ""
                }`}
                onClick={() => handlePricingPeriodChange("monthly")}
              >
                {i18n.language === "ar" ? "شهرياً" : "Monthly"}
              </button>
              <button
                className={`${styles.tabButton} ${
                  pricingPeriod === "yearly" ? styles.activeTab : ""
                }`}
                onClick={() => handlePricingPeriodChange("yearly")}
              >
                {i18n.language === "ar" ? "سنوياً" : "Yearly"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <motion.div
              className="container my-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <Skeleton count={5} />
              <div className="row mt-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="col-md-3 mb-4">
                    <Skeleton height={200} />
                    <Skeleton count={3} className="mt-2" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="container mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Plans */}
              <div className="row justify-content-center">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className="col-12 col-md-6 col-lg-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: plan.id * 0.1 }}
                  >
                    <div
                      className={`${styles.pricingCard} ${
                        plan.recommended === 1 ? styles.popularCard : ""
                      }`}
                    >
                      <div className="p-4">
                        <h3 className={styles.planName}>
                          {i18n.language === "ar" ? plan.name_ar : plan.name_en}
                          {plan.recommended === 1 && (
                            <span className={styles.popularBadge}>
                              {i18n.language === "ar" ? "الأكثر شعبية" : "Most Popular"}
                            </span>
                          )}
                        </h3>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>
                            {pricingPeriod === "monthly"
                              ? plan.price_monthly
                              : plan.price_yearly}
                          </span>
                          <Image
                            src="/assets/sar.png"
                            alt="SAR"
                            width={12}
                            height={12}
                            style={
                              i18n.language === "ar"
                                ? { marginRight: "5px" }
                                : { marginLeft: "3px" }
                            }
                          />
                          <span className={styles.pricePeriod}>
                            {pricingPeriod === "monthly"
                              ? i18n.language === "ar"
                                ? " /شهرياً"
                                : " /month"
                              : i18n.language === "ar"
                              ? " /سنويًا"
                              : " /year"}
                          </span>
                        </div>

                        <ul className={styles.featuresList}>
                          {plan.features
                            .filter((feature) => feature.pivot.is_boolean !== 1)
                            .map((feature, index) => (
                              <li key={index} className={styles.featureItem}>
                                <i className={`bi bi-check2 ${styles.checkIcon}`}></i>
                                <div>
                                  {feature.pivot.value_en && (
                                    <span className={styles.featureValue}>
                                      {i18n.language === "ar"
                                        ? feature.pivot.value_ar
                                        : feature.pivot.value_en}
                                    </span>
                                  )}
                                  <span>
                                    {i18n.language === "ar"
                                      ? feature.name_ar
                                      : feature.name_en}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ul>
                        <button
                          className={`${styles.actionButton} w-100 mt-4`}
                          style={{
                            backgroundColor:
                              plan.recommended === 1 ? "var(--primary-color)" : "#b0b0b0",
                            color: plan.recommended === 1 ? "var(--heading-text-color)" : "black",
                          }}
                          onClick={handleOrderNowClick}
                        >
                          {i18n.language === "ar" ? "اطلب الآن" : "Order Now"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature Comparison Table */}
              <div className={styles.comparisonSection}>
                <h2 className={styles.comparisonTitle}>
                  {i18n.language === "ar" ? "مقارنة الميزات" : "Feature Comparison"}
                </h2>
                <div className={styles.responsiveTableWrapper}>
                  <table
                    className="table table-bordered comparisonTable"
                    style={{ boxShadow: "none" }}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        {plans.map((plan) => (
                          <th key={plan.id}>
                            {i18n.language === "ar" ? plan.name_ar : plan.name_en}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plans[0]?.features.map((feature, index) => (
                        <tr key={index}>
                          <td>{i18n.language === "ar" ? feature.name_ar : feature.name_en}</td>
                          {plans.map((plan) => {
                            const planFeature = plan.features.find((f) => f.id === feature.id);
                            return (
                              <td key={plan.id}>
                                {planFeature?.pivot?.is_boolean === 1 ? (
                                  <i className={`bi bi-check2 ${styles.checkIcon}`}></i>
                                ) : (
                                  <span>
                                    {i18n.language === "ar"
                                      ? planFeature?.pivot?.value_ar
                                      : planFeature?.pivot?.value_en}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        {plans.map((plan) => (
                          <td key={plan.id}>
                            <button
                              className={styles.tableButton}
                              style={{
                                backgroundColor:
                                  plan.recommended === 1 ? "var(--primary-color)" : "#b0b0b0",
                                color: plan.recommended === 1 ? "var(--heading-text-color)" : "black",
                              }}
                              onClick={handleOrderNowClick}
                            >
                              {i18n.language === "ar" ? "اطلب الآن" : "Order Now"}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* FAQ Section */}
              <div className={styles.faqSection}>
                <h2 className={`${styles.comparisonTitle} text-center`}>
                  {i18n.language === "ar"
                    ? faqIntroduction?.title_ar
                    : faqIntroduction?.title_en || "Frequently Asked Questions"}
                </h2>
                <p className={`${styles.pageSubtitle} text-center`}>
                  {i18n.language === "ar"
                    ? faqIntroduction?.sub_title_ar
                    : faqIntroduction?.sub_title_en}
                </p>
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
            </motion.div>
          )}
        </motion.div>
      </ClientOnly>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const [plansResponse, faqsResponse, introductionResponse, landingSettingsResponse] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/get-plans`, { headers: getDefaultHeaders() }),
        axios.get(`${API_BASE_URL}/faqs`, { headers: getDefaultHeaders() }),
        axios.get(`${API_BASE_URL}/get-page-introduction`, { headers: getDefaultHeaders() }),
        axios.get(`${API_BASE_URL}/general-setting`, { headers: getDefaultHeaders() }),
      ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        planData: plansResponse.data.data,
        faqData: faqsResponse.data.data,
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
        planData: [],
        faqData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60,
    };
  }
}

export default PricingPage;
