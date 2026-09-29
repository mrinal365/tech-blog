"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import type { RootState, AppDispatch } from "@/store/articleStore";
import {
  setTitle,
  setSubtitle,
  undo,
  redo,
  setSaveStatus,
  loadArticle,
  resetEditor,
  addBlock,
  selectBlock,
} from "@/store/articleStore";
import { EditorHeader } from "./EditorHeader";
import { BlockToolbar } from "./BlockToolbar";
import { BlockEditor } from "./BlockEditor";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { ArticlePreviewModal } from "../preview/ArticlePreviewModal";
import { SeoWidgetPanel } from "./SeoWidgetPanel";
import { BlockDockLeft } from "./BlockDockLeft";
import type { BlockType } from "@/types/article";
import { Heading, Type, Code, MessageSquare, Image, Columns3, Footprints, Plus } from "lucide-react";

export function ArticleEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { document, selectedBlockId } = useSelector((state: RootState) => state.editor);
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");

  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [leftDockOpen, setLeftDockOpen] = useState(true);
  const [seoWidgetOpen, setSeoWidgetOpen] = useState(true);

  const blocks = document.article.blocks;

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch(undo());
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        dispatch(redo());
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        dispatch(setSaveStatus("saving"));
        try {
          localStorage.setItem("devarticle_draft", JSON.stringify(document));
          setTimeout(() => dispatch(setSaveStatus("saved")), 300);
        } catch {
          dispatch(setSaveStatus("error"));
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, document]);

  // Autosave
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem("devarticle_draft", JSON.stringify(document));
        dispatch(setSaveStatus("saved"));
      } catch { /* ignore */ }
    }, 2000);
    dispatch(setSaveStatus("saving"));
    return () => clearTimeout(timeout);
  }, [document, dispatch]);

  // Article Initialization (Empty canvas vs Edit mode)
  useEffect(() => {
    if (editSlug) {
      fetch(`/api/articles/${editSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.article) {
            const raw = data.article;
            const docToLoad = raw.article
              ? raw
              : { schemaVersion: "1.0", article: raw };
            dispatch(loadArticle(docToLoad));
          }
        })
        .catch((err) => console.error("[ArticleEditor] Error loading article for edit:", err));
    } else {
      // Direct visit to /create or after login: Always open blank empty canvas
      dispatch(resetEditor());
      try {
        localStorage.removeItem("devarticle_draft");
      } catch {
        /* ignore */
      }
    }
  }, [editSlug, dispatch]);


  const handleAddBlockDirect = (type: BlockType, index?: number) => {
    dispatch(addBlock({ type, index }));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: "#121212" }}>
      {/* Editor Top Bar */}
      <EditorHeader
        onExport={() => setExportOpen(true)}
        onImport={() => setImportOpen(true)}
        onPreview={() => setPreviewOpen(true)}
        leftDockOpen={leftDockOpen}
        onToggleLeftDock={() => setLeftDockOpen(!leftDockOpen)}
        seoWidgetOpen={seoWidgetOpen}
        onToggleSeoWidget={() => setSeoWidgetOpen(!seoWidgetOpen)}
      />

      {/* Main Workspace Layout (Responsive 3-Column / Mobile Slide-Over Drawers) */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: Block Dock (Desktop inline / Mobile slide-over drawer) */}
        {leftDockOpen && (
          <>
            {/* Backdrop for mobile (< lg) */}
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setLeftDockOpen(false)}
            />
            <div className="fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-[300px] lg:w-[290px] shrink-0 overflow-hidden bg-[#161616] lg:bg-transparent shadow-2xl lg:shadow-none border-r border-[#2a2a2a]">
              <div className="flex items-center justify-between p-2 lg:hidden border-b border-[#2a2a2a]">
                <span className="text-xs font-mono font-bold text-[#ffffff] px-2">Block Palette</span>
                <button
                  onClick={() => setLeftDockOpen(false)}
                  className="p-1 rounded text-[#aaaaaa] hover:text-[#ffffff] hover:bg-[#252525]"
                >
                  ✕
                </button>
              </div>
              <BlockDockLeft onClose={() => setLeftDockOpen(false)} />
            </div>
          </>
        )}

        {/* CENTER COLUMN: Clean Writing Canvas */}
        <div
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 sm:py-10 min-w-0"
          onClick={() => dispatch(selectBlock(null))}
        >
          <div className="mx-auto max-w-[760px] pb-32">
            {/* Title — Multiline Auto-Wrapping */}
            <textarea
              value={document.article.title}
              onChange={(e) => {
                dispatch(setTitle(e.target.value));
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={1}
              placeholder="Article Title..."
              className="w-full bg-transparent text-2xl sm:text-4xl font-extrabold tracking-tight outline-none resize-none placeholder:text-[#333333] overflow-hidden"
              style={{ color: "#ffffff", lineHeight: 1.25 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Subtitle — Multiline Auto-Wrapping */}
            <textarea
              value={document.article.subtitle}
              onChange={(e) => {
                dispatch(setSubtitle(e.target.value));
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              rows={1}
              placeholder="Add an engaging subtitle..."
              className="mt-2 sm:mt-3 w-full bg-transparent text-sm sm:text-lg outline-none resize-none placeholder:text-[#333333] overflow-hidden"
              style={{ color: "#aaaaaa", lineHeight: 1.4 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Quick Action Chips Bar (1-Click Add, No Popups) */}
            <div
              className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex flex-wrap items-center gap-1.5 p-2 rounded-lg border"
              style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#777777] px-1 sm:px-2">
                Quick Add:
              </span>

              {[
                { type: "paragraph" as BlockType, label: "Text", icon: Type },
                { type: "heading" as BlockType, label: "Heading", icon: Heading },
                { type: "code" as BlockType, label: "Code", icon: Code },
                { type: "callout" as BlockType, label: "Callout", icon: MessageSquare },
                { type: "comparison" as BlockType, label: "Table", icon: Columns3 },
                { type: "image" as BlockType, label: "Image", icon: Image },
                { type: "steps" as BlockType, label: "Steps", icon: Footprints },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleAddBlockDirect(type)}
                  className="flex items-center gap-1 rounded px-2 sm:px-2.5 py-1 text-xs font-mono font-medium transition-colors hover:bg-[#252525]"
                  style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#cccccc" }}
                >
                  <Plus className="h-3 w-3 text-[#ffffff]" />
                  <Icon className="h-3 w-3 text-[#888888]" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Blocks Area */}
            {blocks.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center rounded-xl py-12 sm:py-16 px-4 border-2 border-dashed text-center"
                style={{ borderColor: "#2a2a2a", backgroundColor: "#161616" }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm font-semibold text-[#ffffff] mb-1">Your article is currently empty</p>
                <p className="text-xs text-[#777777] mb-4">
                  Click any block type on the block palette or use quick add above.
                </p>
                <button
                  onClick={() => handleAddBlockDirect("paragraph")}
                  className="flex items-center gap-1.5 rounded px-4 py-2 text-xs font-bold transition-all hover:bg-[#e0e0e0]"
                  style={{ backgroundColor: "#ffffff", color: "#121212" }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Start Writing</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="group relative rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 border overflow-visible"
                    style={{
                      borderColor: selectedBlockId === block.id ? "var(--accent-theme)" : "#222222",
                      backgroundColor: selectedBlockId === block.id ? "#181818" : "#141414",
                      boxShadow: selectedBlockId === block.id
                        ? "0 4px 20px rgba(0,0,0,0.6), 0 0 15px var(--accent-theme)30"
                        : "none",
                      zIndex: selectedBlockId === block.id ? 30 : 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(selectBlock(block.id));
                    }}
                  >
                    {/* Inline Action Bar for Block */}
                    <div
                      className="absolute -top-4 right-3 z-40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-auto"
                      style={{ opacity: selectedBlockId === block.id ? 1 : undefined }}
                    >
                      <BlockToolbar blockId={block.id} index={index} total={blocks.length} />
                    </div>

                    <BlockEditor block={block} />

                    {/* Inline Direct Insert Shortcut Bar between blocks */}
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity py-1 flex items-center justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="h-px flex-1" style={{ backgroundColor: "#2a2a2a" }} />
                      <button
                        onClick={() => handleAddBlockDirect("paragraph", index + 1)}
                        className="rounded px-2 py-0.5 text-[10px] font-mono text-[#aaaaaa] hover:bg-[#222222] transition-colors border border-[#2a2a2a]"
                      >
                        + Text
                      </button>
                      <button
                        onClick={() => handleAddBlockDirect("heading", index + 1)}
                        className="rounded px-2 py-0.5 text-[10px] font-mono text-[#aaaaaa] hover:bg-[#222222] transition-colors border border-[#2a2a2a]"
                      >
                        + Heading
                      </button>
                      <button
                        onClick={() => handleAddBlockDirect("code", index + 1)}
                        className="rounded px-2 py-0.5 text-[10px] font-mono text-[#aaaaaa] hover:bg-[#222222] transition-colors border border-[#2a2a2a]"
                      >
                        + Code
                      </button>
                      <div className="h-px flex-1" style={{ backgroundColor: "#2a2a2a" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SEO & AI SEO Optimizer Widget (Desktop inline / Mobile slide-over drawer) */}
        {seoWidgetOpen && (
          <>
            {/* Backdrop for mobile (< lg) */}
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setSeoWidgetOpen(false)}
            />
            <div className="fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto w-[300px] sm:w-[320px] shrink-0 overflow-hidden bg-[#161616] lg:bg-transparent shadow-2xl lg:shadow-none border-l border-[#2a2a2a]">
              <div className="flex items-center justify-between p-2 lg:hidden border-b border-[#2a2a2a]">
                <span className="text-xs font-mono font-bold text-[#ffffff] px-2">SEO & AI Optimizer</span>
                <button
                  onClick={() => setSeoWidgetOpen(false)}
                  className="p-1 rounded text-[#aaaaaa] hover:text-[#ffffff] hover:bg-[#252525]"
                >
                  ✕
                </button>
              </div>
              <SeoWidgetPanel />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
      {previewOpen && <ArticlePreviewModal onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}
