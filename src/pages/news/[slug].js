// // src/pages/news/[slug].js
// import React from "react";
// import { useRouter } from "next/router";
// import { useTranslation } from "react-i18next";
// import Head from "next/head";
// import BannerTitle from "@/components/BannerTitle";
// import NotFound from "@/components/NotFound";
// import MainLayout from "@/components/Layout";
// import {
//   FacebookShareButton,
//   FacebookMessengerShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   WhatsappShareButton,
//   TelegramShareButton,
//   EmailShareButton,
//   FacebookIcon,
//   FacebookMessengerIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   WhatsappIcon,
//   TelegramIcon,
//   EmailIcon,
// } from "react-share";
// import Link from "next/link";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
// import { FaXTwitter } from "react-icons/fa6";
// import Image from "next/image";

// const NewsCustomPage = ({ newsDetails, introductionData, locale, isLoading }) => {
//   const router = useRouter();
//   const { slug } = router.query;
//   const { i18n } = useTranslation();

//   // Handle fallback case during static generation
//   if (router.isFallback) {
//     return (
//       <MainLayout>
//         <div className="container my-5 text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading news article...</p>
//         </div>
//       </MainLayout>
//     );
//   }

//   const shareUrl = typeof window !== "undefined" ? window.location.href : "";

//   if (!newsDetails) return <NotFound />;

//   const newsIntro = introductionData?.find((i) => i.page_key === "news");
//   const news = newsDetails?.news_details || {};
//   const latest = newsDetails?.latest_news || [];

//   const pageTitle = news
//     ? i18n.language === "ar"
//       ? `هاتساين | ${news.title_ar}`
//       : `HaatSign | ${news.title_en}`
//     : i18n.language === "ar"
//     ? "هاتساين | الأخبار"
//     : "HaatSign | News";

//   const keywords = news?.seo_key_words || "news, updates, digital trust";

//   const metaDesc = news?.meta_description || 
//     (newsIntro
//       ? i18n.language === "ar"
//         ? newsIntro?.sub_title_ar
//         : newsIntro?.sub_title_en
//       : "Explore our latest news and insights on digital trust services and their impact.");

//   const logoUrl =
//     news?.image_url ||
//     "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

//   const localeCode = i18n.language === "ar" ? "ar_SA" : "en_US";

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', options);
//   };

//   return (
//     <MainLayout>
//       <Head>
//         <title>{pageTitle}</title>
//         <meta name="description" content={metaDesc} />
//         <meta name="keywords" content={keywords} />
//         <meta name="author" content="HaatSign" />
//         <meta name="robots" content="index, follow" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//         {/* Canonical & Alternate URLs */}
//         <link rel="canonical" href={shareUrl} />
//         <link
//           rel="alternate"
//           hreflang="ar"
//           href={`https://www.haatsign.sa/ar/news/${slug}`}
//         />
//         <link
//           rel="alternate"
//           hreflang="en"
//           href={`https://www.haatsign.sa/en/news/${slug}`}
//         />
//         <link
//           rel="alternate"
//           hreflang="x-default"
//           href={`https://www.haatsign.sa/news/${slug}`}
//         />

//         {/* OpenGraph / Facebook */}
//         <meta property="og:type" content="article" />
//         <meta property="og:url" content={shareUrl} />
//         <meta property="og:title" content={pageTitle} />
//         <meta property="og:description" content={metaDesc} />
//         <meta property="og:image" content={logoUrl} />
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//         <meta property="og:site_name" content="HaatSign" />
//         <meta property="og:locale" content={localeCode} />

//         {/* Twitter */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:url" content={shareUrl} />
//         <meta name="twitter:title" content={pageTitle} />
//         <meta name="twitter:description" content={metaDesc} />
//         <meta name="twitter:image" content={logoUrl} />
//         <meta name="twitter:creator" content="@HaatSign" />
//         <meta name="twitter:site" content="@HaatSign" />

//         {/* Schema.org */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Article",
//             "headline": pageTitle,
//             "url": shareUrl,
//             "image": logoUrl,
//             "description": metaDesc,
//             "author": {
//               "@type": "Organization",
//               "name": "HaatSign"
//             },
//             "publisher": {
//               "@type": "Organization",
//               "name": "HaatSign",
//               "logo": {
//                 "@type": "ImageObject",
//                 "url": logoUrl
//               }
//             },
//             "datePublished": news?.created_at,
//             "dateModified": news?.updated_at
//           })}
//         </script>
//       </Head>

//       <BannerTitle
//         title={
//           isLoading ? (
//             <Skeleton width={200} />
//           ) : i18n.language === "ar" ? (
//             newsIntro?.title_ar || "الأخبار"
//           ) : (
//             newsIntro?.title_en || "News"
//           )
//         }
//         description={
//           isLoading ? (
//             <Skeleton width={300} />
//           ) : i18n.language === "ar" ? (
//             newsIntro?.sub_title_ar
//           ) : (
//             newsIntro?.sub_title_en
//           )
//         }
//       />

//       <motion.div
//         key={slug}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
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
//             <Skeleton height={30} width={200} />
//             <Skeleton height={400} className="my-3" />
//             <Skeleton count={5} />
//           </motion.div>
//         ) : (
//           <motion.div
//             className="container mt-5"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               className="row"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <motion.div
//                 className="col-md-8"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <small className="text-muted">
//                   {formatDate(news?.updated_at)}
//                 </small>
//                 <h2 className="mt-2 mb-3" style={{ color: "#a4d264" }}>
//                   {i18n.language === "ar" ? news?.title_ar : news?.title_en}
//                 </h2>
//                 {news?.image_url && (
//                   <div className="position-relative" style={{ height: '400px' }}>
//                     <Image
//                       src={news.image_url}
//                       alt={i18n.language === "ar" ? news?.title_ar : news?.title_en}
//                       fill
//                       className="img-fluid rounded mb-3"
//                       style={{ objectFit: 'cover' }}
//                       priority
//                     />
//                   </div>
//                 )}
//                 <div
//                   className="news-content"
//                   dangerouslySetInnerHTML={{
//                     __html:
//                       i18n.language === "ar"
//                         ? news?.description_ar
//                         : news?.description_en,
//                   }}
//                 />
//               </motion.div>

//               <motion.div
//                 className="col-md-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div className="social-share-buttons mb-4 d-flex justify-content-center gap-2 flex-wrap">
//                   <FacebookShareButton url={shareUrl}>
//                     <FacebookIcon size={32} round />
//                   </FacebookShareButton>

//                   <FacebookMessengerShareButton url={shareUrl}>
//                     <FacebookMessengerIcon size={32} round />
//                   </FacebookMessengerShareButton>

//                   <TwitterShareButton url={shareUrl}>
//                     <div
//                       style={{
//                         width: 32,
//                         height: 32,
//                         backgroundColor: "#000",
//                         borderRadius: "50%",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       <FaXTwitter size={20} color="#fff" />
//                     </div>
//                   </TwitterShareButton>

//                   <TelegramShareButton url={shareUrl}>
//                     <TelegramIcon size={32} round />
//                   </TelegramShareButton>

//                   <WhatsappShareButton url={shareUrl}>
//                     <WhatsappIcon size={32} round />
//                   </WhatsappShareButton>

//                   <LinkedinShareButton url={shareUrl}>
//                     <LinkedinIcon size={32} round />
//                   </LinkedinShareButton>

//                   <EmailShareButton url={shareUrl}>
//                     <EmailIcon size={32} round />
//                   </EmailShareButton>
//                 </div>

//                 <ul className="list-group blogs-list">
//                   {latest.map((item) => ( 
//                     <motion.li
//                       key={item.id}
//                       className="list-group-item blogs-list-item"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       <Link href={`/news/${item.slug_url}`} className="read-more">
//                         {i18n.language === "ar" ? item.title_ar : item.title_en}
//                       </Link>
//                       <br />
//                       <small className="text-muted">
//                         {formatDate(item.date)}
//                       </small>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         )}
//       </motion.div>
//     </MainLayout>
//   );
// };

// export async function getStaticProps({ params, locale }) {
//   try {
//     const headers = getDefaultHeaders();
    
//     const [newsDetailsResponse, introductionResponse] = await Promise.all([
//       axios.post(
//         `${API_BASE_URL}/news-details`,
//         { slug: params.slug },
//         { headers }
//       ),
//       axios.get(`${API_BASE_URL}/get-page-introduction`, { headers }),
//     ]);

//     // Check if news exists
//     if (!newsDetailsResponse.data.data || !newsDetailsResponse.data.data.news_details) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ["common"])),
//         newsDetails: newsDetailsResponse.data.data,
//         introductionData: introductionResponse.data.data,
//         locale: locale === "ar" ? "ar_SA" : "en_SA",
//         isLoading: false,
//       },
//       revalidate: 60 * 60, // Revalidate every hour
//     };
//   } catch (error) {
//     console.error("Error fetching news data:", error);
//     return {
//       notFound: true,
//     };
//   }
// }

// export async function getStaticPaths() {
//   try {
//     const headers = getDefaultHeaders();
//     const response = await axios.get(`${API_BASE_URL}/news`, { headers });

//     const paths = response.data.data.flatMap((news) => [
//       {
//         params: { slug: news.slug.replace("/news/", "") },
//         locale: 'en',
//       },
//       {
//         params: { slug: news.slug.replace("/news/", "") },
//         locale: 'ar',
//       },
//     ]);

//     return {
//       paths,
//       fallback: "blocking",
//     };
//   } catch (error) {
//     console.error("Error generating paths:", error);
//     return {
//       paths: [],
//       fallback: "blocking",
//     };
//   }
// }

// export default NewsCustomPage;






// src/pages/news/[slug].js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import BannerTitle from "@/components/BannerTitle";
import NotFound from "@/components/NotFound";
import MainLayout from "@/components/Layout";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Image from "next/image";

// Hydration-safe text component
const HydrationSafeText = ({ en, ar, locale }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span>{locale === "ar_SA" ? ar : en}</span>;
  return <>{locale === "ar_SA" ? ar : en}</>;
};

// Hydration-safe date formatting
const HydrationSafeDate = ({ dateString, locale }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !dateString) return null;

  const date = new Date(dateString);
  return (
    <>{date.toLocaleDateString(locale === "ar_SA" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</>
  );
};

const NewsCustomPage = ({ newsDetails, introductionData, locale, isLoading }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { i18n } = useTranslation();

  // fallback during build
  if (router.isFallback) {
    return (
      <MainLayout>
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading news article...</p>
        </div>
      </MainLayout>
    );
  }

  // SSR-safe canonical and OpenGraph URL
  const domain = "https://landing.haatsign.sa";
  const shareUrl = `${domain}/news/${ slug || ''}`;

  if (!newsDetails) return <NotFound />;

  const newsIntro = introductionData?.find((i) => i.page_key === "news");
  const news = newsDetails?.news_details || {};
  const latest = newsDetails?.latest_news || [];

  const pageTitle = news
    ? locale === "ar_SA"
      ? `هاتساين | ${news.title_ar}`
      : `HaatSign | ${news.title_en}`
    : locale === "ar_SA"
    ? "هاتساين | الأخبار"
    : "HaatSign | News";

  const keywords = news?.seo_key_words;

  function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  const metaDesc = i18n.language === "ar"
    ? extractPlainText(news?.description_ar)
    : extractPlainText(news?.description_en);

  const logoUrl = news?.image_url || "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

  return (
    <MainLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="canonical" href={shareUrl} />
  <link rel="alternate" hreflang="ar" href={`${domain}/news/${news?.slug_url || slug || ''}`} />
  <link rel="alternate" hreflang="en" href={`${domain}/en/news/${news?.slug_url || slug || ''}`} />
  <link rel="alternate" hreflang="x-default" href={`${domain}/news/${news?.slug_url || slug || ''}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HaatSign" />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="twitter:creator" content="@HaatSign" />
        <meta name="twitter:site" content="@HaatSign" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageTitle,
            url: shareUrl,
            image: logoUrl,
            description: metaDesc,
            author: { "@type": "Organization", name: "HaatSign" },
            publisher: { "@type": "Organization", name: "HaatSign", logo: { "@type": "ImageObject", url: logoUrl } },
            datePublished: news?.created_at,
            dateModified: news?.updated_at
          })}
        </script>
      </Head>

      <BannerTitle
        title={
          isLoading
            ? <Skeleton width={200} />
            : <HydrationSafeText en={newsIntro?.title_en || "News"} ar={newsIntro?.title_ar || "الأخبار"} locale={locale} />
        }
        description={
          isLoading
            ? <Skeleton width={300} />
            : <HydrationSafeText en={newsIntro?.sub_title_en} ar={newsIntro?.sub_title_ar} locale={locale} />
        }
      />

      <motion.div key={slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {isLoading ? (
          <motion.div className="container my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}>
            <Skeleton height={30} width={200} />
            <Skeleton height={400} className="my-3" />
            <Skeleton count={5} />
          </motion.div>
        ) : (
          <motion.div className="container mt-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.div className="col-md-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <small className="text-muted">
                  <HydrationSafeDate dateString={news?.updated_at} locale={locale} />
                </small>
                <h2 className="mt-2 mb-3" style={{ color: "var(--primary-color)" }}>
                  <HydrationSafeText en={news?.title_en} ar={news?.title_ar} locale={locale} />
                </h2>
                {news?.image_url && (
                  <div className="position-relative" style={{ height: '400px', marginBottom: '20px' }}>
                    <Image
                      src={news.image_url}
                      alt={locale === "ar_SA" ? news?.title_ar : news?.title_en}
                      fill
                      className="img-fluid rounded mb-3"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                )}
                <div className="news-content" dangerouslySetInnerHTML={{
                  __html: locale === "ar_SA" ? news?.description_ar : news?.description_en
                }} />
              </motion.div>

              <motion.div className="col-md-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="social-share-buttons mb-4 d-flex justify-content-center gap-2 flex-wrap">
                  <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
                  <FacebookMessengerShareButton url={shareUrl}><FacebookMessengerIcon size={32} round /></FacebookMessengerShareButton>
                  <TwitterShareButton url={shareUrl}>
                    <div style={{ width: 32, height: 32, backgroundColor: "#000", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <FaXTwitter size={20} color="#fff" />
                    </div>
                  </TwitterShareButton>
                  <TelegramShareButton url={shareUrl}><TelegramIcon size={32} round /></TelegramShareButton>
                  <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
                  <LinkedinShareButton url={shareUrl}><LinkedinIcon size={32} round /></LinkedinShareButton>
                  <EmailShareButton url={shareUrl}><EmailIcon size={32} round /></EmailShareButton>
                </div>

                <ul className="list-group blogs-list">
                  {latest.map((item) => (
                    <motion.li key={item.id} className="list-group-item blogs-list-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      <Link href={`/news/${item.slug_url}`} className="read-more">
                        <HydrationSafeText en={item.title_en} ar={item.title_ar} locale={locale} />
                      </Link>
                      <br />
                      <small className="text-muted">
                        <HydrationSafeDate dateString={item.date} locale={locale} />
                      </small>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export async function getStaticProps({ params, locale }) {
  try {
    const headers = getDefaultHeaders();

    const [newsDetailsResponse, introductionResponse] = await Promise.all([
      axios.post(`${API_BASE_URL}/news-details`, { slug: params.slug }, { headers }),
      axios.get(`${API_BASE_URL}/get-page-introduction`, { headers }),
    ]);

    if (!newsDetailsResponse.data.data || !newsDetailsResponse.data.data.news_details) {
      return { notFound: true };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        newsDetails: newsDetailsResponse.data.data,
        introductionData: introductionResponse.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: false,
      },
      revalidate: 60 ,
    };
  } catch (error) {
    console.error("Error fetching news data:", error);
    return { notFound: true , revalidate: 60 };
  }
}

export async function getStaticPaths() {
  try {
    const headers = getDefaultHeaders();
    const response = await axios.get(`${API_BASE_URL}/news`, { headers });

    const paths = response.data.data
      .filter((news) => news.slug) // ensure slug exists
      .flatMap((news) => [
        { params: { slug: news.slug.replace("/news/", "") }, locale: 'en' },
        { params: { slug: news.slug.replace("/news/", "") }, locale: 'ar' },
      ]);

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error generating paths:", error);
    return { paths: [], fallback: "blocking" };
  }
}


export default NewsCustomPage;
