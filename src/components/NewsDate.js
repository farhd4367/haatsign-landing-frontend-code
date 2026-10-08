// src/components/NewsDate.js
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NewsDate = ({ dateString }) => {
  const { i18n } = useTranslation();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!dateString) return;

    const date = new Date(dateString);
    const locale = i18n.language === "ar" ? "ar-SA" : "en-US";

    setFormattedDate(
      new Date(date.getTime() + date.getTimezoneOffset() * 60000)
        .toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    );
  }, [dateString, i18n.language]);

  return <>{formattedDate}</>;
};

export default NewsDate;
