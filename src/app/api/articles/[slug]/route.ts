import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import { getAuthUserFromRequest } from "@/lib/auth";

// GET /api/articles/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    // Find and atomically increment views
    const doc = await ArticleModel.findOneAndUpdate(
      { $or: [{ "article.slug": slug }, { "article.id": slug }] },
      { $inc: { "article.views": 1 } },
      { returnDocument: "after" }
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article: doc,
    });
  } catch (error) {
    console.error("[API Article GET Slug Error]:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PUT /api/articles/[slug]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    await connectToDatabase();
    const body = await req.json();

    const updatedDoc = await ArticleModel.findOneAndUpdate(
      { $or: [{ "article.slug": slug }, { "article.id": slug }] },
      {
        $set: {
          "article.title": body.article?.title,
          "article.subtitle": body.article?.subtitle,
          "article.category": body.article?.category,
          "article.tags": body.article?.tags,
          "article.status": body.article?.status,
          "article.blocks": body.article?.blocks,
          "article.seo": body.article?.seo,
          "article.aiSeo": body.article?.aiSeo,
          "article.metadata": body.article?.metadata,
          "article.settings": body.article?.settings,
          "article.updatedAt": new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    ).lean();

    if (!updatedDoc) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article: updatedDoc,
    });
  } catch (error) {
    console.error("[API Article PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE /api/articles/[slug]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = await params;
    await connectToDatabase();

    const deleted = await ArticleModel.findOneAndDelete({
      $or: [{ "article.slug": slug }, { "article.id": slug }],
    });

    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("[API Article DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
