"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/articleStore";
import { exportArticleJSON } from "@/lib/migrations";
import { X, Download, Copy, Check } from "lucide-react";
import { useState } from "react";

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { document } = useSelector((state: RootState) => state.editor);
  const [copied, setCopied] = useState(false);

  const jsonString = exportArticleJSON(document);
  const filename = `${document.article.slug || "article"}.json`;

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-xl shadow-2xl"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #2a2a2a" }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "#e8e8e8" }}>Export JSON</h2>
            <p className="text-[11px] font-mono" style={{ color: "#555" }}>{filename}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-mono transition-colors hover:bg-[#222]"
              style={{ border: "1px solid #2a2a2a", color: copied ? "#e8e8e8" : "#999" }}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={handleDownload}
              className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: "#e8e8e8", color: "#121212" }}>
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            <button onClick={onClose} className="rounded p-1.5 hover:bg-[#222]" style={{ color: "#555" }}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="rounded-lg p-4 font-mono text-xs leading-relaxed overflow-auto"
            style={{ backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#999" }}>
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
