import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Partners = ({ partners = [] }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Constants for consistent values
  const BRAND_COLOR = "var(--primary-color)";
  const HEADING_CLASS = "my-3 fw-semibold";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container my-4">
        <div className="row align-items-center bg-white shadow-sm rounded p-4">
          <div className="col-md-3">
            <h3 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
              <Skeleton width={150} />
            </h3>
            <p className="text-muted mb-0">
              <Skeleton width={200} />
            </p>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            <div className="d-flex w-100">
              {[...Array(4)].map((_, index) => (
                <div key={`skeleton-partner-${index}`} className="mx-2">
                  <Skeleton width={100} height={60} />
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-3 text-center mt-3">
            <Skeleton width={100} height={38} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row align-items-center bg-white shadow-sm rounded p-4">
        <div className="col-md-3">
          <h3 className={HEADING_CLASS} style={{ color: BRAND_COLOR }}>
            {t("Our Partners")}
          </h3>
          <p className="text-muted mb-0">{t("When It Comes to Trust Services")}</p>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          <div className="d-flex w-100">
            {partners.slice(0, 3).map((partner, index) => (
              <img
                key={`partner-${index}`}
                src={partner.logo_url}
                alt={`Partner ${index + 1}`}
                className="img-fluid rounded partner-logo mx-2"
                loading="lazy"
                width="100"
                height="60"
                onError={(e) => {
                  e.target.src = '/default-partner.png';
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-3 text-center mt-3">
          <button
            className="btn read-more-btn"
            onClick={() => router.push("/partners")}
            aria-label={t("Read more about partners")}
          >
            {t("Read More")} <span className="ms-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Partners;