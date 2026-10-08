// src/components/RecaptchaDynamic.jsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

// Expose .getToken() via ref for parent to call (useful for v3 & invisible v2)
const V3TokenProvider = ({ siteKey, innerRef }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  useImperativeHandle(innerRef, () => ({
    // returns token string when called
    getToken: async (action = "contact_form") => {
      if (!executeRecaptcha) {
        throw new Error("executeRecaptcha not ready");
      }
      const token = await executeRecaptcha(action);
      return token;
    },
  }));

  return null;
};

const RecaptchaDynamic = forwardRef(function RecaptchaDynamic({ settings, onV2Change, v2Size = "compact" }, ref) {
  // ref will expose getToken when applicable
  const v2Ref = useRef(null);
  const v3Ref = useRef(null);

  // expose common API: getToken()
  useImperativeHandle(ref, () => ({
    // returns token (string) or null
    getToken: async () => {
      if (!settings) return null;
      if (settings.recaptcha_version === "v3") {
        // v3 path: use v3Ref.getToken()
        if (!v3Ref.current || !v3Ref.current.getToken) {
          throw new Error("v3 recaptcha not ready");
        }
        return await v3Ref.current.getToken();
      } else {
        // v2 path: if widget provided a token via onV2Change, parent should already have it.
        // But if using invisible v2 and want programmatic execute, try executeAsync (if available)
        if (v2Ref.current && v2Ref.current.executeAsync) {
          // execute invisible v2
          const token = await v2Ref.current.executeAsync();
          return token;
        }
        return null;
      }
    },
    // helper: reset v2 widget
    reset: () => {
      if (v2Ref.current && v2Ref.current.reset) v2Ref.current.reset();
    },
  }));

  if (!settings) return null;

  const { recaptcha_version } = settings;

  if (recaptcha_version === "v2") {
    // Visible checkbox or invisible depending on admin choice. We assume typical checkbox.
    return (
      <div className="d-flex justify-content-center">
        <ReCAPTCHA
          ref={v2Ref}
          sitekey={settings.recaptcha_v2_site_key}
          onChange={(token) => {
            if (typeof onV2Change === "function") onV2Change(token);
          }}
          size={settings.recaptcha_v2_invisible ? "invisible" : undefined}
        />
      </div>
    );
  }

  // v3
  return (
    <GoogleReCaptchaProvider reCaptchaKey={settings.recaptcha_v3_site_key}>
      <V3TokenProvider siteKey={settings.recaptcha_v3_site_key} innerRef={v3Ref} />
    </GoogleReCaptchaProvider>
  );
});

export default RecaptchaDynamic;
