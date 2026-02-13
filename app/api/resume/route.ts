import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

type ResourceType = "raw" | "image";

function parseFromCloudinaryUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const uploadIndex = parsedUrl.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = parsedUrl.pathname.slice(uploadIndex + "/upload/".length);
    const segments = pathAfterUpload.split("/").filter(Boolean);
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
    const cleaned = decodeURIComponent(publicIdSegments.join("/"));
    if (!cleaned) return null;

    const dotIndex = cleaned.lastIndexOf(".");
    const withoutExt = dotIndex === -1 ? cleaned : cleaned.slice(0, dotIndex);
    const ext = dotIndex === -1 ? undefined : cleaned.slice(dotIndex + 1);

    return { cleaned, withoutExt, ext };
  } catch {
    return null;
  }
}

function buildCandidatePublicIds(cleaned: string, withoutExt: string, ext?: string) {
  const ids = new Set<string>([cleaned, withoutExt]);
  if (!ext) {
    ids.add(`${cleaned}.pdf`);
    ids.add(`${withoutExt}.pdf`);
  }

  const cleanedBase = cleaned.split("/").pop();
  if (cleanedBase) ids.add(cleanedBase);
  if (cleanedBase && !ext) ids.add(`${cleanedBase}.pdf`);

  const withoutExtBase = withoutExt.split("/").pop();
  if (withoutExtBase) ids.add(withoutExtBase);
  if (withoutExtBase && !ext) ids.add(`${withoutExtBase}.pdf`);

  return Array.from(ids);
}

async function resolveExistingResource(candidateIds: string[]) {
  const resourceTypes: ResourceType[] = ["raw", "image"];

  for (const resourceType of resourceTypes) {
    for (const candidateId of candidateIds) {
      try {
        const resource = await cloudinary.api.resource(candidateId, {
          resource_type: resourceType,
          type: "upload",
        });

        return {
          publicId: resource.public_id as string,
          resourceType,
          format: (resource.format as string | undefined) ?? undefined,
        };
      } catch {
        // Try next candidate
      }
    }
  }

  return null;
}

function hasExtension(publicId: string) {
  const lastSlash = publicId.lastIndexOf("/");
  const fileName = lastSlash >= 0 ? publicId.slice(lastSlash + 1) : publicId;
  return fileName.includes(".");
}

function getDownloadFileName(publicId: string, format?: string) {
  const lastSlash = publicId.lastIndexOf("/");
  const fileName = lastSlash >= 0 ? publicId.slice(lastSlash + 1) : publicId;
  if (fileName.includes(".")) return fileName.replace(/"/g, "");
  if (format) return `${fileName}.${format}`.replace(/"/g, "");
  return `${fileName}.pdf`.replace(/"/g, "");
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const resumeUrl = requestUrl.searchParams.get("url");

  if (!resumeUrl) {
    return NextResponse.json({ ok: false, error: "Missing url parameter" }, { status: 400 });
  }

  if (!resumeUrl.includes("res.cloudinary.com")) {
    return NextResponse.redirect(resumeUrl, { status: 302 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary credentials not configured" },
      { status: 500 }
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const parsed = parseFromCloudinaryUrl(resumeUrl);
  if (!parsed) {
    return NextResponse.json({ ok: false, error: "Invalid Cloudinary URL" }, { status: 400 });
  }

  const candidateIds = buildCandidatePublicIds(parsed.cleaned, parsed.withoutExt, parsed.ext);
  const resolved = await resolveExistingResource(candidateIds);

  if (!resolved) {
    return new NextResponse("Resume not found or not accessible.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const publicIdIncludesExt = hasExtension(resolved.publicId);
  const finalPublicId = resolved.publicId;
  const finalFormat = publicIdIncludesExt ? undefined : resolved.format ?? parsed.ext;

  const signedUrl = cloudinary.utils.private_download_url(finalPublicId, finalFormat, {
    resource_type: resolved.resourceType,
    type: "upload",
  });

  const cloudinaryResponse = await fetch(signedUrl, { cache: "no-store" });

  if (!cloudinaryResponse.ok) {
    const errorText = await cloudinaryResponse.text();
    return new NextResponse(errorText || "Resume not found or not accessible.", {
      status: cloudinaryResponse.status,
      headers: {
        "Content-Type":
          cloudinaryResponse.headers.get("content-type") ?? "text/plain; charset=utf-8",
      },
    });
  }

  const data = Buffer.from(await cloudinaryResponse.arrayBuffer());
  const fileName = getDownloadFileName(finalPublicId, finalFormat);
  const contentType =
    cloudinaryResponse.headers.get("content-type") ??
    (finalFormat === "pdf" ? "application/pdf" : "application/octet-stream");

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
