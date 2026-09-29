import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import { getAuthUserFromRequest } from "@/lib/auth";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { DeleteArticleButton } from "@/components/auth/DeleteArticleButton";
import { ArrowLeft, Clock, Eye, Calendar, Tag, Edit3 } from "lucide-react";
import type { BaseBlock } from "@/types/article";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const rawDoc = await ArticleModel.findOne(
      { $or: [{ "article.slug": slug }, { "article.id": slug }] },
      {
        "article.title": 1,
        "article.subtitle": 1,
        "article.category": 1,
        "article.tags": 1,
        "article.author": 1,
        "article.createdAt": 1,
        "article.updatedAt": 1,
        "article.slug": 1,
      }
    ).lean();

    if (!rawDoc) {
      return {
        title: "Article Not Found | SDE.GUIDE",
        description: "The requested technical engineering article could not be found.",
      };
    }

    const title = rawDoc.article.title;
    const description =
      rawDoc.article.subtitle ||
      `${title} — Technical guide covering full-stack architecture, system design, and code patterns on SDE.GUIDE.`;
    const url = `https://sde.guide/articles/${rawDoc.article.slug}`;

    return {
      title: `${title} | SDE.GUIDE`,
      description,
      keywords: [
        rawDoc.article.category,
        ...(rawDoc.article.tags || []),
        "SDE.GUIDE",
        "System Design",
        "Software Engineering",
      ],
      authors: [{ name: rawDoc.article.author?.name || "Mrinal" }],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "SDE.GUIDE",
        type: "article",
        publishedTime: rawDoc.article.createdAt,
        modifiedTime: rawDoc.article.updatedAt || rawDoc.article.createdAt,
        authors: [rawDoc.article.author?.name || "Mrinal"],
        tags: rawDoc.article.tags || [rawDoc.article.category],
        images: [
          {
            url: "/logo.png",
            width: 1200,
            height: 1200,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/logo.png"],
      },
    };
  } catch {
    return {
      title: "Technical Article | SDE.GUIDE",
    };
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let isLoggedIn = false;

  try {
    const user = await getAuthUserFromRequest();
    if (user) isLoggedIn = true;
  } catch {
    /* ignore auth error */
  }

  let doc: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    createdAt?: string;
    views?: number;
    author?: { name: string; role?: string };
    settings?: { readingTime?: number };
    tags?: string[];
    blocks?: BaseBlock[];
  } | null = null;

  let relatedPosts: Array<{
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    readTime?: string;
  }> = [];

  try {
    await connectToDatabase();

    // Increment views and retrieve latest document
    const rawDoc = await ArticleModel.findOneAndUpdate(
      { $or: [{ "article.slug": slug }, { "article.id": slug }] },
      { $inc: { "article.views": 1 } },
      { returnDocument: "after" }
    ).lean();

    if (rawDoc) {
      doc = {
        id: rawDoc.article.id,
        slug: rawDoc.article.slug,
        title: rawDoc.article.title,
        subtitle: rawDoc.article.subtitle,
        category: rawDoc.article.category,
        createdAt: rawDoc.article.createdAt,
        views: rawDoc.article.views || 0,
        author: rawDoc.article.author,
        settings: rawDoc.article.settings,
        tags: rawDoc.article.tags || [],
        blocks: (rawDoc.article.blocks as unknown as BaseBlock[]) || [],
      };

      // Fetch related articles
      const relatedDocs = await ArticleModel.find(
        {
          "article.slug": { $ne: rawDoc.article.slug },
          "article.status": "published",
        },
        {
          "article.id": 1,
          "article.slug": 1,
          "article.title": 1,
          "article.subtitle": 1,
          "article.category": 1,
          "article.settings": 1,
        }
      )
        .limit(3)
        .lean();

      relatedPosts = relatedDocs.map((r) => ({
        id: r.article.id,
        slug: r.article.slug,
        title: r.article.title,
        subtitle: r.article.subtitle,
        category: r.article.category,
        readTime: r.article.settings?.readingTime
          ? `${r.article.settings.readingTime} min read`
          : "5 min read",
      }));
    }
  } catch (err) {
    console.error("[SSR Article Detail] MongoDB fetch error:", err);
  }

  if (!doc) {
    notFound();
  }

  const readTime = doc.settings?.readingTime
    ? `${doc.settings.readingTime} min read`
    : "5 min read";

  const publishedAt = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Sep 27, 2026";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": doc.title,
    "description": doc.subtitle || doc.title,
    "inLanguage": "en-US",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sde.guide/articles/${doc.slug}`,
    },
    "author": {
      "@type": "Person",
      "name": doc.author?.name || "Mrinal",
      "url": "https://sde.guide/user/mrinal",
    },
    "publisher": {
      "@type": "Organization",
      "name": "SDE.GUIDE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sde.guide/logo.png",
      },
    },
    "datePublished": doc.createdAt || new Date().toISOString(),
    "dateModified": doc.createdAt || new Date().toISOString(),
    "keywords": doc.tags?.length ? doc.tags.join(", ") : doc.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article
        className="min-h-screen text-[#cccccc] pb-24"
        style={{ backgroundColor: "#121212" }}
      >
      {/* HEADER SECTION */}
      <header className="border-b border-[#2a2a2a] bg-[#161616] py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-3 sm:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-[#ffffff] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
              <span>← Back to All Articles</span>
            </Link>

            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/create?edit=${doc.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
                  <span>Edit</span>
                </Link>
                <DeleteArticleButton
                  slug={doc.slug}
                  title={doc.title}
                  redirectOnDelete="/articles"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-4 text-[#888888]">
            <span
              className="rounded px-2.5 py-0.5 text-xs font-bold font-mono border"
              style={{
                backgroundColor: "#1c1917",
                borderColor: "var(--accent-theme)",
                color: "var(--accent-theme)",
              }}
            >
              {doc.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#aaaaaa]">
              <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} /> {readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#888888]">
              <Calendar className="h-3.5 w-3.5" /> {publishedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-[#ffffff] leading-tight font-sans">
            {doc.title}
          </h1>

          {doc.subtitle && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed text-[#aaaaaa]">
              {doc.subtitle}
            </p>
          )}

          {/* Author bar */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2a2a] pt-4 sm:pt-6">
            <Link href="/user/mrinal" className="flex items-center gap-3 group">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-bold border transition-colors group-hover:border-[#666666]"
                style={{
                  backgroundColor: "#1e1e1e",
                  borderColor: "#3a3a3a",
                  color: "var(--accent-theme)",
                }}
              >
                MR
              </div>
              <div>
                <div className="text-sm font-bold text-[#ffffff] transition-colors">
                  {doc.author?.name || "Mrinal"}
                </div>
                <div className="text-xs text-[#888888] font-mono">
                  {doc.author?.role || "Full-Stack Developer"}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 text-xs font-mono text-[#888888]">
              <span className="flex items-center gap-1.5 rounded px-3 py-1.5 border border-[#2a2a2a] bg-[#121212]">
                <Eye className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} /> {doc.views} views
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      <main className="mx-auto max-w-4xl px-3 sm:px-6 pt-6 sm:pt-10">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#161616] p-3.5 sm:p-10 space-y-6 text-[#cccccc] leading-relaxed font-sans min-w-0 overflow-x-auto">
          {doc.blocks && doc.blocks.length > 0 ? (
            <div className="space-y-6">
              {doc.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          ) : (
            <p className="text-[#888888] italic">
              No content blocks found in this article document.
            </p>
          )}
        </div>

        {/* TAGS FOOTER */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[#2a2a2a] pt-6">
            <Tag className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#161616] px-3 py-1 text-xs font-mono text-[#888888] border border-[#2a2a2a]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* RELATED ARTICLES */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 border-t border-[#2a2a2a] pt-10">
            <h3 className="text-lg font-bold text-[#ffffff] mb-6 font-sans">
              Related Technical Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  className="group rounded-xl border border-[#2a2a2a] bg-[#161616] p-5 hover:border-[#444444] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] font-mono text-[#777777] mb-2">
                      {related.category}
                    </div>
                    <h4 className="text-sm font-bold text-[#e8e8e8] group-hover:text-[#ffffff] transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    {related.subtitle && (
                      <p className="mt-2 text-xs text-[#aaaaaa] line-clamp-2 leading-relaxed">
                        {related.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#2a2a2a] font-mono text-[10px] text-[#777777]">
                    {related.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </article>
    </>
  );
}

