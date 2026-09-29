"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { addBlock } from "@/store/articleStore";
import { blockRegistry } from "@/registry/blockRegistry";
import type { BlockType } from "@/types/article";
import {
  Search,
  Plus,
  Heading,
  Type,
  List,
  ListOrdered,
  MessageSquare,
  Code,
  Terminal,
  FolderTree,
  CodeXml,
  Settings,
  Diff,
  GitCompare,
  Play,
  Globe,
  ArrowLeftRight,
  Network,
  GitBranch,
  MessageSquareMore,
  Database,
  Braces,
  Columns3,
  BarChart3,
  Scale,
  Footprints,
  CheckSquare,
  BookOpen,
  Atom,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Info,
} from "lucide-react";

interface BlockDockLeftProps {
  onClose?: () => void;
}

const BLOCK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  paragraph: Type,
  "rich-text": Type,
  heading: Heading,
  "bullet-list": List,
  "numbered-list": ListOrdered,
  callout: MessageSquare,
  code: Code,
  terminal: Terminal,
  "file-tree": FolderTree,
  "inline-code": CodeXml,
  config: Settings,
  "code-diff": Diff,
  "before-after": GitCompare,
  playground: Play,
  "api-request": Globe,
  http: ArrowLeftRight,
  architecture: Network,
  flow: GitBranch,
  sequence: MessageSquareMore,
  "database-schema": Database,
  "json-viewer": Braces,
  comparison: Columns3,
  benchmark: BarChart3,
  "pros-cons": Scale,
  steps: Footprints,
  takeaways: CheckSquare,
  image: ImageIcon,
  embed: ExternalLink,
  definition: BookOpen,
  "react-component": Atom,
  "seo-block": Sparkles,
};

const BLOCK_TOOLTIPS: Record<string, { explanation: string; example: string }> = {
  heading: {
    explanation: "Hierarchical section titles (H2, H3, H4) used to organize article structure, build Table of Contents, and optimize SEO.",
    example: "H2: Connection Pooling Architecture",
  },
  paragraph: {
    explanation: "Standard text block for article narrative, architectural deep dives, technical context, and code explanations.",
    example: "We benchmarked connection pool sizes under 10,000 concurrent socket requests...",
  },
  "rich-text": {
    explanation: "Formatted rich text container supporting custom inline annotations and code highlighting.",
    example: "Use React.memo to prevent unnecessary child re-renders.",
  },
  "bullet-list": {
    explanation: "Unordered bullet list for quick scannability of key takeaways, highlights, or technical requirements.",
    example: "• Sub-10ms response latency\n• Stateless horizontal scaling",
  },
  "numbered-list": {
    explanation: "Ordered sequential list for step-by-step procedures, prioritized criteria, or execution order.",
    example: "1. Clone Git repo\n2. Configure env variables",
  },
  callout: {
    explanation: "Highlighted container (Info, Tip, Warning, Danger, Note) to emphasize critical caveats or security tips.",
    example: "Warning: Do not expose secret credentials in client-side code.",
  },
  code: {
    explanation: "Syntax-highlighted code editor supporting 15+ languages, line numbers, filenames, and copy-to-clipboard.",
    example: "export async function GET() { return Response.json({ ok: true }); }",
  },
  terminal: {
    explanation: "Authentic dark CLI session simulator displaying commands ($), outputs (→), and comments (#).",
    example: "$ npm run build\n→ Compiled successfully in 1.4s",
  },
  "file-tree": {
    explanation: "Visual collapsible directory structure showing file and folder hierarchies.",
    example: "my-app/\n├── src/index.ts\n└── package.json",
  },
  "inline-code": {
    explanation: "Single expression or inline code badge with description tooltip.",
    example: "const pool = new Pool();",
  },
  config: {
    explanation: "Configuration file display (JSON, YAML, TOML, ENV) with syntax highlighting.",
    example: "MONGODB_URI=mongodb://localhost:27017",
  },
  playground: {
    explanation: "Interactive code playground container with live execution output preview.",
    example: "console.log('Hello DevArticle!');",
  },
  "api-request": {
    explanation: "HTTP API endpoint card displaying HTTP method, request headers, body, and response preview.",
    example: "GET /api/v1/articles → 200 OK",
  },
  http: {
    explanation: "Client-server HTTP request/response flow diagram with step-by-step status codes.",
    example: "Client → POST /api/login → 200 OK",
  },
  architecture: {
    explanation: "System architecture node graph visualizing services, microservices, and database connections.",
    example: "Frontend App → API Gateway → Redis Cache",
  },
  flow: {
    explanation: "Process flowchart showing execution steps, branch conditions, and outcomes.",
    example: "Validate Token → Query DB → Send Response",
  },
  sequence: {
    explanation: "UML sequence diagram showing message timelines between actors and services.",
    example: "User -> Client: Click Submit\nClient -> API: Auth Request",
  },
  "database-schema": {
    explanation: "Database table schema visualizer with columns, data types, primary keys, and relationships.",
    example: "Table: users | id: uuid (PK) | email: string",
  },
  "json-viewer": {
    explanation: "Interactive collapsible JSON viewer with copy and syntax highlighting.",
    example: '{ "status": "ok", "latencyMs": 4 }',
  },
  comparison: {
    explanation: "Multi-column feature matrix table contrasting frameworks, specs, libraries, or architectural tradeoffs.",
    example: "Feature | Redis | Memcached\nPersistence | Yes (AOF) | No",
  },
  benchmark: {
    explanation: "Empirical performance testing results card displaying latency (p99), ops/sec, or memory footprint.",
    example: "Metric: p99 Latency | Value: 12ms",
  },
  "pros-cons": {
    explanation: "Side-by-side evaluation cards contrasting advantages vs disadvantages of a solution.",
    example: "Pros: Low latency | Cons: Higher memory usage",
  },
  steps: {
    explanation: "Numbered step-by-step tutorial walkthrough container with step titles and detailed explanations.",
    example: "Step 1: Install Dependencies\nStep 2: Generate Auth Tokens",
  },
  takeaways: {
    explanation: "Numbered summary card highlighting key technical conclusions for executive TL;DRs and retention.",
    example: "01. Redis caching reduced p99 query latency from 120ms to 8ms.",
  },
  definition: {
    explanation: "Structured technical glossary card presenting specialized jargon, formal definition, and real-world example.",
    example: "Term: RAG | Def: Combining vector search with LLMs",
  },
  "react-component": {
    explanation: "Live interactive React widget embedded inside the article canvas (Counter, RAG Latency Calculator, Subsea Telemetry).",
    example: "ComponentName: CounterWidget",
  },
  image: {
    explanation: "High-resolution article diagram, screenshot, or infographic with required SEO alt text.",
    example: "Alt text: Next.js 16 Server Components Architecture Flowchart",
  },
  embed: {
    explanation: "Embeds external developer assets like GitHub Gists, CodeSandbox dynamic demos, YouTube videos, or Figma designs.",
    example: "Provider: github | URL: https://gist.github.com/...",
  },
  "code-diff": {
    explanation: "Git-style unified diff showing exact added (+) and removed (-) lines of code between commits or versions.",
    example: "- const url = '/v1/users';\n+ const url = '/v2/users';",
  },
  "before-after": {
    explanation: "Side-by-side code blocks showing code before refactoring versus clean optimized code after refactoring.",
    example: "Before: 120 lines procedural callbacks\nAfter: 15 lines async/await pipeline",
  },
  "seo-block": {
    explanation: "Comprehensive SEO & GEO meta block specifying primary focus keywords, search intent, recognized entities, and FAQ schema.",
    example: "Primary Keyword: Next.js 16 MongoDB Engine",
  },
};

import { PortalTooltip } from "@/components/common/PortalTooltip";

function BlockPaletteItem({
  type,
  entry,
  IconComp,
  onAdd,
}: {
  type: BlockType;
  entry: { label: string; description: string };
  IconComp: React.ComponentType<{ className?: string }>;
  onAdd: (type: BlockType) => void;
}) {
  const info = BLOCK_TOOLTIPS[type] || {
    explanation: "Structured technical block for developer articles.",
    example: "Standard block configuration",
  };

  return (
    <div
      className="group rounded p-2 transition-all hover:bg-[#222222] hover:border-[#444444]"
      style={{ border: "1px solid #222222", backgroundColor: "#1c1c1c" }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => onAdd(type)}
          className="flex flex-1 items-center gap-2.5 min-w-0 text-left cursor-pointer"
        >
          {/* Icon Avatar Box */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded"
            style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a" }}
          >
            <IconComp className="h-3.5 w-3.5 text-[#ffffff] group-hover:scale-110 transition-transform" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#e8e8e8] group-hover:text-[#ffffff] truncate">
              {entry.label}
            </p>
            <p className="text-[10px] text-[#777777] truncate mt-0.5">{entry.description}</p>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <PortalTooltip
            title={entry.label}
            explanation={info.explanation}
            example={info.example}
            iconSize="h-3.5 w-3.5"
          />
          <button
            onClick={() => onAdd(type)}
            className="p-1 text-[#666666] hover:text-[#ffffff] transition-transform hover:scale-110 focus:outline-none"
            title="Add block to canvas"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  {
    name: "Core Writing",
    items: ["paragraph", "heading", "rich-text", "bullet-list", "numbered-list", "callout", "definition", "takeaways"] as BlockType[],
  },
  {
    name: "Developer & Code",
    items: ["code", "terminal", "file-tree", "inline-code", "config", "code-diff", "before-after", "playground"] as BlockType[],
  },
  {
    name: "Architecture & APIs",
    items: ["api-request", "http", "architecture", "flow", "sequence", "database-schema", "json-viewer"] as BlockType[],
  },
  {
    name: "Comparison & Tutorials",
    items: ["comparison", "benchmark", "pros-cons", "steps"] as BlockType[],
  },
  {
    name: "Media & SEO",
    items: ["image", "embed", "react-component", "seo-block"] as BlockType[],
  },
];

export function BlockDockLeft({ onClose }: BlockDockLeftProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = (type: BlockType) => {
    dispatch(addBlock({ type }));
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden text-xs"
      style={{ backgroundColor: "#161616", borderRight: "1px solid #2a2a2a" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#1c1c1c" }}
      >
        <span className="font-mono font-bold uppercase tracking-wider text-[#ffffff]">
          Block Palette ({Object.keys(blockRegistry).length})
        </span>
        <span className="text-[10px] font-mono text-[#777777]">1-Click Add</span>
      </div>

      {/* Search */}
      <div className="p-3 border-b shrink-0" style={{ borderColor: "#2a2a2a", backgroundColor: "#181818" }}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666]" />
          <input
            type="text"
            placeholder="Search all 31 block types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded px-2.5 py-1.5 pl-8 text-xs outline-none placeholder:text-[#666666]"
            style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
          />
        </div>
      </div>

      {/* Categories & Blocks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.map((cat) => {
          const matchingItems = cat.items.filter((t) => {
            const entry = blockRegistry[t];
            if (!entry) return false;
            return (
              !searchQuery ||
              entry.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
          });

          if (matchingItems.length === 0) return null;

          return (
            <div key={cat.name}>
              <p className="px-1 mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#777777]">
                {cat.name} ({matchingItems.length})
              </p>
              <div className="space-y-1.5">
                {matchingItems.map((type) => {
                  const entry = blockRegistry[type];
                  if (!entry) return null;
                  const IconComp = BLOCK_ICONS[type] || HelpCircle;

                  return (
                    <BlockPaletteItem
                      key={type}
                      type={type}
                      entry={entry}
                      IconComp={IconComp}
                      onAdd={handleAdd}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
