import { NextRequest, NextResponse } from "next/server";

const INTERNAL_PATH_PREFIXES = ["/_next", "/api", "/favicon", "/robots.txt", "/sitemap.xml", "/site.webmanifest"];
const PUBLIC_FILE = /\.[^/]+$/;

function shouldBypass(pathname: string): boolean {
    if (!pathname || pathname === "/") return false;
    if (PUBLIC_FILE.test(pathname)) return true;
    if (pathname.startsWith("/p/") || pathname.startsWith("/u/")) return true;
    return INTERNAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function normalizeHost(host: string | null): string {
    if (!host) return "";
    return host.split(":")[0].trim().toLowerCase();
}

function getBoolField(value: any, fallback: boolean): boolean {
    if (value?.booleanValue === undefined) return fallback;
    return value.booleanValue === true;
}

async function resolveUserIdFromDomain(domain: string): Promise<string | null> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) return null;

    const encodedDomain = encodeURIComponent(domain);
    const url =
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/domain_mappings/${encodedDomain}?key=${apiKey}`;

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const json = await response.json();
    const fields = json?.fields ?? {};
    const userId = fields?.userId?.stringValue as string | undefined;
    const active = getBoolField(fields?.active, true);

    if (!userId || !active) return null;
    return userId;
}

export async function middleware(request: NextRequest) {
    const host = normalizeHost(request.headers.get("host"));
    const pathname = request.nextUrl.pathname;

    if (!host || shouldBypass(pathname)) {
        return NextResponse.next();
    }

    const primaryDomain = (process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "resume-portfolioweb.netlify.app")
        .trim()
        .toLowerCase();
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

    if (host === primaryDomain || localHosts.has(host)) {
        return NextResponse.next();
    }

    let userId = await resolveUserIdFromDomain(host);
    if (!userId && host.startsWith("www.")) {
        userId = await resolveUserIdFromDomain(host.replace(/^www\./, ""));
    }
    if (!userId) {
        return NextResponse.next();
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/p/${userId}`;
    return NextResponse.rewrite(rewriteUrl);
}

export const config = {
    matcher: ["/:path*"],
};
