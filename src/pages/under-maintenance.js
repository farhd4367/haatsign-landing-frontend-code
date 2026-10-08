// src/pages/under-maintenance.js
import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from 'next/image';
import maintenanceImage from "../../public/assets/maintenance.png";
import maintenanceArImage from "../../public/assets/maintenance_ar.png";
import haatSign from "../../public/assets/haatsign.png";
import axios from "axios";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import Head from "next/head";


const MaintenancePage = ({ landingSettingsData }) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.body.style.padding = "0";
    return () => {
      document.body.style.padding = "";
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "inherit",
      color: "#333",
      textAlign: "center",
    },
    image: {
      width: "500px",
    },
    title: {
      fontSize: "3rem",
      color: "var(--primary-color)",
    },
    message: {
      fontSize: "1.5rem",
      maxWidth: "1000px",
    },
  };

  const landingSettings = landingSettingsData && landingSettingsData.length > 0 ? landingSettingsData[0] : {};
  const LogoImage = landingSettings.logo_color;
  return (
    <>
      <Head>
        <title>{i18n.language === "ar" ? "هاتساين | تحت الصيانة" : "HaatSign | Under Maintenance"}</title>
      </Head>
      <div style={styles.container}>
        <div style={{ width: "200px", marginBottom: "20px", position: 'relative', height: 'auto' }}>
          <Image src={LogoImage} alt="HaatSign Logo" layout="responsive" width={250} height={200} />
        </div>
        <div style={{ ...styles.image, position: 'relative', height: 'auto' }}>
          <Image
            src={i18n.language === 'ar' ? landingSettings.maintenance_image_ar : landingSettings.maintenance_image_en}
            alt="Under Maintenance"
            width={150}
            height={150}
            layout="responsive"
          />
        </div>
        <p style={styles.message}>
          {i18n.language === "ar"
            ? "نحن نعمل على تحسين موقعنا. يرجى العودة لاحقًا."
            : "We are currently working on improvements. Please check back later."}
        </p>

      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const landingSettingsResponse = await axios.get(`${API_BASE_URL}/general-setting`, {
      headers: getDefaultHeaders(),
    });

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        landingSettingsData: landingSettingsResponse.data.data || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching landing settings:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        landingSettingsData: [],
      },
      revalidate: 60,
    };
  }
}

export default MaintenancePage;
