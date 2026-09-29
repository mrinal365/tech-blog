import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sde.guide";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/user/mrinal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic article routes from DB
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectToDatabase();
    const docs = await ArticleModel.find(
      { "article.status": "published" },
      { "article.slug": 1, "article.updatedAt": 1, "article.createdAt": 1 }
    ).lean();

    articleRoutes = docs.map((d) => ({
      url: `${baseUrl}/articles/${d.article.slug}`,
      lastModified: d.article.updatedAt ? new Date(d.article.updatedAt) : new Date(d.article.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[Sitemap Generator] Error fetching articles:", err);
  }

  return [...staticRoutes, ...articleRoutes];
}
