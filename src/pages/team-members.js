// src/pages/team-members.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import BannerTitle from "@/components/BannerTitle";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "@/components/Layout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Link from "next/link";

// Dynamically import motion components to avoid SSR hydration issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const TeamMembers = ({
  teamMembersData,
  introductionData,
  landingSettingsData,
  locale,
  isLoading,
}) => {
  const { t, i18n } = useTranslation();
  const teamIntroduction = introductionData?.find(
    (intro) => intro.page_key === "team-members"
  );

  const pageTitle =
    i18n.language === "ar"
      ? "هاتساين | أعضاء الفريق"
      : "HaatSign | Team Members";

  // Extract plain text from blog description for meta description
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
      ?  extractPlainText(teamIntroduction?.description_ar)
      : extractPlainText(teamIntroduction?.description_en);

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
  const currentUrl = `${domain}/team-members`;

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
        <link rel="alternate" hreflang="ar" href={`${domain}/team-members`} />
        <link
          rel="alternate"
          hreflang="en"
          href={`${domain}/en/team-members`}
        />
        <link
          rel="alternate"
          hreflang="x-default"
          href={`${domain}/team-members`}
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
            name: "HaatSign Team Members",
            url: currentUrl,
          })}
        </script>

      </Head>

      <BannerTitle
        title={
          isLoading ? (
            <Skeleton width={200} />
          ) : i18n.language === "ar" ? (
            teamIntroduction?.title_ar
          ) : (
            teamIntroduction?.title_en || t("Team Members")
          )
        }
        description={
          isLoading ? (
            <Skeleton width={300} />
          ) : i18n.language === "ar" ? (
            teamIntroduction?.sub_title_ar
          ) : (
            teamIntroduction?.sub_title_en
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
                <div key={`skeleton-${item}`} className="col-12 mb-4">
                  <Skeleton height={200} />
                  <Skeleton count={3} className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            {teamIntroduction && (
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    i18n.language === "ar"
                      ? teamIntroduction.description_ar
                      : teamIntroduction.description_en,
                }}
              />
            )}

            <div className="row">
              {teamMembersData.map((member) => (
                <MotionDiv
                  key={member.id}
                  className="col-12 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="card flex-column flex-md-row w-100 align-items-start p-3"
                    style={{
                      border: "none",
                      background: "none",
                      backgroundImage:
                        i18n.language === "ar"
                          ? "linear-gradient(to right, rgba(255,0,0,0), rgba(238, 237, 237,1))"
                          : "linear-gradient(to left, rgba(255,0,0,0), rgba(238, 237, 237,1))",
                    }}
                  >
                    <div className="avatar-section">
                      <div className="row">
                        <div className="col-12 text-center">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt={
                                i18n.language === "ar"
                                  ? member.name_ar
                                  : member.name_en
                              }
                              className="img-fluid rounded mx-auto mx-md-0"
                              width={250} // Specify the width
                              height={300} // Specify the height
                            />
                          ) : (
                            <p className="text-center">
                              {t("No Avatar Available")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 row d-flex justify-content-center">
                        <div className="col-12 text-center">
                          <h5 className="card-title">
                            {i18n.language === "ar"
                              ? member.name_ar
                              : member.name_en}
                          </h5>
                        </div>
                        <div className="col-12 text-center">
                          <p
                            className="card-subtitle mb-2"
                            style={{ color: "var(--primary-color)" }}
                          >
                            {i18n.language === "ar"
                              ? member.job_title_ar
                              : member.job_title_en}
                          </p>
                        </div>
                      </div>

                      <div className="social-icons mt-3 justify-content-center">
                        {member.linkedin_url && (
                          <Link
                            href={member.x_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src="/assets/twitter.png"
                              alt="Twitter"
                              width={24}
                              height={24}
                            />
                          </Link>
                        )}
                        {member.x_url && (
                          <Link
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src="/assets/linkedin.png"
                              alt="LinkedIn"
                              width={24}
                              height={24}
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="card-body ms-4 me-4">
                      <p
                        className="card-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            i18n.language === "ar"
                              ? member.description_ar
                              : member.description_en,
                        }}
                      />
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
    const [teamMembersResponse, introductionResponse, landingSettingsResponse] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/team-members`, {
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
        teamMembersData: teamMembersResponse.data.data,
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
        teamMembersData: [],
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60,
    };
  }
}

export default TeamMembers;
