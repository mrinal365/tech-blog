import { ArticleDocument, BaseBlock, BlockType } from "@/types/article";
import { blockRegistry } from "@/registry/blockRegistry";

export const CURRENT_SCHEMA_VERSION = "1.0";

// Validation Result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  migrated: boolean;
}

// Validate article structure
export function validateArticleJSON(json: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!json || typeof json !== "object") {
    return { valid: false, errors: ["Input is not a valid JSON object"], warnings: [], migrated: false };
  }

  const doc = json as Record<string, unknown>;

  // Check schemaVersion
  if (!doc.schemaVersion) {
    warnings.push("Missing top-level 'schemaVersion' — assuming '1.0.0'");
  }

  // Check article root
  if (!doc.article || typeof doc.article !== "object") {
    errors.push("Missing 'article' root object in payload. Expected structure: { schemaVersion: '1.0.0', article: { title: '...', blocks: [...] } }");
    return { valid: false, errors, warnings, migrated: false };
  }

  const article = doc.article as Record<string, unknown>;

  // Check title
  if (!article.title && typeof article.title !== "string") {
    warnings.push("Missing 'article.title' — article will be named 'Untitled Article'");
  }

  // Check blocks
  if (!article.blocks || !Array.isArray(article.blocks)) {
    errors.push("'article.blocks' must be an array of block objects");
    return { valid: false, errors, warnings, migrated: false };
  }

  if (article.blocks.length === 0) {
    errors.push("'article.blocks' array is empty. At least one content block (e.g. paragraph, heading, seo-block) is required.");
    return { valid: false, errors, warnings, migrated: false };
  }

  // Validate each block
  const blocks = article.blocks as Record<string, unknown>[];
  blocks.forEach((block, index) => {
    if (!block || typeof block !== "object") {
      errors.push(`Block at index ${index}: Block element is not an object.`);
      return;
    }

    if (!block.type || typeof block.type !== "string") {
      errors.push(`Block at index ${index}: Missing required 'type' property.`);
      return;
    }

    if (!blockRegistry[block.type as keyof typeof blockRegistry]) {
      errors.push(
        `Block at index ${index}: Unknown block type '${block.type}'. Valid types are: ${Object.keys(blockRegistry).join(", ")}`
      );
      return;
    }

    // Check data presence (either nested inside block.data OR flat on block object)
    const systemKeys = new Set(["id", "type", "version", "metadata", "seo", "data"]);
    const hasNestedData = block.data && typeof block.data === "object" && Object.keys(block.data as object).length > 0;
    const hasFlatData = Object.keys(block).some((key) => !systemKeys.has(key));

    if (!hasNestedData && !hasFlatData) {
      warnings.push(`Block at index ${index} ('${block.type}'): missing content fields. Default empty template will be used.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    migrated: false,
  };
}

// Migrate article to current version
export function migrateArticle(json: Record<string, unknown>): ArticleDocument {
  const rawArticle = (json.article || {}) as Record<string, unknown>;
  const now = new Date().toISOString();

  const title = (rawArticle.title as string) || "Untitled Article";
  const slug =
    (rawArticle.slug as string) ||
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  let seoBlockFoundData: Record<string, unknown> | null = null;
  const rawBlocks = (rawArticle.blocks || []) as Record<string, unknown>[];

  const blocks: BaseBlock[] = rawBlocks.map((rawBlock: Record<string, unknown>, index: number) => {
    const blockType = (rawBlock.type as BlockType) || "paragraph";
    const entry = blockRegistry[blockType];
    const defaultData = entry ? { ...entry.defaultData } : {};

    // Extract block data: check both nested block.data and flat block properties
    let extractedData: Record<string, unknown> = {};
    if (rawBlock.data && typeof rawBlock.data === "object") {
      extractedData = { ...(rawBlock.data as Record<string, unknown>) };
    } else {
      const systemKeys = new Set(["id", "type", "version", "metadata", "seo", "data"]);
      for (const [key, val] of Object.entries(rawBlock)) {
        if (!systemKeys.has(key)) {
          extractedData[key] = val;
        }
      }
    }

    // Merge extracted properties over default block data
    const finalData = { ...defaultData, ...extractedData };

    if (blockType === "seo-block") {
      seoBlockFoundData = finalData;
    }

    return {
      id: (rawBlock.id as string) || `blk_imported_${Date.now()}_${index}`,
      type: blockType,
      version: typeof rawBlock.version === "number" ? rawBlock.version : 1,
      data: finalData,
      metadata: (rawBlock.metadata as BaseBlock["metadata"]) || { visibility: "public" },
    };
  });

  // Ensure article.seo
  const rawSeo = (rawArticle.seo || {}) as Record<string, unknown>;
  const seoData = seoBlockFoundData as Record<string, unknown> | null;

  const seo = {
    metaTitle: (rawSeo.metaTitle as string) || title,
    metaDescription: (rawSeo.metaDescription as string) || (rawArticle.subtitle as string) || "",
    primaryKeyword: (rawSeo.primaryKeyword as string) || (seoData?.primaryKeyword as string) || "",
    secondaryKeywords: Array.isArray(rawSeo.secondaryKeywords)
      ? (rawSeo.secondaryKeywords as string[])
      : Array.isArray(seoData?.entities)
      ? (seoData?.entities as string[])
      : [],
    canonicalUrl: (rawSeo.canonicalUrl as string) || "",
  };

  // Ensure article.aiSeo
  const rawAiSeo = (rawArticle.aiSeo || {}) as Record<string, unknown>;
  const aiSeo = {
    primaryTopic: (rawAiSeo.primaryTopic as string) || (seoData?.primaryKeyword as string) || title,
    searchIntent: (rawAiSeo.searchIntent as string) || (seoData?.targetIntent as string) || "",
    entities: Array.isArray(rawAiSeo.entities)
      ? (rawAiSeo.entities as string[])
      : Array.isArray(seoData?.entities)
      ? (seoData?.entities as string[])
      : [],
    relatedConcepts: Array.isArray(rawAiSeo.relatedConcepts) ? (rawAiSeo.relatedConcepts as string[]) : [],
    questionsAnswered: Array.isArray(rawAiSeo.questionsAnswered)
      ? (rawAiSeo.questionsAnswered as string[])
      : Array.isArray(seoData?.questionsAnswered)
      ? (seoData?.questionsAnswered as string[])
      : [],
    contentGaps: Array.isArray(rawAiSeo.contentGaps) ? (rawAiSeo.contentGaps as string[]) : [],
    suggestedSchema: Array.isArray(rawAiSeo.suggestedSchema)
      ? (rawAiSeo.suggestedSchema as string[])
      : Array.isArray(seoData?.suggestedSchema)
      ? (seoData?.suggestedSchema as string[])
      : ["TechArticle"],
    topicCoverage:
      typeof rawAiSeo.topicCoverage === "number"
        ? rawAiSeo.topicCoverage
        : typeof seoData?.topicCoverage === "number"
        ? (seoData.topicCoverage as number)
        : 96,
  };

  const rawMeta = (rawArticle.metadata || {}) as Record<string, unknown>;
  const rawAuthor = (rawArticle.author || rawMeta.author || {}) as Record<string, unknown>;

  const author = {
    id: (rawAuthor.id as string) || "author-mrinal",
    name: (rawAuthor.name as string) || "Mrinal",
    avatar: (rawAuthor.avatar as string) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: (rawAuthor.role as string) || "Full-Stack Developer",
  };

  const metadata = {
    title,
    slug,
    subtitle: (rawArticle.subtitle as string) || "",
    description: (rawArticle.subtitle as string) || (rawMeta.description as string) || "",
    author,
    category: (rawArticle.category as string) || (rawMeta.category as string) || "Databases",
    tags: (rawArticle.tags as string[]) || (rawMeta.tags as string[]) || [],
    createdAt: (rawArticle.createdAt as string) || now,
    readingTime: (rawMeta.readingTime as number) || 5,
    difficulty: (rawMeta.difficulty as "beginner" | "intermediate" | "advanced" | "expert") || "intermediate",
    technologies: (rawMeta.technologies as string[]) || (rawArticle.tags as string[]) || [],
  };

  const rawSettings = (rawArticle.settings || {}) as Record<string, unknown>;
  const settings = {
    readingTime: (rawSettings.readingTime as number) || 5,
    allowComments: typeof rawSettings.allowComments === "boolean" ? rawSettings.allowComments : true,
    showTableOfContents: typeof rawSettings.showTableOfContents === "boolean" ? rawSettings.showTableOfContents : true,
    showAuthorBio: typeof rawSettings.showAuthorBio === "boolean" ? rawSettings.showAuthorBio : true,
  };

  return {
    schemaVersion: (json.schemaVersion as string) || CURRENT_SCHEMA_VERSION,
    article: {
      id: (rawArticle.id as string) || `art_${Date.now()}`,
      slug,
      title,
      subtitle: (rawArticle.subtitle as string) || "",
      author,
      category: (rawArticle.category as string) || "Databases",
      tags: (rawArticle.tags as string[]) || [],
      status: (rawArticle.status as "draft" | "ready" | "published" | "archived") || "published",
      blocks,
      seo,
      aiSeo,
      metadata,
      settings,
      createdAt: (rawArticle.createdAt as string) || now,
      updatedAt: (rawArticle.updatedAt as string) || now,
    },
  };
}

// Full import pipeline
export function importArticleJSON(rawJSON: string): {
  document: ArticleDocument | null;
  validation: ValidationResult;
} {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJSON);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid JSON syntax";
    return {
      document: null,
      validation: {
        valid: false,
        errors: [`JSON Syntax Error: ${errorMsg}. Please check for unescaped quotes, trailing commas, or missing brackets.`],
        warnings: [],
        migrated: false,
      },
    };
  }

  const validation = validateArticleJSON(parsed);

  if (!validation.valid) {
    return { document: null, validation };
  }

  const migrated = migrateArticle(parsed as Record<string, unknown>);
  validation.migrated = true;

  return { document: migrated, validation };
}

// Export article as clean JSON string
export function exportArticleJSON(document: ArticleDocument): string {
  return JSON.stringify(document, null, 2);
}
