import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import { getAuthUserFromRequest } from "@/lib/auth";
import { Search, Clock, Eye, BookOpen, Edit3, ArrowRight } from "lucide-react";
import { DeleteArticleButton } from "@/components/auth/DeleteArticleButton";

export default async function ArticlesPage() {
  let articles: Array<{
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    readTime?: string;
    views?: number;
    createdAt?: string;
    author?: { name: string };
  }> = [];

  let isLoggedIn = false;

  try {
    const user = await getAuthUserFromRequest();
    if (user) isLoggedIn = true;

    await connectToDatabase();
    const docs = await ArticleModel.find(
      { "article.status": "published" },
      {
        "article.id": 1,
        "article.slug": 1,
        "article.title": 1,
        "article.subtitle": 1,
        "article.category": 1,
        "article.createdAt": 1,
        "article.views": 1,
        "article.author": 1,
        "article.settings": 1,
      }
    )
      .sort({ "article.createdAt": -1 })
      .lean();

    articles = docs.map((d) => ({
      id: d.article.id,
      slug: d.article.slug,
      title: d.article.title,
      subtitle: d.article.subtitle,
      category: d.article.category,
      readTime: d.article.settings?.readingTime ? `${d.article.settings.readingTime} min read` : "5 min read",
      views: d.article.views || 0,
      createdAt: d.article.createdAt,
      author: d.article.author,
    }));
  } catch (err) {
    console.error("[SSR Articles Page] MongoDB fetch error:", err);
  }

  return (
    <div className="min-h-screen py-6 sm:py-12 text-[#cccccc]" style={{ backgroundColor: "#121212" }}>
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
              Engineering Journal
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#ffffff]">
              Articles & Guides ({articles.length})
            </h1>
          </div>

          {isLoggedIn && (
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
              <span>Create New Article</span>
            </Link>
          )}
        </div>

        {/* If articles exist in MongoDB */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-xl p-6 border transition-all hover:bg-[#161616] hover:border-[#444444]"
                style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-3 text-[#777777]">
                    <span className="rounded px-2.5 py-0.5 bg-[#121212] border border-[#2a2a2a] text-[#ffffff]">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#e8e8e8] group-hover:text-[#ffffff] transition-colors line-clamp-2">
                    <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {post.subtitle && (
                    <p className="mt-2.5 text-xs text-[#aaaaaa] line-clamp-3 leading-relaxed">
                      {post.subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4 font-mono text-[11px] border-[#2a2a2a] text-[#777777]">
                  <span>{post.author?.name || "Mrinal"}</span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {post.views}
                    </span>
                    {isLoggedIn && (
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/create?edit=${post.slug}`}
                          className="flex items-center gap-1 hover:underline font-bold"
                          style={{ color: "var(--accent-theme)" }}
                        >
                          <Edit3 className="h-3 w-3" /> Edit
                        </Link>
                        <DeleteArticleButton slug={post.slug} title={post.title} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border p-8 space-y-3"
            style={{ backgroundColor: "#161616", borderColor: "#2a2a2a" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
              <BookOpen className="h-6 w-6" style={{ color: "var(--accent-theme)" }} />
            </div>
            <h2 className="text-lg font-bold text-[#ffffff]">No articles published yet</h2>
            <p className="text-xs text-[#888888] max-w-sm leading-relaxed">
              Technical guides and architecture breakdowns published by the author will be listed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
