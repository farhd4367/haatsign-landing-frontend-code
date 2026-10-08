'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const Customers = ({ customers = [] }) => {
  const router = useRouter();
  const { t, ready } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state if translations aren't ready or component isn't mounted
  if (!ready || !isMounted) {
    return (
      <div className="container my-4">
        <div className="row align-items-center bg-white shadow-sm rounded p-4">
          <div className="col-12 text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row align-items-center bg-white shadow-sm rounded p-4">
        <div className="col-md-3">
          <h3 className="my-3 fw-semibold" style={{ color: "var(--primary-color)" }}>
            {t("Customers")}
          </h3>
          <p className="text-muted mb-0">{t("Because trust starts with experience")}</p>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div className="d-flex w-100 flex-wrap justify-content-center gap-3">
            {customers.slice(0, 3).map((customer, index) => (
              <div key={index} className="partner-logo-container">
                <Image
                  src={customer.image_url}
                  alt={t("Customer logo")}
                  width={100}
                  height={60}
                  className="img-fluid rounded partner-logo"
                  style={{ objectFit: 'contain' }}
                  priority={index < 2} // Only prioritize first two images
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-3 text-center mt-3 mt-md-0">
          <button
            className="btn read-more-btn"
            onClick={() => router.push('/customers')}
            aria-label={t("Read more about our customers")}
          >
            {t("Read More")} <span className="ms-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;