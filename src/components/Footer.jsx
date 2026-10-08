"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import {
  fetchLandingSettings,
  fetchSocialMediaLinks,
  enableFooter,
  enableSecondFooter,
} from "@/redux/landingSettingSlice";
import { subscribeNewsletter } from "@/redux/newletterSlice";

import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NoSSRFooterContent = dynamic(
  () => Promise.resolve(({ children }) => <>{children}</>),
  {
    ssr: false,
  }
);

const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("العربية");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const { landingSettingsData, socialMediaLinksData } = useSelector(
    (state) => state.landingSettings
  );

  const footerEnabledData = useSelector(
    (state) => state.landingSettings.footerEnabledData || []
  );

  const secondFooterEnabledData = useSelector(
    (state) => state.landingSettings.secondFooterEnabledData || []
  );

  const { loading, error } = useSelector((state) => state.newsletter);

  useEffect(() => {
    const currentLang = i18n.language === "ar" ? "العربية" : "English";
    setSelectedLanguage(currentLang);

    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchLandingSettings());
    dispatch(fetchSocialMediaLinks());
    dispatch(enableFooter());
    dispatch(enableSecondFooter());
  }, [dispatch]);

  const handleSelectLanguage = (language) => {
    const langCode = language === "English" ? "en" : "ar";
    router.push(router.pathname, router.asPath, { locale: langCode });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(i18n.language === "ar" ? "يرجى إدخال عنوان بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }
    try {
      const result = await dispatch(subscribeNewsletter(email)).unwrap();
      if (result) {
        toast.success(i18n.language === "ar" ? "تم الاشتراك بنجاح في النشرة البريدية!" : "Successfully subscribed to newsletter!");
        setEmail("");
      }
    } catch (error) {
      if(error.message === "The email has already been taken.") {
        toast.error(i18n.language === "ar" ? "البريد الإلكتروني مستخدم بالفعل." : "Email is already taken.");
      }
      else {
      toast.error(error.message || (i18n.language === "ar" ? "فشل الاشتراك في النشرة البريدية" : "Failed to subscribe to newsletter"));
      }
    }
  };

  const settings = landingSettingsData?.[0];

  const isActive = (path) => router.asPath.startsWith(path);

  if (!isClient) {
    return null;
  }

  // Function to get all hardcoded footer links
  const getHardcodedLinks = () => {
    return [
      // Help & Support
      "/news",
      "/blogs",
      "/tutorials",
      "/careers",
      "/faqs",
      "/contact-us",
      "/pricing",

      // Company Overview
      "/about-us",
      "/partners",
      "/customers",
      "/memberships",
      "/certificates",
      "/company-files",
      "/site-map",

      // Our Services
      "/why-haatsign",
      "/regulations",
      "/issuing-digital-certificates",
      "/e-signature",
      "/electronic-and-time-stamp",
      "/automatic-workflow-signing-service",
    ];
  };

  // Function to get all hardcoded second footer (policy) links
  const getHardcodedPolicyLinks = () => {
    return [
      "/privacy-policy",
      "/terms-of-use",
      "/return-and-refund-policy",
      "/quality-policy",
      "/security-policy",
    ];
  };

  // Filter footerEnabledData to only include links not already hardcoded
  const additionalLinks = footerEnabledData?.filter(
    (item) =>
      item.is_footer === 1 && !getHardcodedLinks().includes(item.page_url)
  );

  // Filter secondFooterEnabledData to only include links not already hardcoded in policies
  const additionalPolicyLinks = secondFooterEnabledData?.filter(
    (item) =>
      item.as_second_footer === 1 &&
      !getHardcodedPolicyLinks().includes(item.page_url)
  );

  // Function to group additional links by their path structure
  const groupAdditionalLinks = () => {
    const groups = {
      helpSupport: [],
      companyOverview: [],
      ourServices: [],
      policies: [],
    };

    additionalLinks?.forEach((link) => {
      if (
        link.page_url.startsWith("/news") ||
        link.page_url.startsWith("/blogs") ||
        link.page_url.startsWith("/tutorials") ||
        link.page_url.startsWith("/faqs") ||
        link.page_url.startsWith("/contact")
      ) {
        groups.helpSupport.push(link);
      } else if (
        link.page_url.startsWith("/about") ||
        link.page_url.startsWith("/partners") ||
        link.page_url.startsWith("/customers")
      ) {
        groups.companyOverview.push(link);
      } else if (
        link.page_url.startsWith("/why") ||
        link.page_url.includes("signature") ||
        link.page_url.includes("certificate") ||
        link.page_url.includes("regulation")
      ) {
        groups.ourServices.push(link);
      } else {
        // Default to company overview if no match
        groups.ourServices.push(link);
      }
    });

    return groups;
  };

  const groupedLinks = groupAdditionalLinks();

  return (
    <NoSSRFooterContent>
      <ToastContainer
        toastStyle={{ fontFamily: "Changa" }}
        position="top-right"
      />
      {settings?.show_footer_newsletter_subscription === 1 && (
        <div className="newsletter-container">
          <p>{t("Sign up for our newsletter to receive the latest news")}</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-wrapper">
              <input
                type="email"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Your email address")}
                className="newsletter-input"
                required
              />
              <button
                type="submit"
                className="newsletter-button"
                disabled={loading}
              >
                {t("Subscribe")}
              </button>
            </div>
          </form>
        </div>
      )}
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <Image
                src={settings?.is_dark_icons_theme === 1 ? settings?.black_logo : settings?.white_logo}
                alt="Logo"
                width={200}
                height={140}
                boxFit="contain"
                objectFit="contain"
                className="footer-logo"
              />
              <p>
                {i18n.language === "ar"
                  ? settings?.app_bio_ar
                  : settings?.app_bio_en}
              </p>

              <p className="text-danger text-center mt-3">
                {i18n.language === "ar"
                  ? "إطلاق تجريبي v.1.0.0"
                  : "Beta Release v.1.0.0"}
              </p>

              <div className="app-buttons">
                {settings?.show_footer_android_link === 1 && (
                  <Link
                    href={settings.android_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/Google_Play_Store.png"
                      alt="Google Play"
                      width={150}
                      height={70}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                )}
                {settings?.show_footer_ios_link === 1 && (
                  <Link
                    href={settings.ios_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/App_Store.png"
                      alt="App Store"
                      width={150}
                      height={70}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  marginTop: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {settings?.show_footer_dga === 1 && (
                  <Link
                    href={settings.dga_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        settings?.is_dark_icons_theme === 1
                          ? "/assets/dga-w.png"
                          : "/assets/dga-b.png"
                      }
                      alt="DGA"
                      width={100}
                      height={100}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                )}
                {settings?.show_footer_web_trust === 1 && (
                  <Link
                    href={settings.webtrustseal_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={
                        settings?.is_dark_icons_theme === 1
                          ? "/assets/webtrust-w.png"
                          : "/assets/webtrust-b.png"
                      }
                      alt="WebTrust"
                      width={90}
                      height={50}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                )}
                {settings?.show_footer_iso === 1 && (
                  <Image
                    src={
                      settings?.is_dark_icons_theme === 1
                        ? "/assets/iso-w.png"
                        : "/assets/iso-b.png"
                    }
                    alt="ISO"
                    width={80}
                    height={100}
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
            </div>

            <div className="footer-section">
              <h3>{t("Help & Support")}</h3>
              <ul>
                {settings?.show_footer_latest_news === 1 && (
                  <li>
                    <Link
                      href="/news"
                      className={isActive("/news") ? "footer-active-link" : ""}
                    >
                      {t("Latest News")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_blog === 1 && (
                  <li>
                    <Link
                      href="/blogs"
                      className={isActive("/blogs") ? "footer-active-link" : ""}
                    >
                      {t("blogs")}
                    </Link>
                  </li>
                )}

                {settings?.show_footer_tutorials === 1 && (
                  <li>
                    <Link
                      href="/tutorials"
                      className={
                        isActive("/tutorials") ? "footer-active-link" : ""
                      }
                    >
                      {t("Tutorials")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_career === 1 && (
                  <li>
                    <Link
                      href="/careers"
                      className={
                        isActive("/careers") ? "footer-active-link" : ""
                      }
                    >
                      {t("Career")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_faq === 1 && (
                  <li>
                    <Link
                      href="/faqs"
                      className={isActive("/faqs") ? "footer-active-link" : ""}
                    >
                      {t("FAQs")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_contact_us === 1 && (
                  <li>
                    <Link
                      href="/contact-us"
                      className={
                        isActive("/contact-us") ? "footer-active-link" : ""
                      }
                    >
                      {t("Contact Us")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_pricing === 1 && (
                  <li>
                    <Link
                      href="/pricing"
                      className={
                        isActive("/pricing") ? "footer-active-link" : ""
                      }
                    >
                      {t("Pricing")}
                    </Link>
                  </li>
                )}
                {/* Additional Help & Support Links */}
                {groupedLinks.helpSupport.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.page_url}
                      className={
                        isActive(link.page_url) ? "footer-active-link" : ""
                      }
                    >
                      {i18n.language === "ar"
                        ? link.page_title_ar
                        : link.page_title_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3>{t("Company Overview")}</h3>
              <ul>
                {settings?.show_footer_about_haatsign === 1 && (
                  <li>
                    <Link
                      href="/about-us"
                      className={
                        isActive("/about-us") ? "footer-active-link" : ""
                      }
                    >
                      {t("About haatsign")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_partner === 1 && (
                  <li>
                    <Link
                      href="/partners"
                      className={
                        isActive("/partners") ? "footer-active-link" : ""
                      }
                    >
                      {t("partners")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_customer === 1 && (
                  <li>
                    <Link
                      href="/customers"
                      className={
                        isActive("/customers") ? "footer-active-link" : ""
                      }
                    >
                      {t("Customers")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_memberships === 1 && (
                  <li>
                    <Link
                      href="/memberships"
                      className={
                        isActive("/memberships") ? "footer-active-link" : ""
                      }
                    >
                      {t("Memberships")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_certificate === 1 && (
                  <li>
                    <Link
                      href="/certificates"
                      className={
                        isActive("/certificates") ? "footer-active-link" : ""
                      }
                    >
                      {t("Certificates")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_company_file === 1 && (
                  <li>
                    <Link
                      href="/company-files"
                      className={
                        isActive("/company-files") ? "footer-active-link" : ""
                      }
                    >
                      {t("Company files")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_sitemap === 1 && (
                  <li>
                    <Link
                      href="/site-map"
                      className={
                        isActive("/site-map") ? "footer-active-link" : ""
                      }
                    >
                      {t("Site Map")}
                    </Link>
                  </li>
                )}
                {/* Additional Company Overview Links */}
                {groupedLinks.companyOverview.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.page_url}
                      className={
                        isActive(link.page_url) ? "footer-active-link" : ""
                      }
                    >
                      {i18n.language === "ar"
                        ? link.page_title_ar
                        : link.page_title_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3>{t("Our Services")}</h3>
              <ul>
                {settings?.show_footer_why_haatsign === 1 && (
                  <li>
                    <Link
                      href="/why-haatsign"
                      className={
                        isActive("/why-haatsign") ? "footer-active-link" : ""
                      }
                    >
                      {t("Why haatsign?")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_regulation === 1 && (
                  <li>
                    <Link
                      href="/regulations"
                      className={
                        isActive("/regulations") ? "footer-active-link" : ""
                      }
                    >
                      {t("Regulations")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_issuing_digital_certificate === 1 && (
                  <li>
                    <Link
                      href="/issuing-digital-certificates"
                      className={
                        isActive("/issuing-digital-certificates")
                          ? "footer-active-link"
                          : ""
                      }
                    >
                      {t("Issuing Digital Certificates")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_esignature === 1 && (
                  <li>
                    <Link
                      href="/e-signature"
                      className={
                        isActive("/e-signature") ? "footer-active-link" : ""
                      }
                    >
                      {t("E-signature")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_electronic_time_stamp === 1 && (
                  <li>
                    <Link
                      href="/electronic-and-time-stamp"
                      className={
                        isActive("/electronic-and-time-stamp")
                          ? "footer-active-link"
                          : ""
                      }
                    >
                      {t("Electronic and Time Stamp")}
                    </Link>
                  </li>
                )}
                {settings?.show_footer_automatic_overflow_signature === 1 && (
                  <li>
                    <Link
                      href="/automatic-workflow-signing-service"
                      className={
                        isActive("/automatic-workflow-signing-service")
                          ? "footer-active-link"
                          : ""
                      }
                    >
                      {t("Automate Workflow Signing service")}
                    </Link>
                  </li>
                )}
                {/* Additional Our Services Links */}
                {groupedLinks.ourServices.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.page_url}
                      className={
                        isActive(link.page_url) ? "footer-active-link" : ""
                      }
                    >
                      {i18n.language === "ar"
                        ? link.page_title_ar
                        : link.page_title_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3>{t("Get Connected")}</h3>
              {settings && (
                <>
                  <p>
                    {t("Phone 1")}:{" "}
                    <span
                      style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
                    >
                      {settings.phone_no1}
                    </span>
                  </p>
                  <p>
                    {t("Phone 2")}:{" "}
                    <span
                      style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
                    >
                      {settings.phone_no2}
                    </span>
                  </p>
                  <p>{settings.email}</p>
                  <p>{settings.email_support}</p>
                  <p>{settings.email_cells}</p>
                </>
              )}
              <p>{t("Stay up to Date")}</p>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-bottom-column">
                {settings?.show_footer_copyright_term === 1 && (
                  <p>
                    {t(
                      "All Rights Reserved for HAAT Global for Communications and IT © 2025"
                    )}
                  </p>
                )}

                {settings?.show_footer_social_media === 1 && (
                  <>
                    {/* <h3>{t("Social Links")}:</h3> */}
                    <div className="social-icons">
                      {socialMediaLinksData && (
                        <>
                          {socialMediaLinksData.facebook_link && (
                            <Link
                              href={socialMediaLinksData.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/facebook-w.png"
                                    : "/assets/facebook-b.png"
                                }
                                alt="Facebook"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                          {socialMediaLinksData.twitter_link && (
                            <Link
                              href={socialMediaLinksData.twitter_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/twitter-w.png"
                                    : "/assets/twitter-b.png"
                                }
                                alt="Twitter"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                          {socialMediaLinksData.linkedin_link && (
                            <Link
                              href={socialMediaLinksData.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/linkedin-w.png"
                                    : "/assets/linkedin-b.png"
                                }
                                alt="LinkedIn"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                          {socialMediaLinksData.youtube_link && (
                            <Link
                              href={socialMediaLinksData.youtube_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/youtube-w.png"
                                    : "/assets/youtube-b.png"
                                }
                                alt="YouTube"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                          {socialMediaLinksData.snapchat_link && (
                            <Link
                              href={socialMediaLinksData.snapchat_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/snapchat-w.png"
                                    : "/assets/snapchat-b.png"
                                }
                                alt="Snapchat"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                          {socialMediaLinksData.tiktok_link && (
                            <Link
                              href={socialMediaLinksData.tiktok_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={
                                  settings?.is_dark_icons_theme === 1
                                    ? "/assets/tiktok-w.png"
                                    : "/assets/tiktok-b.png"
                                }
                                alt="TikTok"
                                width={30}
                                height={30}
                              />
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="footer-bottom-column footer-links">
                {/* Hardcoded policy links */}
                {settings?.show_footer_privacy_policy === 1 && (
                  <Link
                    href="/privacy-policy"
                    className={
                      isActive("/privacy-policy") ? "footer-active-link" : ""
                    }
                  >
                    {t("Privacy Policy")}
                  </Link>
                )}
                {settings?.show_footer_terms_of_use === 1 && (
                  <Link
                    href="/terms-of-use"
                    className={
                      isActive("/terms-of-use") ? "footer-active-link" : ""
                    }
                  >
                    {t("Terms of Use")}
                  </Link>
                )}
                {settings?.show_footer_return_and_refund_policy === 1 && (
                  <Link
                    href="/return-and-refund-policy"
                    className={
                      isActive("/return-and-refund-policy")
                        ? "footer-active-link"
                        : ""
                    }
                  >
                    {t("Return and Refund Policy")}
                  </Link>
                )}
                {settings?.show_footer_quality_policy === 1 && (
                  <Link
                    href="/quality-policy"
                    className={
                      isActive("/quality-policy") ? "footer-active-link" : ""
                    }
                  >
                    {t("Quality Policy")}
                  </Link>
                )}
                {settings?.show_footer_security_policy === 1 && (
                  <Link
                    href="/security-policy"
                    className={
                      isActive("/security-policy") ? "footer-active-link" : ""
                    }
                  >
                    {t("Security Policy")}
                  </Link>
                )}

                {/* Additional Policy Links from secondFooterEnabledData */}
                {additionalPolicyLinks?.map((link) => (
                  <Link
                    key={link.id}
                    href={link.page_url}
                    className={
                      isActive(link.page_url) ? "footer-active-link" : ""
                    }
                  >
                    {i18n.language === "ar"
                      ? link.page_title_ar
                      : link.page_title_en}
                  </Link>
                ))}
              </div>
              <div className="footer-bottom-column">
                {settings?.show_footer_language_switcher === 1 && (
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-basic"
                      className="language-dropdown"
                    >
                      {selectedLanguage}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="language-dropdown-menu">
                      <Dropdown.Item
                        onClick={() => handleSelectLanguage("English")}
                      >
                        English
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleSelectLanguage("العربية")}
                      >
                        العربية
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </NoSSRFooterContent>
  );
};

export default dynamic(() => Promise.resolve(Footer), {
  ssr: false,
});
