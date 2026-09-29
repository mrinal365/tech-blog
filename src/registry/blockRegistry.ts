import { BlockType, BlockCategory, BaseBlock } from "@/types/article";

// Block Registry Entry
export interface BlockRegistryEntry {
  type: BlockType;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  category: BlockCategory;
  pinned: boolean; // Show in quick-access (6 pinned blocks)
  defaultData: Record<string, unknown>;
  version: number;
}

// The Registry
export const blockRegistry: Record<BlockType, BlockRegistryEntry> = {

  // CORE WRITING

  heading: {
    type: "heading",
    label: "Heading",
    description: "Section heading (H2, H3, H4)",
    icon: "Heading",
    category: "core-writing",
    pinned: true,
    version: 1,
    defaultData: { level: 2, text: "" },
  },

  paragraph: {
    type: "paragraph",
    label: "Paragraph",
    description: "Normal text block",
    icon: "Type",
    category: "core-writing",
    pinned: true,
    version: 1,
    defaultData: { text: "" },
  },

  "rich-text": {
    type: "rich-text",
    label: "Rich Text",
    description: "Advanced formatted text with annotations",
    icon: "AlignLeft",
    category: "core-writing",
    pinned: false,
    version: 1,
    defaultData: { text: "", annotations: [] },
  },

  "bullet-list": {
    type: "bullet-list",
    label: "Bullet List",
    description: "Unordered list of items",
    icon: "List",
    category: "core-writing",
    pinned: false,
    version: 1,
    defaultData: { items: [""] },
  },

  "numbered-list": {
    type: "numbered-list",
    label: "Numbered List",
    description: "Ordered list of items",
    icon: "ListOrdered",
    category: "core-writing",
    pinned: false,
    version: 1,
    defaultData: { items: [""], startNumber: 1 },
  },

  callout: {
    type: "callout",
    label: "Callout",
    description: "Info, tip, warning, danger, note, important",
    icon: "MessageSquare",
    category: "core-writing",
    pinned: true,
    version: 1,
    defaultData: { variant: "info", title: "", text: "" },
  },

  // DEVELOPER

  code: {
    type: "code",
    label: "Code Block",
    description: "Syntax-highlighted code with filename and line numbers",
    icon: "Code",
    category: "developer",
    pinned: true,
    version: 1,
    defaultData: {
      language: "typescript",
      filename: "",
      code: "",
      highlightLines: [],
      showLineNumbers: true,
    },
  },

  terminal: {
    type: "terminal",
    label: "Terminal",
    description: "CLI commands and output",
    icon: "Terminal",
    category: "developer",
    pinned: true,
    version: 1,
    defaultData: {
      lines: [{ type: "command", text: "" }],
      title: "Terminal",
    },
  },

  "file-tree": {
    type: "file-tree",
    label: "File Tree",
    description: "Directory structure visualization",
    icon: "FolderTree",
    category: "developer",
    pinned: true,
    version: 1,
    defaultData: {
      root: "my-app/",
      files: [
        { path: "my-app/", type: "directory" },
        { path: "my-app/src/index.js", type: "file" },
        { path: "my-app/package.json", type: "file" },
      ],
    },
  },

  "inline-code": {
    type: "inline-code",
    label: "Inline Code",
    description: "Single expression or command",
    icon: "CodeXml",
    category: "developer",
    pinned: false,
    version: 1,
    defaultData: { code: "", language: "typescript", description: "" },
  },

  "api-request": {
    type: "api-request",
    label: "API Request",
    description: "HTTP endpoint with request/response",
    icon: "Globe",
    category: "developer",
    pinned: false,
    version: 1,
    defaultData: {
      method: "GET",
      url: "/api/",
      headers: [],
      body: "",
      bodyLanguage: "json",
      response: "",
      responseStatus: 200,
      responseLanguage: "json",
    },
  },

  http: {
    type: "http",
    label: "HTTP Flow",
    description: "Client → Server request/response visualization",
    icon: "ArrowLeftRight",
    category: "developer",
    pinned: false,
    version: 1,
    defaultData: {
      steps: [{ from: "Client", to: "API", method: "POST", path: "/", statusCode: 200, label: "" }],
    },
  },

  // ARCHITECTURE

  architecture: {
    type: "architecture",
    label: "Architecture",
    description: "System architecture diagram with nodes and edges",
    icon: "Network",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: {
      nodes: [],
      edges: [],
      layout: "horizontal",
      title: "",
    },
  },

  flow: {
    type: "flow",
    label: "Flow Diagram",
    description: "Process flow with steps and decisions",
    icon: "GitBranch",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: {
      steps: [],
      connections: [],
      direction: "vertical",
    },
  },

  sequence: {
    type: "sequence",
    label: "Sequence Diagram",
    description: "Actor-to-actor message timeline",
    icon: "MessageSquareMore",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: {
      actors: ["Client", "Server"],
      messages: [],
    },
  },

  "database-schema": {
    type: "database-schema",
    label: "Database Schema",
    description: "Table definitions with columns and relationships",
    icon: "Database",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: {
      tables: [{ name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }] }],
      relationships: [],
    },
  },

  "json-viewer": {
    type: "json-viewer",
    label: "JSON Viewer",
    description: "Collapsible syntax-highlighted JSON",
    icon: "Braces",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: { json: "{}", title: "", collapsedByDefault: false },
  },

  config: {
    type: "config",
    label: "Config Block",
    description: "Configuration file display (JSON, YAML, TOML, ENV)",
    icon: "Settings",
    category: "architecture",
    pinned: false,
    version: 1,
    defaultData: { language: "json", filename: "", content: "", highlightKeys: [] },
  },

  // COMPARISON / EDUCATIONAL

  comparison: {
    type: "comparison",
    label: "Comparison Table",
    description: "Feature comparison matrix",
    icon: "Columns3",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: {
      headers: ["Feature", "Option A", "Option B"],
      rows: [{ cells: ["", "", ""] }],
    },
  },

  benchmark: {
    type: "benchmark",
    label: "Benchmark",
    description: "Performance metrics table",
    icon: "BarChart3",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: {
      title: "",
      columns: ["Operation", "Avg", "P95", "P99"],
      rows: [{ cells: ["", "", "", ""], highlight: false }],
    },
  },

  "pros-cons": {
    type: "pros-cons",
    label: "Pros & Cons",
    description: "Advantages and disadvantages columns",
    icon: "Scale",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: { pros: [""], cons: [""] },
  },

  takeaways: {
    type: "takeaways",
    label: "Key Takeaways",
    description: "Numbered summary points",
    icon: "Lightbulb",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: { items: [""] },
  },

  definition: {
    type: "definition",
    label: "Definition",
    description: "Term and explanation card",
    icon: "BookOpen",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: { term: "", definition: "", example: "" },
  },

  steps: {
    type: "steps",
    label: "Step-by-Step",
    description: "Numbered tutorial steps",
    icon: "FootprintsIcon",
    category: "comparison",
    pinned: false,
    version: 1,
    defaultData: {
      steps: [{ title: "", description: "", code: "", codeLanguage: "" }],
    },
  },

  // ADVANCED TECHNICAL

  "react-component": {
    type: "react-component",
    label: "React Component",
    description: "Interactive component preview",
    icon: "Atom",
    category: "advanced",
    pinned: false,
    version: 1,
    defaultData: {
      componentName: "",
      props: {},
      description: "",
      previewType: "custom",
    },
  },

  playground: {
    type: "playground",
    label: "Code Playground",
    description: "Code with output preview",
    icon: "Play",
    category: "advanced",
    pinned: false,
    version: 1,
    defaultData: {
      language: "javascript",
      code: "",
      output: "",
      editable: false,
    },
  },

  "before-after": {
    type: "before-after",
    label: "Before / After",
    description: "Side-by-side code comparison",
    icon: "Diff",
    category: "advanced",
    pinned: false,
    version: 1,
    defaultData: {
      language: "typescript",
      before: { code: "", label: "Before" },
      after: { code: "", label: "After" },
    },
  },

  "code-diff": {
    type: "code-diff",
    label: "Code Diff",
    description: "Git-style unified diff",
    icon: "GitCompare",
    category: "advanced",
    pinned: false,
    version: 1,
    defaultData: { language: "typescript", filename: "", diff: "" },
  },

  image: {
    type: "image",
    label: "Image",
    description: "Screenshot, diagram, or visual asset",
    icon: "Image",
    category: "advanced",
    pinned: true,
    version: 1,
    defaultData: { src: "", alt: "", caption: "", width: "", height: "" },
  },

  embed: {
    type: "embed",
    label: "Embed",
    description: "GitHub, CodeSandbox, YouTube, Figma, etc.",
    icon: "ExternalLink",
    category: "advanced",
    pinned: false,
    version: 1,
    defaultData: { provider: "github", url: "", title: "" },
  },

  "seo-block": {
    type: "seo-block",
    label: "SEO & AI Search Overview",
    description: "Target keyword, intent, key entities, and FAQ schema breakdown",
    icon: "Sparkles",
    category: "advanced",
    pinned: true,
    version: 1,
    defaultData: {
      primaryKeyword: "",
      targetIntent: "",
      entities: [],
      questionsAnswered: [],
      topicCoverage: 100,
      suggestedSchema: ["TechArticle"],
    },
  },
};

// Helper: Get pinned blocks
export function getPinnedBlocks(): BlockRegistryEntry[] {
  return Object.values(blockRegistry).filter((b) => b.pinned);
}

// Helper: Get blocks by category
export function getBlocksByCategory(category: BlockCategory): BlockRegistryEntry[] {
  return Object.values(blockRegistry).filter((b) => b.category === category);
}

// Helper: Get all blocks
export function getAllBlocks(): BlockRegistryEntry[] {
  return Object.values(blockRegistry);
}

// Helper: Search blocks
export function searchBlocks(query: string): BlockRegistryEntry[] {
  const q = query.toLowerCase();
  return Object.values(blockRegistry).filter(
    (b) =>
      b.label.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.type.includes(q)
  );
}

// Helper: Create a new block instance
export function createBlock(type: BlockType, customData?: Record<string, unknown>): BaseBlock {
  const entry = blockRegistry[type];
  return {
    id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type,
    version: entry ? entry.version : 1,
    data: customData ? { ...(entry?.defaultData || {}), ...customData } : { ...(entry?.defaultData || {}) },
    metadata: { visibility: "public" },
  };
}

// Category labels
export const categoryLabels: Record<BlockCategory, string> = {
  "core-writing": "Core Writing",
  developer: "Developer",
  architecture: "Architecture",
  comparison: "Comparison & Educational",
  advanced: "Advanced Technical",
};
