"use client";

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { addBlock } from "@/store/articleStore";
import {
  getPinnedBlocks,
  getBlocksByCategory,
  searchBlocks,
  categoryLabels,
  type BlockRegistryEntry,
} from "@/registry/blockRegistry";
import type { BlockCategory, BlockType } from "@/types/article";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Heading,
  Type,
  AlignLeft,
  List,
  ListOrdered,
  MessageSquare,
  Code,
  Terminal,
  FolderTree,
  CodeXml,
  Globe,
  ArrowLeftRight,
  Network,
  GitBranch,
  MessageSquareMore,
  Database,
  Braces,
  Settings,
  Columns3,
  BarChart3,
  Scale,
  Lightbulb,
  BookOpen,
  Footprints,
  Atom,
  Play,
  Diff,
  GitCompare,
  Image,
  ExternalLink,
} from "lucide-react";

// Icon map
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heading, Type, AlignLeft, List, ListOrdered, MessageSquare,
  Code, Terminal, FolderTree, CodeXml, Globe, ArrowLeftRight,
  Network, GitBranch, MessageSquareMore, Database, Braces, Settings,
  Columns3, BarChart3, Scale, Lightbulb, BookOpen, FootprintsIcon: Footprints,
  Atom, Play, Diff, GitCompare, Image, ExternalLink,
};

function BlockIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const IconComp = ICON_MAP[iconName];
  if (!IconComp) return <Code className={className} style={style} />;
  return <IconComp className={className} style={style} />;
}

interface BlockLibraryProps {
  insertAtIndex?: number;
}

export function BlockLibrary({ insertAtIndex }: BlockLibraryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pinnedBlocks = useMemo(() => getPinnedBlocks(), []);

  const allCategories: BlockCategory[] = [
    "core-writing",
    "developer",
    "architecture",
    "comparison",
    "advanced",
  ];

  const filteredBlocks = useMemo(() => {
    if (searchQuery.trim()) {
      return searchBlocks(searchQuery);
    }
    return null;
  }, [searchQuery]);

  const handleAddBlock = (type: BlockType) => {
    dispatch(addBlock({ type, index: insertAtIndex }));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "#777777" }}>
          Blocks
        </h2>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#666666" }} />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-[#666666]"
            style={{
              backgroundColor: "#222222",
              border: "1px solid #2a2a2a",
              color: "#e8e8e8",
            }}
          />
        </div>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Search Results */}
        {filteredBlocks ? (
          <div className="space-y-1">
            {filteredBlocks.length === 0 && (
              <p className="px-2 py-4 text-center text-xs" style={{ color: "#666666" }}>
                No blocks found
              </p>
            )}
            {filteredBlocks.map((entry) => (
              <BlockButton key={entry.type} entry={entry} onClick={() => handleAddBlock(entry.type)} />
            ))}
          </div>
        ) : (
          <>
            {/* Pinned Blocks */}
            <div className="mb-4">
              <p className="mb-2 px-1 text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: "#777777" }}>
                Quick Access
              </p>
              <div className="space-y-0.5">
                {pinnedBlocks.map((entry) => (
                  <BlockButton key={entry.type} entry={entry} onClick={() => handleAddBlock(entry.type)} />
                ))}
              </div>
            </div>

            {/* Expand Toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-3 flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-colors hover:bg-[#222222]"
              style={{ color: "#aaaaaa", border: "1px solid #2a2a2a", backgroundColor: "#1a1a1a" }}
            >
              <Plus className="h-3.5 w-3.5" style={{ color: "#e8e8e8" }} />
              <span>{expanded ? "Less blocks" : "More blocks"}</span>
              {expanded ? (
                <ChevronUp className="ml-auto h-3.5 w-3.5" style={{ color: "#777777" }} />
              ) : (
                <ChevronDown className="ml-auto h-3.5 w-3.5" style={{ color: "#777777" }} />
              )}
            </button>

            {/* Full Library */}
            {expanded && (
              <div className="space-y-4">
                {allCategories.map((cat) => {
                  const blocks = getBlocksByCategory(cat).filter((b) => !b.pinned);
                  if (blocks.length === 0) return null;

                  return (
                    <div key={cat}>
                      <p
                        className="mb-2 px-1 text-[10px] font-mono font-semibold uppercase tracking-widest"
                        style={{ color: "#777777" }}
                      >
                        {categoryLabels[cat]}
                      </p>
                      <div className="space-y-0.5">
                        {blocks.map((entry) => (
                          <BlockButton key={entry.type} entry={entry} onClick={() => handleAddBlock(entry.type)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Single Block Button
function BlockButton({
  entry,
  onClick,
}: {
  entry: BlockRegistryEntry;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-[#222222]"
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded"
        style={{ backgroundColor: "#222222", border: "1px solid #2a2a2a" }}
      >
        <BlockIcon iconName={entry.icon} className="h-3.5 w-3.5" style={{ color: "#cccccc" }} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium" style={{ color: "#e8e8e8" }}>
          {entry.label}
        </p>
        <p className="truncate text-[10px]" style={{ color: "#888888" }}>
          {entry.description}
        </p>
      </div>
    </button>
  );
}
