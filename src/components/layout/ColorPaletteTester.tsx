"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette, Copy, Check, X, RefreshCw } from "lucide-react";

export const EIGHTY_ACCENT_COLORS = [
  // ── Warm Gold & Yellows (1-10) ──
  { name: "Warm Gold (Default)", hex: "#d97706" },
  { name: "Bright Amber", hex: "#f59e0b" },
  { name: "Sunburst Yellow", hex: "#eab308" },
  { name: "Pure Goldenrod", hex: "#ca8a04" },
  { name: "Mustard Gold", hex: "#d4a373" },
  { name: "Champagne Gold", hex: "#e0a96d" },
  { name: "Bronze Gold", hex: "#b78103" },
  { name: "Honey Amber", hex: "#f5b041" },
  { name: "Sunflower Yellow", hex: "#ffc107" },
  { name: "Saffron Gold", hex: "#e5a93b" },

  // ── Sunset Orange & Rust (11-20) ──
  { name: "Vivid Orange", hex: "#f97316" },
  { name: "Deep Amber", hex: "#ea580c" },
  { name: "Burnt Orange", hex: "#c2410c" },
  { name: "Tangerine", hex: "#ff7043" },
  { name: "Peach Orange", hex: "#ff9f43" },
  { name: "Sunset Coral", hex: "#ff6b6b" },
  { name: "Copper Accent", hex: "#b45309" },
  { name: "Terracotta", hex: "#9a3412" },
  { name: "Electric Tangerine", hex: "#ff5e00" },
  { name: "Fiery Rust", hex: "#dc2626" },

  // ── Crimson, Reds & Roses (21-30) ──
  { name: "Flame Red", hex: "#ef4444" },
  { name: "Crimson Red", hex: "#b91c1c" },
  { name: "Ruby Red", hex: "#e11d48" },
  { name: "Rose Pink", hex: "#f43f5e" },
  { name: "Deep Rose", hex: "#be123c" },
  { name: "Warm Crimson", hex: "#9f1239" },
  { name: "Cyberpunk Red", hex: "#ff0055" },
  { name: "Hot Pink", hex: "#ff1493" },
  { name: "Neon Pink", hex: "#ec4899" },
  { name: "Fuchsia Magenta", hex: "#c026d3" },

  // ── Violets, Purples & Magenta (31-40) ──
  { name: "Hot Magenta", hex: "#ff007f" },
  { name: "Electric Purple", hex: "#d946ef" },
  { name: "Royal Violet", hex: "#9333ea" },
  { name: "Deep Violet", hex: "#a855f7" },
  { name: "Vivid Purple", hex: "#7c3aed" },
  { name: "Dark Orchid", hex: "#8b5cf6" },
  { name: "Neon Violet", hex: "#b026ff" },
  { name: "Plum Purple", hex: "#701a75" },
  { name: "Deep Lavender", hex: "#581c87" },
  { name: "Lavender Indigo", hex: "#818cf8" },

  // ── Indigos & Royal Blues (41-50) ──
  { name: "Royal Indigo", hex: "#6366f1" },
  { name: "Midnight Blue", hex: "#4338ca" },
  { name: "Navy Indigo", hex: "#1e1b4b" },
  { name: "Cobalt Blue", hex: "#1d4ed8" },
  { name: "Sapphire Blue", hex: "#1e40af" },
  { name: "Electric Blue", hex: "#3b82f6" },
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Cerulean Blue", hex: "#0ea5e9" },
  { name: "Neon Blue", hex: "#00b0ff" },
  { name: "Ice Cyan", hex: "#38bdf8" },

  // ── Cyans, Teals & Aquas (51-60) ──
  { name: "Deep Cyan", hex: "#0891b2" },
  { name: "Cyan Teal", hex: "#06b6d4" },
  { name: "Neon Cyan", hex: "#00ffff" },
  { name: "Ocean Aqua", hex: "#00e5ff" },
  { name: "Aquamarine", hex: "#2dd4bf" },
  { name: "Turquoise", hex: "#14b8a6" },
  { name: "Teal Jade", hex: "#10b981" },
  { name: "Dark Teal", hex: "#0f766e" },
  { name: "Mint Emerald", hex: "#34d399" },
  { name: "Pastel Mint", hex: "#6ee7b7" },

  // ── Greens, Limes & Emeralds (61-70) ──
  { name: "Emerald Green", hex: "#059669" },
  { name: "Forest Emerald", hex: "#047857" },
  { name: "Spring Green", hex: "#00e676" },
  { name: "Neon Green", hex: "#39ff14" },
  { name: "Lime Green", hex: "#84cc16" },
  { name: "Vivid Lime", hex: "#65a30d" },
  { name: "Neon Lime", hex: "#76ff03" },
  { name: "Chartreuse", hex: "#a3e635" },
  { name: "Golden Olive", hex: "#854d0e" },
  { name: "Sage Green", hex: "#84a98c" },

  // ── Neutrals, Cyberpunk & Earth Tones (71-80) ──
  { name: "Cyberpunk Yellow", hex: "#ffe600" },
  { name: "Sand Gold", hex: "#ddb892" },
  { name: "Mocha Brown", hex: "#7f5539" },
  { name: "Slate Accent", hex: "#94a3b8" },
  { name: "Titanium Grey", hex: "#cbd5e1" },
  { name: "Pure Silver", hex: "#a1a1aa" },
  { name: "Cool Grey", hex: "#64748b" },
  { name: "Warm Ivory", hex: "#fef08a" },
  { name: "Crisp Snow", hex: "#f8fafc" },
  { name: "Pure White", hex: "#ffffff" },
];

export const DEFAULT_ACCENT_HEX = "#a3e635";

export function ColorPaletteTester() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHex, setSelectedHex] = useState(DEFAULT_ACCENT_HEX);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status (Hide palette for non-logged-in users)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!(data?.authenticated && data?.user));
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const applyColorLive = useCallback((hex: string) => {
    if (typeof document === "undefined") return;

    // 1. Set global CSS variable on :root
    document.documentElement.style.setProperty("--accent-theme", hex);

    // 2. Dynamic style tag override
    let styleTag = document.getElementById("dynamic-accent-theme-overrides");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "dynamic-accent-theme-overrides";
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      :root { --accent-theme: ${hex} !important; }

      .text-accent-theme, [style*="#d97706"], [style*="#a3e635"], [style*="#f59e0b"] {
        color: ${hex} !important;
      }
      .bg-accent-theme, [style*="background-color: #d97706"], [style*="background-color: #a3e635"], [style*="background-color: #f59e0b"] {
        background-color: ${hex} !important;
      }
      .border-accent-theme, [style*="border-color: #d97706"], [style*="border-color: #a3e635"], [style*="border-color: #f59e0b"] {
        border-color: ${hex} !important;
      }
      .text-\\[\\#d97706\\], .text-\\[\\#a3e635\\], .text-\\[\\#f59e0b\\] { color: ${hex} !important; }
      .bg-\\[\\#d97706\\], .bg-\\[\\#a3e635\\], .bg-\\[\\#f59e0b\\] { background-color: ${hex} !important; }
      .border-\\[\\#d97706\\], .border-\\[\\#a3e635\\], .border-\\[\\#f59e0b\\] { border-color: ${hex} !important; }
      
      svg[class*="text-[#a3e635]"], svg[class*="text-[#d97706]"],
      .text-\\[\\#a3e635\\] svg, .text-\\[\\#d97706\\] svg {
        color: ${hex} !important;
        stroke: ${hex} !important;
      }
    `;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sde_accent_theme_hex");
    const initialHex = saved || DEFAULT_ACCENT_HEX;
    setSelectedHex(initialHex);
    applyColorLive(initialHex);

    const observer = new MutationObserver(() => {
      const current = localStorage.getItem("sde_accent_theme_hex") || initialHex;
      applyColorLive(current);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [applyColorLive]);

  const handleSelectColor = (hex: string) => {
    setSelectedHex(hex);
    localStorage.setItem("sde_accent_theme_hex", hex);
    applyColorLive(hex);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleResetDefault = () => {
    handleSelectColor(DEFAULT_ACCENT_HEX);
  };

  // Hide palette widget completely for non-logged-in visitors
  if (!isAuthenticated) {
    return null;
  }

  const filteredColors = EIGHTY_ACCENT_COLORS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hex.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="fixed bottom-5 right-5 z-[99999] select-none font-mono">
      {/* Floating Popover Drawer */}
      {isOpen && (
        <div
          className="mb-3 w-80 sm:w-96 rounded-2xl p-5 shadow-2xl border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5"
          style={{ backgroundColor: "#181818", borderColor: "#3a3a3a" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" style={{ color: selectedHex }} />
              <div>
                <h3 className="text-xs font-bold text-[#ffffff]">
                  Accent Color Customizer (80 Swatches)
                </h3>
                <p className="text-[10px] text-[#888888]">
                  Live test colors on sde.guide & copy hex code
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#777777] hover:text-[#ffffff] hover:bg-[#252525] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Color Code & Copy Bar */}
          <div className="p-3 rounded-xl border flex items-center justify-between gap-3 bg-[#121212] border-[#2a2a2a]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-7 w-7 rounded-lg shrink-0 border border-white/20 shadow"
                style={{ backgroundColor: selectedHex }}
              />
              <div className="min-w-0">
                <div className="text-[10px] text-[#888888] uppercase tracking-wider">
                  Selected Accent
                </div>
                <div className="text-xs font-bold text-[#ffffff] font-mono tracking-wide">
                  {selectedHex.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:opacity-90"
                style={{
                  backgroundColor: selectedHex,
                  color: selectedHex === "#ffffff" ? "#121212" : "#ffffff",
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Search Filter */}
          <input
            type="text"
            placeholder="Search 80 colors (e.g. amber, cyan, #00ffff)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg px-3 py-1.5 text-xs font-mono bg-[#121212] border border-[#2a2a2a] text-[#ffffff] outline-none placeholder-[#555555]"
          />

          {/* 80 Color Swatches Grid */}
          <div className="max-h-64 overflow-y-auto pr-1">
            <div className="grid grid-cols-8 gap-1.5">
              {filteredColors.map((item) => {
                const isSelected = selectedHex.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.hex}
                    onClick={() => handleSelectColor(item.hex)}
                    title={`${item.name} (${item.hex})`}
                    className="group relative flex h-7 w-full items-center justify-center rounded-md border transition-all hover:scale-110"
                    style={{
                      backgroundColor: item.hex,
                      borderColor: isSelected ? "#ffffff" : "rgba(255,255,255,0.15)",
                      boxShadow: isSelected ? `0 0 10px ${item.hex}` : undefined,
                    }}
                  >
                    {isSelected && (
                      <Check
                        className="h-3 w-3"
                        style={{ color: item.hex === "#ffffff" ? "#121212" : "#ffffff" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Reset & Helper */}
          <div className="flex items-center justify-between border-t pt-3 border-[#2a2a2a] text-[10px] text-[#888888]">
            <button
              onClick={handleResetDefault}
              className="flex items-center gap-1 hover:text-[#ffffff] transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Reset Default (#a3e635)
            </button>
            <span>{filteredColors.length} Swatches</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 border"
        style={{
          backgroundColor: "#181818",
          borderColor: selectedHex,
          color: "#ffffff",
          boxShadow: `0 4px 20px ${selectedHex}40`,
        }}
      >
        <Palette className="h-4 w-4" style={{ color: selectedHex }} />
        <span>Test 80 Accent Colors</span>
        <span
          className="h-2.5 w-2.5 rounded-full border border-white/40"
          style={{ backgroundColor: selectedHex }}
        />
      </button>
    </aside>
  );
}
