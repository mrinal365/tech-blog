import { ArticleDocument, ArticleAISEO } from "@/types/article";
import type { HeadingBlockData, ParagraphBlockData, CodeBlockData, CalloutBlockData } from "@/types/blocks";

function extractTextContent(doc: ArticleDocument): string {
  const parts: string[] = [doc.article.title, doc.article.subtitle || ""];

  for (const block of doc.article.blocks) {
    const data = block.data as Record<string, unknown>;
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "rich-text":
      case "definition":
        if (typeof data.text === "string") parts.push(data.text);
        if (typeof data.term === "string") parts.push(data.term);
        if (typeof data.definition === "string") parts.push(data.definition);
        break;
      case "bullet-list":
      case "numbered-list":
      case "takeaways":
        if (Array.isArray(data.items)) parts.push(...(data.items as string[]));
        break;
      case "callout":
        if (typeof data.title === "string") parts.push(data.title);
        if (typeof data.text === "string") parts.push(data.text);
        break;
      case "pros-cons":
        if (Array.isArray(data.pros)) parts.push(...(data.pros as string[]));
        if (Array.isArray(data.cons)) parts.push(...(data.cons as string[]));
        break;
      case "steps":
        if (Array.isArray(data.steps)) {
          for (const step of data.steps as Array<{ title?: string; description?: string }>) {
            if (step.title) parts.push(step.title);
            if (step.description) parts.push(step.description);
          }
        }
        break;
    }
  }

  return parts.filter(Boolean).join(" ");
}

// Detect entities from text
function detectEntities(text: string): string[] {
  // Common tech entities — pattern-based detection
  const entityPatterns = [
    /\b(React|Next\.js|Node\.js|Express|Fastify|NestJS)\b/g,
    /\b(TypeScript|JavaScript|Python|Rust|Go|Java|C\+\+|Ruby|PHP|Swift|Kotlin)\b/g,
    /\b(Redis|PostgreSQL|MongoDB|MySQL|SQLite|DynamoDB|Elasticsearch)\b/g,
    /\b(Docker|Kubernetes|AWS|GCP|Azure|Vercel|Cloudflare)\b/g,
    /\b(GraphQL|REST|gRPC|WebSocket|HTTP\/2)\b/g,
    /\b(Kafka|RabbitMQ|NATS|SQS)\b/g,
    /\b(Tailwind|CSS|SCSS|HTML)\b/g,
    /\b(Git|GitHub|GitLab|CI\/CD)\b/g,
    /\b(JWT|OAuth|RBAC|SSO)\b/g,
    /\b(LLM|RAG|GPT|Claude|Embedding|Vector)\b/g,
    /\b(Webpack|Vite|Turbopack|esbuild|Rollup)\b/g,
    /\b(Prisma|Drizzle|Sequelize|TypeORM)\b/g,
  ];

  const found = new Set<string>();
  for (const pattern of entityPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => found.add(m));
    }
  }
  return Array.from(found).sort();
}

// Detect search intent
function detectSearchIntent(doc: ArticleDocument): string {
  const title = doc.article.title.toLowerCase();
  const blockTypes = doc.article.blocks.map((b) => b.type);

  if (title.includes("how to") || title.includes("tutorial") || title.includes("guide") || blockTypes.includes("steps")) {
    return "Tutorial / How-to";
  }
  if (title.includes("vs") || title.includes("comparison") || blockTypes.includes("comparison") || blockTypes.includes("pros-cons")) {
    return "Comparison / Evaluation";
  }
  if (title.includes("benchmark") || title.includes("performance") || blockTypes.includes("benchmark")) {
    return "Performance Analysis";
  }
  if (title.includes("what is") || title.includes("introduction") || title.includes("understanding")) {
    return "Informational / Conceptual";
  }
  if (blockTypes.includes("architecture") || blockTypes.includes("flow") || blockTypes.includes("sequence")) {
    return "Architecture / System Design";
  }
  if (title.includes("build") || title.includes("implement") || title.includes("create")) {
    return "Implementation Guide";
  }
  return "Technical Article";
}

// Detect content gaps
function detectContentGaps(doc: ArticleDocument): string[] {
  const gaps: string[] = [];
  const blockTypes = new Set(doc.article.blocks.map((b) => b.type));
  const textContent = extractTextContent(doc).toLowerCase();

  // Check for missing structural elements
  if (!blockTypes.has("heading") || doc.article.blocks.filter((b) => b.type === "heading").length < 2) {
    gaps.push("Add more section headings for better content structure");
  }

  if (!blockTypes.has("code") && !blockTypes.has("terminal")) {
    gaps.push("Add code examples or terminal commands for technical depth");
  }

  if (!blockTypes.has("callout")) {
    gaps.push("Consider adding callout boxes for key warnings or tips");
  }

  if (!blockTypes.has("takeaways")) {
    gaps.push("Add a Key Takeaways section for quick reader summary");
  }

  if (doc.article.tags.length < 3) {
    gaps.push("Add more tags for better topic categorization");
  }

  if (!doc.article.metadata.difficulty) {
    gaps.push("Set a difficulty level (beginner/intermediate/advanced)");
  }

  if (!blockTypes.has("image")) {
    gaps.push("Add diagrams or screenshots for visual explanation");
  }

  if (doc.article.blocks.length < 5) {
    gaps.push("Article is very short — consider expanding content");
  }

  return gaps;
}

// Suggest schema types
function suggestSchemaTypes(doc: ArticleDocument): string[] {
  const schemas: string[] = ["Article", "TechArticle"];
  const blockTypes = new Set(doc.article.blocks.map((b) => b.type));

  if (blockTypes.has("steps")) {
    schemas.push("HowTo");
  }
  if (blockTypes.has("definition")) {
    schemas.push("FAQPage");
  }
  if (blockTypes.has("code") || blockTypes.has("playground")) {
    schemas.push("SoftwareSourceCode");
  }
  if (blockTypes.has("benchmark") || blockTypes.has("comparison")) {
    schemas.push("Dataset");
  }

  return schemas;
}

// Calculate topic coverage
function calculateTopicCoverage(doc: ArticleDocument): number {
  let score = 0;
  const max = 10;

  if (doc.article.title.length > 0) score++;
  if (doc.article.subtitle && doc.article.subtitle.length > 0) score++;
  if (doc.article.blocks.length >= 5) score++;
  if (doc.article.tags.length >= 3) score++;
  if (doc.article.seo.metaDescription.length > 0) score++;

  const blockTypes = new Set(doc.article.blocks.map((b) => b.type));
  if (blockTypes.size >= 3) score++;
  if (blockTypes.has("heading")) score++;
  if (blockTypes.has("code") || blockTypes.has("terminal")) score++;
  if (doc.article.metadata.technologies && doc.article.metadata.technologies.length > 0) score++;
  if (doc.article.metadata.difficulty) score++;

  return Math.round((score / max) * 100);
}

// Full AI SEO Analysis
export function analyzeAISEO(doc: ArticleDocument): ArticleAISEO {
  const textContent = extractTextContent(doc);

  return {
    primaryTopic: doc.article.title || "Not set",
    searchIntent: detectSearchIntent(doc),
    entities: detectEntities(textContent),
    relatedConcepts: [], // User fills manually or AI generates later
    questionsAnswered: [], // User fills manually
    contentGaps: detectContentGaps(doc),
    suggestedSchema: suggestSchemaTypes(doc),
    topicCoverage: calculateTopicCoverage(doc),
  };
}
