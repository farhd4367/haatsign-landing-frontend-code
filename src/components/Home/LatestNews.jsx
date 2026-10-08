// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useTranslation } from "react-i18next";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const LatestNews = ({ latestnews = [] }) => {
//   const router = useRouter();
//   const { i18n, t } = useTranslation();
//   const [isMounted, setIsMounted] = useState(false);

//   // Constants for consistent values
//   const BRAND_COLOR = "#a4d264";
//   const HEADING_CLASS = "text-center my-5 fw-semibold";
//   const ICON_STYLE = { fontSize: '2rem', color: BRAND_COLOR };

//   // Set mounted state after component mounts
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Format date consistently between server and client
//   const formatDate = (dateString) => {
//     if (!isMounted) return ''; // Return empty string during SSR
    
//     const date = new Date(dateString);
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    
//     // Use UTC to prevent timezone differences
//     return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
//       .toLocaleDateString(locale, options);
//   };

//   if (!isMounted) {
//     return (
//       <div className="container mt-5">
//         <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
//           <Skeleton width={200} />
//         </h2>
//         <div className="row">
//           {[...Array(4)].map((_, index) => (
//             <div key={`skeleton-${index}`} className="col-md-3 mb-3">
//               <div className="card h-100 text-center border-0 rounded">
//                 <div className="card-body">
//                   <div className="mb-3">
//                     <Skeleton circle width={32} height={32} />
//                   </div>
//                   <h5><Skeleton count={2} /></h5>
//                   <p className="text-grey"><Skeleton width={100} /></p>
//                   <div className="mt-2">
//                     <Skeleton width={100} height={38} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
//         {t("Latest News")}
//       </h2>
//       <div className="row">
//         {latestnews.map((news, index) => (
//           <div key={`news-${index}`} className="col-md-3 mb-3">
//             <div className="card h-100 text-center border-0 rounded">
//               <div className="card-body">
//                 <div className="mb-3">
//                   <i className="bi bi-aspect-ratio" style={ICON_STYLE}></i>
//                 </div>
//                 <h5>{i18n.language === "ar" ? news.title_ar : news.title_en}</h5>
//                 <p className="text-grey">{formatDate(news.date)}</p>
//                 <button
//                   className="btn read-more-btn mt-2"
//                   onClick={() => router.push(`news/${news.slug_url}`)}
//                   aria-label={`Read more about ${i18n.language === "ar" ? news.title_ar : news.title_en}`}
//                 >
//                   {t("Read More")}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LatestNews;


import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

const LatestNews = ({ latestnews = [] }) => {
  const { i18n, t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const BRAND_COLOR = "var(--primary-color)";
  const HEADING_CLASS = "text-center my-5 fw-semibold";
  const ICON_STYLE = { fontSize: '2rem', color: BRAND_COLOR };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (dateString) => {
    if (!isMounted) return ""; // prevent SSR mismatch
    const date = new Date(dateString);
    const locale = i18n.language === "ar" ? "ar-SA" : "en-US";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  };

  if (!isMounted) {
    return (
      <div className="container mt-5">
        <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
          <Skeleton width={200} />
        </h2>
        <div className="row">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="col-md-3 mb-3">
              <div className="card h-100 text-center border-0 rounded">
                <div className="card-body">
                  <div className="mb-3">
                    <Skeleton circle width={32} height={32} />
                  </div>
                  <h5><Skeleton count={2} /></h5>
                  <p className="text-grey"><Skeleton width={100} /></p>
                  <div className="mt-2">
                    <Skeleton width={100} height={38} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
        {t("Latest News")}
      </h2>
      <div className="row">
        {latestnews.map((news) => (
          <div key={news.id || news.slug_url} className="col-md-3 mb-3">
            <div className="card h-100 text-center border-0 rounded">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-aspect-ratio" style={ICON_STYLE}></i>
                </div>
                <h5>{i18n.language === "ar" ? news.title_ar : news.title_en}</h5>
                <p className="text-grey">{formatDate(news.date)}</p>
                <Link
                  href={`/news/${news.slug_url}`}
                  className="btn read-more-btn mt-2 d-inline-block"
                  aria-label={`Read more about ${i18n.language === "ar" ? news.title_ar : news.title_en}`}
                >
                  {t("Read More")}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
