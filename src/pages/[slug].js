// // src/pages/[slug].js
// import React, { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCustomPage, clearPageData } from "@/redux/CustomPageSlice";
// import { fetchPageIntroduction } from "@/redux/pagesIntroductionSlice";
// import { showLoader, hideLoader } from "@/redux/loaderSlice";
// import { useTranslation } from "react-i18next";
// import Head from "next/head";
// import BannerTitle from "@/components/BannerTitle";
// import NotFound from "@/components/NotFound";
// import MainLayout from "@/components/Layout";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
// import Image from 'next/image';

// const CustomPage = ({ pageData: initialPageData, introductionData, locale }) => {
//   const router = useRouter();
//   const { slug } = router.query;
//   const dispatch = useDispatch();
//   const { i18n, t } = useTranslation();

//   // Get redux state
//   const { pageData: reduxPageData, loading, error } = useSelector(
//     (state) => state.customPage
//   );

//   // Use server data initially, fallback to redux data if available
//   const pageData = reduxPageData || initialPageData;
//   const isAr = i18n.language === "ar";

//   // Sync server data to redux on client after mount if redux is empty
//   useEffect(() => {
//     if (initialPageData && !reduxPageData) {
//       dispatch({ type: fetchCustomPage.fulfilled.type, payload: initialPageData });
//     }
//   }, [dispatch, initialPageData, reduxPageData]);

//   // Fetch page introduction and optionally refetch pageData on client (optional)
//   useEffect(() => {
//     if (slug) {
//       dispatch(showLoader());
//       dispatch(fetchPageIntroduction());
//       dispatch(fetchCustomPage(slug)).finally(() => dispatch(hideLoader()));
//     }

//     return () => {
//       dispatch(clearPageData());
//     };
//   }, [slug, dispatch]);

//   // SEO Metadata
//   const pageTitle = pageData
//     ? isAr
//       ? `هاتساين | ${pageData.page_title_ar || ""}`
//       : `HaatSign | ${pageData.page_title_en || ""}`
//     : isAr
//     ? "هاتساين"
//     : "HaatSign";

//   const metaDescription = pageData
//     ? isAr
//       ? pageData.meta_description_ar || pageData.sub_title_ar
//       : pageData.meta_description_en || pageData.sub_title_en
//     : isAr
//     ? "هاتساين - منصة الثقة الرقمية"
//     : "HaatSign - Digital Trust Platform";

//   const keywords = pageData?.seo_key_words || "digital trust, esignature, saudi arabia";
//   const logoUrl = pageData?.image_url || "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";
//   const currentUrl = `https://www.haatsign.sa/${isAr ? 'ar' : 'en'}/${slug}`;

//   if (error) {
//     return <NotFound />;
//   }

//   if (router.isFallback) {
//     return (
//       <MainLayout>
//         <div className="container my-5 text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">{t("Loading page...")}</p>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout key={slug}>
//       <Head>
//         <title>{pageTitle}</title>
//         <meta name="description" content={metaDescription} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content="HaatSign" />
//         <meta name="robots" content="index, follow" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//         {/* Canonical & Alternate URLs */}
//         <link rel="canonical" href={currentUrl} />
//         <link rel="alternate" hreflang="ar" href={`https://www.haatsign.sa/ar/${slug}`} />
//         <link rel="alternate" hreflang="en" href={`https://www.haatsign.sa/en/${slug}`} />
//         <link rel="alternate" hreflang="x-default" href={`https://www.haatsign.sa/${slug}`} />

//         {/* OpenGraph / Facebook */}
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content={currentUrl} />
//         <meta property="og:title" content={pageTitle} />
//         <meta property="og:description" content={metaDescription} />
//         <meta property="og:image" content={logoUrl} />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:site_name" content="HaatSign" />
//         <meta property="og:locale" content={isAr ? "ar_SA" : "en_US"} />

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
//             "name": pageTitle,
//             "url": currentUrl,
//             "description": metaDescription,
//             "publisher": {
//               "@type": "Organization",
//               "name": "HaatSign",
//               "logo": {
//                 "@type": "ImageObject",
//                 "url": logoUrl
//               }
//             }
//           })}
//         </script>
//       </Head>

//       <BannerTitle
//         title={
//           loading ? (
//             <Skeleton width={200} />
//           ) : isAr ? (
//             pageData?.page_title_ar
//           ) : (
//             pageData?.page_title_en
//           )
//         }
//         description={
//           loading ? (
//             <Skeleton width={300} />
//           ) : isAr ? (
//             pageData?.sub_title_ar
//           ) : (
//             pageData?.sub_title_en
//           )
//         }
//       />

//       <motion.div
//         key={slug}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {loading ? (
//           <motion.div
//             className="container my-5"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
//           >
//             <Skeleton height={400} className="mb-3" />
//             <Skeleton count={5} />
//           </motion.div>
//         ) : (
//           <motion.div
//             className="container my-5"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {pageData && (
//               <div
//                 className="page-content"
//                 dangerouslySetInnerHTML={{
//                   __html: isAr ? pageData.page_content_ar : pageData.page_content_en,
//                 }}
//               />
//             )}

//             {slug === "about-us" && pageData?.additional_data && (
//               <>
//                 <div className="services-section my-5">
//                   <h2 className="text-center mb-4" style={{ color: "#a4d264" }}>
//                     {t("Our Services")}
//                   </h2>
//                   <div className="row">
//                     {pageData.additional_data.services?.map((service) => (
//                       <div key={service.id} className="col-md-4 mb-4">
//                         <div className="text-center">
//                           <Image
//                             src={service.icons_url}
//                             alt={isAr ? service.title_ar : service.title_en}
//                             width={80}
//                             height={80}
//                             className="mb-3 img-fluid"
//                           />
//                           <h5>{isAr ? service.title_ar : service.title_en}</h5>
//                           <p>{isAr ? service.description_ar : service.description_en}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="values-section my-5">
//                   <h2 className="text-center mb-4" style={{ color: "#a4d264" }}>
//                     {t("Our Values")}
//                   </h2>
//                   <div className="row justify-content-center">
//                     {pageData.additional_data.values?.map((value) => (
//                       <div key={value.id} className="col-md-3 col-6 text-center mb-4">
//                         <div className="p-3 h-100">
//                           <Image
//                             src={value.icon}
//                             alt={isAr ? value.title_ar : value.title_en}
//                             width={60}
//                             height={60}
//                             className="mb-3 img-fluid"
//                           />
//                           <h5>{isAr ? value.title_ar : value.title_en}</h5>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mission-vision-section my-5">
//                   <div className="row">
//                     <div className="col-md-6 mb-4">
//                       <div className="p-4 h-100 bg-light rounded">
//                         <h5 className="mb-3 text-center" style={{ color: "#a4d264" }}>
//                           {t("Our Mission")}
//                         </h5>
//                         <p className="text-center">
//                           {isAr
//                             ? pageData.additional_data.landing?.our_mission_ar
//                             : pageData.additional_data.landing?.our_mission_en}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="col-md-6 mb-4">
//                       <div className="p-4 h-100 bg-light rounded">
//                         <h5 className="mb-3 text-center" style={{ color: "#a4d264" }}>
//                           {t("Our Vision")}
//                         </h5>
//                         <p className="text-center">
//                           {isAr
//                             ? pageData.additional_data.landing?.our_vission_ar
//                             : pageData.additional_data.landing?.our_vission_en}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </motion.div>
//         )}
//       </motion.div>
//     </MainLayout>
//   );
// };

// export async function getServerSideProps(context) {
//   const { locale, params } = context;
//   const { slug } = params;

//   try {
//     const headers = getDefaultHeaders();
    
//     const [pageResponse, introductionResponse] = await Promise.all([
//       axios.post(
//         `${API_BASE_URL}/custom-page-details`,
//         { slug: `/${slug}` },
//         { headers }
//       ),
//       axios.get(`${API_BASE_URL}/get-page-introduction`, { headers }),
//     ]);

//     // Check if page exists
//     if (!pageResponse.data.data) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ["common"])),
//         pageData: pageResponse.data.data,
//         introductionData: introductionResponse.data.data,
//         locale: locale === "ar" ? "ar_SA" : "en_US",
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching page data:", error);
//     return {
//       notFound: true,
//     };
//   }
// }

// export default CustomPage;



import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomPage, clearPageData } from "@/redux/CustomPageSlice";
import { fetchPageIntroduction } from "@/redux/pagesIntroductionSlice";
import { showLoader, hideLoader } from "@/redux/loaderSlice";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import BannerTitle from "@/components/BannerTitle";
import NotFound from "@/components/NotFound";
import MainLayout from "@/components/Layout";
import ClientOnly from "@/components/ClientOnly";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Image from 'next/image';

const CustomPage = ({ pageData: initialPageData, introductionData, locale, seoKeywords }) => {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
 

  // Redux state
  const { pageData: reduxPageData, loading, error } = useSelector(
    (state) => state.customPage
  );

  const pageData = reduxPageData || initialPageData;
  const isAr = i18n.language === "ar";

  // Sync server data to redux
  useEffect(() => {
    if (initialPageData && !reduxPageData) {
      dispatch({ type: fetchCustomPage.fulfilled.type, payload: initialPageData });
    }
  }, [dispatch, initialPageData, reduxPageData]);

  // Fetch page data on client
  useEffect(() => {
    if (slug) {
      dispatch(showLoader());
      dispatch(fetchPageIntroduction());
      dispatch(fetchCustomPage(slug)).finally(() => dispatch(hideLoader()));
    }

    return () => {
      dispatch(clearPageData());
    };
  }, [slug, dispatch]);

  // SEO
  const pageTitle = pageData
    ? isAr
      ? `هاتساين | ${pageData.page_title_ar || ""}`
      : `HaatSign | ${pageData.page_title_en || ""}`
    : isAr
    ? "هاتساين"
    : "HaatSign";

function extractPlainText(html, maxLength = 300) {
  if (!html) return "";
  // Remove h1 tag content
  let withoutH1 = html.replace(/<h1[^>]*>.*?<\/h1>/gis, "");
  // Remove HTML tags
  let text = withoutH1.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  // Remove &nbsp; and similar entities
  text = text.replace(/(&nbsp;)+/gi, " ").replace(/\s+/g, " ").trim();
  // Truncate and add ellipsis if needed
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }    

  const metaDescription = i18n.language === "ar"
    ? extractPlainText(pageData?.page_content_ar)
    : extractPlainText(pageData?.page_content_en);

  const keywords = seoKeywords;
  const logoUrl = pageData?.image_url || "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";
  const domain = "https://landing.haatsign.sa";
  const currentUrl = isAr ? `${domain}/${slug}` : `${domain}/en/${slug}`;

  if (error) return <NotFound />;
  if (router.isFallback) return <MainLayout><p>Loading...</p></MainLayout>;

  return (
    <MainLayout key={slug}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={currentUrl} />
        <link rel="alternate" hreflang="ar" href={`${domain}/${slug}`} />
        <link rel="alternate" hreflang="en" href={`${domain}/en/${slug}`} />
        <link rel="alternate" hreflang="x-default" href={`${domain}/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HaatSign" />
        <meta property="og:locale" content={isAr ? "ar_SA" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="twitter:creator" content="@HaatSign" />
        <meta name="twitter:site" content="@HaatSign" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "url": currentUrl,
            "description": metaDescription,
            "publisher": {
              "@type": "Organization",
              "name": "HaatSign",
              "logo": { "@type": "ImageObject", "url": logoUrl }
            }
          })}
        </script>
      </Head>

      {/* Banner and Page Content are now SEO-visible */}
      <BannerTitle
        title={loading ? <Skeleton width={200} /> : isAr ? pageData?.page_title_ar : pageData?.page_title_en}
        description={loading ? <Skeleton width={300} /> : isAr ? pageData?.sub_title_ar : pageData?.sub_title_en}
      />

      <motion.div
        key={slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <Skeleton height={400} className="mb-3" />
        ) : (
          <div className="container my-5">
            {pageData && (
              <div
                className="page-content"
                dangerouslySetInnerHTML={{
                  __html: isAr ? pageData.page_content_ar : pageData.page_content_en,
                }}
              />
            )}

            {/* Interactive parts remain client-only if needed, add here */}
            {slug === "about-us" && pageData?.additional_data && (
              <>
                <div className="services-section my-5">
                  <h2 className="text-center mb-4" style={{ color: "var(--primary-color)" }}>
                    {t("Our Services")}
                  </h2>
                  <div className="row">
                    {pageData.additional_data.services?.map((service) => (
                      <div key={service.id} className="col-md-4 mb-4 text-center">
                        <Image
                          src={service.icons_url}
                          alt={isAr ? service.title_ar : service.title_en}
                          width={80}
                          height={80}
                          className="mb-3 img-fluid"
                        />
                        <h5>{isAr ? service.title_ar : service.title_en}</h5>
                        <p>{isAr ? service.description_ar : service.description_en}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="values-section my-5">
                  <h2 className="text-center mb-4" style={{ color: "var(--primary-color)" }}>
                    {t("Our Values")}
                  </h2>
                  <div className="row justify-content-center">
                    {pageData.additional_data.values?.map((value) => (
                      <div key={value.id} className="col-md-3 col-6 text-center mb-4">
                        <div className="p-3 h-100">
                          <Image
                            src={value.icon}
                            alt={isAr ? value.title_ar : value.title_en}
                            width={60}
                            height={60}
                            className="mb-3 img-fluid"
                          />
                          <h5>{isAr ? value.title_ar : value.title_en}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mission-vision-section my-5">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 bg-light rounded text-center">
                        <h5 className="mb-3" style={{ color: "var(--primary-color)" }}>{t("Our Mission")}</h5>
                        <p>{isAr ? pageData.additional_data.landing?.our_mission_ar : pageData.additional_data.landing?.our_mission_en}</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 bg-light rounded text-center">
                        <h5 className="mb-3" style={{ color: "var(--primary-color)" }}>{t("Our Vision")}</h5>
                        <p>{isAr ? pageData.additional_data.landing?.our_vission_ar : pageData.additional_data.landing?.our_vission_en}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export async function getServerSideProps(context) {
  const { locale, params } = context;
  const { slug } = params;

  try {
    const headers = getDefaultHeaders();
    const [pageResponse, introductionResponse, generalSettingResponse] = await Promise.all([
      axios.post(`${API_BASE_URL}/custom-page-details`, { slug: `/${slug}` }, { headers }),
      axios.get(`${API_BASE_URL}/get-page-introduction`, { headers }),
      axios.get(`${API_BASE_URL}/general-setting`, { headers }),
    ]);

    if (!pageResponse.data.data) return { notFound: true };

    // Get SEO keywords from pageData or fallback to general-setting
    const pageData = pageResponse.data.data;
    const generalSetting = generalSettingResponse.data.data?.[0] || {};
    
    const seoKeywords = pageData.seo_key_words || generalSetting.default_seo_key_words || "";

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        pageData,
        introductionData: introductionResponse.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_US",
        seoKeywords,
        revalidate: 60,
      }
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return { notFound: true };
  }
}

export default CustomPage;
