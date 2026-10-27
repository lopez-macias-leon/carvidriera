import type { MetadataRoute } from "next";
import { portal } from "@/config/portal";

export default function robots(): MetadataRoute.Robots {
  // En modo demostración no se indexa nada.
  if (portal.demo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/admin", "/api", "/favoritos"] },
    sitemap: `${portal.siteUrl}/sitemap.xml`,
  };
}
