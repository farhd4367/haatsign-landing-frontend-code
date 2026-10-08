// // src/pages/contact-us.js
// import React, { useEffect, useState, useCallback, memo } from "react";
// import Head from "next/head";
// import { useDispatch, useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import MainLayout from "@/components/Layout";
// import BannerTitle from "@/components/BannerTitle";
// const Select = dynamic(() => import("react-select"), { ssr: false });
// import { toast } from "react-toastify";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { motion } from "framer-motion";
// import axios from "axios";
// import dynamic from "next/dynamic";
// const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
//   ssr: false,
// });

// import {
//   fetchContactSubject,
//   postContactUs,
// } from "@/redux/landingSettingSlice";
// import { showLoader, hideLoader } from "@/redux/loaderSlice";
// import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";

// const selectStyles = {
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#ddd",
//     borderRadius: "30px",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#a4d264" },
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isFocused ? "#a4d264" : "white",
//     color: "black",
//   }),
// };

// // 🔹 Pre-render content with static props
// export async function getStaticProps({ locale }) {
//   try {
//     const [introRes, landingRes] = await Promise.all([
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
//         introductionData: introRes.data.data,
//         landingSettingsData: landingRes.data.data,
//         locale: locale === "ar" ? "ar_SA" : "en_SA",
//         isLoading: false,
//       },
//       revalidate: 60, // ISR: Refresh data every 1 min
//     };
//   } catch (error) {
//     console.error("Error fetching contact page data:", error);
//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ["common"])),
//         introductionData: [],
//         landingSettingsData: [],
//         locale: locale === "ar" ? "ar_SA" : "en_SA",
//         isLoading: true,
//       },
//     };
//   }
// }

// // 🔹 Lazy-loaded Google Map component
// const ContactMap = memo(function ContactMap({ landingSettingsData  }) {
//   const [mapHtml, setMapHtml] = useState("");
//   const [isInView, setIsInView] = useState(false);
//   const { t, i18n } = useTranslation();

//   const mapRef = useCallback((node) => {
//     if (node) {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsInView(true);
//           }
//         },
//         { threshold: 0.1 }
//       );
//       observer.observe(node);
//       return () => observer.disconnect();
//     }
//   }, []);

//   useEffect(() => {
//     if (isInView) {
//       let iframeHtml = landingSettingsData?.[0]?.iframe || "";
//       iframeHtml = iframeHtml.replace(
//         /style="[^"]*"/,
//         'style="width: 100%; height: 300px;"'
//       );
//       setMapHtml(iframeHtml);
//     }
//   }, [isInView, landingSettingsData]);

//   const landing = landingSettingsData[0] || {};
//   return (
//     <div ref={mapRef} className="card p-2 mt-4 rounded-3 w-100">
//       {isInView && (
//         <div
//           style={{ minHeight: "300px", width: "100%" }}
//           dangerouslySetInnerHTML={{ __html: mapHtml }}
//         />
//       )}
//       {landing.google_map_url && (
//         <a
//           href={landing.google_map_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="read-more mt-2 text-center"
//         >
//           {i18n.language === "ar" ? "عرض على خرائط جوجل" : "View on Google Maps"}
//         </a>
//       )}
//     </div>
//   );
// });

// export default function ContactUs({
//   introductionData,
//   landingSettingsData,
//   isLoading,
//   locale,
// }) {
//   const dispatch = useDispatch();
//   const { t, i18n } = useTranslation();
//   // Use locale for SSR/SSG rendering
//   const lang = locale && (locale.startsWith("ar") ? "ar" : "en");
//   const { contactSubjectData } = useSelector((st) => st.landingSettings);

//   // 🔹 Form State
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     subject_id: "",
//     message: "",
//   });

//   const [captchaToken, setCaptchaToken] = useState(null); // ✅ reCAPTCHA state

//   // 🔹 Load subjects on mount
//   useEffect(() => {
//     dispatch(showLoader());
//     dispatch(fetchContactSubject()).finally(() => dispatch(hideLoader()));
//   }, [dispatch]);

//   const handleChange = (e) =>
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const subjectOptions = contactSubjectData.map((s) => ({
//     value: s.id,
//     label: lang === "ar" ? s.name_ar : s.name_en,
//   }));

//   const selectedSubject =
//     subjectOptions.find((opt) => opt.value === formData.subject_id) || null;

//   // 🔹 Form Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       toast.error(t("Please complete the reCAPTCHA before submitting."));
//       return;
//     }

//     dispatch(showLoader());
//     try {
//       await dispatch(postContactUs({ ...formData, captchaToken })).unwrap();
//       toast.success(t("Message sent successfully!"));
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         subject_id: "",
//         message: "",
//       });
//       setCaptchaToken(null);
//     } catch {
//       toast.error(t("Failed to send message. Please try again."));
//     } finally {
//       dispatch(hideLoader());
//     }
//   };

//   // 🔹 SEO Content
//   const contactIntro = introductionData?.find(
//     (i) => i.page_key === "contact-us"
//   );
//   const landing = landingSettingsData[0] || {};
//   const pageTitle =
//     lang === "ar" ? "هاتساين | اتصل بنا" : "HaatSign | Contact Us";
//   const metaDesc =
//     lang === "ar"
//       ? contactIntro?.sub_title_ar
//       : contactIntro?.sub_title_en ||
//         t("Find answers to your questions and get support.");
//   const logoUrl =
//     "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

//   const [currentUrl, setCurrentUrl] = useState(
//     "https://www.haatsign.sa/contact-us"
//   );
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setCurrentUrl(`${window.location.origin}/contact-us`);
//     }
//   }, []);

//   return (
//     <MainLayout>
//       <Head>
//         <title>{pageTitle}</title>
//         <meta name="description" content={metaDesc} />
//         <meta name="keywords" content={landing.default_seo_key_words || ""} />
//         <meta name="author" content="HaatSign" />
//         <meta name="robots" content="index, follow" />
//         <link rel="canonical" href={currentUrl} />

//         {/* OG & Twitter */}
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content={currentUrl} />
//         <meta property="og:title" content={pageTitle} />
//         <meta property="og:description" content={metaDesc} />
//         <meta property="og:image" content={logoUrl} />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={pageTitle} />
//         <meta name="twitter:description" content={metaDesc} />
//         <meta name="twitter:image" content={logoUrl} />
//       </Head>

//       {/* Banner */}
//       <BannerTitle
//         title={
//           isLoading ? (
//             <Skeleton width={200} />
//           ) : contactIntro ? (
//             lang === "ar" ? (
//               contactIntro.title_ar
//             ) : (
//               contactIntro.title_en
//             )
//           ) : (
//             t("Contact Us")
//           )
//         }
//         description={
//           isLoading ? (
//             <Skeleton width={300} />
//           ) : contactIntro ? (
//             lang === "ar" ? (
//               contactIntro.sub_title_ar
//             ) : (
//               contactIntro.sub_title_en
//             )
//           ) : (
//             metaDesc
//           )
//         }
//       />

//       {/* Content */}
//       <motion.div
//         className="container mt-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {isLoading ? (
//           <Skeleton count={5} />
//         ) : (
//           <div className="row">
//             {/* Left Column - Info */}
//             <div className="col-md-6">
//               <h5>{lang === "ar" ? "العنوان " : "Address"}</h5>
//               <p>{lang === "ar" ? landing.address_ar : landing.address_en}</p>

//               <h5 className="mt-4">{lang === "ar" ? "أرقام الهواتف" : "Phones"}</h5>
//               {[landing.phone_no1, landing.phone_no2].map(
//                 (phone, i) =>
//                   phone && (
//                     <p key={i} style={{ direction: "ltr" }}>
//                       {phone}
//                     </p>
//                   )
//               )}

//               <h5>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</h5>
//               {[landing.email, landing.email_support, landing.email_cells].map(
//                 (email, i) =>
//                   email && (
//                     <p key={i}>
//                       <a className="read-more" href={`mailto:${email}`}>
//                         {email}
//                       </a>
//                     </p>
//                   )
//               )}
//             </div>

//             {/* Right Column - Form */}
//             <div className="col-md-6">
//               <div className="card p-4 rounded-3 shadow-sm">
//                 <h5>{lang === "ar" ? "تواصل معنا" : "Contact Us"}</h5>
//                 <form onSubmit={handleSubmit}>
//                   <div className="row mb-3">
//                     <div className="col">
//                       <input
//                         type="text"
//                         name="name"
//                         className="form-control"
//                         placeholder={lang === "ar" ? "اسمك *" : "Your Name *"}
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="col">
//                       <input
//                         type="text"
//                         name="mobile"
//                         className="form-control"
//                         placeholder={lang === "ar" ? "رقم الهاتف *" : "Mobile *"}
//                         value={formData.mobile}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <input
//                       type="email"
//                       name="email"
//                       className="form-control"
//                       placeholder={lang === "ar" ? "البريد الإلكتروني *" : "Email *"}
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <Select
//                       name="subject_id"
//                       value={selectedSubject}
//                       onChange={(opt) =>
//                         handleChange({
//                           target: {
//                             name: "subject_id",
//                             value: opt?.value || "",
//                           },
//                         })
//                       }
//                       options={subjectOptions}
//                       placeholder={t("---Select---")}
//                       styles={selectStyles}
//                       isClearable
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <textarea
//                       name="message"
//                       className="form-control"
//                       placeholder={lang === "ar" ? "رسالتك *" : "Message *"}
//                       rows="4"
//                       value={formData.message}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   {/* ✅ reCAPTCHA before submit button */}
//                   <div className="mb-3 d-flex justify-content-center">
//                     <ReCAPTCHA
//                       sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
//                       onChange={(token) => setCaptchaToken(token)}
//                     />
//                   </div>

//                   <button type="submit" className="btn haat-btn w-100">
//                      {lang === "ar" ? "إرسال" : "Submit"}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Map */}
//         <ContactMap landingSettingsData={landingSettingsData} />
//       </motion.div>
//     </MainLayout>
//   );
// }





// src/pages/contact-us.js
import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "@/components/Layout";
import BannerTitle from "@/components/BannerTitle";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import {
  fetchContactSubject,
  postContactUs,
} from "@/redux/landingSettingSlice";
import { showLoader, hideLoader } from "@/redux/loaderSlice";
import { API_BASE_URL, TEST_URL, getDefaultHeaders } from "@/config/apiConfig";
import RecaptchaDynamic from "@/components/RecaptchaDynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

// 🔹 Client-only wrapper to prevent hydration mismatch
const ClientOnly = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : fallback;
};

// 🔹 Lazy-loaded Google Map component
const ContactMap = memo(function ContactMap({ landingSettingsData }) {
  const [mapHtml, setMapHtml] = useState("");
  const [isInView, setIsInView] = useState(false);
  const { i18n } = useTranslation();

  const mapRef = useCallback((node) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setIsInView(true);
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (isInView) {
      let iframeHtml = landingSettingsData?.[0]?.iframe || "";
      iframeHtml = iframeHtml.replace(
        /style="[^"]*"/,
        'style="width: 100%; height: 300px;"'
      );
      setMapHtml(iframeHtml);
    }
  }, [isInView, landingSettingsData]);

  const landing = landingSettingsData[0] || {};
  return (
    <ClientOnly
      fallback={
        <div className="map-placeholder" style={{ height: "300px", background: "#eee" }} />
      }
    >
      <div ref={mapRef} className="card p-2 mt-4 rounded-3 w-100">
        {isInView && (
          <div
            style={{ minHeight: "300px", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: mapHtml }}
          />
        )}
        {landing.google_map_url && (
          <Link
            href={landing.google_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more mt-2 text-center"
          >
            {i18n.language === "ar" ? "عرض على خرائط جوجل" : "View on Google Maps"}
          </Link>
        )}
      </div>
    </ClientOnly>
  );
});

export async function getStaticProps({ locale }) {
  try {
    const [introRes, landingRes] = await Promise.all([
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
        introductionData: introRes.data.data,
        landingSettingsData: landingRes.data.data,
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: false,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
        introductionData: [],
        landingSettingsData: [],
        locale: locale === "ar" ? "ar_SA" : "en_SA",
        isLoading: true,
      },
      revalidate: 60,
    };
  }
}

export default function ContactUs({
  introductionData,
  landingSettingsData,
  isLoading,
  locale,
}) {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const lang = locale && (locale.startsWith("ar") ? "ar" : "en");
  const { contactSubjectData } = useSelector((st) => st.landingSettings);
  const recaptchaRef = useRef(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject_id: "",
    message: "",
    captchaToken: "", 
    recaptcha_version: ""
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  // SSR-safe canonical and OpenGraph URL for SEO only
  const domain = "https://landing.haatsign.sa";
  const currentUrl = `${domain}/contact-us`;

  useEffect(() => {
    dispatch(showLoader());
    dispatch(fetchContactSubject()).finally(() => dispatch(hideLoader()));
  }, [dispatch]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const subjectOptions = contactSubjectData.map((s) => ({
    value: s.id,
    label: lang === "ar" ? s.name_ar : s.name_en,
  }));

  const selectedSubject =
    subjectOptions.find((opt) => opt.value === formData.subject_id) || null;

  // Minimal fetch: get reCAPTCHA settings from TEST_URL/settings
  const [recaptchaSettings, setRecaptchaSettings] = useState(null);
  // helper: treat several shapes as enabled: true, 1, "1", "true"
  const recaptchaEnabled = React.useMemo(() => {
    if (!recaptchaSettings) return false;
    const v = recaptchaSettings.is_recaptcha;
    return (
      v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true"
    );
  }, [recaptchaSettings]);
  useEffect(() => {
    let cancelled = false;
    const fetchRecaptchaSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/setting`, {
          headers: getDefaultHeaders(),
        });
        if (!cancelled) {
          const data = res?.data?.data?.data;
          setRecaptchaSettings(data);
          // Temporary: log for verification; we'll refactor wiring later
          console.log("reCAPTCHA settings fetched:", data);
        }
      } catch (err) {
        console.error("Failed to fetch reCAPTCHA settings", err);
      }
    };
    fetchRecaptchaSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(showLoader());
    try {
      // If recaptcha is enabled in settings, validate/get token; otherwise skip recaptcha entirely
      let token = captchaToken; // for v2 flows this may already be set
      const version = recaptchaSettings?.recaptcha_version;

      if (recaptchaEnabled) {
        // Make sure site key exists for configured version
        if (!recaptchaSettings.recaptcha_v2_site_key && !recaptchaSettings.recaptcha_v3_site_key) {
          toast.error(t("reCAPTCHA is not configured. Please try later."));
          dispatch(hideLoader());
          return;
        }

        if (version === "v3") {
          if (!recaptchaRef.current || !recaptchaRef.current.getToken) {
            throw new Error("reCAPTCHA v3 not ready");
          }
          token = await recaptchaRef.current.getToken();
        } else {
          // v2: if token not already set from onChange, try to obtain via ref (invisible)
          if (!token && recaptchaRef.current && recaptchaRef.current.getToken) {
            token = await recaptchaRef.current.getToken();
          }
        }

        if (!token) {
          toast.error(t("Please complete the reCAPTCHA before submitting."));
          dispatch(hideLoader());
          return;
        }
      }

      // If recaptcha disabled, send without captchaToken/recaptcha_version
      const payloadToSend = recaptchaEnabled
        ? { ...formData, captchaToken: token, recaptcha_version: version }
        : { ...formData };

      const res = await dispatch(postContactUs(payloadToSend));

      if (res.meta.requestStatus === "fulfilled") {
        const payload = res.payload;
        const msg =
          (payload?.message && (i18n.language === "ar" ? payload.message.ar : payload.message.en)) ||
          payload?.message ||
          t("Message sent successfully!");
        toast.success(msg);
        setFormData({ name: "", email: "", mobile: "", subject_id: "", message: "" });
        setCaptchaToken(null);
        if (recaptchaRef.current && recaptchaRef.current.reset) recaptchaRef.current.reset();
      } else {
        const errPayload = res.payload;
        let errMsg =
          (errPayload?.message && (typeof errPayload.message === "string" ? errPayload.message : (i18n.language === "ar" ? errPayload.message.ar : errPayload.message.en))) ||
          (Array.isArray(errPayload?.errors) ? errPayload.errors.join(", ") : null) ||
          t("Failed to send message. Please try again.");
        if (typeof errPayload?.score === "number") errMsg += ` (score: ${errPayload.score})`;
        toast.error(errMsg);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to send message. Please try again."));
    } finally {
      dispatch(hideLoader());
    }
  };


  const contactIntro = introductionData?.find((i) => i.page_key === "contact-us");
  const landing = landingSettingsData[0] || {};
  const pageTitle = lang === "ar" ? "هاتساين | اتصل بنا" : "HaatSign | Contact Us";
  const metaDesc =
    lang === "ar"
      ? contactIntro?.sub_title_ar
      : contactIntro?.sub_title_en || t("Find answers to your questions and get support.");
  const logoUrl =
    "https://api.haatsign.sa/storage/landing/CFe2VKFoW2uXRj7F40Zq6GYDJHJHmvM8rZdq98xl.png";

  return (
    <MainLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={landing.default_seo_key_words || ""} />
        <meta name="author" content="HaatSign" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        {/* OG & Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={logoUrl} />
      </Head>

      {/* Banner */}
      <BannerTitle
        title={
          isLoading ? (
            <Skeleton width={200} />
          ) : contactIntro ? (
            lang === "ar" ? contactIntro.title_ar : contactIntro.title_en
          ) : (
            t("Contact Us")
          )
        }
        description={
          isLoading ? (
            <Skeleton width={300} />
          ) : contactIntro ? (
            lang === "ar" ? contactIntro.sub_title_ar : contactIntro.sub_title_en
          ) : (
            metaDesc
          )
        }
      />

      <motion.div
        className="container mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <Skeleton count={5} />
        ) : (
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <h5>{lang === "ar" ? "العنوان" : "Address"}</h5>
              <p>{lang === "ar" ? landing.address_ar : landing.address_en}</p>

              <h5 className="mt-4">{lang === "ar" ? "أرقام الهواتف" : "Phones"}</h5>
              {[landing.phone_no1, landing.phone_no2].map(
                (phone, i) => phone && <p key={i} style={{ direction: "ltr" }}>{phone}</p>
              )}

              <h5>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</h5>
              {[landing.email, landing.email_support, landing.email_cells].map(
                (email, i) =>
                  email && (
                    <p key={i}>
                      <Link className="read-more" href={`mailto:${email}`}>{email}</Link>
                    </p>
                  )
              )}
            </div>

            {/* Right Column - Form */}
            <div className="col-md-6">
              <div className="card p-4 rounded-3 shadow-sm">
                <h5>{lang === "ar" ? "تواصل معنا" : "Contact Us"}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={lang === "ar" ? "اسمك *" : "Your Name *"}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        placeholder={lang === "ar" ? "رقم الهاتف *" : "Mobile *"}
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder={lang === "ar" ? "البريد الإلكتروني *" : "Email *"}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <Select
                      name="subject_id"
                      value={selectedSubject}
                      onChange={(opt) =>
                        handleChange({ target: { name: "subject_id", value: opt?.value || "" } })
                      }
                      options={subjectOptions}
                      placeholder={t("---Select---")}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderColor: "#ddd",
                          borderRadius: "30px",
                          boxShadow: "none",

                          "&:hover": { borderColor: "var(--primary-color)" },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused ? "var(--primary-color)" : "white",
                          color: state.isFocused ? "var(--heading-text-color)" : "black",
                        }),
                      }}
                      isClearable
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder={lang === "ar" ? "رسالتك *" : "Message *"}
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {recaptchaEnabled && (
                    <div className="mb-3 d-flex justify-content-center">
                      <RecaptchaDynamic
                        ref={recaptchaRef}
                        settings={recaptchaSettings}
                        onV2Change={(token) => setCaptchaToken(token)}
                      />
                    </div>
                  )}


                  <button type="submit" className="btn haat-btn w-100">
                    {lang === "ar" ? "إرسال" : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <ContactMap landingSettingsData={landingSettingsData} />
      </motion.div>
    </MainLayout>
  );
}
