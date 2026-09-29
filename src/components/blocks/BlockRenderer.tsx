"use client";

import { useState } from "react";
import type { BaseBlock } from "@/types/article";
import { VSCodeHighlighter } from "./VSCodeHighlighter";
import { InteractiveReactWidget } from "./InteractiveReactWidget";
import { Sparkles, ChevronDown, Folder, FolderOpen, FileCode, FileText, ChevronRight, FolderTree } from "lucide-react";

interface BlockRendererProps {
  block: BaseBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const d = block.data as Record<string, unknown>;

  switch (block.type) {
    // HEADING
    case "heading": {
      const level = (d.level as number) || 2;
      const text = (d.text as string) || "";
      const id = block.metadata?.anchor || text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const sizes: Record<number, string> = { 2: "text-2xl mt-6 mb-2", 3: "text-xl mt-5 mb-2", 4: "text-lg mt-4 mb-1" };
      return (
        <h2 id={id} className={`${sizes[level] || "text-xl"} font-bold tracking-tight`}
          style={{ color: "#ffffff" }}>
          {text}
        </h2>
      );
    }

    // PARAGRAPH
    case "paragraph":
    case "rich-text": {
      return (
        <p className="text-sm leading-relaxed" style={{ color: "#cccccc" }}>
          {(d.text as string) || ""}
        </p>
      );
    }

    // BULLET LIST
    case "bullet-list": {
      const items = (d.items as string[]) || [];
      return (
        <ul className="space-y-1.5 pl-4">
          {items.filter(Boolean).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#cccccc" }}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#e8e8e8" }} />
              {item}
            </li>
          ))}
        </ul>
      );
    }

    // NUMBERED LIST
    case "numbered-list": {
      const items = (d.items as string[]) || [];
      return (
        <ol className="space-y-1.5 pl-4">
          {items.filter(Boolean).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#cccccc" }}>
              <span className="shrink-0 font-mono font-bold text-xs" style={{ color: "#ffffff", minWidth: 20 }}>
                {i + 1}.
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    }

    // CALLOUT
    case "callout": {
      const title = d.title as string;
      const text = (d.text as string) || "";
      return (
        <div className="rounded-lg p-4 my-2" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderLeft: "4px solid #ffffff" }}>
          {title && <span className="block text-sm font-semibold mb-1" style={{ color: "#ffffff" }}>{title}</span>}
          <p className="text-sm" style={{ color: "#cccccc" }}>{text}</p>
        </div>
      );
    }

    // CODE BLOCK
    case "code": {
      const code = (d.code as string) || "";
      const language = (d.language as string) || "typescript";
      const filename = d.filename as string;
      return <VSCodeHighlighter code={code} language={language} filename={filename} />;
    }

    // TERMINAL
    case "terminal": {
      const commands = (d.commands as Array<{ command: string; output?: string }>) || [];
      return (
        <div className="rounded-lg overflow-hidden font-mono text-xs my-3" style={{ border: "1px solid #2a2a2a", backgroundColor: "#121212" }}>
          <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: "#2a2a2a", backgroundColor: "#1c1c1c" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#333333" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#444444" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#555555" }} />
            <span className="ml-2 text-[10px]" style={{ color: "#777777" }}>bash</span>
          </div>
          <div className="p-4 space-y-2">
            {commands.map((cmd, i) => (
              <div key={i}>
                <div className="flex items-center gap-2" style={{ color: "#ffffff" }}>
                  <span style={{ color: "#888888" }}>$</span>
                  <span>{cmd.command}</span>
                </div>
                {cmd.output && (
                  <p className="mt-1 whitespace-pre-wrap pl-4" style={{ color: "#aaaaaa" }}>
                    {cmd.output}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // IMAGE BLOCK
    case "image": {
      const url = (d.url as string) || "";
      const caption = d.caption as string;
      const alt = (d.alt as string) || "";
      return (
        <figure className="my-4">
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"} alt={alt} className="w-full object-cover" />
          </div>
          {caption && <figcaption className="mt-2 text-center text-xs" style={{ color: "#777777" }}>{caption}</figcaption>}
        </figure>
      );
    }

    // PROS / CONS
    case "pros-cons": {
      const pros = (d.pros as string[]) || [];
      const cons = (d.cons as string[]) || [];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
          <div className="rounded-lg p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <p className="text-xs font-mono font-bold uppercase mb-2" style={{ color: "#ffffff" }}>PROS</p>
            <ul className="space-y-1">
              {pros.map((p, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#cccccc" }}>
                  <span style={{ color: "#ffffff" }}>+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <p className="text-xs font-mono font-bold uppercase mb-2" style={{ color: "#aaaaaa" }}>CONS</p>
            <ul className="space-y-1">
              {cons.map((c, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#aaaaaa" }}>
                  <span style={{ color: "#777777" }}>-</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // KEY TAKEAWAYS
    case "takeaways": {
      const items = (d.items as string[]) || [];
      return (
        <div className="rounded-lg p-4 my-3" style={{ backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a" }}>
          <p className="text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "#ffffff" }}>KEY TAKEAWAYS</p>
          <ul className="space-y-1.5">
            {items.map((it, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: "#cccccc" }}>
                <span className="font-mono" style={{ color: "#ffffff" }}>•</span> {it}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // DEFINITION
    case "definition": {
      const term = (d.term as string) || "";
      const def = (d.definition as string) || "";
      return (
        <div className="rounded-lg p-4 my-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <p className="text-sm font-bold font-mono mb-1" style={{ color: "#ffffff" }}>{term}</p>
          <p className="text-xs leading-relaxed" style={{ color: "#cccccc" }}>{def}</p>
        </div>
      );
    }

    // COMPARISON TABLE
    case "comparison": {
      const headers = (d.headers as string[]) || ["Feature", "Option A", "Option B"];
      const rows = (d.rows as string[][]) || [];
      return (
        <div className="rounded-lg overflow-hidden my-3 border" style={{ borderColor: "#2a2a2a" }}>
          <table className="w-full text-xs text-left">
            <thead style={{ backgroundColor: "#1c1c1c", color: "#ffffff" }}>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-3 border-b border-r last:border-r-0 font-mono uppercase" style={{ borderColor: "#2a2a2a" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b last:border-b-0" style={{ borderColor: "#2a2a2a", backgroundColor: rIdx % 2 === 0 ? "#141414" : "#1a1a1a" }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 border-r last:border-r-0" style={{ borderColor: "#2a2a2a", color: cIdx === 0 ? "#ffffff" : "#cccccc" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // BENCHMARK / METRICS
    case "benchmark": {
      const title = (d.title as string) || "Performance Benchmark";
      const metrics = (d.metrics as Array<{ label: string; value: string; unit?: string }>) || [];
      return (
        <div className="rounded-lg p-4 my-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <p className="text-xs font-mono font-bold uppercase tracking-wider mb-3" style={{ color: "#ffffff" }}>{title}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="p-3 rounded-md" style={{ backgroundColor: "#222222", border: "1px solid #2a2a2a" }}>
                <p className="text-[10px] font-mono uppercase" style={{ color: "#777777" }}>{m.label}</p>
                <p className="text-base font-bold mt-1" style={{ color: "#ffffff" }}>
                  {m.value} <span className="text-xs font-normal" style={{ color: "#aaaaaa" }}>{m.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // STEPS
    case "steps": {
      const steps = (d.steps as Array<{ title: string; description: string; code?: string }>) || [];
      return (
        <div className="space-y-4 my-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-bold"
                style={{ backgroundColor: "#222222", border: "1px solid #333333", color: "#ffffff" }}>{i + 1}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>{step.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#cccccc" }}>{step.description}</p>
                {step.code && (
                  <pre className="mt-2 rounded-md p-3 font-mono text-xs overflow-x-auto"
                    style={{ backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#e8e8e8" }}>
                    {step.code}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // BEFORE / AFTER
    case "before-after": {
      const before = (d.before as { code: string; label?: string }) || { code: "" };
      const after = (d.after as { code: string; label?: string }) || { code: "" };
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
            <div className="px-3 py-1.5" style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a" }}>
              <span className="text-[10px] font-mono font-bold" style={{ color: "#888888" }}>BEFORE</span>
            </div>
            <pre className="p-3 font-mono text-xs overflow-x-auto" style={{ backgroundColor: "#141414", color: "#cccccc" }}>{before.code}</pre>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
            <div className="px-3 py-1.5" style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a" }}>
              <span className="text-[10px] font-mono font-bold" style={{ color: "#ffffff" }}>AFTER</span>
            </div>
            <pre className="p-3 font-mono text-xs overflow-x-auto" style={{ backgroundColor: "#141414", color: "#ffffff" }}>{after.code}</pre>
          </div>
        </div>
      );
    }

    // CODE DIFF
    case "code-diff": {
      const diff = (d.diff as string) || "";
      const filename = d.filename as string;
      return (
        <div className="rounded-lg overflow-hidden my-3" style={{ border: "1px solid #2a2a2a" }}>
          {filename && (
            <div className="px-4 py-2" style={{ backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a" }}>
              <span className="text-[11px] font-mono" style={{ color: "#888888" }}>{filename}</span>
            </div>
          )}
          <pre className="p-4 font-mono text-xs overflow-x-auto" style={{ backgroundColor: "#141414" }}>
            {diff.split("\n").map((line, i) => (
              <div key={i} style={{
                color: line.startsWith("+") ? "#ffffff" : line.startsWith("-") ? "#777777" : "#aaaaaa",
                backgroundColor: line.startsWith("+") ? "rgba(255,255,255,0.06)" : line.startsWith("-") ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
                {line}
              </div>
            ))}
          </pre>
        </div>
      );
    }

    // EMBED
    case "embed": {
      const url = (d.url as string) || "";
      const provider = (d.provider as string) || "custom";
      const eTitle = d.title as string;
      return (
        <div className="rounded-lg p-4 my-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <p className="text-[10px] font-mono uppercase mb-2" style={{ color: "#777777" }}>{provider} embed</p>
          {eTitle && <p className="text-sm font-medium mb-1" style={{ color: "#ffffff" }}>{eTitle}</p>}
          <a href={url} target="_blank" rel="noreferrer" className="text-xs font-mono break-all underline"
            style={{ color: "#cccccc" }}>{url}</a>
        </div>
      );
    }

    // REACT COMPONENT
    case "react-component": {
      const componentName = (d.componentName as string) || "InteractiveWidget";
      const previewType = (d.previewType as "counter" | "rag-calculator" | "telemetry" | "custom") || "counter";
      const description = d.description as string;
      const props = (d.props as Record<string, unknown>) || {};
      return (
        <InteractiveReactWidget
          componentName={componentName}
          previewType={previewType}
          description={description}
          props={props}
        />
      );
    }

    // FILE TREE
    case "file-tree": {
      return <FileTreeRenderer data={d} />;
    }

    // INLINE CODE
    case "inline-code": {
      const code = (d.code as string) || "";
      const desc = (d.description as string) || "";
      return (
        <div className="inline-flex items-center gap-2 rounded px-3 py-1 font-mono text-xs my-1 border"
          style={{ backgroundColor: "#181818", borderColor: "#2a2a2a", color: "#a3e635" }}>
          <code>{code}</code>
          {desc && <span className="text-[10px] text-[#777777] border-l border-[#333333] pl-2 font-sans">{desc}</span>}
        </div>
      );
    }

    // CONFIG BLOCK
    case "config": {
      const filename = (d.filename as string) || "config.json";
      const content = (d.content as string) || (d.code as string) || "";
      const lang = (d.language as string) || "json";
      return (
        <div className="rounded-lg overflow-hidden my-3 border font-mono text-xs" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
          <div className="px-3 py-1.5 flex items-center justify-between border-b" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <span className="text-[11px] text-[#ffffff] font-bold">{filename}</span>
            <span className="text-[10px] uppercase text-[#777777]">{lang}</span>
          </div>
          <pre className="p-3 overflow-x-auto text-[#cccccc]">{content}</pre>
        </div>
      );
    }

    // PLAYGROUND
    case "playground": {
      const code = (d.code as string) || "";
      const output = (d.output as string) || "";
      const lang = (d.language as string) || "javascript";
      return (
        <div className="rounded-xl overflow-hidden my-3 border font-mono text-xs" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
          <div className="px-4 py-2 border-b flex items-center justify-between" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" />
              <span className="font-bold text-xs text-[#ffffff]">Interactive Playground</span>
            </div>
            <span className="text-[10px] text-[#777777] uppercase">{lang}</span>
          </div>
          <div className="p-3 bg-[#161616] text-[#e8e8e8] border-b border-[#2a2a2a]">
            <pre className="overflow-x-auto">{code}</pre>
          </div>
          {output && (
            <div className="p-3 bg-[#0e0e0e]">
              <span className="text-[10px] text-[#777777] uppercase block mb-1">Output:</span>
              <pre className="text-[#a3e635] overflow-x-auto">{output}</pre>
            </div>
          )}
        </div>
      );
    }

    // API REQUEST
    case "api-request": {
      const method = ((d.method as string) || "GET").toUpperCase();
      const url = (d.url as string) || "/api/v1/resource";
      const status = (d.responseStatus as number) || 200;
      const response = (d.response as string) || "";
      const methodColors: Record<string, string> = {
        GET: "#a3e635",
        POST: "#60a5fa",
        PUT: "#f59e0b",
        DELETE: "#ef4444",
      };
      return (
        <div className="rounded-xl overflow-hidden my-3 border font-mono text-xs" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
          <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#121212]" style={{ backgroundColor: methodColors[method] || "#a3e635" }}>
                {method}
              </span>
              <span className="text-[#ffffff] font-bold">{url}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#ffffff] bg-[#222222] border border-[#333333]">
              {status} OK
            </span>
          </div>
          {response && (
            <div className="p-3 bg-[#161616] border-t border-[#2a2a2a]">
              <span className="text-[10px] text-[#777777] uppercase block mb-1">Response Body</span>
              <pre className="text-[#cccccc] overflow-x-auto">{response}</pre>
            </div>
          )}
        </div>
      );
    }

    // HTTP FLOW
    case "http": {
      const steps = (d.steps as Array<{ from: string; to: string; method: string; path: string; statusCode: number; label?: string }>) || [];
      return (
        <div className="rounded-xl p-4 my-3 border font-mono text-xs space-y-3" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
          <p className="text-[10px] uppercase font-bold text-[#777777]">HTTP Protocol Flow</p>
          {steps.map((st, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <span className="text-[#ffffff] font-semibold">{st.from}</span>
                <span className="text-[#a3e635]">→</span>
                <span className="text-[#ffffff] font-semibold">{st.to}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#252525] text-[#cccccc]">{st.method} {st.path}</span>
                <span className="text-[10px] font-bold text-[#a3e635]">{st.statusCode}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ARCHITECTURE
    case "architecture": {
      const title = (d.title as string) || "System Architecture";
      const nodes = (d.nodes as Array<{ id: string; label: string; type?: string }>) || [];
      return (
        <div className="rounded-xl p-4 my-3 border font-mono text-xs" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
          <p className="text-xs font-bold text-[#ffffff] uppercase tracking-wider mb-3">{title}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {nodes.map((nd, i) => (
              <div key={i} className="p-3 rounded-lg text-center bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#a3e635] transition-colors">
                <span className="text-[10px] text-[#777777] uppercase block mb-0.5">{nd.type || "Service"}</span>
                <span className="font-bold text-[#ffffff]">{nd.label || nd.id}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // FLOW
    case "flow": {
      const steps = (d.steps as Array<{ title: string; description?: string; status?: string }>) || [];
      return (
        <div className="rounded-xl p-4 my-3 border font-mono text-xs space-y-2" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
          <p className="text-[10px] uppercase font-bold text-[#777777] mb-2">Process Flowchart</p>
          <div className="flex flex-col gap-2">
            {steps.map((st, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#222222] border border-[#333333] text-[10px] font-bold text-[#a3e635]">
                  {i + 1}
                </div>
                <div className="flex-1 p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                  <span className="font-semibold text-[#ffffff]">{st.title}</span>
                  {st.description && <p className="text-[11px] text-[#aaaaaa] mt-0.5 font-sans">{st.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // SEQUENCE
    case "sequence": {
      const actors = (d.actors as string[]) || ["Client", "Server"];
      const messages = (d.messages as Array<{ from: string; to: string; label: string }>) || [];
      return (
        <div className="rounded-xl p-4 my-3 border font-mono text-xs space-y-3" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
          <div className="flex justify-around border-b border-[#2a2a2a] pb-2">
            {actors.map((act, i) => (
              <span key={i} className="px-3 py-1 rounded bg-[#1f1f1f] text-[#ffffff] font-bold text-[11px]">
                {act}
              </span>
            ))}
          </div>
          <div className="space-y-2 pt-1">
            {messages.map((msg, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                <span className="text-[#a3e635] font-semibold">{msg.from} → {msg.to}</span>
                <span className="text-[#cccccc]">{msg.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // DATABASE SCHEMA
    case "database-schema": {
      const tables = (d.tables as Array<{ name: string; columns: Array<{ name: string; type: string; primaryKey?: boolean }> }>) || [];
      return (
        <div className="rounded-xl p-4 my-3 border font-mono text-xs space-y-3" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
          <p className="text-[10px] uppercase font-bold text-[#777777]">Database Schema Tables</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tables.map((tb, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-[#2a2a2a]" style={{ backgroundColor: "#181818" }}>
                <div className="px-3 py-1.5 bg-[#222222] border-b border-[#2a2a2a] font-bold text-[#ffffff]">
                  {tb.name}
                </div>
                <div className="p-2.5 space-y-1">
                  {(tb.columns || []).map((col, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#e8e8e8]">
                        {col.name} {col.primaryKey && <span className="text-[9px] text-[#a3e635] font-bold ml-1">(PK)</span>}
                      </span>
                      <span className="text-[#777777]">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // JSON VIEWER
    case "json-viewer": {
      const title = (d.title as string) || "JSON Payload";
      const rawJson = typeof d.json === "string" ? d.json : JSON.stringify(d.json || d, null, 2);
      return (
        <div className="rounded-xl overflow-hidden my-3 border font-mono text-xs" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
          <div className="px-4 py-2 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between">
            <span className="font-bold text-[#ffffff]">{title}</span>
            <span className="text-[10px] text-[#777777]">JSON</span>
          </div>
          <pre className="p-4 text-[#a3e635] overflow-x-auto leading-relaxed">{rawJson}</pre>
        </div>
      );
    }

    // SEO & AI SEARCH OVERVIEW BLOCK (NOT VISUALLY DISPLAYED TO USERS - METADATA ONLY)
    case "seo-block": {
      return null;
    }

    // DEFAULT
    default: {
      return (
        <div className="rounded-lg p-4 my-2" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <p className="text-[10px] font-mono uppercase mb-1" style={{ color: "#777777" }}>{block.type}</p>
          <pre className="text-xs font-mono" style={{ color: "#cccccc" }}>{JSON.stringify(d, null, 2)}</pre>
        </div>
      );
    }
  }
}

// FILE TREE RENDERER HELPER & COMPONENTS
interface RenderNode {
  name: string;
  isDir: boolean;
  children: RenderNode[];
  comment?: string;
  fullPath: string;
}

function parsePathsToTree(rawItems: Array<{ path: string; type?: string; comment?: string }>): RenderNode[] {
  const rootNodes: RenderNode[] = [];

  const findOrCreateChild = (parentChildren: RenderNode[], name: string, isDir: boolean, fullPath: string, comment?: string): RenderNode => {
    let existing = parentChildren.find((c) => c.name === name);
    if (!existing) {
      existing = {
        name,
        isDir,
        children: [],
        comment: comment || undefined,
        fullPath,
      };
      parentChildren.push(existing);
    } else {
      if (isDir) existing.isDir = true;
      if (comment && !existing.comment) existing.comment = comment;
    }
    return existing;
  };

  for (const item of rawItems) {
    const rawPath = (item.path || "").trim();
    if (!rawPath) continue;

    const isExplicitDir =
      item.type === "directory" ||
      item.type === "folder" ||
      rawPath.endsWith("/") ||
      rawPath.endsWith("\\");

    const cleanPath = rawPath.replace(/[/\\]+$/, "");
    const parts = cleanPath.split(/[/\\]+/).filter(Boolean);

    if (parts.length === 0) continue;

    let currentLevel = rootNodes;
    let pathAcc = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      pathAcc = pathAcc ? `${pathAcc}/${part}` : part;
      const isDir = isLast ? isExplicitDir : true;
      const comment = isLast ? item.comment : undefined;

      const node = findOrCreateChild(currentLevel, part, isDir, pathAcc, comment);
      currentLevel = node.children;
    }
  }

  const sortNodes = (nodes: RenderNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortNodes(n.children));
  };

  sortNodes(rootNodes);
  return rootNodes;
}

function convertNodesToTree(nodes: unknown[]): RenderNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((n: any) => ({
    name: n.name || n.label || "unnamed",
    isDir: n.type === "directory" || n.type === "folder" || Array.isArray(n.children),
    children: Array.isArray(n.children) ? convertNodesToTree(n.children) : [],
    comment: n.comment,
    fullPath: n.name || "",
  }));
}

function FileTreeNodeItem({ node, level }: { node: RenderNode; level: number }) {
  const [isOpen, setIsOpen] = useState(true);

  const getFileIcon = (name: string, isDir: boolean, open: boolean) => {
    if (isDir) {
      return open ? (
        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#a3e635]" />
      ) : (
        <Folder className="h-3.5 w-3.5 shrink-0 text-[#a3e635]" />
      );
    }
    const ext = name.split(".").pop()?.toLowerCase();
    if (["js", "jsx", "ts", "tsx", "json", "py", "go", "rs", "html", "css", "yaml", "yml"].includes(ext || "") || name === "Dockerfile") {
      return <FileCode className="h-3.5 w-3.5 shrink-0 text-[#cccccc]" />;
    }
    return <FileText className="h-3.5 w-3.5 shrink-0 text-[#888888]" />;
  };

  const hasExpandableChildren = node.isDir && node.children.length > 0;

  return (
    <div>
      <div
        onClick={() => hasExpandableChildren && setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-1 px-2 rounded transition-colors text-xs select-none ${
          hasExpandableChildren ? "cursor-pointer hover:bg-[#1f1f1f]" : "hover:bg-[#1a1a1a]"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasExpandableChildren ? (
          <ChevronRight
            className={`h-3 w-3 shrink-0 text-[#666666] transition-transform duration-150 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {getFileIcon(node.name, node.isDir, isOpen)}

        <span
          className={`font-mono ${node.isDir ? "font-semibold text-[#ffffff]" : "text-[#cccccc]"}`}
        >
          {node.name}
          {node.isDir && "/"}
        </span>

        {node.comment && (
          <span className="ml-2 text-[10px] italic text-[#666666]">
            # {node.comment}
          </span>
        )}
      </div>

      {node.isDir && isOpen && node.children.length > 0 && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 border-l border-[#262626]"
            style={{ left: `${level * 16 + 14}px` }}
          />
          {node.children.map((child, i) => (
            <FileTreeNodeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function FileTreeRenderer({ data }: { data: Record<string, unknown> }) {
  const rootTitle = (data.root as string) || (data.title as string) || "";
  
  let treeNodes: RenderNode[] = [];
  if (Array.isArray(data.nodes) && data.nodes.length > 0) {
    treeNodes = convertNodesToTree(data.nodes);
  } else {
    let rawList: any[] = [];
    if (Array.isArray(data.files)) rawList = data.files;
    else if (Array.isArray(data.paths)) rawList = data.paths;
    else if (Array.isArray(data.structure)) rawList = data.structure;
    else if (Array.isArray(data.items)) rawList = data.items;
    else if (typeof data.tree === "string") rawList = data.tree.split("\n");
    else if (typeof data.files === "string") rawList = data.files.split("\n");
    else if (typeof data.paths === "string") rawList = data.paths.split("\n");
    else if (Array.isArray(data)) rawList = data;

    const items = rawList
      .map((f: any) => {
        if (typeof f === "string") return { path: f };
        if (f && typeof f === "object") {
          return {
            path: f.path || f.name || f.filename || "",
            type: f.type,
            comment: f.comment || f.description,
          };
        }
        return { path: "" };
      })
      .filter((x) => x.path);

    treeNodes = parsePathsToTree(items);
  }

  return (
    <div
      className="rounded-xl overflow-hidden my-3 border shadow-lg font-mono text-xs"
      style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
      >
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-[#a3e635]" />
          <span className="font-bold text-xs tracking-wide text-[#ffffff]">
            {rootTitle || "Directory Structure"}
          </span>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded font-mono border border-[#2a2a2a]"
          style={{ backgroundColor: "#222222", color: "#888888" }}
        >
          File Tree
        </span>
      </div>

      <div className="p-3 overflow-x-auto">
        {treeNodes.length === 0 ? (
          <p className="text-xs italic py-2 text-center text-[#666666]">
            Empty directory structure
          </p>
        ) : (
          <div className="space-y-0.5">
            {treeNodes.map((node, idx) => (
              <FileTreeNodeItem key={node.name + idx} node={node} level={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ACCORDION COMPONENT FOR SEO BLOCK (BY DEFAULT CLOSED)
function SeoBlockAccordion({ data }: { data: Record<string, unknown> }) {
  const [isOpen, setIsOpen] = useState(false); // BY DEFAULT CLOSED

  const primaryKeyword = (data.primaryKeyword as string) || "Primary Focus Keyword";
  const targetIntent = (data.targetIntent as string) || "Technical Guide & Architecture Breakdown";
  const entities = Array.isArray(data.entities)
    ? (data.entities as string[])
    : ["React", "Next.js", "MongoDB"];
  const questionsAnswered = Array.isArray(data.questionsAnswered)
    ? (data.questionsAnswered as string[])
    : [
        "What core technical architecture patterns does this article cover?",
        "How to implement and optimize this in production?"
      ];
  const topicCoverage = (data.topicCoverage as number) ?? 96;
  const suggestedSchema = Array.isArray(data.suggestedSchema)
    ? (data.suggestedSchema as string[])
    : ["TechArticle", "HowTo"];

  return (
    <div
      className="rounded-xl my-4 border select-none overflow-hidden shadow-xl font-mono text-xs transition-all"
      style={{ backgroundColor: "#181818", borderColor: "var(--accent-theme)" }}
    >
      {/* Accordion Header - Click to toggle expand/collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[#1f1f1f]"
        title="Click to view/hide SEO & AI Search Overview"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1c1917] border border-[#3a3a3a]">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
          </span>
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#ffffff] tracking-wide uppercase text-xs">
              SEO & AI Search Overview (GEO Optimized)
            </span>
            <span className="text-[10px] text-[#888888] truncate hidden sm:inline">
              • {primaryKeyword}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="rounded px-2.5 py-0.5 text-[10px] font-bold bg-[#121212] border border-[#3a3a3a] text-[#aaaaaa]">
            Coverage: <strong style={{ color: "var(--accent-theme)" }}>{topicCoverage}%</strong>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#888888] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content (BY DEFAULT CLOSED - conditionally rendered when isOpen is true) */}
      {isOpen && (
        <div className="p-5 border-t space-y-4 border-[#2a2a2a] bg-[#141414]">
          {/* Key Grid Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#181818] border border-[#2a2a2a] space-y-1">
              <span className="text-[10px] text-[#777777] uppercase tracking-wider block">Primary Focus Keyword</span>
              <p className="font-bold text-[#ffffff] text-xs">{primaryKeyword}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#181818] border border-[#2a2a2a] space-y-1">
              <span className="text-[10px] text-[#777777] uppercase tracking-wider block">Search Intent</span>
              <p className="font-bold text-[#ffffff] text-xs">{targetIntent}</p>
            </div>
          </div>

          {/* Entities & Schema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#888888] uppercase tracking-wider">
              <span>Target Entities Recognized</span>
              <span>Schema.org: {suggestedSchema.join(", ")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {entities.map((ent, i) => (
                <span
                  key={i}
                  className="rounded px-2.5 py-0.5 text-[11px] font-mono bg-[#1c1917] border border-[#3a3a3a]"
                  style={{ color: "var(--accent-theme)" }}
                >
                  #{ent}
                </span>
              ))}
            </div>
          </div>

          {/* Questions Answered (FAQ Schema) */}
          {questionsAnswered.length > 0 && (
            <div className="pt-3 border-t border-[#2a2a2a] space-y-1.5">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider block">
                Target Questions Answered (AI Search & Perplexity Overview)
              </span>
              <ul className="space-y-1.5 text-xs text-[#cccccc]">
                {questionsAnswered.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: "var(--accent-theme)" }}>?</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
