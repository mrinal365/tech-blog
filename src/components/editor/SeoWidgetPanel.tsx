"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/articleStore";
import {
  setSEO,
  setAISEO,
  setSlug,
  setCategory,
  setTags,
  setMetadata,
} from "@/store/articleStore";
import { analyzeSEO } from "@/lib/seo/analyzer";
import { analyzeAISEO } from "@/lib/seo/aiSeoAnalyzer";
import { ARTICLE_CATEGORIES, DIFFICULTY_LEVELS } from "@/types/article";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Brain,
  ListTree,
  FileText,
} from "lucide-react";
import type { HeadingBlockData } from "@/types/blocks";

type WidgetTab = "seo" | "ai" | "meta" | "outline";

export function SeoWidgetPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { document } = useSelector((state: RootState) => state.editor);
  const [activeTab, setActiveTab] = useState<WidgetTab>("seo");

  const article = document.article;
  const seo = article.seo;
  const seoResult = useMemo(() => analyzeSEO(document), [document]);
  const aiSeoResult = useMemo(() => analyzeAISEO(document), [document]);

  const headings = article.blocks.filter((b) => b.type === "heading");

  return (
    <div
      className="flex h-full flex-col overflow-hidden text-xs"
      style={{ backgroundColor: "#161616", borderLeft: "1px solid #2a2a2a" }}
    >
      {/* Widget Title Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#1c1c1c" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#ffffff]" />
          <span className="font-mono font-bold uppercase tracking-wider text-[#ffffff]">
            SEO & AI Optimizer
          </span>
        </div>
        <span
          className="rounded px-2 py-0.5 font-mono text-[10px] font-bold"
          style={{
            backgroundColor: seoResult.score >= 80 ? "#222222" : "#1a1a1a",
            color: seoResult.score >= 80 ? "#ffffff" : "#aaaaaa",
            border: "1px solid #333333",
          }}
        >
          Score: {seoResult.score}/100
        </span>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b" style={{ borderColor: "#2a2a2a", backgroundColor: "#181818" }}>
        {[
          { key: "seo", label: "SEO", icon: Search },
          { key: "ai", label: "AI Search", icon: Brain },
          { key: "meta", label: "Meta", icon: FileText },
          { key: "outline", label: "Outline", icon: ListTree },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as WidgetTab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono transition-colors text-[11px]"
            style={{
              color: activeTab === key ? "#ffffff" : "#777777",
              borderBottom: activeTab === key ? "2px solid #ffffff" : "2px solid transparent",
              backgroundColor: activeTab === key ? "#1c1c1c" : "transparent",
            }}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: SEO ANALYSIS */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            {/* Score Ring / Bar */}
            <div className="rounded-xl p-4 border" style={{ backgroundColor: "#1c1c1c", borderColor: "#2a2a2a" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase text-[#777777]">Live SEO Rank</p>
                  <p className="text-2xl font-extrabold font-mono text-[#ffffff]">{seoResult.score}%</p>
                </div>
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                  style={{ border: "2px solid #ffffff", color: "#ffffff", backgroundColor: "#222222" }}
                >
                  {seoResult.score >= 80 ? "A" : seoResult.score >= 60 ? "B" : "C"}
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${seoResult.score}%`, backgroundColor: "#ffffff" }}
                />
              </div>
            </div>

            {/* Quick Field Editors */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#777777]">Meta Title</label>
                <input
                  type="text"
                  value={seo.metaTitle}
                  onChange={(e) => dispatch(setSEO({ metaTitle: e.target.value }))}
                  placeholder="SEO Title (30-70 chars)..."
                  className="mt-1 w-full rounded px-3 py-2 outline-none font-mono text-xs"
                  style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#777777]">Meta Description</label>
                <textarea
                  value={seo.metaDescription}
                  onChange={(e) => dispatch(setSEO({ metaDescription: e.target.value }))}
                  placeholder="Meta Description (120-160 chars)..."
                  rows={2}
                  className="mt-1 w-full resize-none rounded px-3 py-2 outline-none text-xs"
                  style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#777777]">Primary Keyword</label>
                <input
                  type="text"
                  value={seo.primaryKeyword}
                  onChange={(e) => dispatch(setSEO({ primaryKeyword: e.target.value }))}
                  placeholder="e.g. React Server Components"
                  className="mt-1 w-full rounded px-3 py-2 outline-none text-xs"
                  style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[10px] font-mono font-semibold uppercase text-[#777777] mb-2">
                SEO Audit Checks ({seoResult.checks.filter((c) => c.status === "pass").length}/{seoResult.checks.length})
              </p>
              {seoResult.checks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-start gap-2 rounded p-2 border"
                  style={{ backgroundColor: "#1c1c1c", borderColor: "#2a2a2a" }}
                >
                  {check.status === "pass" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ffffff] mt-0.5" />
                  ) : check.status === "warning" ? (
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#aaaaaa] mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-[#666666] mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#e8e8e8]">{check.label}</p>
                    <p className="text-[10px] text-[#888888]">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI SEARCH READINESS */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 border" style={{ backgroundColor: "#1c1c1c", borderColor: "#2a2a2a" }}>
              <p className="text-[10px] font-mono uppercase text-[#777777]">LLM Topic Coverage</p>
              <p className="text-2xl font-extrabold font-mono text-[#ffffff]">{aiSeoResult.topicCoverage}%</p>
              <p className="text-[11px] text-[#aaaaaa] mt-1">
                Optimized for Perplexity, ChatGPT Search, & Claude LLM indexing.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">Search Intent Category</label>
              <div className="mt-1">
                <span
                  className="inline-block rounded px-2.5 py-1 text-xs font-mono font-semibold"
                  style={{ backgroundColor: "#222222", border: "1px solid #333333", color: "#ffffff" }}
                >
                  {aiSeoResult.searchIntent}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">
                Detected Technical Entities ({aiSeoResult.entities.length})
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {aiSeoResult.entities.length === 0 ? (
                  <p className="text-[11px] text-[#666666]">No entities detected yet. Write technical terms!</p>
                ) : (
                  aiSeoResult.entities.map((entity) => (
                    <span
                      key={entity}
                      className="rounded px-2 py-0.5 text-[10px] font-mono"
                      style={{ backgroundColor: "#222222", border: "1px solid #2a2a2a", color: "#cccccc" }}
                    >
                      {entity}
                    </span>
                  ))
                )}
              </div>
            </div>

            {aiSeoResult.contentGaps.length > 0 && (
              <div className="rounded-lg p-3 border" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
                <p className="text-[10px] font-mono font-semibold uppercase text-[#ffffff] mb-1">
                  AI Content Gap Suggestions
                </p>
                {aiSeoResult.contentGaps.map((gap, i) => (
                  <p key={i} className="text-[11px] text-[#aaaaaa] mb-1">
                    • {gap}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ARTICLE METADATA */}
        {activeTab === "meta" && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">URL Slug</label>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => dispatch(setSlug(e.target.value))}
                placeholder="my-article-slug"
                className="mt-1 w-full rounded px-3 py-2 outline-none font-mono text-xs"
                style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">Category</label>
              <select
                value={article.category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="mt-1 w-full rounded px-3 py-2 outline-none text-xs"
                style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">Tags (Comma Separated)</label>
              <input
                type="text"
                value={article.tags.join(", ")}
                onChange={(e) =>
                  dispatch(
                    setTags(
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  )
                }
                placeholder="React, TypeScript, Architecture"
                className="mt-1 w-full rounded px-3 py-2 outline-none text-xs"
                style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-[#777777]">Difficulty Level</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {DIFFICULTY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    onClick={() =>
                      dispatch(
                        setMetadata({
                          difficulty: lvl.value as "beginner" | "intermediate" | "advanced" | "expert",
                        })
                      )
                    }
                    className="rounded px-2.5 py-1 text-[10px] font-mono transition-colors"
                    style={{
                      backgroundColor: article.metadata.difficulty === lvl.value ? "#ffffff" : "#1e1e1e",
                      color: article.metadata.difficulty === lvl.value ? "#121212" : "#888888",
                      border: `1px solid ${article.metadata.difficulty === lvl.value ? "#ffffff" : "#2a2a2a"}`,
                    }}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OUTLINE & NAVIGATION */}
        {activeTab === "outline" && (
          <div className="space-y-3">
            <div className="rounded p-3 border" style={{ backgroundColor: "#1c1c1c", borderColor: "#2a2a2a" }}>
              <p className="text-[11px] font-mono text-[#aaaaaa]">
                {article.blocks.length} Total Blocks · {headings.length} Headings
              </p>
            </div>

            {article.title && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#888888]">H1</span>
                <span className="font-semibold text-[#ffffff] truncate">{article.title}</span>
              </div>
            )}

            {headings.length === 0 ? (
              <p className="text-[11px] text-[#666666]">No H2/H3 headings added yet.</p>
            ) : (
              headings.map((b) => {
                const data = b.data as unknown as HeadingBlockData;
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-2"
                    style={{ paddingLeft: ((data.level || 2) - 1) * 12 }}
                  >
                    <span className="font-mono text-[10px] text-[#666666]">H{data.level || 2}</span>
                    <span className="text-[11px] text-[#cccccc] truncate">{data.text || "(empty heading)"}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
