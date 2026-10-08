// src/pages/api/get-coming-soon-date.js

import CryptoJS from 'crypto-js';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Encrypt API key using CryptoJS (AES-CBC + random IV)
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

    const response = await fetch('https://api.haatsign.sa/api/landing/general-setting', {
      method: 'GET',
      headers: {
        'API-KEY': encryptedApiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data' });
    }

    const json = await response.json();
    const comingSoonDatetime = json?.data?.[0]?.coming_soon_datetime;

    res.status(200).json({ comingSoonDatetime });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
