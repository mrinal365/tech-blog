"use client";

import { useState } from "react";
import {
  Code2,
  FileText,
  Folder,
  FolderOpen,
  FileCode,
  FileText as FileIcon,
  ChevronRight,
  Check,
  Copy,
  Sparkles,
  Layers,
} from "lucide-react";

export function LandingHeroPreview() {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [copied, setCopied] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "cloud-app/": true,
    "cloud-app/src/": true,
  });

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const sampleJson = {
    schemaVersion: "1.0.0",
    article: {
      id: "art-101",
      slug: "nextjs-mongodb-architecture",
      title: "Building Sub-10ms Next.js 16 & MongoDB Engines",
      category: "Architecture",
      blocks: [
        {
          id: "b1",
          type: "heading",
          data: { level: 2, text: "1. Connection Pooling & RSC Waterfall Elimination" },
        },
        {
          id: "b2",
          type: "callout",
          data: {
            variant: "info",
            title: "PRODUCTION POOL RULE",
            text: "Cache global MongoClient promises across serverless invocations to prevent database socket exhaustion.",
          },
        },
        {
          id: "b3",
          type: "file-tree",
          data: {
            root: "cloud-app/",
            files: [
              { path: "cloud-app/", type: "directory" },
              { path: "cloud-app/src/", type: "directory" },
              { path: "cloud-app/src/lib/db.ts", type: "file" },
              { path: "cloud-app/src/app/page.tsx", type: "file" },
              { path: "cloud-app/package.json", type: "file" },
            ],
          },
        },
      ],
    },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(sampleJson, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[#262626] bg-[#141414] overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#383838]">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#262626] gap-3">
        {/* Left Mac-style Dots + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#333333]" />
            <div className="h-3 w-3 rounded-full bg-[#333333]" />
            <div className="h-3 w-3 rounded-full bg-[#333333]" />
          </div>
          <span className="font-mono text-xs text-[#888888] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
            <span>SDE.GUIDE Engine Preview</span>
          </span>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-[#262626]">
          <button
            onClick={() => setActiveTab("visual")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all"
            style={{
              backgroundColor: activeTab === "visual" ? "#222222" : "transparent",
              color: activeTab === "visual" ? "#ffffff" : "#888888",
              border: activeTab === "visual" ? "1px solid var(--accent-theme)" : "1px solid transparent",
            }}
          >
            <FileText className="h-3.5 w-3.5" style={{ color: activeTab === "visual" ? "var(--accent-theme)" : "inherit" }} />
            <span>Interactive Article View</span>
          </button>

          <button
            onClick={() => setActiveTab("json")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all"
            style={{
              backgroundColor: activeTab === "json" ? "#222222" : "transparent",
              color: activeTab === "json" ? "#ffffff" : "#888888",
              border: activeTab === "json" ? "1px solid var(--accent-theme)" : "1px solid transparent",
            }}
          >
            <Code2 className="h-3.5 w-3.5" style={{ color: activeTab === "json" ? "var(--accent-theme)" : "inherit" }} />
            <span>SDE.GUIDE JSON Schema</span>
          </button>
        </div>
      </div>

      {/* TAB BODY CONTENT */}
      <div className="p-5 sm:p-7 min-h-[360px] text-left">
        {activeTab === "visual" ? (
          <div className="space-y-5 animate-fadeIn">
            {/* Heading Block */}
            <div className="border-b pb-3 border-[#262626]">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded px-2 py-0.5 text-[10px] font-mono border bg-[#1a1a1a]" style={{ borderColor: "var(--accent-theme)", color: "var(--accent-theme)" }}>
                  HEADING BLOCK (H2)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#ffffff]">
                1. Connection Pooling & RSC Waterfall Elimination
              </h2>
            </div>

            {/* Callout Block */}
            <div className="rounded-xl border p-4 bg-[#1a1a1a] border-[#333333] space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent-theme)" }} />
                <h4 className="text-xs font-bold font-mono text-[#ffffff] uppercase tracking-wide">
                  PRODUCTION POOL RULE
                </h4>
              </div>
              <p className="text-xs text-[#cccccc] leading-relaxed pl-4">
                Cache global MongoClient promises across serverless invocations to prevent database socket exhaustion in Next.js Server Components.
              </p>
            </div>

            {/* Interactive File Tree Block */}
            <div className="rounded-xl border p-4 bg-[#121212] border-[#262626] space-y-2">
              <div className="flex items-center justify-between border-b pb-2 border-[#262626]">
                <span className="text-xs font-mono text-[#888888] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
                  FILE TREE BLOCK (Directory Tree)
                </span>
                <span className="text-[10px] font-mono text-[#666666]">cloud-app/</span>
              </div>

              <div className="font-mono text-xs space-y-1 text-[#cccccc]">
                {/* Root Folder */}
                <div>
                  <button
                    onClick={() => toggleFolder("cloud-app/")}
                    className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#1f1f1f] text-[#ffffff] w-full text-left cursor-pointer"
                  >
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${openFolders["cloud-app/"] ? "rotate-90" : ""}`}
                    />
                    {openFolders["cloud-app/"] ? (
                      <FolderOpen className="h-4 w-4 text-[#ffd04b]" />
                    ) : (
                      <Folder className="h-4 w-4 text-[#ffd04b]" />
                    )}
                    <span className="font-bold">cloud-app</span>
                  </button>

                  {openFolders["cloud-app/"] && (
                    <div className="pl-5 space-y-1 border-l border-[#262626] ml-3 mt-1">
                      {/* Subfolder src */}
                      <div>
                        <button
                          onClick={() => toggleFolder("cloud-app/src/")}
                          className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-[#1f1f1f] text-[#ffffff] w-full text-left cursor-pointer"
                        >
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform ${openFolders["cloud-app/src/"] ? "rotate-90" : ""}`}
                          />
                          {openFolders["cloud-app/src/"] ? (
                            <FolderOpen className="h-4 w-4 text-[#ffd04b]" />
                          ) : (
                            <Folder className="h-4 w-4 text-[#ffd04b]" />
                          )}
                          <span>src</span>
                        </button>

                        {openFolders["cloud-app/src/"] && (
                          <div className="pl-5 space-y-1 border-l border-[#262626] ml-3 mt-1 text-[#aaaaaa]">
                            <div className="flex items-center gap-2 py-0.5 px-1.5">
                              <FileCode className="h-3.5 w-3.5 text-[#3178c6]" />
                              <span>db.ts</span>
                            </div>
                            <div className="flex items-center gap-2 py-0.5 px-1.5">
                              <FileCode className="h-3.5 w-3.5 text-[#007acc]" />
                              <span>page.tsx</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* File package.json */}
                      <div className="flex items-center gap-2 py-0.5 px-1.5 text-[#aaaaaa] pl-5">
                        <FileIcon className="h-3.5 w-3.5 text-[#e5a000]" />
                        <span>package.json</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* JSON Schema View */
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">100% Type-Safe SDE.GUIDE Document Format</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded px-3 py-1 text-xs font-mono bg-[#222222] text-[#ffffff] hover:bg-[#333333] transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />}
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0f0f0f] border border-[#262626] font-mono text-xs text-[#e8e8e8] overflow-x-auto max-h-[300px] leading-relaxed">
              {JSON.stringify(sampleJson, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* FOOTER CAPTION */}
      <div className="px-5 py-2.5 bg-[#171717] border-t border-[#262626] text-center font-mono text-[11px] text-[#777777]">
        Every article rendered on <strong>sde.guide</strong> maps 1-to-1 to clean, machine-readable JSON blocks.
      </div>
    </div>
  );
}
