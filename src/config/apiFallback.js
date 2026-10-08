const API_HOST = "api.haatsign.sa";

let preferHttp = false;
let fetchPatched = false;
let axiosPatched = false;

function toHttpUrl(url) {
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== API_HOST || parsed.protocol !== "https:") return null;
  parsed.protocol = "http:";
  return parsed.toString();
}

function applyPreferredProtocol(url) {
  if (!preferHttp) return url;
  return toHttpUrl(url) || url;
}

export function installFetchFallback() {
  if (fetchPatched || typeof globalThis.fetch !== "function") return;
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input, init) => {
    const url = applyPreferredProtocol(typeof input === "string" ? input : input?.url);
    const requestInput = typeof input === "string" ? url : input;
    try {
      return await originalFetch(requestInput, init);
    } catch (error) {
      const fallbackUrl = toHttpUrl(typeof input === "string" ? input : input?.url);
      if (!fallbackUrl) throw error;
      preferHttp = true;
      return originalFetch(fallbackUrl, init);
    }
  };

  fetchPatched = true;
}

export function installAxiosFallback(axios) {
  if (axiosPatched || !axios?.interceptors) return;

  axios.interceptors.request.use((config) => {
    if (preferHttp && typeof config.url === "string") {
      config.url = applyPreferredProtocol(config.url);
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;
      const fallbackUrl = toHttpUrl(config?.url);
      if (!config || config.__httpFallback || error?.response || !fallbackUrl) {
        return Promise.reject(error);
      }
      preferHttp = true;
      config.__httpFallback = true;
      config.url = fallbackUrl;
      return axios.request(config);
    }
  );

  axiosPatched = true;
}
