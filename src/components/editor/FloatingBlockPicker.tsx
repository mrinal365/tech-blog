"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  getPinnedBlocks,
  getBlocksByCategory,
  searchBlocks,
  categoryLabels,
  type BlockRegistryEntry,
} from "@/registry/blockRegistry";
import type { BlockCategory, BlockType } from "@/types/article";
import { Search, X } from "lucide-react";

interface FloatingBlockPickerProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export function FloatingBlockPicker({ onSelect, onClose }: FloatingBlockPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pinnedBlocks = useMemo(() => getPinnedBlocks(), []);

  const allCategories: BlockCategory[] = [
    "core-writing", "developer", "architecture", "comparison", "advanced",
  ];

  const filteredBlocks = useMemo(() => {
    if (searchQuery.trim()) return searchBlocks(searchQuery);
    return null;
  }, [searchQuery]);

  // Focus search on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-10 top-0 z-50 w-[280px] rounded-lg shadow-2xl overflow-hidden"
      style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
        <Search className="h-3.5 w-3.5 shrink-0" style={{ color: "#666" }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) setExpanded(true);
          }}
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#444]"
          style={{ color: "#e8e8e8" }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />
        <button onClick={onClose} className="rounded p-0.5 hover:bg-[#222]" style={{ color: "#666" }}>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Block List */}
      <div className="max-h-[320px] overflow-y-auto py-1">
        {filteredBlocks ? (
          // Search results
          filteredBlocks.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: "#666" }}>No blocks found</p>
          ) : (
            filteredBlocks.map((entry) => (
              <PickerItem key={entry.type} entry={entry} onSelect={onSelect} />
            ))
          )
        ) : (
          <>
            {/* Quick access */}
            <div className="px-3 pt-1 pb-0.5">
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#555" }}>
                Quick Add
              </span>
            </div>
            {pinnedBlocks.map((entry) => (
              <PickerItem key={entry.type} entry={entry} onSelect={onSelect} />
            ))}

            {/* Show more */}
            {!expanded ? (
              <button
                onClick={() => setExpanded(true)}
                className="w-full px-3 py-2 text-left text-[11px] font-mono transition-colors hover:bg-[#222]"
                style={{ color: "#666", borderTop: "1px solid #2a2a2a" }}
              >
                Show all blocks →
              </button>
            ) : (
              <>
                {allCategories.map((cat) => {
                  const blocks = getBlocksByCategory(cat).filter((b) => !b.pinned);
                  if (blocks.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="px-3 pt-3 pb-0.5">
                        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#555" }}>
                          {categoryLabels[cat]}
                        </span>
                      </div>
                      {blocks.map((entry) => (
                        <PickerItem key={entry.type} entry={entry} onSelect={onSelect} />
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PickerItem({ entry, onSelect }: { entry: BlockRegistryEntry; onSelect: (type: BlockType) => void }) {
  return (
    <button
      onClick={() => onSelect(entry.type)}
      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#222]"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium" style={{ color: "#e8e8e8" }}>{entry.label}</p>
        <p className="text-[10px] truncate" style={{ color: "#555" }}>{entry.description}</p>
      </div>
    </button>
  );
}
