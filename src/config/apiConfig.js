import CryptoJS from "crypto-js";
import { installFetchFallback } from "./apiFallback";

installFetchFallback();

// Get env variables
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.haatsign.sa/api/landing";
const TEST_URL = process.env.NEXT_PUBLIC_TEST_URL;
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.haatsign.sa/api";
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

// Encrypt API key with IV
const encryptKey = (plainText) => {
  const key = CryptoJS.SHA256(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
  return `${ivBase64}:${encrypted.toString()}`;
};

// Generate encrypted key with fresh timestamp
const getEncryptedWithTimestamp = (keyValue) => {
  const timestamp = Date.now(); // fresh timestamp for each request
  return encryptKey(`${keyValue}:${timestamp}`);
};

// Default headers -> generate fresh encrypted key for each call
const getDefaultHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "API-KEY": getEncryptedWithTimestamp(API_KEY),
});

export { API_BASE_URL, API_URL, ADMIN_API_URL, TEST_URL, getDefaultHeaders };
