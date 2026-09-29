"use client";

import Link from "next/link";
import { SAMPLE_POSTS } from "@/data/posts";
import { DETAILED_SAMPLE_ARTICLES } from "@/data/sampleArticlesData";
import { Clock, Eye, Sparkles, ShieldCheck } from "lucide-react";
import { ProtectedAuthRoute } from "@/components/auth/ProtectedAuthRoute";

export default function AdminExamplesPage() {
  return (
    <ProtectedAuthRoute>
      <div className="min-h-screen text-[#cccccc] py-12" style={{ backgroundColor: "#121212" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Secret Admin Banner */}
          <div
            className="mb-8 p-4 rounded-xl border flex items-center justify-between font-mono text-xs select-none"
            style={{ backgroundColor: "#181818", borderColor: "var(--accent-theme)", color: "var(--accent-theme)" }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
              <span>
                <strong>ADMIN SECRET EXAMPLES ROUTE</strong> — Protected by JWT Authentication (/examples)
              </span>
            </div>
            <span className="rounded px-2.5 py-0.5 bg-[#121212] border text-[10px] font-bold" style={{ borderColor: "var(--accent-theme)", color: "var(--accent-theme)" }}>
              UNLINKED SECRET
            </span>
          </div>

          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
              Admin Sample Documents
            </span>
            <h1 className="mt-1 text-3xl font-extrabold text-[#ffffff]">
              Sample Articles & Technical Architecture Demonstrations
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#aaaaaa]">
              Click any sample article below to inspect live React component widgets, VS Code syntax highlighters, tables, and AI SEO metrics.
            </p>
          </div>

          {/* Detailed JSON Sample Articles Grid */}
          <div className="space-y-6 mb-12">
            <h2 className="text-sm font-mono font-bold uppercase text-[#777777]">
              1. Rich Block Sample Documents (With Interactive Widgets)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DETAILED_SAMPLE_ARTICLES.map((item) => {
                const art = item.article;
                return (
                  <article
                    key={art.id}
                    className="group flex flex-col justify-between rounded-xl p-6 border transition-all hover:bg-[#161616] hover:border-[#444444]"
                    style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                        <span
                          className="rounded px-2.5 py-0.5 border"
                          style={{
                            backgroundColor: "#1c1917",
                            borderColor: "var(--accent-theme)",
                            color: "var(--accent-theme)",
                          }}
                        >
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1 text-[#888888]">
                          <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} /> {art.settings.readingTime} min read
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#e8e8e8] group-hover:text-[#ffffff] transition-colors line-clamp-2">
                        <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                      </h3>

                      <p className="mt-2.5 text-xs text-[#aaaaaa] line-clamp-3 leading-relaxed">
                        {art.subtitle}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#888888]">
                        {art.blocks.length} Block Components
                      </span>
                      <Link
                        href={`/articles/${art.slug}`}
                        className="inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors"
                      >
                        <span>Open Guide</span>
                        <Sparkles className="h-3 w-3" style={{ color: "var(--accent-theme)" }} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Simple Sample Posts Grid */}
          <div className="space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase text-[#777777]">
              2. Standard Technical Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_POSTS.map((post) => (
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
                        <Clock className="h-3.5 w-3.5 text-[#666666]" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#e8e8e8] group-hover:text-[#ffffff] transition-colors line-clamp-2">
                      <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="mt-2.5 text-xs text-[#aaaaaa] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4 font-mono text-[11px] border-[#2a2a2a] text-[#777777]">
                    <span>{post.author.name}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {post.views}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedAuthRoute>
  );
}
