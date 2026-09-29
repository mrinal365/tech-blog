"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Check } from "lucide-react";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<"AI & Systems" | "Frontend Architecture" | "Backend & Infra" | "DevOps & Cloud" | "Performance">("Frontend Architecture");
  const [excerpt, setExcerpt] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [tagsInput, setTagsInput] = useState("React 19, Next.js 16, TypeScript");
  const [content, setContent] = useState(
    `# Article Title Overview\n\nWrite your technical introduction here...\n\n## System Architecture\n\nProvide deep technical breakdown...\n\n\`\`\`tsx\n// Code snippet example\nconst result = await processData();\n\`\`\`\n\n### Conclusion\n\nWrap up your key takeaways.`
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setPublishedSuccess(true);
    setTimeout(() => {
      router.push("/blog");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 pb-24">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-[#181818] py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white font-sans">Article Publisher</h1>
              <p className="text-xs text-zinc-400 font-mono">Write & format technical posts</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-zinc-300" />
            <span>{isPreviewMode ? "Edit Markdown" : "Live Preview"}</span>
          </button>
        </div>
      </header>

      {/* FORM CONTENT */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        {publishedSuccess && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-zinc-100 flex items-center gap-3">
            <Check className="h-5 w-5 text-white" />
            <span>Article published successfully! Redirecting to Tech Blog...</span>
          </div>
        )}

        {isPreviewMode ? (
          /* PREVIEW MODE */
          <div className="rounded-xl border border-zinc-800 bg-[#181818] p-8">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700 text-zinc-200">{category}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-sans">{title || "Untitled Article"}</h1>
            <p className="mt-3 text-base text-zinc-400">{excerpt}</p>

            <div className="mt-8 border-t border-zinc-800 pt-6 space-y-4 font-sans text-zinc-200">
              {content.split("\n\n").map((chunk, i) => (
                <div key={i}>
                  {chunk.startsWith("# ") ? (
                    <h1 className="text-2xl font-bold text-white mt-4">{chunk.replace("# ", "")}</h1>
                  ) : chunk.startsWith("## ") ? (
                    <h2 className="text-xl font-semibold text-zinc-100 mt-4">{chunk.replace("## ", "")}</h2>
                  ) : chunk.startsWith("```") ? (
                    <pre className="my-4 rounded-lg bg-[#121212] p-4 font-mono text-xs border border-zinc-800 text-zinc-200">
                      <code>{chunk.replace(/```[a-z]*/g, "").trim()}</code>
                    </pre>
                  ) : (
                    <p className="leading-relaxed">{chunk}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EDIT FORM */
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-[#181818] p-6 sm:p-8 space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 16 App Router Benchmarks"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="nextjs-16-benchmarks"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm font-mono text-zinc-200 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-zinc-400 focus:outline-none"
                  >
                    <option value="Frontend Architecture">Frontend Architecture</option>
                    <option value="AI & Systems">AI & Systems</option>
                    <option value="Backend & Infra">Backend & Infra</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-zinc-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-zinc-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Short Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide a 1-2 sentence overview of the post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-400 focus:outline-none"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Markdown Content *
                </label>
                <textarea
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] p-4 text-sm font-mono text-zinc-200 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200 transition-colors"
                >
                  <span>Publish Article</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
