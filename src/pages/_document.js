import Document, { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-toastify";

class MyDocument extends Document {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale || "ar";
    const isRTL = currentLocale === "ar";

    return (
      <Html lang={currentLocale} dir={isRTL ? "rtl" : "ltr"}>
        <Head>
          {/* Add any additional head elements here */}
        </Head>
        <body>
          <ToastContainer
            toastStyle={{ fontFamily: "Changa" }}
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss/>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
