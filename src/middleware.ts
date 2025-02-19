// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "ja"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1) If already on a subpath (e.g. /en, /ja, /contact, /en/about, etc.), do nothing
    if (pathname !== "/") {
        return NextResponse.next();
    }

    // 2) parse Accept-Language only for root
    const acceptLang = request.headers.get("accept-language") || "";
    let primaryLang = acceptLang.split(",")[0]?.toLowerCase() || "";
    if (primaryLang.includes("-")) {
        primaryLang = primaryLang.split("-")[0]; // 'en-us' => 'en'
    }
    if (!SUPPORTED_LOCALES.includes(primaryLang)) {
        primaryLang = "en"; // fallback
    }

    // 3) redirect from "/" => "/en" or "/ja"
    const url = request.nextUrl.clone();
    url.pathname = `/${primaryLang}`;
    return NextResponse.redirect(url);
}
