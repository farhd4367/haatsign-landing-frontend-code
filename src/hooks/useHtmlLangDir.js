import { useEffect } from "react";
import { useTranslation } from "next-i18next";

export function useHtmlLangDir() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
}
