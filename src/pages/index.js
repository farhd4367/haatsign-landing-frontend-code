import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { showLoader, hideLoader } from "@/redux/loaderSlice";
import { useTranslation } from "react-i18next";
import Services from "@/components/Home/Services";
import Partners from "@/components/Home/Partners";
import Customers from "@/components/Home/Customers";
import WhyHaatSign from "@/components/Home/WhyHaatsign";
import LatestNews from "@/components/Home/LatestNews";
import MainLayout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export async function getStaticProps({ locale }) {
  try {
    const [slidersResponse, homeResponse, landingSettingsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/sliders`, {
        headers: getDefaultHeaders(),
      }),
      axios.get(`${API_BASE_URL}/home`, {
        headers: getDefaultHeaders(),
      }),
      axios.get(`${API_BASE_URL}/general-setting`, {
        headers: getDefaultHeaders(),
      }),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        sliderData: slidersResponse.data.data,
        homeData: homeResponse.data.data,
        landingSettingsData: landingSettingsResponse.data.data,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        sliderData: [],
        homeData: {},
        landingSettingsData: [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  }
}

export default function HomePage({ sliderData = [], homeData = {}, landingSettingsData = [] }) {

  // Use locale from props for SSR consistency
  const carouselRef = useRef(null);
  const router = useRouter();
  const { asPath, locale: routerLocale } = router;
  const [isCarouselLoading, setIsCarouselLoading] = useState(sliderData.length === 0);

  // Ensure landingSettings is defined
  const landingSettings =
    landingSettingsData && landingSettingsData.length > 0
      ? landingSettingsData[0]
      : {};

  // Use locale from router or props
  const currentLocale = routerLocale || 'en';
  const isAr = currentLocale === 'ar';

  // SEO Meta Variables
  const pageTitle = isAr ? "هاتساين | الصفحة الرئيسية" : "HaatSign | Home";
  const metaDescription = isAr
    ? "هاتساين توفر حلول التوقيع الإلكتروني الآمنة والمعتمدة في السعودية. وقع مستنداتك بسهولة وسرعة مع حلولنا الموثوقة."
    : "HaatSign offers legally binding digital signature solutions in Saudi Arabia. Sign documents securely online with our trusted e-signature platform.";
  const localeCode = isAr ? "ar_SA" : "en_US";
  const logoUrl = "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";
  const currentUrl = `https://landing.haatsign.sa${asPath}`;

  useEffect(() => {
    if (sliderData.length > 0) {
      setIsCarouselLoading(false);
    }
  }, [sliderData]);

  useEffect(() => {
    if (isAr) {
      const modifyTransformValues = () => {
        const slider = carouselRef.current?.querySelector(".slider.animated");
        if (slider) {
          const currentTransform = slider.style.transform;
          const newTransform = currentTransform.replace(/-([0-9]+)/g, "$1");
          slider.style.transform = newTransform;
        }
      };

      modifyTransformValues();
      const intervalId = setInterval(modifyTransformValues, 100);
      return () => clearInterval(intervalId);
    }
  }, [sliderData, isAr]);

  // Loading state for homeData (simulate skeleton if empty)
  const loading = !homeData || Object.keys(homeData).length === 0;

  return (
    <MainLayout>
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={landingSettings.default_seo_key_words || ""}
        />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical & Alternate URLs */}
        <link rel="canonical" href={currentUrl} />
        <link
          rel="alternate"
          hreflang="ar"
          href={
            typeof window !== "undefined"
              ? `${window.location.origin}${asPath}`
              : `https://landing.haatsign.sa${asPath}`
          }
        />
        <link
          rel="alternate"
          hreflang="en"
          href={
            typeof window !== "undefined"
              ? `${window.location.origin}/en${asPath}`
              : `https://landing.haatsign.sa/en${asPath}`
          }
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={
            typeof window !== "undefined"
              ? `${window.location.origin}${asPath}`
              : `https://landing.haatsign.sa${asPath}`
          }
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
            "@type": "WebSite",
            name: "HaatSign",
            url: "https://landing.haatsign.sa/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://landing.haatsign.sa/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>

      
      </Head>

      <div className="carousel-container" ref={carouselRef}>
        {isCarouselLoading ? (
          <div className="carousel-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ) : (
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            stopOnHover={false}
          >
            {sliderData.map((item) => (
              <div key={item.id} className="carousel-slide">
                <div
                  className="carousel-image"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "600px",
                  }}
                >
                  <Image
                    src={item.slider_image}
                    alt={isAr ? item.title_ar : item.title_en}
                    width={1200}
                    height={600}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="carousel-overlay">
                  <div className="container">
                    <h2 className="carousel-title">
                      {isAr ? item.title_ar : item.title_en}
                    </h2>
                    <p className="carousel-subtitle">
                      {isAr ? item.sub_title_ar : item.sub_title_en}
                    </p>
                    <Link
                      href={item.button_url}
                      target="_blank"
                      className="read-more-button"
                    >
                      {isAr ? item.button_title_ar : item.button_title_en}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="container my-5">
            <div className="row">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="col-md-3 mb-4">
                  <div className="card-skeleton">
                    <div className="card-skeleton-image"></div>
                    <div className="card-skeleton-title"></div>
                    <div className="card-skeleton-text"></div>
                    <div className="card-skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <Services
              services={Object.values(homeData.our_services || {}).slice(0, 4)}
            />
            <Partners partners={Object.values(homeData.partners || [])} />
            <WhyHaatSign whyhaatsign={homeData.why_haat_sign} />
            <Customers
              customers={Object.values(homeData.our_customers || [])}
            />
            <LatestNews
              latestnews={Object.values(homeData.latest_news || {}).slice(0, 4)}
            />
          </>
        )}
      </motion.div>

      <style jsx>{`
        .carousel-skeleton {
          position: relative;
          width: 100%;
          height: 500px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .skeleton-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          text-align: center;
        }

        .skeleton-title {
          width: 60%;
          height: 40px;
          margin: 0 auto 20px;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-subtitle {
          width: 80%;
          height: 30px;
          margin: 0 auto 30px;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-button {
          width: 150px;
          height: 40px;
          margin: 0 auto;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .card-skeleton {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          height: 300px;
        }

        .card-skeleton-image {
          width: 100%;
          height: 150px;
          background: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
        }

        .card-skeleton-title {
          width: 80%;
          height: 20px;
          background: #f0f0f0;
          margin-bottom: 10px;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
        }

        .card-skeleton-text {
          width: 100%;
          height: 60px;
          background: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
        }

        .card-skeleton-button {
          width: 100px;
          height: 30px;
          background: #f0f0f0;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </MainLayout>
  );
}
