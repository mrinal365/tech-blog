"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/articleStore";
import { setStatus, setSaveStatus, undo, redo } from "@/store/articleStore";
import {
  Download,
  Upload,
  Check,
  Circle,
  Loader2,
  ChevronDown,
  BookOpen,
  Undo2,
  Redo2,
  PanelLeft,
  Sparkles,
  Eye,
  Home,
  Send,
} from "lucide-react";
import type { ArticleStatus } from "@/types/article";
import { useState, useRef, useEffect } from "react";
import { SampleArticlesModal } from "./SampleArticlesModal";
import { TerminalLogo } from "@/components/TerminalLogo";

const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Draft",
  ready: "Ready to Publish",
  published: "Published",
  archived: "Archived",
};

interface EditorHeaderProps {
  onExport: () => void;
  onImport: () => void;
  onPreview: () => void;
  leftDockOpen: boolean;
  onToggleLeftDock: () => void;
  seoWidgetOpen: boolean;
  onToggleSeoWidget: () => void;
}

export function EditorHeader({
  onExport,
  onImport,
  onPreview,
  leftDockOpen,
  onToggleLeftDock,
  seoWidgetOpen,
  onToggleSeoWidget,
}: EditorHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { document: articleDoc, saveStatus, lastSavedAt, past, future } = useSelector(
    (state: RootState) => state.editor
  );
  const [statusOpen, setStatusOpen] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const status = articleDoc.article.status;

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    window.document.addEventListener("mousedown", handler);
    return () => window.document.removeEventListener("mousedown", handler);
  }, []);

  const handlePublish = async () => {
    if (!articleDoc.article.title.trim()) {
      alert("Please enter an article title before publishing.");
      return;
    }

    setIsPublishing(true);
    const token = localStorage.getItem("sde_auth_token");

    const computedSlug =
      articleDoc.article.slug ||
      articleDoc.article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const updatedDoc = {
      ...articleDoc,
      article: {
        ...articleDoc.article,
        slug: computedSlug,
        status: "published" as const,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedDoc),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(`Publish error: ${data.error || "Failed to publish article"}`);
        setIsPublishing(false);
        return;
      }

      dispatch(setStatus("published"));
      dispatch(setSaveStatus("saved"));
      setIsPublishing(false);

      // Redirect to the newly published article page
      router.push(`/articles/${computedSlug}`);
    } catch (err) {
      console.error("Publish article error:", err);
      alert("Network error connecting to publish API.");
      setIsPublishing(false);
    }
  };

  return (
    <>
      <header
        className="flex min-h-12 shrink-0 items-center justify-between px-2 sm:px-4 py-1.5 gap-2 border-b select-none overflow-x-auto no-scrollbar"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#181818" }}
      >
        {/* Left: Home Link + Dock Toggle + Status + Templates */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Go to Root Page (Home) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-mono font-bold transition-colors hover:bg-[#252525]"
            style={{ color: "#ffffff", border: "1px solid #2a2a2a", backgroundColor: "#121212" }}
            title="Return to sde.guide Root Landing Page"
          >
            <TerminalLogo size={20} showText={false} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "#2a2a2a" }} />

          {/* Toggle Left Dock */}
          <button
            onClick={onToggleLeftDock}
            className="flex items-center gap-1 sm:gap-1.5 rounded px-2 sm:px-2.5 py-1 text-xs font-mono transition-colors hover:bg-[#252525]"
            style={{
              color: leftDockOpen ? "#ffffff" : "#888888",
              border: `1px solid ${leftDockOpen ? "#444444" : "#2a2a2a"}`,
              backgroundColor: leftDockOpen ? "#222222" : "transparent",
            }}
            title="Toggle Block Palette Dock"
          >
            <PanelLeft className="h-3.5 w-3.5" />
            <span>Blocks</span>
          </button>

          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "#2a2a2a" }} />

          {/* Status Badge Dropdown */}
          <div className="relative hidden sm:block" ref={statusRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1 text-xs font-mono font-medium transition-colors hover:bg-[#252525]"
              style={{
                backgroundColor: "#121212",
                border: "1px solid #2a2a2a",
                color: "#e8e8e8",
              }}
            >
              <Circle className="h-2 w-2" style={{ fill: status === "published" ? "#ffffff" : "#888888", color: status === "published" ? "#ffffff" : "#888888" }} />
              <span>{STATUS_LABELS[status]}</span>
              <ChevronDown className="h-3 w-3 text-[#777777]" />
            </button>

            {statusOpen && (
              <div
                className="absolute left-0 top-full mt-1.5 z-50 rounded-lg py-1 shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", minWidth: 160 }}
              >
                {(["draft", "ready", "published", "archived"] as ArticleStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      dispatch(setStatus(s));
                      setStatusOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-mono hover:bg-[#252525] transition-colors"
                    style={{ color: status === s ? "#ffffff" : "#888888" }}
                  >
                    <Circle className="h-1.5 w-1.5" style={{ fill: status === s ? "#ffffff" : "#555555", color: status === s ? "#ffffff" : "#555555" }} />
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Templates Button */}
          <button
            onClick={() => setSampleModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono transition-colors hover:bg-[#252525]"
            style={{ color: "#cccccc", border: "1px solid #2a2a2a", backgroundColor: "#121212" }}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#aaaaaa]" />
            <span>Templates</span>
          </button>

          {/* Save indicator */}
          <span className="hidden md:flex items-center gap-1 text-[11px] font-mono ml-1" style={{ color: "#777777" }}>
            {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
            {saveStatus === "saved" && <Check className="h-3 w-3 text-[#ffffff]" />}
            {saveStatus === "saved" && lastSavedAt ? `Saved` : saveStatus === "saving" ? "Saving..." : ""}
          </span>
        </div>

        {/* Right: Actions (Undo/Redo, Import, Export, SEO Widget, Preview, PUBLISH) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Undo/Redo */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => dispatch(undo())}
              disabled={past.length === 0}
              className="rounded p-1.5 transition-colors hover:bg-[#252525] disabled:opacity-20"
              style={{ color: "#aaaaaa" }}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch(redo())}
              disabled={future.length === 0}
              className="rounded p-1.5 transition-colors hover:bg-[#252525] disabled:opacity-20"
              style={{ color: "#aaaaaa" }}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "#2a2a2a" }} />

          {/* Import JSON */}
          <button
            onClick={onImport}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-mono transition-colors hover:bg-[#252525]"
            style={{ color: "#aaaaaa", border: "1px solid #2a2a2a" }}
            title="Import JSON Document"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExport}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-mono transition-colors hover:bg-[#252525]"
            style={{ color: "#aaaaaa", border: "1px solid #2a2a2a" }}
            title="Export Portable JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "#2a2a2a" }} />

          {/* SEO Widget Toggle */}
          <button
            onClick={onToggleSeoWidget}
            className="flex items-center gap-1 sm:gap-1.5 rounded px-2 sm:px-3 py-1 text-xs font-mono font-medium transition-all"
            style={{
              backgroundColor: seoWidgetOpen ? "#222222" : "transparent",
              color: seoWidgetOpen ? "#ffffff" : "#aaaaaa",
              border: `1px solid ${seoWidgetOpen ? "#555555" : "#2a2a2a"}`,
            }}
            title="Toggle SEO & AI Optimizer Widget"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEO</span>
          </button>

          {/* Preview */}
          <button
            onClick={onPreview}
            className="hidden sm:flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors hover:bg-[#e0e0e0]"
            style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#ffffff" }}
          >
            <Eye className="h-3.5 w-3.5 text-[#aaaaaa]" />
            <span>Preview</span>
          </button>

          <div className="h-4 w-px hidden sm:block" style={{ backgroundColor: "#2a2a2a" }} />

          {/* PUBLISH ARTICLE BUTTON */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-1 text-xs font-mono font-bold transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
            style={{ backgroundColor: "var(--accent-theme)", color: "#ffffff" }}
            title="Publish Article live to MongoDB & sde.guide"
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>{isPublishing ? "..." : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* Sample Articles Modal */}
      {sampleModalOpen && (
        <SampleArticlesModal onClose={() => setSampleModalOpen(false)} />
      )}
    </>
  );
}

