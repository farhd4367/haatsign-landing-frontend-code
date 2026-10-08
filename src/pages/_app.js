import { useEffect } from "react";
import "@/config/registerAxiosFallback";
import "@/styles/globals.css";
import "@/styles/footer.css";
import "@/styles/headerNavbar.css";
import "@/styles/Home.css";
import "@/styles/BannerTitle.css";
import "@/styles/Loader.css";
import "@/styles/Partners.css";
import "@/styles/Customers.css";
import "@/styles/Blogs.css";
import "@/styles/NotFound.css";
import "@/styles/CompanyFiles.css";
import "@/styles/Tutorials.css";
import "@/styles/Careers.css";
import "@/styles/Memberships.css";
import "@/styles/comingSoon.css";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { appWithTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/utils/Loader";

import Head from "next/head";
import { API_BASE_URL, getDefaultHeaders } from "@/config/apiConfig";
import { darkenColor } from "@/utils/colorUtils";
import { hexToFilter } from "css-filter-converter";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    async function fetchTheme() {
      try {
        const res = await fetch(`${API_BASE_URL}/general-setting`, {
          method: "GET",
          headers: getDefaultHeaders(),
        });
        const json = await res.json();

        if (json.success && json.data.length > 0) {
          const theme = json.data[0];

          // Update global CSS variables dynamically
          document.documentElement.style.setProperty(
            "--primary-color",
            theme.landing_primary_color 
          );
          document.documentElement.style.setProperty(
            "--heading-text-color",
            theme.heading_text_color 
          );
          document.documentElement.style.setProperty(
            "--link-text-color",
            theme.link_text_color 
          );
      

          const baseColor = theme.link_text_color ;
          document.documentElement.style.setProperty(
            "--link-hover-color",
            darkenColor(baseColor, 40) // darken by 25%
          );
          const primaryColor = theme.landing_primary_color ;
          document.documentElement.style.setProperty(
            "--button-hover-bg-color",
            darkenColor(primaryColor, 25) // darken by 10%
          );

        }
      } catch (err) {
        console.warn("Failed to fetch theme:", err instanceof Error ? err.message : err);
      }
    }

    fetchTheme();
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link rel="icon" href="/haatsign.ico" />
      </Head>

      <Provider store={store}>
        <Loader />
        <ToastContainer
          toastStyle={{ fontFamily: "Changa" }}
          position="top-right"
        />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default appWithTranslation(MyApp);
