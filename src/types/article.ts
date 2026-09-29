export type BlockType =
  | "heading"
  | "paragraph"
  | "rich-text"
  | "bullet-list"
  | "numbered-list"
  | "callout"
  | "code"
  | "terminal"
  | "file-tree"
  | "inline-code"
  | "api-request"
  | "http"
  | "architecture"
  | "flow"
  | "sequence"
  | "database-schema"
  | "json-viewer"
  | "config"
  | "comparison"
  | "benchmark"
  | "pros-cons"
  | "takeaways"
  | "definition"
  | "steps"
  | "react-component"
  | "playground"
  | "before-after"
  | "code-diff"
  | "image"
  | "embed"
  | "seo-block";

export type BlockCategory =
  | "core-writing"
  | "developer"
  | "architecture"
  | "comparison"
  | "advanced";

export interface BaseBlock {
  id: string;
  type: BlockType;
  version: number;
  data: Record<string, unknown>;
  metadata?: BlockMetadata;
  seo?: BlockSEO;
}

export interface BlockMetadata {
  className?: string;
  anchor?: string;
  caption?: string;
  visibility?: "public" | "draft";
}

export interface BlockSEO {
  enabled?: boolean;
  title?: string;
  description?: string;
}

export interface ArticleCover {
  url: string;
  alt: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  author: ArticleAuthor;
  category: string;
  tags: string[];
  cover?: ArticleCover;
  publishedAt?: string;
  updatedAt?: string;
  createdAt: string;
  readingTime?: number;
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  technologies?: string[];
}

export interface ArticleSEO {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: string;
}

export interface ArticleAISEO {
  primaryTopic: string;
  searchIntent: string;
  entities: string[];
  relatedConcepts: string[];
  questionsAnswered: string[];
  contentGaps: string[];
  suggestedSchema: string[];
  topicCoverage: number;
}

export interface ArticleSettings {
  readingTime: number;
  allowComments: boolean;
  showTableOfContents: boolean;
  showAuthorBio: boolean;
}

export type ArticleStatus = "draft" | "ready" | "published" | "archived";

export interface ArticleDocument {
  schemaVersion: string;
  article: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    author: ArticleAuthor;
    category: string;
    tags: string[];
    cover?: ArticleCover;
    status: ArticleStatus;
    blocks: BaseBlock[];
    seo: ArticleSEO;
    aiSeo: ArticleAISEO;
    metadata: ArticleMetadata;
    settings: ArticleSettings;
    createdAt: string;
    updatedAt: string;
  };
}

export type EditorMode = "edit" | "preview" | "split";
export type SidebarTab = "article" | "seo" | "ai-seo" | "structure";

export interface SEOCheck {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail";
  message: string;
}

export const ARTICLE_CATEGORIES = [
  "Frontend",
  "Backend",
  "React",
  "Next.js",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "System Design",
  "DevOps",
  "Cloud",
  "Databases",
  "AI / ML",
  "Security",
  "Mobile",
  "Architecture",
  "Open Source",
  "Career",
  "Programming",
] as const;

export const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner", color: "#888888" },
  { value: "intermediate", label: "Intermediate", color: "#aaaaaa" },
  { value: "advanced", label: "Advanced", color: "#cccccc" },
  { value: "expert", label: "Expert", color: "#ffffff" },
] as const;
