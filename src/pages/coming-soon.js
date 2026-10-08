// src/pages/coming-soon.js

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "next-i18next";
import haatSign from "../../public/assets/haatsign.png";
import Image from 'next/image';
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const ComingSoonPage = ({ comingSoonDatetime, logoUrl }) => {
  const { t, i18n } = useTranslation('common');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    let interval;
    if (comingSoonDatetime) {
      const countdownDate = new Date(comingSoonDatetime.replace(' ', 'T')).getTime();
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [comingSoonDatetime]);

  useEffect(() => {
    document.body.style.padding = "0";
    document.body.style.margin = "0";
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/subscribe-news-latter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getDefaultHeaders(),
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success(
          i18n.language === "ar"
            ? "تم الاشتراك بنجاح في النشرة البريدية!"
            : "Successfully subscribed to the newsletter!"
        );
        setEmail("");
      } else {
        let errorMsg = i18n.language === "ar"
          ? "حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى."
          : "An error occurred during subscription. Please try again.";
        try {
          const data = await res.json();
          if (data && data.message && data.message.email && Array.isArray(data.message.email)) {
            let apiMsg = data.message.email[0];
            if (i18n.language === "ar" && apiMsg === "The email has already been taken.") {
              errorMsg = "البريد الإلكتروني مستخدم بالفعل.";
            } else {
              errorMsg = apiMsg;
            }
          }
        } catch { }
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error(
        i18n.language === "ar"
          ? "حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى."
          : "An error occurred during subscription. Please try again."
      );
    }
  };

  return (
    <>

      <Head>
        <title>{i18n.language === "ar" ? "هاتساين | قريباً" : "HaatSign | Coming Soon"}</title>
      </Head>
      <div style={styles.container}>
        <div style={{ width: "250px", position: 'relative', height: 'auto' }}>
          <Image src={logoUrl} alt="Logo" layout="responsive" width={250} height={250} />
        </div>
        <h1 style={styles.title}>
          {i18n.language === "ar" ? "قريباً" : "Coming Soon"}
        </h1>
        <div style={styles.countdown}>
          <div style={styles.timeBox}>
            <span style={styles.time}>{timeLeft.days}</span>
            <span style={styles.label}>
              {i18n.language === "ar" ? "أيام" : "Days"}
            </span>
          </div>
          <div style={styles.timeBox}>
            <span style={styles.time}>{timeLeft.hours}</span>
            <span style={styles.label}>
              {i18n.language === "ar" ? "ساعات" : "Hours"}
            </span>
          </div>
          <div style={styles.timeBox}>
            <span style={styles.time}>{timeLeft.minutes}</span>
            <span style={styles.label}>
              {i18n.language === "ar" ? "دقائق" : "Minutes"}
            </span>
          </div>
          <div style={styles.timeBox}>
            <span style={styles.time}>{timeLeft.seconds}</span>
            <span style={styles.label}>
              {i18n.language === "ar" ? "ثواني" : "Seconds"}
            </span>
          </div>
        </div>
        {/* Newsletter Subscription Section */}
        <div className="newsletter-container">
          <p>{t("Sign up for our newsletter to receive the latest news")}</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-wrapper">
              <input
                type="email"
                name="EMAIL"
                placeholder={t("Your email address")}
                className="newsletter-input"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="newsletter-button">
                {t("Subscribe")}
              </button>
            </div>
          </form>
          <ToastContainer position={i18n.language === "ar" ? "top-left" : "top-right"} autoClose={3000} toastStyle={{ fontFamily: "Changa" }} />
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "rgb(238,237,237)",
    color: "#333",
  },
  logo: {
    width: "250px", // Adjust the size as needed
  },
  title: {
    fontSize: "4rem",
    marginBottom: "2rem",
    color: "var(--primary-color)",
    letterSpacing: "0.5rem",
  },
  countdown: {
    display: "flex",
    justifyContent: "center",
    gap: "2.5rem",
  },
  timeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  time: {
    fontSize: "3rem",
    fontWeight: "bold",
  },
  label: {
    fontSize: "1rem",
  },
};


export default ComingSoonPage;

export async function getStaticProps({ locale }) {
  let comingSoonDatetime = null;
  let logoUrl = null;
  try {
    const res = await fetch(`${API_BASE_URL}/general-setting`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });
    const json = await res.json();
    const data = json?.data?.[0];
    comingSoonDatetime = data?.coming_soon_datetime || null;
    logoUrl = data?.logo_color || null;
  } catch (error) {
    comingSoonDatetime = null;
    logoUrl = null;
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      comingSoonDatetime,
      logoUrl,
    },
  };
}