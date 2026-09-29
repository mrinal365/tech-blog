import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import { getAuthUserFromRequest } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/seedDb";

// GET /api/articles
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDbSeeded();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const status = searchParams.get("status") || "published";
    const includeBlocks = searchParams.get("full") === "true";

    const query: Record<string, unknown> = {};
    if (status !== "all") {
      query["article.status"] = status;
    }
    if (category && category !== "All") {
      query["article.category"] = category;
    }
    if (tag) {
      query["article.tags"] = tag;
    }

    // Optimization: Exclude heavy 'blocks' array for fast listing feeds
    const projection = includeBlocks
      ? {}
      : {
          schemaVersion: 1,
          "article.id": 1,
          "article.slug": 1,
          "article.title": 1,
          "article.subtitle": 1,
          "article.category": 1,
          "article.tags": 1,
          "article.status": 1,
          "article.createdAt": 1,
          "article.views": 1,
          "article.likes": 1,
          "article.author": 1,
          "article.settings": 1,
        };

    const articles = await ArticleModel.find(query, projection)
      .sort({ "article.createdAt": -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("[API Articles GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST /api/articles
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const slug =
      body.article?.slug ||
      body.article?.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `article-${Date.now()}`;

    const newDoc = {
      schemaVersion: body.schemaVersion || "1.0",
      article: {
        id: body.article?.id || `art_${Date.now()}`,
        slug,
        title: body.article?.title || "Untitled Article",
        subtitle: body.article?.subtitle || "",
        category: body.article?.category || "Engineering",
        tags: body.article?.tags || ["Full-Stack"],
        status: body.article?.status || "published",
        createdAt: body.article?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        author: {
          id: user.userId,
          name: user.name || "Mrinal",
          role: "Full-Stack Developer",
        },
        seo: body.article?.seo || {},
        aiSeo: body.article?.aiSeo || {},
        metadata: body.article?.metadata || {},
        settings: body.article?.settings || { readingTime: 5 },
        blocks: body.article?.blocks || [],
      },
    };

    const upsertedArticle = await ArticleModel.findOneAndUpdate(
      {
        $or: [
          { "article.slug": slug },
          { "article.id": body.article?.id || `art_${Date.now()}` },
        ],
      },
      { $set: newDoc },
      { upsert: true, returnDocument: "after" }
    ).lean();

    return NextResponse.json({
      success: true,
      article: upsertedArticle,
    });
  } catch (error) {
    console.error("[API Articles POST Error]:", error);
    return NextResponse.json({ error: "Failed to create or update article" }, { status: 500 });
  }
}

