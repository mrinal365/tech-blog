import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/create", "/login"],
      },
    ],
    sitemap: "https://sde.guide/sitemap.xml",
  };
}
