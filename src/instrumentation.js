export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { installFetchFallback } = await import("./config/apiFallback");
  installFetchFallback();
  await import("./config/registerAxiosFallback");
}
