// Block Data Interfaces

// Core Writing Blocks
export interface HeadingBlockData {
  level: 2 | 3 | 4;
  text: string;
  anchorId?: string;
}

export interface ParagraphBlockData {
  text: string;
}

export interface RichTextBlockData {
  text: string;
  annotations?: Array<{
    type: "bold" | "italic" | "code" | "link" | "highlight" | "strikethrough" | "kbd";
    start: number;
    end: number;
    url?: string;
  }>;
}

export interface BulletListBlockData {
  items: string[];
}

export interface NumberedListBlockData {
  items: string[];
  startNumber?: number;
}

export type CalloutVariant = "info" | "tip" | "warning" | "danger" | "note" | "important";

export interface CalloutBlockData {
  variant: CalloutVariant;
  title?: string;
  text: string;
}

// Developer Blocks
export interface CodeBlockData {
  language: string;
  filename?: string;
  code: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export const CODE_LANGUAGES = [
  "javascript", "typescript", "jsx", "tsx", "python", "java",
  "c", "cpp", "csharp", "go", "rust", "php", "ruby", "swift",
  "kotlin", "dart", "scala", "sql", "html", "css", "scss",
  "json", "yaml", "xml", "graphql", "bash", "shell", "powershell",
  "dockerfile", "nginx", "markdown", "solidity", "lua", "r",
  "plaintext", "diff", "http", "env",
] as const;

export interface TerminalBlockData {
  lines: Array<{
    type: "command" | "output" | "comment";
    text: string;
  }>;
  title?: string;
}

export interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  highlight?: boolean;
}

export interface FileTreeBlockData {
  root: string;
  nodes: FileTreeNode[];
}

export interface InlineCodeBlockData {
  code: string;
  language?: string;
  description?: string;
}

export interface APIRequestBlockData {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers?: Array<{ key: string; value: string }>;
  body?: string;
  bodyLanguage?: string;
  response?: string;
  responseStatus?: number;
  responseLanguage?: string;
}

export interface HTTPBlockData {
  steps: Array<{
    from: string;
    to: string;
    method?: string;
    path?: string;
    statusCode?: number;
    label?: string;
  }>;
}

// Architecture Blocks
export interface ArchitectureNode {
  id: string;
  label: string;
  type: "client" | "server" | "database" | "cache" | "queue" | "storage" | "service" | "gateway" | "worker" | "cdn" | "custom";
  x?: number;
  y?: number;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
  style?: "solid" | "dashed" | "dotted";
}

export interface ArchitectureBlockData {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  layout: "horizontal" | "vertical";
  title?: string;
}

export interface FlowBlockData {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    type?: "process" | "decision" | "start" | "end";
  }>;
  connections: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
  direction: "vertical" | "horizontal";
}

export interface SequenceBlockData {
  actors: string[];
  messages: Array<{
    from: string;
    to: string;
    label: string;
    type?: "request" | "response" | "async";
  }>;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
  foreignKey?: string;
  defaultValue?: string;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

export interface DatabaseSchemaBlockData {
  tables: DatabaseTable[];
  relationships?: Array<{
    from: string;
    to: string;
    type: "one-to-one" | "one-to-many" | "many-to-many";
  }>;
}

export interface JSONViewerBlockData {
  json: string;
  title?: string;
  collapsedByDefault?: boolean;
}

export interface ConfigBlockData {
  language: string;
  filename?: string;
  content: string;
  highlightKeys?: string[];
}

// Comparison & Educational Blocks
export interface ComparisonBlockData {
  headers: string[];
  rows: Array<{
    cells: string[];
  }>;
  highlightColumn?: number;
}

export interface BenchmarkBlockData {
  title?: string;
  columns: string[];
  rows: Array<{
    cells: string[];
    highlight?: boolean;
  }>;
}

export interface ProsConsBlockData {
  pros: string[];
  cons: string[];
}

export interface TakeawaysBlockData {
  items: string[];
}

export interface DefinitionBlockData {
  term: string;
  definition: string;
  example?: string;
}

export interface StepBlockData {
  steps: Array<{
    title: string;
    description: string;
    code?: string;
    codeLanguage?: string;
  }>;
}

// Advanced Technical Blocks
export interface ReactComponentBlockData {
  componentName: string;
  props: Record<string, unknown>;
  description?: string;
  previewType?: "counter" | "tabs" | "toggle" | "form" | "custom";
}

export interface PlaygroundBlockData {
  language: string;
  code: string;
  output?: string;
  editable?: boolean;
}

export interface BeforeAfterBlockData {
  language: string;
  before: {
    code: string;
    label?: string;
  };
  after: {
    code: string;
    label?: string;
  };
}

export interface CodeDiffBlockData {
  language: string;
  filename?: string;
  diff: string;
}

export interface ImageBlockData {
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  height?: string;
}

export type EmbedProvider =
  | "github"
  | "codesandbox"
  | "stackblitz"
  | "youtube"
  | "figma"
  | "excalidraw"
  | "twitter"
  | "codepen"
  | "custom";

export interface EmbedBlockData {
  provider: EmbedProvider;
  url: string;
  title?: string;
  width?: string;
  height?: string;
}

// Block Data Union Type
export type BlockData =
  | HeadingBlockData
  | ParagraphBlockData
  | RichTextBlockData
  | BulletListBlockData
  | NumberedListBlockData
  | CalloutBlockData
  | CodeBlockData
  | TerminalBlockData
  | FileTreeBlockData
  | InlineCodeBlockData
  | APIRequestBlockData
  | HTTPBlockData
  | ArchitectureBlockData
  | FlowBlockData
  | SequenceBlockData
  | DatabaseSchemaBlockData
  | JSONViewerBlockData
  | ConfigBlockData
  | ComparisonBlockData
  | BenchmarkBlockData
  | ProsConsBlockData
  | TakeawaysBlockData
  | DefinitionBlockData
  | StepBlockData
  | ReactComponentBlockData
  | PlaygroundBlockData
  | BeforeAfterBlockData
  | CodeDiffBlockData
  | ImageBlockData
  | EmbedBlockData;
