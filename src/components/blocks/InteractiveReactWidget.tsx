"use client";

import { useState } from "react";
import { Play, RotateCcw, Cpu, Wifi, Activity } from "lucide-react";

interface InteractiveReactWidgetProps {
  componentName?: string;
  previewType?: "counter" | "rag-calculator" | "telemetry" | "custom";
  description?: string;
  props?: Record<string, unknown>;
}

export function InteractiveReactWidget({
  componentName = "InteractiveWidget",
  previewType = "counter",
  description,
  props = {},
}: InteractiveReactWidgetProps) {
  const [count, setCount] = useState(0);
  const [chunkSize, setChunkSize] = useState(512);
  const [topK, setTopK] = useState(5);
  const [activeStation, setActiveStation] = useState<"Chennai" | "Port Blair" | "Havelock">("Port Blair");

  return (
    <div
      className="rounded-xl overflow-hidden my-4 border select-none shadow-2xl"
      style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
    >
      {/* Widget Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#1c1c1c" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ffffff" }} />
          <span className="font-mono text-xs font-bold text-[#ffffff]">
            &lt;{componentName || "ReactComponent"} /&gt;
          </span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded text-[#888888]" style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a" }}>
          Interactive React Widget
        </span>
      </div>

      {/* Description if any */}
      {description && (
        <p className="px-4 pt-3 text-xs text-[#aaaaaa] leading-relaxed">
          {description}
        </p>
      )}

      {/* Widget Body based on previewType */}
      <div className="p-5">
        {/* TYPE 1: COUNTER */}
        {previewType === "counter" && (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg border space-y-4"
            style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase text-[#777777]">Component State: count</span>
              <p className="text-4xl font-mono font-extrabold text-[#ffffff] mt-1">{count}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCount(count - 1)}
                className="rounded px-4 py-1.5 text-xs font-mono font-bold transition-colors hover:bg-[#252525]"
                style={{ backgroundColor: "#222222", border: "1px solid #3a3a3a", color: "#ffffff" }}
              >
                - Decrement
              </button>
              <button
                onClick={() => setCount(0)}
                className="rounded p-2 transition-colors hover:bg-[#252525]"
                style={{ backgroundColor: "#222222", border: "1px solid #3a3a3a", color: "#888888" }}
                title="Reset State"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setCount(count + 1)}
                className="rounded px-4 py-1.5 text-xs font-mono font-bold transition-colors hover:bg-[#e0e0e0]"
                style={{ backgroundColor: "#ffffff", color: "#121212" }}
              >
                + Increment
              </button>
            </div>
          </div>
        )}

        {/* TYPE 2: RAG BENCHMARK CALCULATOR */}
        {previewType === "rag-calculator" && (
          <div className="rounded-lg p-4 border space-y-4" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "#2a2a2a" }}>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#ffffff]" />
                <span className="font-mono text-xs font-bold text-[#ffffff]">RAG Retrieval Latency Calculator</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#ffffff]">
                Est. Latency: {Math.round(chunkSize * 0.08 + topK * 1.5)}ms
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono text-[#aaaaaa] mb-1">
                  <span>Chunk Size: {chunkSize} tokens</span>
                  <span>Overlap: 100 tokens</span>
                </div>
                <input
                  type="range"
                  min={128}
                  max={2048}
                  step={128}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full accent-[#ffffff]"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[#aaaaaa] mb-1">
                  <span>Top-K Vectors Retrieved: {topK}</span>
                  <span>Precision: {Math.min(99, Math.round(85 + topK * 1.2))}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full accent-[#ffffff]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TYPE 3: TELEMETRY WIDGET */}
        {previewType === "telemetry" && (
          <div className="rounded-lg p-4 border space-y-3" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-[#ffffff]" />
                <span className="font-mono text-xs font-bold text-[#ffffff]">CANI Subsea Telemetry</span>
              </div>
              <span className="flex items-center gap-1 font-mono text-[10px] text-[#ffffff]">
                <Activity className="h-3 w-3 animate-pulse" /> Live
              </span>
            </div>

            <div className="flex gap-1 border-b pb-3" style={{ borderColor: "#2a2a2a" }}>
              {(["Chennai", "Port Blair", "Havelock"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveStation(st)}
                  className="flex-1 py-1 text-[11px] font-mono rounded transition-colors"
                  style={{
                    backgroundColor: activeStation === st ? "#222222" : "transparent",
                    color: activeStation === st ? "#ffffff" : "#777777",
                    border: `1px solid ${activeStation === st ? "#444444" : "transparent"}`,
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                <span className="text-[10px] text-[#777777]">PING LATENCY</span>
                <p className="text-base font-bold text-[#ffffff] mt-0.5">
                  {activeStation === "Chennai" ? "4.2 ms" : activeStation === "Port Blair" ? "11.8 ms" : "14.3 ms"}
                </p>
              </div>
              <div className="p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                <span className="text-[10px] text-[#777777]">BANDWIDTH</span>
                <p className="text-base font-bold text-[#ffffff] mt-0.5">400 Gbps</p>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM FALLBACK */}
        {previewType === "custom" && (
          <div className="p-4 rounded-lg border text-center font-mono text-xs" style={{ backgroundColor: "#121212", borderColor: "#2a2a2a", color: "#aaaaaa" }}>
            <p className="font-bold text-[#ffffff]">&lt;{componentName} /&gt;</p>
            <p className="mt-1 text-[11px] text-[#777777]">Props: {JSON.stringify(props)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
