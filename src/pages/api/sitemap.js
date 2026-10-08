// pages/api/sitemap.js
import { API_BASE_URL, getDefaultHeaders } from '@/config/apiConfig';

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_BASE_URL}/get-site-map`, {
      headers: getDefaultHeaders()
    });
    const json = await response.json();

    console.log("Received sitemap URL:", json);

    if (json?.success && json?.data) {
      const xmlResponse = await fetch(json.data);
      const xml = await xmlResponse.text();

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } else {
      res.status(500).send('Failed to fetch sitemap URL');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}
