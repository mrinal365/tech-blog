import type { Metadata } from "next";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import { LandingHeroPreview } from "@/components/landing/LandingHeroPreview";
import { TerminalLogo } from "@/components/TerminalLogo";
import {
  BookOpen,
  ArrowRight,
  Code2,
  Clock,
  Eye,
  UserCheck,
  Database,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SDE.GUIDE — Technical Guides, System Design & Modern Code Patterns",
  description:
    "SDE.GUIDE is a developer technical blog collection covering full-stack engineering across React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Cloud, AI systems, and microservices.",
  openGraph: {
    title: "SDE.GUIDE — Technical Guides & System Design",
    description: "Full-Stack Engineering Journal, System Architecture & Modern Code Patterns.",
    url: "https://sde.guide",
    siteName: "SDE.GUIDE",
  },
};

export default async function SdeGuideLandingPage() {
  let articles: Array<{
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    readTime?: string;
    views?: number;
    author?: { name: string };
  }> = [];

  try {
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
      .limit(6)
      .lean();

    articles = docs.map((d) => ({
      id: d.article.id,
      slug: d.article.slug,
      title: d.article.title,
      subtitle: d.article.subtitle,
      category: d.article.category,
      readTime: d.article.settings?.readingTime
        ? `${d.article.settings.readingTime} min read`
        : "5 min read",
      views: d.article.views || 0,
      createdAt: d.article.createdAt,
      author: d.article.author,
    }));
  } catch (err) {
    console.error("[SSR Landing Page] MongoDB fetch error:", err);
  }

  return (
    <div className="min-h-screen text-[#cccccc]" style={{ backgroundColor: "#121212" }}>
      {/* ANNOUNCEMENT BANNER */}
      <div
        className="border-b py-2 px-3 text-center text-[10px] sm:text-xs font-mono select-none"
        style={{ backgroundColor: "#161616", borderColor: "#2a2a2a", color: "#888888" }}
      >
        <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
          <span
            className="h-2 w-2 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: "var(--accent-theme)" }}
          />
          <strong className="text-[#ffffff]">
            sde<span style={{ color: "var(--accent-theme)" }}>.guide</span>
          </strong>{" "}
          — Curated Full-Stack Engineering Blogs, Architecture Guides & Code Patterns.
        </span>
      </div>

      {/* HERO SECTION (SSR) */}
      <section className="relative mx-auto max-w-6xl px-3 sm:px-6 pt-10 pb-14 sm:pt-24 sm:pb-24 border-b border-[#2a2a2a]">
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-xs font-mono border border-[#3a3a3a] bg-[#181818] text-[#ffffff] max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            <TerminalLogo size={18} showText={false} />
            <span className="truncate">Full-Stack Engineering & System Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#ffffff] leading-tight font-sans">
            Technical Guides, System Design &{" "}
            <span style={{ color: "var(--accent-theme)" }}>Modern Code Patterns</span>
          </h1>

          <p className="text-xs sm:text-base md:text-xl text-[#aaaaaa] leading-relaxed max-w-3xl mx-auto">
            <strong className="text-[#ffffff]">
              sde<span style={{ color: "var(--accent-theme)" }}>.guide</span>
            </strong>{" "}
            is a developer technical blog collection covering full-stack engineering across{" "}
            <strong className="text-[#ffffff]">
              React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Cloud, AI systems
            </strong>
            , and high-performance microservices.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/articles"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold shadow-lg transition-all hover:bg-[#e0e0e0] active:scale-95 cursor-pointer"
              style={{ backgroundColor: "#ffffff", color: "#121212" }}
            >
              <BookOpen className="h-4 w-4" />
              <span>Explore All Blogs ({articles.length})</span>
            </Link>

            <Link
              href="/user/mrinal"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-mono border border-[#3a3a3a] bg-[#1a1a1a] text-[#ffffff] hover:bg-[#252525] hover:border-[#555555] transition-all active:scale-95 cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-[#aaaaaa]" />
              <span>Author: Mrinal</span>
            </Link>
          </div>

          {/* TECH STACK CHIPS */}
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto border-t border-[#2a2a2a] mt-6 sm:mt-8">
            {[
              "React.js",
              "Next.js 16",
              "Node.js",
              "Express.js",
              "TypeScript",
              "PostgreSQL",
              "MongoDB",
              "Redis",
              "Docker",
              "Azure / VPS",
              "WebSockets",
              "RAG & Vector DBs",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-xs bg-[#181818] border border-[#2a2a2a] text-[#cccccc]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-STACK DOMAINS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-b border-[#2a2a2a]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
            Technical Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] mt-1">
            What We Write & Deep Dive Into
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-2">
            In-depth engineering notes, performance optimizations, and architectural breakdowns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Frontend Architecture",
              icon: Code2,
              desc: "React 19 Server Components, Next.js 16 compiler optimizations, rendering patterns (CSR/SSR/ISR), state normalization, and Framer Motion.",
              tags: ["React.js", "Next.js", "TypeScript", "Redux"],
            },
            {
              title: "Backend & Databases",
              icon: Database,
              desc: "Node.js/Express API design, PostgreSQL indexing, MongoDB aggregations, Redis caching strategies, and ORMs (Prisma, Mongoose).",
              tags: ["Node.js", "PostgreSQL", "MongoDB", "Redis"],
            },
            {
              title: "Real-Time & APIs",
              icon: Server,
              desc: "WebSocket streaming, Socket.io event channels, Server-Sent Events (SSE), REST, GraphQL, gRPC, and webhook idempotency.",
              tags: ["WebSocket", "Socket.io", "gRPC", "REST"],
            },
            {
              title: "Cloud & AI Systems",
              icon: ShieldCheck,
              desc: "Azure deployments, VPS/Nginx configuration, Docker containers, CI/CD pipelines, RAG vector pipelines, and Sentry observability.",
              tags: ["Docker", "Azure", "VPS", "RAG / Vector"],
            },
          ].map((domain) => {
            const IconComp = domain.icon;
            return (
              <div
                key={domain.title}
                className="flex flex-col justify-between rounded-xl p-5 border transition-all hover:border-[#444444] hover:bg-[#161616]"
                style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
              >
                <div>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg mb-4"
                    style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a" }}
                  >
                    <IconComp className="h-5 w-5 text-[#ffffff]" />
                  </div>
                  <h3 className="text-base font-bold text-[#ffffff]">{domain.title}</h3>
                  <p className="text-xs text-[#aaaaaa] mt-2 leading-relaxed">{domain.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-[#2a2a2a]">
                  {domain.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded px-2 py-0.5 font-mono text-[10px] bg-[#121212] border border-[#2a2a2a] text-[#888888]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED BLOG WRITEUPS (SSR) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-b border-[#2a2a2a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
              Engineering Journal
            </span>
            <h2 className="text-2xl font-bold text-[#ffffff] mt-1">Featured Technical Articles</h2>
          </div>
          <Link
            href="/articles"
            className="flex items-center gap-1 font-mono text-xs text-[#ffffff] hover:underline"
          >
            All Articles ({articles.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

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

                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {post.views}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div
            className="rounded-xl border p-12 text-center space-y-3"
            style={{ backgroundColor: "#161616", borderColor: "#2a2a2a" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto bg-[#1a1a1a] border border-[#2a2a2a]">
              <BookOpen className="h-6 w-6" style={{ color: "var(--accent-theme)" }} />
            </div>
            <h3 className="text-base font-bold text-[#ffffff]">No articles published yet</h3>
            <p className="text-xs text-[#888888] max-w-md mx-auto leading-relaxed">
              Technical articles and architectural breakdowns published by the author will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

