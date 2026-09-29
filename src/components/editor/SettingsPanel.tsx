"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/articleStore";
import {
  setSidebarTab, setSlug, setCategory, setTags, setMetadata, setSettings, setSEO, setAISEO,
  updateBlockMetadata, updateBlockSEO,
} from "@/store/articleStore";
import type { SidebarTab, BaseBlock } from "@/types/article";
import { ARTICLE_CATEGORIES, DIFFICULTY_LEVELS } from "@/types/article";
import { useMemo } from "react";
import { analyzeSEO } from "@/lib/seo/analyzer";
import { analyzeAISEO } from "@/lib/seo/aiSeoAnalyzer";
import { blockRegistry } from "@/registry/blockRegistry";
import { FileText, Search, Brain, LayoutList, Check, AlertTriangle, X } from "lucide-react";
import type { HeadingBlockData } from "@/types/blocks";

const TABS: { key: SidebarTab; label: string }[] = [
  { key: "article", label: "Article" },
  { key: "seo", label: "SEO" },
  { key: "ai-seo", label: "AI" },
  { key: "structure", label: "Outline" },
];

export function SettingsPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { document, sidebarTab, selectedBlockId } = useSelector((state: RootState) => state.editor);
  const article = document.article;
  const selectedBlock = selectedBlockId ? article.blocks.find((b) => b.id === selectedBlockId) : null;
  const seoResult = useMemo(() => analyzeSEO(document), [document]);
  const aiSeoResult = useMemo(() => analyzeAISEO(document), [document]);

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Tab Bar */}
      <div className="flex shrink-0" style={{ borderBottom: "1px solid #2a2a2a" }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => dispatch(setSidebarTab(key))}
            className="flex-1 py-2.5 text-[11px] font-mono transition-colors"
            style={{
              color: sidebarTab === key ? "#e8e8e8" : "#555",
              borderBottom: sidebarTab === key ? "1px solid #e8e8e8" : "1px solid transparent",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedBlock && sidebarTab === "article" && <BlockSettings block={selectedBlock} />}
        {!selectedBlock && sidebarTab === "article" && <ArticleSettings />}
        {sidebarTab === "seo" && <SEOPanel score={seoResult.score} checks={seoResult.checks} />}
        {sidebarTab === "ai-seo" && <AISEOPanel result={aiSeoResult} />}
        {sidebarTab === "structure" && <StructurePanel />}
      </div>
    </div>
  );
}

function BlockSettings({ block }: { block: BaseBlock }) {
  const dispatch = useDispatch<AppDispatch>();
  const entry = blockRegistry[block.type];
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>Block</p>
        <p className="mt-1 text-sm font-semibold" style={{ color: "#e8e8e8" }}>{entry?.label || block.type}</p>
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Anchor</label>
        <input type="text" value={block.metadata?.anchor || ""}
          onChange={(e) => dispatch(updateBlockMetadata({ blockId: block.id, metadata: { anchor: e.target.value } }))}
          placeholder="custom-id" className="mt-1 w-full rounded px-3 py-1.5 text-xs font-mono outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Caption</label>
        <input type="text" value={block.metadata?.caption || ""}
          onChange={(e) => dispatch(updateBlockMetadata({ blockId: block.id, metadata: { caption: e.target.value } }))}
          placeholder="Caption..." className="mt-1 w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Visibility</label>
        <select value={block.metadata?.visibility || "public"}
          onChange={(e) => dispatch(updateBlockMetadata({ blockId: block.id, metadata: { visibility: e.target.value as "public" | "draft" } }))}
          className="mt-1 w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }}>
          <option value="public">Public</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}

function ArticleSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { document } = useSelector((state: RootState) => state.editor);
  const article = document.article;
  return (
    <div className="space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>Settings</p>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Slug</label>
        <input type="text" value={article.slug} onChange={(e) => dispatch(setSlug(e.target.value))}
          placeholder="article-slug" className="mt-1 w-full rounded px-3 py-1.5 text-xs font-mono outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Category</label>
        <select value={article.category} onChange={(e) => dispatch(setCategory(e.target.value))}
          className="mt-1 w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }}>
          {ARTICLE_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Tags</label>
        <input type="text" value={article.tags.join(", ")}
          onChange={(e) => dispatch(setTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean)))}
          placeholder="React, TypeScript" className="mt-1 w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Difficulty</label>
        <div className="mt-1 flex flex-wrap gap-1">
          {DIFFICULTY_LEVELS.map((lvl) => (
            <button key={lvl.value}
              onClick={() => dispatch(setMetadata({ difficulty: lvl.value as "beginner" | "intermediate" | "advanced" | "expert" }))}
              className="rounded px-2 py-1 text-[10px] font-mono transition-colors"
              style={{
                backgroundColor: article.metadata.difficulty === lvl.value ? "#333" : "#222",
                color: article.metadata.difficulty === lvl.value ? "#e8e8e8" : "#555",
                border: `1px solid ${article.metadata.difficulty === lvl.value ? "#555" : "#2a2a2a"}`,
              }}>{lvl.label}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase" style={{ color: "#555" }}>Technologies</label>
        <input type="text" value={(article.metadata.technologies || []).join(", ")}
          onChange={(e) => dispatch(setMetadata({ technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
          placeholder="Next.js, Redis" className="mt-1 w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
    </div>
  );
}

function SEOPanel({ score, checks }: { score: number; checks: { id: string; label: string; status: string; message: string }[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const { document } = useSelector((state: RootState) => state.editor);
  const seo = document.article.seo;
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a" }}>
        <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Score</p>
        <span className="text-2xl font-bold font-mono" style={{ color: "#e8e8e8" }}>{score}</span>
        <span className="text-xs ml-1" style={{ color: "#555" }}>/ 100</span>
        <div className="mt-2 h-1.5 w-full rounded-full" style={{ backgroundColor: "#2a2a2a" }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: "#999" }} />
        </div>
      </div>
      <div className="space-y-2">
        <input type="text" value={seo.metaTitle} onChange={(e) => dispatch(setSEO({ metaTitle: e.target.value }))}
          placeholder="Meta title..." className="w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
        <textarea value={seo.metaDescription} onChange={(e) => dispatch(setSEO({ metaDescription: e.target.value }))}
          placeholder="Meta description..." rows={2}
          className="w-full resize-none rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
        <input type="text" value={seo.primaryKeyword} onChange={(e) => dispatch(setSEO({ primaryKeyword: e.target.value }))}
          placeholder="Primary keyword..." className="w-full rounded px-3 py-1.5 text-xs outline-none"
          style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }} />
      </div>
      <div className="space-y-1">
        {checks.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded px-2 py-1.5" style={{ backgroundColor: "#222" }}>
            {c.status === "pass" ? <Check className="h-3 w-3" style={{ color: "#999" }} /> :
             c.status === "warning" ? <AlertTriangle className="h-3 w-3" style={{ color: "#777" }} /> :
             <X className="h-3 w-3" style={{ color: "#888" }} />}
            <div className="min-w-0">
              <p className="text-[11px] truncate" style={{ color: "#e8e8e8" }}>{c.label}</p>
              <p className="text-[10px] truncate" style={{ color: "#555" }}>{c.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISEOPanel({ result }: { result: ReturnType<typeof analyzeAISEO> }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>AI SEO</p>
      <div className="rounded-lg p-3" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a" }}>
        <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Coverage</p>
        <span className="text-2xl font-bold font-mono" style={{ color: "#e8e8e8" }}>{result.topicCoverage}%</span>
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Intent</p>
        <span className="rounded px-2 py-0.5 text-xs font-mono" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#e8e8e8" }}>{result.searchIntent}</span>
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Entities ({result.entities.length})</p>
        <div className="flex flex-wrap gap-1">
          {result.entities.length === 0 ? <span className="text-[10px]" style={{ color: "#555" }}>None detected</span> :
           result.entities.map((e) => (<span key={e} className="rounded px-2 py-0.5 text-[10px] font-mono" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#999" }}>{e}</span>))}
        </div>
      </div>
      {result.contentGaps.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Gaps</p>
          {result.contentGaps.map((g, i) => (
            <p key={i} className="text-[11px] mb-1" style={{ color: "#999" }}>• {g}</p>
          ))}
        </div>
      )}
      <div>
        <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#555" }}>Schema</p>
        <div className="flex flex-wrap gap-1">
          {result.suggestedSchema.map((s) => (<span key={s} className="rounded px-2 py-0.5 text-[10px] font-mono" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a", color: "#999" }}>{s}</span>))}
        </div>
      </div>
    </div>
  );
}

function StructurePanel() {
  const { document } = useSelector((state: RootState) => state.editor);
  const blocks = document.article.blocks;
  const headings = blocks.filter((b) => b.type === "heading");
  const blockTypeCount: Record<string, number> = {};
  blocks.forEach((b) => { blockTypeCount[b.type] = (blockTypeCount[b.type] || 0) + 1; });

  return (
    <div className="space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>Outline</p>
      <div className="rounded p-3" style={{ backgroundColor: "#222", border: "1px solid #2a2a2a" }}>
        <p className="text-xs font-mono" style={{ color: "#999" }}>{blocks.length} blocks · {headings.length} headings</p>
      </div>
      {document.article.title && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold" style={{ color: "#666" }}>H1</span>
          <span className="text-xs truncate" style={{ color: "#e8e8e8" }}>{document.article.title}</span>
        </div>
      )}
      {headings.map((b) => {
        const data = b.data as unknown as HeadingBlockData;
        return (
          <div key={b.id} className="flex items-center gap-1.5" style={{ paddingLeft: (data.level - 1) * 16 }}>
            <span className="text-[10px] font-mono" style={{ color: "#555" }}>H{data.level}</span>
            <span className="text-[11px] truncate" style={{ color: "#999" }}>{data.text || "(empty)"}</span>
          </div>
        );
      })}
      {Object.keys(blockTypeCount).length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase mb-1 mt-4" style={{ color: "#555" }}>Types</p>
          {Object.entries(blockTypeCount).sort((a, b) => b[1] - a[1]).map(([t, c]) => (
            <div key={t} className="flex justify-between px-2 py-0.5 text-[11px] font-mono" style={{ color: "#999" }}>
              <span>{t}</span><span style={{ color: "#e8e8e8" }}>{c}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
