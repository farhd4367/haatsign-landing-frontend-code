import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Services = ({ services = [] }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trimContent = (content, maxLength = 200) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>?/gm, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  // Constants for consistent values
  const CONTAINER_CLASS = "container my-4";
  const HEADING_CLASS = "text-center my-5 fw-semibold";
  const BRAND_COLOR = "var(--primary-color)";
  const ICON_STYLE = { fontSize: '2rem', color: BRAND_COLOR };

  if (!mounted) {
    return (
      <div className={CONTAINER_CLASS}>
        <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
          <Skeleton width={200} />
        </h2>
        <div className="row">
          {[...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="col-md-3 mb-3">
              <div className="card h-100 text-center border-0 rounded">
                <div className="card-body">
                  <div className="mb-3">
                    <Skeleton circle width={32} height={32} />
                  </div>
                  <h5><Skeleton count={1} /></h5>
                  <div className="mb-3">
                    <Skeleton count={3} />
                  </div>
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
    <div className={CONTAINER_CLASS}>
      <h2 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
        {i18n.language === "ar" ? "خدماتنا" : "Our Services"}
      </h2>
      <div className="row">
        {services.map((service, index) => (
          <div key={`service-${index}`} className="col-md-3 mb-3">
            <div className="card h-100 text-center border-0 rounded">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-box-seam" style={ICON_STYLE}></i>
                </div>
                <h5>
                  {i18n.language === "ar" ? service.page_title_ar : service.page_title_en}
                </h5>
                <div
                  dangerouslySetInnerHTML={{
                    __html: i18n.language === "ar"
                      ? trimContent(service.page_content_ar)
                      : trimContent(service.page_content_en)
                  }}
                />
                <button
                  className="btn read-more-btn mt-2"
                  onClick={() => router.push(service.page_url)}
                  aria-label={
                    i18n.language === "ar" 
                      ? `اقرأ المزيد عن ${service.page_title_ar}`
                      : `Read more about ${service.page_title_en}`
                  }
                >
                  {i18n.language === "ar" ? "اقرأ المزيد" : "Read More"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;