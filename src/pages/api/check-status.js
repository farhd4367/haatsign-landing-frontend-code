import CryptoJS from "crypto-js";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

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

export default async function handler(req, res) {
  try {
    const encryptedApiKey = encryptKey(API_KEY);

    const apiResponse = await fetch("https://api.haatsign.sa/api/landing/general-setting", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "API-KEY": encryptedApiKey,
      },
    });

    const result = await apiResponse.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("API route error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
