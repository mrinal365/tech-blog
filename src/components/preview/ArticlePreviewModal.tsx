"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/articleStore";
import { BlockRenderer } from "../blocks/BlockRenderer";
import { X, Clock, Tag } from "lucide-react";

interface ArticlePreviewModalProps {
  onClose: () => void;
}

export function ArticlePreviewModal({ onClose }: ArticlePreviewModalProps) {
  const { document } = useSelector((state: RootState) => state.editor);
  const article = document.article;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#121212" }}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#1a1a1a" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium tracking-wider" style={{ color: "#e8e8e8" }}>ARTICLE PREVIEW</span>
          <span className="text-xs" style={{ color: "#777777" }}>
            {article.blocks.length} blocks
          </span>
        </div>
        <button onClick={onClose}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium hover:bg-[#222222] transition-colors"
          style={{ color: "#e8e8e8", border: "1px solid #2a2a2a" }}>
          <X className="h-4 w-4" />
          Close Preview
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <article className="mx-auto max-w-3xl px-6 py-12">
          {/* Article Header */}
          <header className="mb-12 border-b pb-8" style={{ borderColor: "#2a2a2a" }}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-4" style={{ color: "#888888" }}>
              <span className="rounded-md px-2.5 py-1" style={{ backgroundColor: "#222222", border: "1px solid #2a2a2a", color: "#e8e8e8" }}>
                {article.category}
              </span>
              {article.metadata.difficulty && (
                <>
                  <span>·</span>
                  <span className="uppercase">{article.metadata.difficulty}</span>
                </>
              )}
              {article.settings.readingTime > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.settings.readingTime} min read
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3"
              style={{ color: "#ffffff" }}>
              {article.title || "Untitled Article"}
            </h1>

            {article.subtitle && (
              <p className="text-lg leading-relaxed" style={{ color: "#aaaaaa" }}>
                {article.subtitle}
              </p>
            )}

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: "#2a2a2a" }}>
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "#222222", border: "1px solid #2a2a2a", color: "#ffffff" }}>
                {(article.author.name || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "#ffffff" }}>{article.author.name}</p>
                <p className="text-[11px] font-mono" style={{ color: "#777777" }}>
                  {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </p>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <Tag className="h-3 w-3 mr-1" style={{ color: "#777777" }} />
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded px-2 py-0.5 text-[10px] font-mono"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#aaaaaa" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Rendered Blocks */}
          <div className="space-y-6">
            {article.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
