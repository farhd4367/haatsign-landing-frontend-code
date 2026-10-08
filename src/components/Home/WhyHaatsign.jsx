import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WhyHaatSign = ({ whyhaatsign }) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trimContent = (content, maxLength = 1500) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>?/gm, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  // Constants for consistent values
  const BRAND_COLOR = "var(--primary-color)";
  const HEADING_CLASS = "text-center my-3 fw-semibold";

  if (!mounted) {
    return (
      <div className="container my-4">
        <div className="row align-items-center bg-white shadow-sm rounded p-4">
          <div className="col-md-12">
            <h3 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
              <Skeleton width={200} />
            </h3>
          </div>
          <div className="col-md-12 d-flex justify-content-center">
            <div className="w-100">
              <Skeleton count={5} />
            </div>
          </div>
          <div className="col-md-12 text-center mt-3">
            <Skeleton width={120} height={40} />
          </div>
        </div>
      </div>
    );
  }

  if (whyhaatsign?.status !== "active") return null;

  return (
    <div className="container my-4">
      <div className="row align-items-center bg-white shadow-sm rounded p-4">
        <div className="col-md-12">
          <h3 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
            {t("Why HaatSign?")}
          </h3>
        </div>

        <div className="col-md-12 d-flex justify-content-center">
          <div
            dangerouslySetInnerHTML={{
              __html: i18n.language === "ar"
                ? trimContent(whyhaatsign?.page_content_ar)
                : trimContent(whyhaatsign?.page_content_en),
            }}
            className="why-haatsign-content"
          />
        </div>

        <div className="col-md-12 text-center mt-3">
          <button
            className="btn read-more-btn"
            onClick={() => router.push("/why-haatsign")}
            aria-label={t("Read more about Why HaatSign")}
          >
            {t("Read More")} <span className="ms-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyHaatSign;