import { NextResponse } from "next/server";
import { API_BASE_URL, getDefaultHeaders } from "./config/apiConfig";

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|under-maintenance|coming-soon|images|fonts|css|js|api).*)",
  ],
};

export async function middleware(req) {
  try {
    const res = await fetch(`${API_BASE_URL}/general-setting`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    if (!res.ok) {
      console.error("Failed to fetch status:", res.statusText);
      return NextResponse.next();
    }

    const json = await res.json();
    const data = json?.data?.[0];

    const isUnderMaintenance = data?.is_under_maintenance === 1;
    const isComingSoon = data?.is_coming_soon === 1;

    const { pathname } = req.nextUrl;

    if (isComingSoon && pathname !== "/coming-soon") {
      const url = req.nextUrl.clone();
      url.pathname = "/coming-soon";
      return NextResponse.redirect(url);
    }

    if (isUnderMaintenance && pathname !== "/under-maintenance") {
      const url = req.nextUrl.clone();
      url.pathname = "/under-maintenance";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}
