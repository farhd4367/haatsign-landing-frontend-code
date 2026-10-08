// src/pages/blogs/index.js
import React from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BannerTitle from "@/components/BannerTitle";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Link from "next/link";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);

const Blogs = ({ blogData, introductionData, landingSettingsData, locale, isLoading }) => {
  const { i18n, t } = useTranslation();
  const blogsIntroduction = introductionData?.find(
    (intro) => intro.page_key === "blogs"
  );

  const pageTitle =
    i18n.language === "ar" ? "هاتساين | المدونة" : "HaatSign | Blogs";

  function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
  const metaDescription =
    i18n.language === "ar"
      ? extractPlainText(blogsIntroduction?.description_ar)
      : extractPlainText(blogsIntroduction?.description_en);
      
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
  const currentUrl = `${domain}/blogs`;

  const trimDescription = (description, maxLength = 100) => {
    if (!description) return "";
    const stripped = description.replace(/<[^>]+>/g, ""); // Remove HTML tags
    return stripped.length > maxLength
      ? stripped.substring(0, maxLength) + "..."
      : stripped;
  };

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
          href={`${domain}/blogs`}
        />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/blogs`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/blogs`}
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
            name: "HaatSign Blogs",
            url: currentUrl,
          })}
        </script>

      </Head>

      <BannerTitle
        title={i18n.language === "ar" ? blogsIntroduction?.title_ar : blogsIntroduction?.title_en || t("Blogs")}
        description={i18n.language === "ar" ? blogsIntroduction?.sub_title_ar : blogsIntroduction?.sub_title_en}
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
            {blogsIntroduction && (
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html: i18n.language === "ar"
                    ? blogsIntroduction.description_ar
                    : blogsIntroduction.description_en,
                }}
              />
            )}

            <div className="row">
              {blogData.map((blog) => (
                <MotionDiv
                  key={blog.id}
                  className="col-md-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card h-100">
                    <div className="card-img-top" style={{ height: "200px", position: 'relative' }}>
                      <Image
                        src={blog.image_url || "https://via.placeholder.com/150"}
                        alt={blog.title_en || "No Title"}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        {i18n.language === "ar" ? blog.title_ar : blog.title_en}
                      </h5>
                      <p className="card-text">
                        {i18n.language === "ar"
                          ? trimDescription(blog.description_ar)
                          : trimDescription(blog.description_en)}
                      </p>
                      {blog.slug && (
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="read-more mt-2 d-inline-block"
                        >
                          {t("Read More")}
                        </Link>
                      )}
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
    const [blogsResponse, introductionResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/blogs`, {
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
        blogData: blogsResponse.data.data,
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
        blogData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default Blogs;
