"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { updateBlockData } from "@/store/articleStore";
import type { BaseBlock } from "@/types/article";
import { blockRegistry } from "@/registry/blockRegistry";
import { ChipTagInput } from "@/components/common/ChipTagInput";
import { PortalTooltip } from "@/components/common/PortalTooltip";

function FieldInfoTooltip({
  title,
  explanation,
  example,
}: {
  title: string;
  explanation: string;
  example: string;
}) {
  return <PortalTooltip title={title} explanation={explanation} example={example} />;
}

interface BlockEditorProps {
  block: BaseBlock;
}

export function BlockEditor({ block }: BlockEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const entry = blockRegistry[block.type];

  const update = (data: Record<string, unknown>) => {
    dispatch(updateBlockData({ blockId: block.id, data }));
  };

  const d = block.data;

  const renderTypeHeader = (type: string, title: string, explanation: string, example: string) => {
    return (
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">
          {entry?.label || type}
        </span>
        <FieldInfoTooltip title={title} explanation={explanation} example={example} />
      </div>
    );
  };

  switch (block.type) {
    // HEADING
    case "heading": {
      const level = (d.level as number) || 2;
      const text = (d.text as string) || "";
      const fontSize = level === 2 ? "text-2xl" : level === 3 ? "text-xl" : "text-lg";
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            {renderTypeHeader(
              "heading",
              "Heading Block",
              "Organizes article content into structured sections (H2, H3, H4). Essential for generating Table of Contents and SEO semantic hierarchy.",
              "H2: Database Connection Pool Architecture"
            )}
            <div className="flex gap-1">
              {[2, 3, 4].map((l) => (
                <button
                  key={l}
                  onClick={() => update({ level: l })}
                  className="rounded px-2 py-0.5 text-[10px] font-mono transition-colors border border-[#2a2a2a]"
                  style={{
                    backgroundColor: level === l ? "#333333" : "transparent",
                    color: level === l ? "#ffffff" : "#777777",
                  }}
                >
                  H{l}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Section heading..."
            className={`w-full bg-transparent ${fontSize} font-bold outline-none placeholder:text-[#333333]`}
            style={{ color: "#e8e8e8" }}
          />
        </div>
      );
    }

    // PARAGRAPH
    case "paragraph":
    case "rich-text": {
      const text = (d.text as string) || "";
      return (
        <div>
          {renderTypeHeader(
            "paragraph",
            "Paragraph Block",
            "Main body copy block for technical explanations, system walkthroughs, and detailed architectural notes.",
            "We benchmarked MongoClient connection pool sizes under 10,000 concurrent web socket requests..."
          )}
          <textarea
            value={text}
            onChange={(e) => update({ text: e.target.value })}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            placeholder="Write paragraph content..."
            rows={4}
            className="w-full min-h-[140px] resize-y bg-transparent text-sm leading-relaxed outline-none placeholder:text-[#333333]"
            style={{ color: "#e8e8e8", lineHeight: 1.6 }}
          />
        </div>
      );
    }

    // BULLET LIST
    case "bullet-list": {
      const items = (d.items as string[]) || [""];
      return (
        <div>
          {renderTypeHeader(
            "bullet-list",
            "Bullet List Block",
            "Unordered bullet list ideal for non-sequential highlights, core features, or technical prerequisites.",
            "• Sub-10ms response latency\n• Horizontal scaling with stateless nodes"
          )}
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#666" }} />
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const n = [...items];
                  n[i] = e.target.value;
                  update({ items: n });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = [...items];
                    n.splice(i + 1, 0, "");
                    update({ items: n });
                  }
                  if (e.key === "Backspace" && item === "" && items.length > 1) {
                    update({ items: items.filter((_, idx) => idx !== i) });
                  }
                }}
                placeholder="List item..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#333333]"
                style={{ color: "#ccc" }}
              />
            </div>
          ))}
          <button
            onClick={() => update({ items: [...items, ""] })}
            className="mt-1 text-[11px] font-mono hover:text-[#e8e8e8] transition-colors"
            style={{ color: "#555" }}
          >
            + Add item
          </button>
        </div>
      );
    }

    // NUMBERED LIST
    case "numbered-list": {
      const items = (d.items as string[]) || [""];
      return (
        <div>
          {renderTypeHeader(
            "numbered-list",
            "Numbered List Block",
            "Sequential ordered list for numbered steps, prioritized criteria, or execution workflow steps.",
            "1. Initialize Next.js app\n2. Configure Prisma ORM client"
          )}
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="mt-0.5 shrink-0 text-xs font-mono text-[#666666]" style={{ minWidth: 20 }}>
                {i + 1}.
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const n = [...items];
                  n[i] = e.target.value;
                  update({ items: n });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = [...items];
                    n.splice(i + 1, 0, "");
                    update({ items: n });
                  }
                  if (e.key === "Backspace" && item === "" && items.length > 1) {
                    update({ items: items.filter((_, idx) => idx !== i) });
                  }
                }}
                placeholder="List item..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#333333]"
                style={{ color: "#ccc" }}
              />
            </div>
          ))}
          <button
            onClick={() => update({ items: [...items, ""] })}
            className="mt-1 text-[11px] font-mono hover:text-[#e8e8e8] transition-colors"
            style={{ color: "#555" }}
          >
            + Add item
          </button>
        </div>
      );
    }

    // CALLOUT
    case "callout": {
      const variant = (d.variant as string) || "info";
      const title = (d.title as string) || "";
      const text = (d.text as string) || "";
      return (
        <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", borderLeft: "2px solid #555" }}>
          <div className="flex items-center justify-between mb-2">
            {renderTypeHeader(
              "callout",
              "Callout Box",
              "Eye-catching container (Info, Tip, Warning, Danger, Note) to emphasize crucial caveats, security alerts, or pro tips.",
              "Warning: Never commit raw API secret keys to client bundle."
            )}
            <div className="flex gap-1">
              {["info", "tip", "warning", "danger", "note"].map((v) => (
                <button
                  key={v}
                  onClick={() => update({ variant: v })}
                  className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase transition-colors"
                  style={{
                    backgroundColor: variant === v ? "#333" : "transparent",
                    color: variant === v ? "#e8e8e8" : "#555",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Title (optional)..."
            className="mb-1.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#333333]"
            style={{ color: "#e8e8e8" }}
          />
          <textarea
            value={text}
            onChange={(e) => update({ text: e.target.value })}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            placeholder="Callout content..."
            rows={3}
            className="w-full min-h-[90px] resize-y bg-transparent text-sm outline-none placeholder:text-[#333333]"
            style={{ color: "#cccccc", lineHeight: 1.5 }}
          />
        </div>
      );
    }

    // CODE BLOCK
    case "code": {
      const language = (d.language as string) || "typescript";
      const filename = (d.filename as string) || "";
      const code = (d.code as string) || "";
      const showLineNumbers = d.showLineNumbers !== false;
      return (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: "#161616", borderBottom: "1px solid #2a2a2a" }}>
            <div className="flex items-center gap-2">
              {renderTypeHeader(
                "code",
                "Code Block",
                "Syntax-highlighted code editor supporting 15+ languages, line numbers, filenames, and copy-to-clipboard functionality.",
                "export async function GET(req: Request) { return Response.json({ ok: true }); }"
              )}
              <select
                value={language}
                onChange={(e) => update({ language: e.target.value })}
                className="rounded bg-transparent text-[11px] font-mono outline-none"
                style={{ color: "#999" }}
              >
                {["typescript", "javascript", "tsx", "jsx", "python", "java", "go", "rust", "bash", "sql", "json", "yaml", "html", "css", "dockerfile", "graphql", "plaintext"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <input
                type="text"
                value={filename}
                onChange={(e) => update({ filename: e.target.value })}
                placeholder="filename (e.g. server.ts)"
                className="bg-transparent text-[11px] font-mono outline-none placeholder:text-[#333333]"
                style={{ color: "#999" }}
              />
            </div>
            <label className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "#555" }}>
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => update({ showLineNumbers: e.target.checked })}
                className="accent-[#666]"
              />
              Lines
            </label>
          </div>
          <textarea
            value={code}
            onChange={(e) => update({ code: e.target.value })}
            placeholder="// Write code snippet here..."
            rows={10}
            spellCheck={false}
            className="w-full min-h-[220px] resize-y p-3 font-mono text-xs leading-relaxed outline-none"
            style={{ backgroundColor: "#161616", color: "#e8e8e8" }}
          />
        </div>
      );
    }

    // TERMINAL
    case "terminal": {
      const lines = (d.lines as Array<{ type: string; text: string }>) || [{ type: "command", text: "" }];
      const title = (d.title as string) || "Terminal";
      return (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: "#161616", borderBottom: "1px solid #2a2a2a" }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#555" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#444" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#333" }} />
              </div>
              {renderTypeHeader(
                "terminal",
                "Terminal Session Block",
                "Simulates CLI commands ($), terminal outputs (→), and shell comments (#) in an authentic dark terminal interface.",
                "$ npm run build\n→ Compiled successfully in 1.4s"
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => update({ title: e.target.value })}
              className="bg-transparent text-[11px] font-mono outline-none text-right"
              style={{ color: "#666" }}
            />
          </div>
          <div className="p-3 space-y-1" style={{ backgroundColor: "#161616" }}>
            {lines.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <select
                  value={line.type}
                  onChange={(e) => {
                    const n = [...lines];
                    n[i] = { ...n[i], type: e.target.value };
                    update({ lines: n });
                  }}
                  className="shrink-0 bg-transparent text-[10px] font-mono outline-none"
                  style={{ color: line.type === "command" ? "#e8e8e8" : "#555" }}
                >
                  <option value="command">$</option>
                  <option value="output">→</option>
                  <option value="comment">#</option>
                </select>
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => {
                    const n = [...lines];
                    n[i] = { ...n[i], text: e.target.value };
                    update({ lines: n });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const n = [...lines];
                      n.splice(i + 1, 0, { type: "command", text: "" });
                      update({ lines: n });
                    }
                  }}
                  placeholder={line.type === "command" ? "command..." : "output..."}
                  className="w-full bg-transparent font-mono text-xs outline-none placeholder:text-[#333333]"
                  style={{ color: line.type === "command" ? "#e8e8e8" : "#666" }}
                  spellCheck={false}
                />
              </div>
            ))}
            <button
              onClick={() => update({ lines: [...lines, { type: "command", text: "" }] })}
              className="mt-1 text-[11px] font-mono hover:text-[#e8e8e8] transition-colors"
              style={{ color: "#555" }}
            >
              + Add line
            </button>
          </div>
        </div>
      );
    }

    // FILE TREE
    case "file-tree": {
      const root = (d.root as string) || (d.title as string) || "";
      const rawFiles = Array.isArray(d.files)
        ? (d.files as Array<{ path?: string; type?: string } | string>)
        : Array.isArray(d.paths)
        ? (d.paths as Array<{ path?: string; type?: string } | string>)
        : [];

      const filePathsText = rawFiles
        .map((f) => (typeof f === "string" ? f : f.path || ""))
        .filter(Boolean)
        .join("\n");

      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "file-tree",
            "File Tree Block",
            "Visual collapsible file and directory tree structure. Enter path list (1 per line).",
            "my-app/\nmy-app/src/index.js\nmy-app/package.json"
          )}
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
              Root Folder Title (optional)
            </label>
            <input
              type="text"
              value={root}
              onChange={(e) => update({ ...d, root: e.target.value })}
              placeholder="e.g. my-app/ or Project Structure"
              className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff] font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
              File Paths (1 path per line, end directories with /)
            </label>
            <textarea
              value={filePathsText}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                const newFiles = lines
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((p) => ({
                    path: p,
                    type: p.endsWith("/") ? "directory" : "file",
                  }));
                update({ ...d, files: newFiles });
              }}
              rows={8}
              spellCheck={false}
              placeholder={"cloud-application/\ncloud-application/app/\ncloud-application/infrastructure/\ncloud-application/infrastructure/vpc/\ncloud-application/infrastructure/compute/\ncloud-application/infrastructure/database/\ncloud-application/infrastructure/storage/"}
              className="w-full rounded p-3 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#cccccc] leading-relaxed"
            />
          </div>
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-[#777777] uppercase font-mono self-center">Presets:</span>
            <button
              type="button"
              onClick={() => {
                const cloudApp = [
                  { path: "cloud-application/", type: "directory" },
                  { path: "cloud-application/app/", type: "directory" },
                  { path: "cloud-application/infrastructure/", type: "directory" },
                  { path: "cloud-application/infrastructure/vpc/", type: "directory" },
                  { path: "cloud-application/infrastructure/compute/", type: "directory" },
                  { path: "cloud-application/infrastructure/database/", type: "directory" },
                  { path: "cloud-application/infrastructure/storage/", type: "directory" },
                ];
                update({ ...d, root: "Cloud Architecture", files: cloudApp });
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-[#cccccc] hover:text-[#ffffff] border border-[#2a2a2a]"
            >
              Cloud Infrastructure
            </button>
            <button
              type="button"
              onClick={() => {
                const nextApp = [
                  { path: "my-app/", type: "directory" },
                  { path: "my-app/src/", type: "directory" },
                  { path: "my-app/src/app/", type: "directory" },
                  { path: "my-app/src/app/page.tsx", type: "file" },
                  { path: "my-app/src/components/", type: "directory" },
                  { path: "my-app/package.json", type: "file" },
                  { path: "my-app/tsconfig.json", type: "file" },
                ];
                update({ ...d, root: "Next.js App", files: nextApp });
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-[#cccccc] hover:text-[#ffffff] border border-[#2a2a2a]"
            >
              Next.js App
            </button>
          </div>
        </div>
      );
    }

    // INLINE CODE
    case "inline-code": {
      const code = (d.code as string) || "";
      const description = (d.description as string) || "";
      return (
        <div className="space-y-2">
          {renderTypeHeader(
            "inline-code",
            "Inline Code Expression",
            "Single code expression or variable badge with optional context description.",
            "const count = useCount();"
          )}
          <input
            type="text"
            value={code}
            onChange={(e) => update({ ...d, code: e.target.value })}
            placeholder="Code expression (e.g. process.env.DATABASE_URL)..."
            className="w-full rounded px-3 py-2 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#a3e635]"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => update({ ...d, description: e.target.value })}
            placeholder="Description note (optional)..."
            className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]"
          />
        </div>
      );
    }

    // CONFIG BLOCK
    case "config": {
      const filename = (d.filename as string) || "";
      const content = (d.content as string) || (d.code as string) || "";
      const language = (d.language as string) || "json";
      return (
        <div className="space-y-2">
          {renderTypeHeader(
            "config",
            "Configuration File",
            "Configuration file container for ENV, YAML, JSON, or TOML files.",
            "filename: .env.local"
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={filename}
              onChange={(e) => update({ ...d, filename: e.target.value })}
              placeholder="Filename (e.g. .env.local)"
              className="flex-1 rounded px-3 py-1.5 font-mono text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
            />
            <select
              value={language}
              onChange={(e) => update({ ...d, language: e.target.value })}
              className="rounded px-3 py-1.5 font-mono text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]"
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="env">ENV</option>
              <option value="toml">TOML</option>
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => update({ ...d, content: e.target.value })}
            rows={5}
            spellCheck={false}
            placeholder={"# Config content..."}
            className="w-full rounded p-3 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#cccccc]"
          />
        </div>
      );
    }

    // PLAYGROUND
    case "playground": {
      const code = (d.code as string) || "";
      const output = (d.output as string) || "";
      return (
        <div className="space-y-2">
          {renderTypeHeader(
            "playground",
            "Interactive Playground",
            "Code snippet container with live output simulation.",
            "console.log('Hello World');"
          )}
          <textarea
            value={code}
            onChange={(e) => update({ ...d, code: e.target.value })}
            rows={4}
            spellCheck={false}
            placeholder="// Write runnable code..."
            className="w-full rounded p-3 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#ffffff]"
          />
          <textarea
            value={output}
            onChange={(e) => update({ ...d, output: e.target.value })}
            rows={2}
            spellCheck={false}
            placeholder="Execution output preview..."
            className="w-full rounded p-3 font-mono text-xs outline-none bg-[#0e0e0e] border border-[#2a2a2a] text-[#a3e635]"
          />
        </div>
      );
    }

    // API REQUEST
    case "api-request": {
      const method = (d.method as string) || "GET";
      const url = (d.url as string) || "";
      const responseStatus = (d.responseStatus as number) || 200;
      const response = (d.response as string) || "";
      return (
        <div className="space-y-2">
          {renderTypeHeader(
            "api-request",
            "API Endpoint Block",
            "HTTP request endpoint with method, URL, and response preview.",
            "GET /api/v1/articles"
          )}
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => update({ ...d, method: e.target.value })}
              className="rounded px-3 py-1.5 font-mono text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#a3e635]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => update({ ...d, url: e.target.value })}
              placeholder="/api/v1/users"
              className="flex-1 rounded px-3 py-1.5 font-mono text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
            />
            <input
              type="number"
              value={responseStatus}
              onChange={(e) => update({ ...d, responseStatus: Number(e.target.value) })}
              placeholder="200"
              className="w-20 rounded px-3 py-1.5 font-mono text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]"
            />
          </div>
          <textarea
            value={response}
            onChange={(e) => update({ ...d, response: e.target.value })}
            rows={4}
            spellCheck={false}
            placeholder='Response body JSON e.g. { "ok": true }'
            className="w-full rounded p-3 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#cccccc]"
          />
        </div>
      );
    }

    // HTTP FLOW
    case "http": {
      const steps = (d.steps as Array<{ from: string; to: string; method: string; path: string; statusCode: number }>) || [];
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "http",
            "HTTP Flow Sequence",
            "Client to server HTTP request and response step visualization.",
            "Client → POST /api/login → 200 OK"
          )}
          {steps.map((st, i) => (
            <div key={i} className="p-3 rounded bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={st.from}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], from: e.target.value };
                    update({ ...d, steps: n });
                  }}
                  placeholder="From (e.g. Client)"
                  className="rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
                />
                <input
                  type="text"
                  value={st.to}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], to: e.target.value };
                    update({ ...d, steps: n });
                  }}
                  placeholder="To (e.g. Auth Service)"
                  className="rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={st.method}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], method: e.target.value };
                    update({ ...d, steps: n });
                  }}
                  placeholder="Method (POST)"
                  className="w-20 rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#a3e635]"
                />
                <input
                  type="text"
                  value={st.path}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], path: e.target.value };
                    update({ ...d, steps: n });
                  }}
                  placeholder="Path (/login)"
                  className="flex-1 rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
                />
                <input
                  type="number"
                  value={st.statusCode}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], statusCode: Number(e.target.value) };
                    update({ ...d, steps: n });
                  }}
                  placeholder="Status (200)"
                  className="w-20 rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#aaaaaa]"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => update({ ...d, steps: [...steps, { from: "Client", to: "Server", method: "GET", path: "/", statusCode: 200 }] })}
            className="text-[11px] font-mono text-[#888888] hover:text-[#ffffff]"
          >
            + Add Flow Step
          </button>
        </div>
      );
    }

    // ARCHITECTURE
    case "architecture": {
      const title = (d.title as string) || "";
      const nodes = (d.nodes as Array<{ id: string; label: string; type?: string }>) || [];
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "architecture",
            "System Architecture Diagram",
            "System service node breakdown container.",
            "Title: Microservices Infrastructure"
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => update({ ...d, title: e.target.value })}
            placeholder="Architecture Diagram Title..."
            className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
          />
          <div className="space-y-2">
            {nodes.map((nd, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={nd.label}
                  onChange={(e) => {
                    const n = [...nodes];
                    n[i] = { ...n[i], label: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, "-") };
                    update({ ...d, nodes: n });
                  }}
                  placeholder="Service Name (e.g. API Gateway)"
                  className="flex-1 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#ffffff]"
                />
                <input
                  type="text"
                  value={nd.type || ""}
                  onChange={(e) => {
                    const n = [...nodes];
                    n[i] = { ...n[i], type: e.target.value };
                    update({ ...d, nodes: n });
                  }}
                  placeholder="Type (e.g. Gateway)"
                  className="w-32 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#888888]"
                />
              </div>
            ))}
            <button
              onClick={() => update({ ...d, nodes: [...nodes, { id: `node-${Date.now()}`, label: "New Service", type: "Microservice" }] })}
              className="text-[11px] font-mono text-[#888888] hover:text-[#ffffff]"
            >
              + Add Node
            </button>
          </div>
        </div>
      );
    }

    // FLOW
    case "flow": {
      const steps = (d.steps as Array<{ title: string; description?: string }>) || [];
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "flow",
            "Process Flowchart Steps",
            "Step-by-step flowchart process sequence.",
            "Step 1: Validate Payload"
          )}
          {steps.map((st, i) => (
            <div key={i} className="p-3 rounded bg-[#1a1a1a] border border-[#2a2a2a] space-y-1.5">
              <input
                type="text"
                value={st.title}
                onChange={(e) => {
                  const n = [...steps];
                  n[i] = { ...n[i], title: e.target.value };
                  update({ ...d, steps: n });
                }}
                placeholder="Step Title..."
                className="w-full rounded px-2.5 py-1 text-xs font-bold bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
              />
              <input
                type="text"
                value={st.description || ""}
                onChange={(e) => {
                  const n = [...steps];
                  n[i] = { ...n[i], description: e.target.value };
                  update({ ...d, steps: n });
                }}
                placeholder="Description (optional)..."
                className="w-full rounded px-2.5 py-1 text-xs bg-[#121212] border border-[#2a2a2a] text-[#888888]"
              />
            </div>
          ))}
          <button
            onClick={() => update({ ...d, steps: [...steps, { title: "New Step", description: "" }] })}
            className="text-[11px] font-mono text-[#888888] hover:text-[#ffffff]"
          >
            + Add Flow Step
          </button>
        </div>
      );
    }

    // SEQUENCE
    case "sequence": {
      const actors = (d.actors as string[]) || ["Client", "Server"];
      const messages = (d.messages as Array<{ from: string; to: string; label: string }>) || [];
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "sequence",
            "Sequence Diagram",
            "Actor timeline and message exchange diagram.",
            "Actors: Client, Server"
          )}
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
              Actors (comma-separated)
            </label>
            <input
              type="text"
              value={actors.join(", ")}
              onChange={(e) => update({ ...d, actors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              placeholder="Client, API Gateway, DB"
              className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
            />
          </div>
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={msg.from}
                  onChange={(e) => {
                    const n = [...messages];
                    n[i] = { ...n[i], from: e.target.value };
                    update({ ...d, messages: n });
                  }}
                  placeholder="From"
                  className="w-24 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#a3e635]"
                />
                <input
                  type="text"
                  value={msg.to}
                  onChange={(e) => {
                    const n = [...messages];
                    n[i] = { ...n[i], to: e.target.value };
                    update({ ...d, messages: n });
                  }}
                  placeholder="To"
                  className="w-24 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#a3e635]"
                />
                <input
                  type="text"
                  value={msg.label}
                  onChange={(e) => {
                    const n = [...messages];
                    n[i] = { ...n[i], label: e.target.value };
                    update({ ...d, messages: n });
                  }}
                  placeholder="Message Label"
                  className="flex-1 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#ffffff]"
                />
              </div>
            ))}
            <button
              onClick={() => update({ ...d, messages: [...messages, { from: actors[0] || "Client", to: actors[1] || "Server", label: "Request" }] })}
              className="text-[11px] font-mono text-[#888888] hover:text-[#ffffff]"
            >
              + Add Message
            </button>
          </div>
        </div>
      );
    }

    // DATABASE SCHEMA
    case "database-schema": {
      const tables = (d.tables as Array<{ name: string; columns: Array<{ name: string; type: string; primaryKey?: boolean }> }>) || [];
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "database-schema",
            "Database Schema Tables",
            "Visual ER table schema editor with columns and primary keys.",
            "Table: users"
          )}
          {tables.map((tb, i) => (
            <div key={i} className="p-3 rounded bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
              <input
                type="text"
                value={tb.name}
                onChange={(e) => {
                  const n = [...tables];
                  n[i] = { ...n[i], name: e.target.value };
                  update({ ...d, tables: n });
                }}
                placeholder="Table Name (e.g. users)"
                className="w-full rounded px-2.5 py-1 text-xs font-bold bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
              />
              <div className="space-y-1">
                {(tb.columns || []).map((col, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={col.name}
                      onChange={(e) => {
                        const n = [...tables];
                        const cols = [...(n[i].columns || [])];
                        cols[cIdx] = { ...cols[cIdx], name: e.target.value };
                        n[i] = { ...n[i], columns: cols };
                        update({ ...d, tables: n });
                      }}
                      placeholder="Column Name"
                      className="flex-1 rounded px-2 py-0.5 text-xs bg-[#121212] border border-[#2a2a2a] text-[#ffffff]"
                    />
                    <input
                      type="text"
                      value={col.type}
                      onChange={(e) => {
                        const n = [...tables];
                        const cols = [...(n[i].columns || [])];
                        cols[cIdx] = { ...cols[cIdx], type: e.target.value };
                        n[i] = { ...n[i], columns: cols };
                        update({ ...d, tables: n });
                      }}
                      placeholder="Type (uuid, varchar)"
                      className="w-28 rounded px-2 py-0.5 text-xs bg-[#121212] border border-[#2a2a2a] text-[#888888]"
                    />
                    <label className="flex items-center gap-1 text-[10px] text-[#a3e635]">
                      <input
                        type="checkbox"
                        checked={!!col.primaryKey}
                        onChange={(e) => {
                          const n = [...tables];
                          const cols = [...(n[i].columns || [])];
                          cols[cIdx] = { ...cols[cIdx], primaryKey: e.target.checked };
                          n[i] = { ...n[i], columns: cols };
                          update({ ...d, tables: n });
                        }}
                      />
                      PK
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const n = [...tables];
                    const cols = [...(n[i].columns || []), { name: "new_col", type: "varchar" }];
                    n[i] = { ...n[i], columns: cols };
                    update({ ...d, tables: n });
                  }}
                  className="text-[10px] font-mono text-[#777777] hover:text-[#ffffff]"
                >
                  + Add Column
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => update({ ...d, tables: [...tables, { name: "new_table", columns: [{ name: "id", type: "uuid", primaryKey: true }] }] })}
            className="text-[11px] font-mono text-[#888888] hover:text-[#ffffff]"
          >
            + Add Table
          </button>
        </div>
      );
    }

    // JSON VIEWER
    case "json-viewer": {
      const title = (d.title as string) || "";
      const rawJson = typeof d.json === "string" ? d.json : JSON.stringify(d.json || {}, null, 2);
      return (
        <div className="space-y-2">
          {renderTypeHeader(
            "json-viewer",
            "JSON Viewer Block",
            "Collapsible syntax-highlighted JSON viewer.",
            "title: API Payload"
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => update({ ...d, title: e.target.value })}
            placeholder="Payload Title (e.g. User Profile Response)"
            className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
          />
          <textarea
            value={rawJson}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                update({ ...d, json: parsed });
              } catch {
                update({ ...d, json: e.target.value });
              }
            }}
            rows={6}
            spellCheck={false}
            placeholder='{ "key": "value" }'
            className="w-full rounded p-3 font-mono text-xs outline-none bg-[#161616] border border-[#2a2a2a] text-[#a3e635]"
          />
        </div>
      );
    }

    // IMAGE
    case "image": {
      const src = (d.src as string) || "";
      const alt = (d.alt as string) || "";
      const caption = (d.caption as string) || "";
      return (
        <div>
          {renderTypeHeader(
            "image",
            "Image & SEO Alt Block",
            "Renders article diagrams, screenshots, or infographics with alt text required for screen readers and Google Image search index.",
            "Src: https://cdn.example.com/architecture.png\nAlt: Microservices Architecture Diagram"
          )}
          <div className="space-y-2">
            <input
              type="text"
              value={src}
              onChange={(e) => update({ src: e.target.value })}
              placeholder="Image URL (e.g. https://images.unsplash.com/...)"
              className="w-full rounded px-3 py-1.5 text-xs outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
            />
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={alt}
                onChange={(e) => update({ alt: e.target.value })}
                placeholder="Alt text (required for Google Image SEO)..."
                className="w-full rounded px-3 py-1.5 text-xs outline-none"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
              />
              <FieldInfoTooltip
                title="Alt Text (SEO)"
                explanation="Describes image content for accessibility and Google Image search ranking."
                example="Next.js 16 Server Components Architecture Flowchart"
              />
            </div>
            <input
              type="text"
              value={caption}
              onChange={(e) => update({ caption: e.target.value })}
              placeholder="Caption (optional)..."
              className="w-full rounded px-3 py-1.5 text-xs outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#999" }}
            />
            {src && (
              <div className="mt-2 rounded overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
                <img src={src} alt={alt} className="max-h-60 w-full object-contain" style={{ backgroundColor: "#161616" }} />
              </div>
            )}
          </div>
        </div>
      );
    }

    // COMPARISON TABLE
    case "comparison": {
      const headers = (d.headers as string[]) || ["Feature", "Option A", "Option B"];
      const rawRows = (d.rows as unknown) || [];
      const rows: string[][] = Array.isArray(rawRows)
        ? rawRows.map((r: unknown) =>
            Array.isArray(r)
              ? (r as string[])
              : r && typeof r === "object" && "cells" in r && Array.isArray((r as { cells: string[] }).cells)
              ? (r as { cells: string[] }).cells
              : []
          )
        : [];

      return (
        <div>
          {renderTypeHeader(
            "comparison",
            "Comparison Table",
            "Multi-column feature comparison grid contrasting frameworks, tools, specs, or architectural tradeoffs side-by-side.",
            "Headers: Feature | Redis | Memcached\nRow 1: Persistence | Yes (AOF) | No"
          )}
          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #2a2a2a" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "#1a1a1a" }}>
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-mono font-medium" style={{ borderBottom: "1px solid #2a2a2a", color: "#999" }}>
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const n = [...headers];
                          n[i] = e.target.value;
                          update({ headers: n });
                        }}
                        className="w-full bg-transparent outline-none"
                        style={{ color: "#999" }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-1.5" style={{ borderBottom: "1px solid #2a2a2a" }}>
                        <input
                          type="text"
                          value={cell || ""}
                          onChange={(e) => {
                            const nextRows = rows.map((r) => [...r]);
                            if (!nextRows[ri]) nextRows[ri] = [];
                            nextRows[ri][ci] = e.target.value;
                            update({ rows: nextRows });
                          }}
                          className="w-full bg-transparent text-xs outline-none"
                          style={{ color: "#e8e8e8" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => update({ rows: [...rows, headers.map(() => "")] })}
              className="text-[11px] font-mono hover:text-[#e8e8e8]"
              style={{ color: "#555" }}
            >
              + Row
            </button>
            <button
              onClick={() => {
                update({
                  headers: [...headers, "Column"],
                  rows: rows.map((r) => [...r, ""]),
                });
              }}
              className="text-[11px] font-mono hover:text-[#e8e8e8]"
              style={{ color: "#555" }}
            >
              + Column
            </button>
          </div>
        </div>
      );
    }

    // PROS & CONS
    case "pros-cons": {
      const pros = (d.pros as string[]) || [""];
      const cons = (d.cons as string[]) || [""];
      return (
        <div>
          {renderTypeHeader(
            "pros-cons",
            "Pros & Cons Block",
            "Side-by-side evaluation cards comparing advantages (✓) vs disadvantages (✗) of a technology stack or design decision.",
            "Pros: 10x throughput boost | Cons: Higher memory footprint"
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", borderLeft: "2px solid #666" }}>
              <p className="mb-2 text-[10px] font-mono uppercase text-[#999999]">✓ Pros</p>
              {pros.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const n = [...pros];
                    n[i] = e.target.value;
                    update({ pros: n });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") update({ pros: [...pros, ""] });
                  }}
                  placeholder="Advantage..."
                  className="mb-1 w-full bg-transparent text-xs outline-none placeholder:text-[#333333]"
                  style={{ color: "#ccc" }}
                />
              ))}
              <button onClick={() => update({ pros: [...pros, ""] })} className="text-[10px] font-mono" style={{ color: "#555" }}>
                + Add
              </button>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", borderLeft: "2px solid #444" }}>
              <p className="mb-2 text-[10px] font-mono uppercase text-[#999999]">✗ Cons</p>
              {cons.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const n = [...cons];
                    n[i] = e.target.value;
                    update({ cons: n });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") update({ cons: [...cons, ""] });
                  }}
                  placeholder="Disadvantage..."
                  className="mb-1 w-full bg-transparent text-xs outline-none placeholder:text-[#333333]"
                  style={{ color: "#ccc" }}
                />
              ))}
              <button onClick={() => update({ cons: [...cons, ""] })} className="text-[10px] font-mono" style={{ color: "#555" }}>
                + Add
              </button>
            </div>
          </div>
        </div>
      );
    }

    // KEY TAKEAWAYS
    case "takeaways": {
      const items = (d.items as string[]) || [""];
      return (
        <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          {renderTypeHeader(
            "takeaways",
            "Key Takeaways Block",
            "Numbered executive summary card highlighting key technical takeaways for quick reader retention and executive TL;DRs.",
            "01. Redis caching reduced p99 query latency from 120ms to 8ms."
          )}
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="mt-0.5 shrink-0 text-xs font-mono text-[#666666]" style={{ minWidth: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const n = [...items];
                  n[i] = e.target.value;
                  update({ items: n });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") update({ items: [...items, ""] });
                }}
                placeholder="Takeaway..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-[#333333]"
                style={{ color: "#ccc" }}
              />
            </div>
          ))}
          <button onClick={() => update({ items: [...items, ""] })} className="mt-1 text-[10px] font-mono" style={{ color: "#555" }}>
            + Add Takeaway
          </button>
        </div>
      );
    }

    // DEFINITION
    case "definition": {
      const term = (d.term as string) || "";
      const definition = (d.definition as string) || "";
      const example = (d.example as string) || "";
      return (
        <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          {renderTypeHeader(
            "definition",
            "Technical Definition Card",
            "Structured glossary definition card presenting specialized jargon, formal definition, and optional usage example.",
            "Term: RAG (Retrieval-Augmented Generation)\nDef: Pattern combining LLM prompts with vector search context."
          )}
          <input
            type="text"
            value={term}
            onChange={(e) => update({ term: e.target.value })}
            placeholder="Term (e.g. Vector Index)..."
            className="mb-2 w-full bg-transparent text-base font-bold outline-none placeholder:text-[#333333]"
            style={{ color: "#e8e8e8" }}
          />
          <textarea
            value={definition}
            onChange={(e) => update({ definition: e.target.value })}
            placeholder="Definition text..."
            rows={2}
            className="mb-2 w-full resize-none bg-transparent text-sm outline-none placeholder:text-[#333333]"
            style={{ color: "#999" }}
          />
          <input
            type="text"
            value={example}
            onChange={(e) => update({ example: e.target.value })}
            placeholder="Example usage (optional)..."
            className="w-full bg-transparent text-xs font-mono outline-none placeholder:text-[#333333]"
            style={{ color: "#555" }}
          />
        </div>
      );
    }

    // STEPS
    case "steps": {
      const steps = (d.steps as Array<{ title: string; description: string; code?: string }>) || [{ title: "", description: "" }];
      return (
        <div>
          {renderTypeHeader(
            "steps",
            "Step-by-Step Guide",
            "Structured multi-step walkthrough container for installation guides, deployment pipelines, and setup tutorials.",
            "Step 1: Configure Environment Variables\nStep 2: Run Database Migration"
          )}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono"
                    style={{ backgroundColor: "#333", color: "#e8e8e8" }}
                  >
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const n = [...steps];
                      n[i] = { ...n[i], title: e.target.value };
                      update({ steps: n });
                    }}
                    placeholder="Step title..."
                    className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#333333]"
                    style={{ color: "#e8e8e8" }}
                  />
                </div>
                <textarea
                  value={step.description}
                  onChange={(e) => {
                    const n = [...steps];
                    n[i] = { ...n[i], description: e.target.value };
                    update({ steps: n });
                  }}
                  placeholder="Description..."
                  rows={2}
                  className="w-full resize-none bg-transparent text-xs outline-none placeholder:text-[#333333]"
                  style={{ color: "#999" }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => update({ steps: [...steps, { title: "", description: "" }] })}
            className="mt-2 text-[11px] font-mono hover:text-[#e8e8e8]"
            style={{ color: "#555" }}
          >
            + Add step
          </button>
        </div>
      );
    }

    // BEFORE / AFTER
    case "before-after": {
      const before = (d.before as { code: string }) || { code: "" };
      const after = (d.after as { code: string }) || { code: "" };
      return (
        <div>
          {renderTypeHeader(
            "before-after",
            "Before & After Code Comparison",
            "Side-by-side code blocks showing code before refactoring versus optimized code after architectural improvements.",
            "Before: 120 lines procedural callbacks\nAfter: 15 lines async/await pipeline"
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
              <div className="px-3 py-1" style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
                <span className="text-[10px] font-mono" style={{ color: "#999" }}>BEFORE</span>
              </div>
              <textarea
                value={before.code}
                onChange={(e) => update({ before: { ...before, code: e.target.value } })}
                placeholder="// Before refactoring..."
                rows={5}
                spellCheck={false}
                className="w-full resize-y p-3 font-mono text-xs outline-none"
                style={{ backgroundColor: "#161616", color: "#ccc" }}
              />
            </div>
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
              <div className="px-3 py-1" style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
                <span className="text-[10px] font-mono" style={{ color: "#999" }}>AFTER</span>
              </div>
              <textarea
                value={after.code}
                onChange={(e) => update({ after: { ...after, code: e.target.value } })}
                placeholder="// After refactoring..."
                rows={5}
                spellCheck={false}
                className="w-full resize-y p-3 font-mono text-xs outline-none"
                style={{ backgroundColor: "#161616", color: "#ccc" }}
              />
            </div>
          </div>
        </div>
      );
    }

    // CODE DIFF
    case "code-diff": {
      const diff = (d.diff as string) || "";
      const filename = (d.filename as string) || "";
      return (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
            <div className="flex items-center gap-2">
              {renderTypeHeader(
                "code-diff",
                "Code Diff Block",
                "Git-style unified diff showing exact added (+) and removed (-) lines of code between commits or release versions.",
                "- const url = 'http://localhost:3000';\n+ const url = process.env.API_URL;"
              )}
            </div>
            <input
              type="text"
              value={filename}
              onChange={(e) => update({ filename: e.target.value })}
              placeholder="filename (e.g. config.ts)"
              className="bg-transparent text-[11px] font-mono outline-none placeholder:text-[#333333] text-right"
              style={{ color: "#999" }}
            />
          </div>
          <textarea
            value={diff}
            onChange={(e) => update({ diff: e.target.value })}
            placeholder={"- removed line\n+ added line"}
            rows={6}
            spellCheck={false}
            className="w-full resize-y p-3 font-mono text-xs outline-none"
            style={{ backgroundColor: "#161616", color: "#ccc" }}
          />
        </div>
      );
    }

    // BENCHMARK
    case "benchmark": {
      const title = (d.title as string) || "Benchmark Metrics";
      const metrics = (d.metrics as Array<{ label: string; value: string; unit?: string }>) || [];
      const columns = (d.columns as string[]) || ["Metric", "Value", "Unit"];
      const rawRows = (d.rows as unknown) || [];
      const rows: string[][] = Array.isArray(rawRows)
        ? rawRows.map((r: unknown) =>
            Array.isArray(r)
              ? (r as string[])
              : r && typeof r === "object" && "cells" in r && Array.isArray((r as { cells: string[] }).cells)
              ? (r as { cells: string[] }).cells
              : []
          )
        : [];

      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "benchmark",
            "Benchmark Metrics Block",
            "Empirical performance testing results card displaying throughput, latency (p99), memory footprint, or operations per second.",
            "Metric: p99 Latency | Value: 12 | Unit: ms"
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Benchmark Title (e.g. Vector DB Query Latency)..."
            className="w-full bg-transparent font-bold text-sm outline-none text-[#ffffff]"
          />

          {/* If metrics array present */}
          {metrics.length > 0 && (
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => {
                      const nextM = [...metrics];
                      nextM[i] = { ...nextM[i], label: e.target.value };
                      update({ metrics: nextM });
                    }}
                    placeholder="Metric name..."
                    className="flex-1 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#e8e8e8] outline-none"
                  />
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => {
                      const nextM = [...metrics];
                      nextM[i] = { ...nextM[i], value: e.target.value };
                      update({ metrics: nextM });
                    }}
                    placeholder="Value..."
                    className="w-24 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#ffffff] font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={m.unit || ""}
                    onChange={(e) => {
                      const nextM = [...metrics];
                      nextM[i] = { ...nextM[i], unit: e.target.value };
                      update({ metrics: nextM });
                    }}
                    placeholder="Unit (ms, Gbps)..."
                    className="w-24 rounded px-2.5 py-1 text-xs bg-[#141414] border border-[#2a2a2a] text-[#888888] font-mono outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => update({ metrics: [...metrics, { label: "", value: "", unit: "" }] })}
                className="text-[11px] font-mono hover:text-[#ffffff] text-[#777777]"
              >
                + Add Metric
              </button>
            </div>
          )}

          {/* Table fallback if rows present */}
          {rows.length > 0 && metrics.length === 0 && (
            <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #2a2a2a" }}>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ backgroundColor: "#1a1a1a" }}>
                    {columns.map((col, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium" style={{ borderBottom: "1px solid #2a2a2a", color: "#999" }}>
                        <input
                          type="text"
                          value={col}
                          onChange={(e) => {
                            const n = [...columns];
                            n[i] = e.target.value;
                            update({ columns: n });
                          }}
                          className="w-full bg-transparent outline-none"
                          style={{ color: "#999" }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-1.5" style={{ borderBottom: "1px solid #2a2a2a" }}>
                          <input
                            type="text"
                            value={cell || ""}
                            onChange={(e) => {
                              const nextRows = rows.map((r) => [...r]);
                              if (!nextRows[ri]) nextRows[ri] = [];
                              nextRows[ri][ci] = e.target.value;
                              update({ rows: nextRows });
                            }}
                            className="w-full bg-transparent outline-none"
                            style={{ color: "#e8e8e8" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // EMBED
    case "embed": {
      const provider = (d.provider as string) || "github";
      const url = (d.url as string) || "";
      const eTitle = (d.title as string) || "";
      return (
        <div>
          {renderTypeHeader(
            "embed",
            "External Resource Embed",
            "Embeds external developer assets like GitHub Gists, CodeSandbox dynamic demos, YouTube video tutorials, or Figma designs.",
            "Provider: github | URL: https://gist.github.com/user/12345"
          )}
          <div className="space-y-2">
            <select
              value={provider}
              onChange={(e) => update({ provider: e.target.value })}
              className="rounded px-3 py-1.5 text-xs outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#999" }}
            >
              {["github", "codesandbox", "stackblitz", "youtube", "figma", "codepen", "twitter", "custom"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => update({ url: e.target.value })}
              placeholder="Embed URL..."
              className="w-full rounded px-3 py-1.5 text-xs outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
            />
            <input
              type="text"
              value={eTitle}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Embed Title (optional)..."
              className="w-full rounded px-3 py-1.5 text-xs outline-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#999" }}
            />
          </div>
        </div>
      );
    }

    // REACT COMPONENT
    case "react-component": {
      const componentName = (d.componentName as string) || "InteractiveWidget";
      const previewType = (d.previewType as string) || "counter";
      const description = (d.description as string) || "";
      return (
        <div className="space-y-3">
          {renderTypeHeader(
            "react-component",
            "Interactive React Component",
            "Embeds live interactive React widgets (Counter & State, RAG Latency Benchmark Calculator, Subsea Telemetry Monitor) directly into the article.",
            "ComponentName: RagLatencyCalculator | PreviewType: rag-calculator"
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={componentName}
              onChange={(e) => update({ componentName: e.target.value })}
              placeholder="ComponentName (e.g. Counter)"
              className="flex-1 rounded px-3 py-1.5 text-xs font-mono outline-none bg-[#141414] border border-[#2a2a2a] text-[#ffffff]"
            />
            <select
              value={previewType}
              onChange={(e) => update({ previewType: e.target.value })}
              className="rounded px-3 py-1.5 text-xs font-mono outline-none bg-[#141414] border border-[#2a2a2a] text-[#cccccc]"
            >
              <option value="counter">Counter & State Demo</option>
              <option value="rag-calculator">RAG Latency Benchmark</option>
              <option value="telemetry">Subsea Telemetry Monitor</option>
              <option value="custom">Custom Component</option>
            </select>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Widget description for readers..."
            className="w-full rounded px-3 py-1.5 text-xs outline-none bg-[#141414] border border-[#2a2a2a] text-[#aaaaaa]"
          />
        </div>
      );
    }

    // SEO & AI SEARCH OVERVIEW BLOCK
    case "seo-block": {
      const primaryKeyword = (d.primaryKeyword as string) || "";
      const targetIntent = (d.targetIntent as string) || "";
      const entities = Array.isArray(d.entities) ? (d.entities as string[]) : [];
      const questionsAnswered = Array.isArray(d.questionsAnswered)
        ? (d.questionsAnswered as string[]).join("\n")
        : "";
      const topicCoverage = (d.topicCoverage as number) ?? 100;
      const suggestedSchema = Array.isArray(d.suggestedSchema)
        ? (d.suggestedSchema as string[])
        : [];

      return (
        <div className="space-y-4 p-5 rounded-xl border bg-[#141414] border-[#2a2a2a] shadow-inner">
          <div className="flex items-center justify-between border-b pb-2.5 border-[#2a2a2a]">
            {renderTypeHeader(
              "seo-block",
              "SEO & AI Search Overview",
              "Comprehensive SEO & GEO meta block specifying primary focus keywords, search intent, recognized entities, and FAQ schema.",
              "Primary Focus Keyword: Next.js 16 MongoDB Engine"
            )}
            <span className="text-[10px] font-mono text-[#888888]">
              SEO & GEO Form Editor (Hover (i) for explanations)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                Primary Focus Keyword
                <FieldInfoTooltip
                  title="Primary Focus Keyword"
                  explanation="The core 2-4 word phrase searchers query on Google. Placed in titles, headers, and meta descriptions."
                  example='Next.js 16 MongoDB Engine'
                />
              </label>
              <input
                type="text"
                value={primaryKeyword}
                onChange={(e) => update({ primaryKeyword: e.target.value })}
                placeholder="e.g. Next.js & MongoDB Engine"
                className="w-full rounded-lg px-3 py-2 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                Target Search Intent
                <FieldInfoTooltip
                  title="Target Search Intent"
                  explanation="The underlying goal of the searcher (e.g. Hands-on Tutorial, Architecture Breakdown, Benchmark)."
                  example='Technical Guide & Architecture Breakdown'
                />
              </label>
              <input
                type="text"
                value={targetIntent}
                onChange={(e) => update({ targetIntent: e.target.value })}
                placeholder="e.g. Technical Guide & Architecture Breakdown"
                className="w-full rounded-lg px-3 py-2 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
              Recognized Technical Entities
              <FieldInfoTooltip
                title="Recognized Technical Entities"
                explanation="Specific frameworks, tools, or protocols mentioned. Used by Perplexity AI & Google Knowledge Graph."
                example='Type "React", "Next.js", "MongoDB" and press Space'
              />
            </label>
            <ChipTagInput
              tags={entities}
              onChange={(newEntities) => update({ entities: newEntities })}
              placeholder="Type entity name (e.g. React, Next.js) and press Space..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
              Target Questions Answered (1 per line for AI Overviews)
              <FieldInfoTooltip
                title="Target Questions Answered"
                explanation="Explicit questions answered in this writeup. Used by Perplexity, SearchGPT & Google FAQ rich snippets."
                example="How to optimize MongoClient pool size in Next.js?"
              />
            </label>
            <textarea
              value={questionsAnswered}
              onChange={(e) =>
                update({
                  questionsAnswered: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              rows={3}
              placeholder="What core technical architecture patterns does this article cover?&#10;How to implement and optimize this in production?"
              className="w-full rounded-lg p-2.5 text-xs font-mono outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                Topic Coverage Score (%)
                <FieldInfoTooltip
                  title="Topic Coverage Score"
                  explanation="Estimated completeness of topic coverage (90-100%). Signals depth to search engine crawlers."
                  example="98"
                />
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={topicCoverage}
                onChange={(e) => update({ topicCoverage: Number(e.target.value) })}
                className="w-full rounded-lg px-3 py-2 text-xs outline-none bg-[#1a1a1a] border border-[#2a2a2a] text-[#ffffff]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#777777] mb-1">
                Suggested Schema.org Types
                <FieldInfoTooltip
                  title="Suggested Schema.org Types"
                  explanation="Structured data schemas for rich Google search results."
                  example='Type "TechArticle", "HowTo" and press Space'
                />
              </label>
              <ChipTagInput
                tags={suggestedSchema}
                onChange={(newSchemas) => update({ suggestedSchema: newSchemas })}
                placeholder="Type schema (e.g. TechArticle, HowTo) and press Space..."
              />
            </div>
          </div>
        </div>
      );
    }

    // FALLBACK
    default: {
      return (
        <div className="rounded-lg p-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          {renderTypeHeader(block.type, block.type, "Custom block data editor.", "Data JSON")}
          <p className="text-xs mb-2" style={{ color: "#555" }}>
            Edit <span className="font-mono">{block.type}</span> data:
          </p>
          <textarea
            value={JSON.stringify(block.data, null, 2)}
            onChange={(e) => { try { update(JSON.parse(e.target.value)); } catch { /* ignore */ } }}
            rows={5} spellCheck={false}
            className="w-full resize-y rounded p-3 font-mono text-xs outline-none"
            style={{ backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#ccc" }} />
        </div>
      );
    }
  }
}
