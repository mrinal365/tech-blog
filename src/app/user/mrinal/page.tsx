import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { ArticleModel } from "@/models/Article";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Code2,
  BookOpen,
  ArrowUpRight,
  Cpu,
  Clock,
  Eye,
} from "lucide-react";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
    </svg>
  );
}

export default async function MrinalPortfolioPage() {
  let articles: Array<{
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    category: string;
    readTime?: string;
    views?: number;
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
        "article.views": 1,
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
      readTime: d.article.settings?.readingTime
        ? `${d.article.settings.readingTime} min read`
        : "5 min read",
      views: d.article.views || 0,
    }));
  } catch (err) {
    console.error("[SSR Mrinal Page] MongoDB check error:", err);
  }

  return (
    <div className="min-h-screen text-[#cccccc]" style={{ backgroundColor: "#121212" }}>
      {/* HERO SECTION (SSR) */}
      <section className="mx-auto max-w-5xl px-3 sm:px-6 pt-10 pb-10 sm:pt-24 sm:pb-16 border-b border-[#2a2a2a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-xs font-mono mb-3 sm:mb-4 border border-[#3a3a3a] bg-[#1a1a1a] text-[#ffffff] max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="h-2 w-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: "var(--accent-theme)" }} />
              <span className="truncate">Available for Full-Stack Roles & Technical Writing</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#ffffff]">
              MRINAL
            </h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-xl font-medium text-[#aaaaaa]">
              Full-Stack Developer • <span style={{ color: "var(--accent-theme)" }}>4+ Years Experience</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-mono text-[#888888]">
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-theme)" }} /> Bengaluru, India
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col flex-wrap gap-2 shrink-0">
            <a
              href="mailto:mrinaltewary@gmail.com"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono border border-[#2a2a2a] bg-[#1a1a1a] text-[#ffffff] hover:bg-[#252525] transition-colors break-all"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-theme)" }} />
              <span className="truncate">mrinaltewary@gmail.com</span>
            </a>
            <a
              href="tel:+919304165314"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono border border-[#2a2a2a] bg-[#1a1a1a] text-[#ffffff] hover:bg-[#252525] transition-colors"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-theme)" }} />
              <span>+91 9304165314</span>
            </a>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[80px] flex items-center justify-center gap-1 rounded px-2.5 py-1.5 text-xs font-mono border border-[#2a2a2a] bg-[#161616] text-[#cccccc] hover:text-[#ffffff] transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5 shrink-0" /> GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[80px] flex items-center justify-center gap-1 rounded px-2.5 py-1.5 text-xs font-mono border border-[#2a2a2a] bg-[#161616] text-[#cccccc] hover:text-[#ffffff] transition-colors"
              >
                <LinkedinIcon className="h-3.5 w-3.5 shrink-0" /> LinkedIn
              </a>
              <a
                href="https://mrinal.cv"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[80px] flex items-center justify-center gap-1 rounded px-2.5 py-1.5 text-xs font-mono border border-[#2a2a2a] bg-[#161616] text-[#cccccc] hover:text-[#ffffff] transition-colors"
              >
                <Globe className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-theme)" }} /> mrinal.cv
              </a>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mt-8 p-5 rounded-xl border border-[#2a2a2a] bg-[#181818]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-theme)" }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-[#cccccc]">
            Full-Stack Developer with <strong className="text-[#ffffff]">4+ years</strong> of experience across freelance, startups, and product companies, building polished React/Next.js frontends alongside Node.js/Express APIs and backend services that power them. At FC.ONE, helped scale the platform from <span style={{ color: "var(--accent-theme)" }}>15 to 750+</span> sports academy partners serving <span style={{ color: "var(--accent-theme)" }}>100,000+ registered users</span> across 10+ cities.
          </p>
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-8">
          <Briefcase className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
          <h2 className="text-xl font-bold text-[#ffffff]">Work Experience</h2>
        </div>

        <div className="space-y-8">
          {/* EXPERIENCE 1 */}
          <div className="relative pl-6 border-l-2 border-[#2a2a2a]">
            <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent-theme)" }} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="text-base font-bold text-[#ffffff]">
                Full-Stack Developer <span className="font-normal text-[#aaaaaa]">| Freelance</span>
              </h3>
              <span className="font-mono text-xs text-[#888888]">
                Jul 2022–Sep 2023, Dec 2024–Present • Bengaluru
              </span>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-[#aaaaaa] mt-3">
              <li>
                <strong className="text-[#ffffff]">Agentic AI Chat Platform:</strong> Enterprise chat platform built on Node.js backend powering WebSocket streaming, session management, and model switching, with frontend handling conditional rendering of markdown, tables, charts, Excel, URLs, MSAL SSO, and Azure deployment.
              </li>
              <li>
                <strong className="text-[#ffffff]">Order Discrepancy Dashboard:</strong> Streamlined order-discrepancy resolution by replacing manual review with a paginated workflow supporting filtering, approve/reject actions, and automatic promotion of resolved cases into audit history.
              </li>
              <li>
                <strong className="text-[#ffffff]">Pulsedoge & Poorpleb (Web3):</strong> Enabled self-service token migration for two Web3 platforms, integrating wallet connectivity, token-burning/claim flows, and on-chain transaction state using React, Node.js, Web3.js, and Ethers.js.
              </li>
              <li>
                Delivered feature enhancements, performance improvements, and Figma-to-pixel-perfect builds across multiple client projects.
              </li>
            </ul>
          </div>

          {/* EXPERIENCE 2 */}
          <div className="relative pl-6 border-l-2 border-[#2a2a2a]">
            <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent-theme)" }} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="text-base font-bold text-[#ffffff]">
                Software Developer <span className="font-normal text-[#aaaaaa]">| FC.ONE</span>
              </h3>
              <span className="font-mono text-xs text-[#888888]">
                Oct 2023–Nov 2024 • Bengaluru
              </span>
            </div>
            <p className="text-xs text-[#888888] mb-3">
              Core member of a lean three-person engineering team that scaled FC.ONE from <span style={{ color: "var(--accent-theme)" }}>15 to 750+</span> sports academies and gyms across 10+ cities, supporting <span style={{ color: "var(--accent-theme)" }}>100,000+ users</span>.
            </p>
            <ul className="space-y-2 text-xs leading-relaxed text-[#aaaaaa]">
              <li>
                <strong className="text-[#ffffff]">Booking Platform:</strong> Digitized end-to-end booking workflow for courts, trainings, and memberships with conditional slot availability, multi-person reservations, payments, and automated WhatsApp/Email invoice delivery.
              </li>
              <li>
                <strong className="text-[#ffffff]">Admin Dashboard:</strong> Centralized academy operations into a multi-role dashboard giving real-time visibility into earnings, bookings, cash payments, and student attendance.
              </li>
              <li>
                <strong className="text-[#ffffff]">Coach Attendance App:</strong> Automated coach/student attendance tracking through facial recognition and manual check-ins syncing attendance data with the admin dashboard.
              </li>
              <li>
                <strong className="text-[#ffffff]">Community & Apartment App:</strong> Built paginated feeds, watermarked story sharing, WebSocket updates, and integrated booking/membership flows.
              </li>
              <li>
                <strong className="text-[#ffffff]">Sales & Support CRM:</strong> Connected Instagram ad leads directly to sales pipeline; enabled agents to onboard academies end-to-end with catalog pages and initial bookings.
              </li>
              <li>
                <strong className="text-[#ffffff]">Frontend Architecture:</strong> Instrumenting errors, user behavior, and performance with Sentry, Mixpanel, Clarity, Google Analytics, and Meta Events.
              </li>
            </ul>
          </div>

          {/* EXPERIENCE 3 */}
          <div className="relative pl-6 border-l-2 border-[#2a2a2a]">
            <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent-theme)" }} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="text-base font-bold text-[#ffffff]">
                Frontend Developer <span className="font-normal text-[#aaaaaa]">| Lepton Software</span>
              </h3>
              <span className="font-mono text-xs text-[#888888]">
                Aug 2021–Jun 2022 • Gurugram
              </span>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-[#aaaaaa]">
              <li>
                <strong className="text-[#ffffff]">SmartMarket:</strong> Enabled businesses to analyze location intelligence visually through interactive map-based dashboards built with Deck.gl and Google Maps.
              </li>
              <li>
                <strong className="text-[#ffffff]">Neo360:</strong> Enabled telecom teams to analyze large-scale geographic datasets interactively through map layers, filtering, and GeoJSON visualization for client Vodafone.
              </li>
              <li>
                <strong className="text-[#ffffff]">American Express:</strong> Improved location-search responsiveness in high-traffic Amex app via debounced autocomplete and backend location suggestion APIs.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
            <h2 className="text-xl font-bold text-[#ffffff]">Featured Project</h2>
          </div>
          <a
            href="https://www.explore.baby"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-mono text-xs hover:underline"
            style={{ color: "var(--accent-theme)" }}
          >
            www.explore.baby <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="p-6 rounded-xl border border-[#2a2a2a] bg-[#181818] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: "#2a2a2a" }}>
            <div>
              <h3 className="text-lg font-bold text-[#ffffff]">explore.baby — Social Media App</h3>
              <p className="text-xs text-[#888888]">Solo Full-Stack Build • Node.js, React, Socket.io, Redux, PostgreSQL</p>
            </div>
            <span
              className="rounded px-3 py-1 font-mono text-[10px] font-bold uppercase bg-[#1c1917] border shrink-0"
              style={{ borderColor: "var(--accent-theme)", color: "var(--accent-theme)" }}
            >
              Production Deployment
            </span>
          </div>

          <ul className="space-y-2 text-xs leading-relaxed text-[#aaaaaa]">
            <li>
              • Architected and built the entire platform solo — Node.js/Express backend and REST APIs alongside React frontend — with real-time messaging over Socket.io, typing indicators, online status, and infinite-scroll feed using Redux normalization for O(1) client updates with optimistic UI and rollback.
            </li>
            <li>
              • Engineered app-wide live notifications over Socket.io, @mentions, and time-windowed view tracking; deployed full stack on Vercel + VPS/Nginx with ImageKit CDN.
            </li>
            <li>
              • Implemented JWT authentication with refresh-token rotation, rate limiting, and role-based route protection across the entire API surface.
            </li>
            <li>
              • Instrumented platform end to end with Sentry for error tracking, Mixpanel/Clarity for analytics, and CI/CD pipelines with GitHub Actions for zero-downtime deployments.
            </li>
          </ul>
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
          <h2 className="text-xl font-bold text-[#ffffff]">Technical Skills</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              category: "Backend",
              skills: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Database Indexing", "Docker", "Azure", "VPS", "Nginx", "PM2", "CI/CD", "Git"],
            },
            {
              category: "Backend Tools & Libraries",
              skills: ["Mongoose", "Prisma", "Zod", "bcrypt", "Helmet", "Nodemailer", "Node-cron", "BullMQ", "Postman"],
            },
            {
              category: "Real-time & APIs",
              skills: ["WebSocket", "Socket.io", "Server-Sent Events (SSE)", "Long Polling", "Short Polling", "REST APIs", "GraphQL", "gRPC", "WebHooks"],
            },
            {
              category: "Frontend",
              skills: ["React.js", "Next.js", "TypeScript", "React Query", "Redux Toolkit", "Context API", "React Native", "Tailwind CSS", "Framer Motion", "MUI"],
            },
            {
              category: "Performance & Security",
              skills: ["CSR/SSR/ISR", "Build Optimization", "Code Splitting", "Tree Shaking", "XSS", "CSRF", "CORS", "SSRF", "CSP", "Web Vitals"],
            },
            {
              category: "Caching & Observability",
              skills: ["Redis Caching", "HTTP Caching", "IndexedDB", "Sentry", "Mixpanel", "Clarity", "Google Analytics", "Figma", "Web3.js", "Ethers.js"],
            },
          ].map((group) => (
            <div key={group.category} className="p-4 rounded-xl border border-[#2a2a2a] bg-[#181818]">
              <h3 className="text-xs font-mono font-bold uppercase mb-2.5" style={{ color: "var(--accent-theme)" }}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded px-2.5 py-1 font-mono text-[11px] bg-[#121212] border border-[#2a2a2a] text-[#cccccc]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLISHED ARTICLES BY MRINAL */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
              <h2 className="text-2xl font-bold text-[#ffffff]">Published Engineering Writeups ({articles.length})</h2>
            </div>
            <p className="text-xs text-[#888888] mt-1">
              Articles and architecture breakdowns published by Mrinal on sde.guide
            </p>
          </div>
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
                  <span>Mrinal</span>

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
            <h3 className="text-base font-bold text-[#ffffff]">No published articles yet</h3>
            <p className="text-xs text-[#888888] max-w-md mx-auto leading-relaxed">
              Technical writeups and architecture breakdowns published by Mrinal will be listed here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

