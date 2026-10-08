// src/pages/blogs/[slug].js
import React from "react";
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
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const BlogsCustomPage = ({
  blogDetails,
  introductionData,
  locale,
  isLoading,
}) => {
  const router = useRouter();
  const { slug } = router.query;
  const { i18n } = useTranslation();

  // Handle fallback case during static generation
  if (router.isFallback) {
    return (
      <MainLayout>
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blog post...</p>
        </div>
      </MainLayout>
    );
  }

  // SSR-safe canonical and share URL
  const domain = "https://landing.haatsign.sa";
  const canonicalUrl = `${domain}${router.asPath}`;

  if (!blogDetails) return <NotFound />;

  const blogIntro = introductionData?.find((i) => i.page_key === "blogs");
  const blog = blogDetails?.blogs_details || {};
  const latest = blogDetails?.latest_blogs || [];

  const pageTitle = blog
    ? i18n.language === "ar"
      ? `هاتساين | ${blog.title_ar}`
      : `HaatSign | ${blog.title_en}`
    : i18n.language === "ar"
    ? "هاتساين | المدونة"
    : "HaatSign | Blogs";

  const keywords = blog?.seo_key_words  ;

  // Extract plain text from blog description for meta description
  function extractPlainText(html, maxLength = 300) {
    if (!html) return "";
    // Remove HTML tags
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    // Truncate and add ellipsis if needed
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  const metaDesc = i18n.language === "ar"
    ? extractPlainText(blog?.description_ar)
    : extractPlainText(blog?.description_en);

  const logoUrl =
    blog?.image_url ||
    "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

  const localeCode = i18n.language === "ar" ? "ar_SA" : "en_US";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(
      i18n.language === "ar" ? "ar-SA" : "en-US",
      options
    );
  };

  return (
    <MainLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical & Alternate URLs */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hreflang="ar" href={`${domain}/blogs/${slug}`} />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/blogs/${slug}`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/blogs/${slug}`}
        />

        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="HaatSign" />
        <meta property="og:locale" content={localeCode} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="twitter:creator" content="@HaatSign" />
        <meta name="twitter:site" content="@HaatSign" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageTitle,
            url: canonicalUrl,
            image: logoUrl,
            description: metaDesc,
            author: {
              "@type": "Organization",
              name: "HaatSign",
            },
            publisher: {
              "@type": "Organization",
              name: "HaatSign",
              logo: {
                "@type": "ImageObject",
                url: logoUrl,
              },
            },
            datePublished: blog?.created_at,
            dateModified: blog?.updated_at,
          })}
        </script>
      </Head>

      <BannerTitle
        title={
          isLoading ? (
            <Skeleton width={200} />
          ) : i18n.language === "ar" ? (
            blogIntro?.title_ar || "المدونة"
          ) : (
            blogIntro?.title_en || "Blogs"
          )
        }
        description={
          isLoading ? (
            <Skeleton width={300} />
          ) : i18n.language === "ar" ? (
            blogIntro?.sub_title_ar
          ) : (
            blogIntro?.sub_title_en
          )
        }
      />

      <motion.div
        key={slug}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <motion.div
            className="container my-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Skeleton height={30} width={200} />
            <Skeleton height={400} className="my-3" />
            <Skeleton count={5} />
          </motion.div>
        ) : (
          <motion.div
            className="container mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="col-md-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <small className="text-muted">
                  {formatDate(blog?.updated_at)}
                </small>
                <h2 className="mt-2 mb-3" style={{ color: "var(--primary-color)" }}>
                  {i18n.language === "ar" ? blog?.title_ar : blog?.title_en}
                </h2>
                {blog?.image_url && (
                  <div
                    className="position-relative"
                    style={{ height: "400px" }}
                  >
                    <Image
                      src={blog.image_url}
                      alt={
                        i18n.language === "ar" ? blog?.title_ar : blog?.title_en
                      }
                      fill
                      className="img-fluid rounded mb-3"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </div>
                )}
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      i18n.language === "ar"
                        ? blog?.description_ar
                        : blog?.description_en,
                  }}
                />
              </motion.div>

              <motion.div
                className="col-md-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="social-share-buttons mb-4 d-flex justify-content-center gap-2 flex-wrap">
                  <FacebookShareButton url={canonicalUrl}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>

                  <FacebookMessengerShareButton url={canonicalUrl}>
                    <FacebookMessengerIcon size={32} round />
                  </FacebookMessengerShareButton>

                  <TwitterShareButton url={canonicalUrl}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: "#000",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FaXTwitter size={20} color="#fff" />
                    </div>
                  </TwitterShareButton>

                  <TelegramShareButton url={canonicalUrl}>
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>

                  <WhatsappShareButton url={canonicalUrl}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>

                  <LinkedinShareButton url={canonicalUrl}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>

                  <EmailShareButton url={canonicalUrl}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>

                <ul className="list-group blogs-list">
                  {latest.map((item) => (
                    <motion.li
                      key={item.id}
                      className="list-group-item blogs-list-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Link href={`/blogs/${item.slug}`} className="read-more">
                        {i18n.language === "ar" ? item.title_ar : item.title_en}
                      </Link>
                      <br />
                      <small className="text-muted">
                        {formatDate(item.date)}
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

    const [blogDetailsResponse, introductionResponse] = await Promise.all([
      axios.post(
        `${API_BASE_URL}/blog-details`,
        { slug: params.slug },
        { headers }
      ),
      axios.get(`${API_BASE_URL}/get-page-introduction`, { headers }),
    ]);

    // Check if blog exists
    if (
      !blogDetailsResponse.data.data ||
      !blogDetailsResponse.data.data.blogs_details
    ) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        blogDetails: blogDetailsResponse.data.data,
        introductionData: introductionResponse.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: false,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      notFound: true,
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export async function getStaticPaths() {
  try {
    const headers = getDefaultHeaders();
    const response = await axios.get(`${API_BASE_URL}/blogs`, { headers });

    const paths = response.data.data.flatMap((blog) => [
      {
        params: { slug: blog.slug.replace("/blogs/", "") },
        locale: "en",
      },
      {
        params: { slug: blog.slug.replace("/blogs/", "") },
        locale: "ar",
      },
    ]);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error generating paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export default BlogsCustomPage;
