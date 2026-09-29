"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Sparkles,
  Code2,
  FileText,
  Layers,
  ArrowRight,
  Terminal,
  Search,
} from "lucide-react";
import { ProtectedAuthRoute } from "@/components/auth/ProtectedAuthRoute";

export type ElaborationMode = "strict" | "beginner" | "medium" | "pro" | "promax";

export const MODE_CONFIGS: Record<
  ElaborationMode,
  {
    name: string;
    shortName: string;
    badge: string;
    liberty: string;
    icon: string;
    description: string;
    useCase: string;
    promptDirective: string;
  }
> = {
  strict: {
    name: "Strict Point to Point (0% Additions / Pure Formatter)",
    shortName: "🎯 Point to Point (0%)",
    badge: "0% Additions — NO Extra Explanations",
    liberty: "0%",
    icon: "🎯",
    description:
      "Strict zero-explanation point-to-point converter. The AI MUST NOT add any explanations, background context, intro/outro paragraphs, or expand short bullet points into long paragraphs. It maps raw data 1-to-1 to block structures verbatim.",
    useCase:
      "Use when you have 10-15 bullet points or short notes and want AI to format them directly into a bullet-list or short blocks WITHOUT turning each bullet point into a long paragraph.",
    promptDirective: `
─────────────────────────────────────────────────────────────
MODE SPECIFICATION: STRICT POINT-TO-POINT FORMATTER (0% ADDITION & 0% EXTRA EXPLANATION)
─────────────────────────────────────────────────────────────
CRITICAL MANDATES:
1. DO NOT EXPAND BULLET POINTS INTO PARAGRAPHS:
   - If the raw input contains 15 bullet points or short notes, output a SINGLE "bullet-list" block containing those 15 items (or 15 short 1-line blocks).
   - NEVER expand a 1-line bullet point into a 100-word paragraph.

2. DO NOT ADD UNREQUESTED INTROS, OUTROS, OR EXPLANATIONS:
   - Do NOT write introductory paragraphs ("In this article we will explore..."), conclusion summaries, or extra sentences unless present in the raw input.
   - Do NOT explain code or add comments unless the raw input already has explanations.

3. PRESERVE ORIGINAL BREVITY & WORD COUNT:
   - If the raw input is 150 words total, the combined text across all generated blocks MUST be ~150 words.
   - Do NOT invent unmentioned features, edge cases, or extra background details.

4. NO UNREQUESTED DEEP BLOCKS:
   - Do NOT generate "comparison", "benchmark", "pros-cons", or "before-after" blocks UNLESS the raw input explicitly contains benchmark metrics or comparison tables.
`,
  },
  beginner: {
    name: "Beginner Level (10% Elaboration)",
    shortName: "🌱 Beginner (10%)",
    badge: "10% Liberty — Minor Polish & Transitions",
    liberty: "10%",
    icon: "🌱",
    description:
      "Minor polish and light filler (10% liberty) to smooth out raw sentences, expand brief acronyms, and clarify points without changing scope.",
    useCase:
      "Use for quick drafts where raw notes are mostly complete but need light polishing for readability.",
    promptDirective: `
─────────────────────────────────────────────────────────────
MODE SPECIFICATION: BEGINNER CONVERTER (10% LIBERTY)
─────────────────────────────────────────────────────────────
- You have UP TO 10% CREATIVE LIBERTY to refine rough sentence structures and add smooth transition phrases.
- Expand technical acronyms or clarify brief statements present in the raw data.
- Do NOT invent new major sections, unmentioned frameworks, or additional architecture diagrams not implied by the raw data.
`,
  },
  medium: {
    name: "Medium Level (40% Elaboration)",
    shortName: "⚡ Medium (40%)",
    badge: "40% Liberty — Balanced Technical Context",
    liberty: "40%",
    icon: "⚡",
    description:
      "Moderate technical expansion (40% liberty), fleshing out raw bullet points into clear paragraphs, adding code comments, and inserting safety callouts.",
    useCase:
      "Use for outline-level notes or code snippets where you want AI to fill in standard explanations and technical context.",
    promptDirective: `
─────────────────────────────────────────────────────────────
MODE SPECIFICATION: BALANCED TECHNICAL EXPANSION (40% LIBERTY)
─────────────────────────────────────────────────────────────
- You have 40% CREATIVE LIBERTY to expand brief points into rich, informative technical paragraphs.
- Add code comments, safety callouts (tips/warnings), and clear architectural context derived from the raw data.
- Introduce 1-2 comparison tables or code snippets where appropriate to clarify the raw topic.
`,
  },
  pro: {
    name: "Pro Level (70% Deep Dive Expansion)",
    shortName: "🚀 Pro Level (70%)",
    badge: "70% Liberty — Technical Deep Dive",
    liberty: "70%",
    icon: "🚀",
    description:
      "Deep technical expansion (70% liberty), adding architecture diagrams, before-after refactoring code diffs, pros/cons tables, and benchmark metrics.",
    useCase:
      "Use when starting from high-level topics or repo summaries and wanting AI to generate an in-depth engineering breakdown.",
    promptDirective: `
─────────────────────────────────────────────────────────────
MODE SPECIFICATION: PRO TECHNICAL DEEP DIVE (70% LIBERTY)
─────────────────────────────────────────────────────────────
- You have 70% CREATIVE LIBERTY to deeply expand the raw data into a comprehensive engineering breakdown.
- Add architecture blocks, file-tree structure blocks, before-after code refactoring snippets, pros-cons tradeoff cards, benchmark metric tables, and production edge case callouts.
- Provide comprehensive code implementations with filename and language annotations.
`,
  },
  promax: {
    name: "Pro Max (Full Berserk Masterclass - 100% Liberty)",
    shortName: "🔥 Pro Max (100% Berserk)",
    badge: "100% Liberty — Full Creative Authority",
    liberty: "100%",
    icon: "🔥",
    description:
      "Full berserk mode! Expands raw input into an exhaustive, world-class engineering masterclass covering system design, benchmarks, diffs, file trees, and edge cases.",
    useCase:
      "Use when you want an all-encompassing, definitive technical guide based on a single seed topic or brief prompt.",
    promptDirective: `
─────────────────────────────────────────────────────────────
MODE SPECIFICATION: PRO MAX FULL BERSERK MASTERCLASS (100% LIBERTY)
─────────────────────────────────────────────────────────────
- GO FULL BERSERK. Take the raw input as the foundational seed topic and construct an exhaustive, world-class engineering masterclass.
- Utilize ALL 31 block types available: mandatory "seo-block", "heading", "paragraph", "code", "terminal", "file-tree", "inline-code", "config", "api-request", "http", "architecture", "flow", "sequence", "database-schema", "json-viewer", "comparison", "benchmark", "pros-cons", "takeaways", "definition", "steps", "before-after", "code-diff", "image", "embed", "react-component", and "playground".
- Elaborate extensively on low-level memory management, protocol specifications, concurrency models, security practices, and enterprise production tradeoffs.
`,
  },
};

export function buildSystemPrompt(mode: ElaborationMode): string {
  if (mode === "strict") {
    return `
YOU ARE A STRICT 1:1 SDE.GUIDE JSON SYNTAX COMPILER.

CRITICAL ROLE:
YOU ARE NOT A CONTENT WRITER, AUTHOR, OR EXPANDER.
YOUR ONLY JOB IS TO FORMAT THE USER'S RAW INPUT DATA DIRECTLY INTO SDE.GUIDE JSON BLOCKS VERBATIM.

─────────────────────────────────────────────────────────────
ABSOLUTE NEGATIVE CONSTRAINTS (STRICT 0% ADDITION MODE):
─────────────────────────────────────────────────────────────
1. DO NOT CONVERT BULLET POINTS TO PARAGRAPHS:
   - If the raw input contains 15 bullet points or short notes, output a SINGLE "bullet-list" block with those 15 items, OR short 1-line blocks.
   - NEVER expand a 1-sentence bullet point into a 100-word paragraph.

2. NO UNREQUESTED INTROS, OUTROS, OR EXPLANATIONS:
   - Do NOT add "In this article we will cover...", "In conclusion...", or any commentary not present in the raw input.
   - Do NOT add explanations to code blocks unless the raw data already has explanations.

3. PRESERVE ORIGINAL BREVITY & WORD COUNT:
   - If the raw input is 150 words, the total word count across all generated blocks MUST be ~150 words.
   - Do NOT invent unmentioned features, edge cases, or extra background details.

4. NO UNREQUESTED DEEP BLOCKS:
   - Do NOT generate "comparison", "benchmark", "pros-cons", or "before-after" blocks UNLESS the raw input explicitly contains benchmark metrics or comparison tables.

─────────────────────────────────────────────────────────────
SECTION 1: MANDATORY SEO BLOCK ("seo-block")
─────────────────────────────────────────────────────────────
- EVERY article MUST still include an "seo-block" as the FIRST block in the "blocks" array.
- Extract "primaryKeyword", "targetIntent", "entities", and "questionsAnswered" directly from the user's raw input.
- NOTE: The "seo-block" is non-rendering on published reader pages (returns null), keeping reader views clean.

─────────────────────────────────────────────────────────────
SECTION 2: TOP-LEVEL ARTICLE DOCUMENT JSON SCHEMA
─────────────────────────────────────────────────────────────
{
  "schemaVersion": "1.0.0",
  "article": {
    "id": "art-1741234567890",
    "slug": "kebab-case-url-slug-here",
    "title": "Title From Raw Data (or Short Kebab Slug Title)",
    "subtitle": "Short 1-sentence summary directly from raw data",
    "author": {
      "id": "author-mrinal",
      "name": "Mrinal",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "role": "Full-Stack Developer"
    },
    "category": "Frontend | Backend | System Design | React | Next.js | Node.js | TypeScript | DevOps | Cloud | Databases | AI / ML | Security | Architecture",
    "tags": ["Tag1", "Tag2"],
    "status": "published",
    "blocks": [ /* ARRAY OF BASE BLOCK OBJECTS - SEE SECTION 3 */ ],
    "seo": {
      "metaTitle": "Short Title (50-60 chars)",
      "metaDescription": "Short description from raw data (120-160 chars)",
      "primaryKeyword": "Keyword from input",
      "secondaryKeywords": ["Tag1", "Tag2"],
      "canonicalUrl": "http://localhost:3000/articles/kebab-case-url-slug-here"
    },
    "aiSeo": {
      "primaryTopic": "Main topic from input",
      "searchIntent": "Technical Reference",
      "entities": ["Entity 1", "Entity 2"],
      "relatedConcepts": [],
      "questionsAnswered": ["Question answered in input"],
      "contentGaps": [],
      "suggestedSchema": ["TechArticle"],
      "topicCoverage": 100
    },
    "metadata": {
      "title": "Title From Raw Data",
      "slug": "kebab-case-url-slug-here",
      "description": "Short summary",
      "author": { "id": "author-mrinal", "name": "Mrinal", "role": "Full-Stack Developer" },
      "category": "Architecture",
      "tags": ["Tag1"],
      "createdAt": "2026-09-27T10:00:00.000Z",
      "readingTime": 3,
      "difficulty": "intermediate",
      "technologies": ["TypeScript"]
    },
    "settings": {
      "readingTime": 3,
      "allowComments": true,
      "showTableOfContents": true,
      "showAuthorBio": true
    },
    "createdAt": "2026-09-27T10:00:00.000Z",
    "updatedAt": "2026-09-27T10:00:00.000Z"
  }
}

─────────────────────────────────────────────────────────────
SECTION 3: EXHAUSTIVE SPECIFICATION FOR ALL 31 SUPPORTED BLOCK TYPES
─────────────────────────────────────────────────────────────
Every element in "blocks" should use the standard format:
{
  "id": "blk-1",
  "type": "<block-type-name>",
  "version": 1,
  "data": { ... }
}

Block Data Specifications:
1. "seo-block": { "data": { "primaryKeyword": "...", "targetIntent": "...", "entities": [...], "questionsAnswered": [...], "topicCoverage": 100, "suggestedSchema": ["TechArticle"] } }
2. "heading": { "data": { "level": 2 | 3 | 4, "text": "Exact Heading From Input" } }
3. "paragraph": { "data": { "text": "Exact Text From Input Verbatim" } }
4. "bullet-list": { "data": { "items": ["Item 1 from input", "Item 2 from input"] } }
5. "numbered-list": { "data": { "items": ["Step 1 from input", "Step 2 from input"] } }
6. "callout": { "data": { "variant": "info|tip|warning|danger", "title": "...", "text": "Exact note from input" } }
7. "code": { "data": { "code": "Exact Code From Input", "language": "sql|typescript|bash", "filename": "" } }
8. "terminal": { "data": { "lines": [{ "type": "command", "text": "..." }], "title": "Terminal" } }
9. "file-tree": { "data": { "root": "cloud-application/", "files": [{ "path": "cloud-application/", "type": "directory" }, { "path": "cloud-application/app/", "type": "directory" }] } }
10. "inline-code": { "data": { "code": "...", "description": "..." } }
11. "config": { "data": { "filename": ".env.local", "content": "...", "language": "json|env|yaml|toml" } }
12. "code-diff": { "data": { "language": "...", "filename": "...", "diff": "..." } }
13. "before-after": { "data": { "language": "...", "before": { "code": "..." }, "after": { "code": "..." } } }
14. "playground": { "data": { "code": "...", "output": "...", "language": "javascript" } }
15. "api-request": { "data": { "method": "GET|POST|PUT|DELETE", "url": "/api/v1/...", "responseStatus": 200, "response": "{...}" } }
16. "http": { "data": { "steps": [{ "from": "Client", "to": "API", "method": "POST", "path": "/login", "statusCode": 200 }] } }
17. "architecture": { "data": { "title": "...", "nodes": [{ "id": "1", "label": "API Gateway", "type": "Gateway" }] } }
18. "flow": { "data": { "steps": [{ "title": "Step 1", "description": "..." }] } }
19. "sequence": { "data": { "actors": ["Client", "Server"], "messages": [{ "from": "Client", "to": "Server", "label": "Request" }] } }
20. "database-schema": { "data": { "tables": [{ "name": "users", "columns": [{ "name": "id", "type": "uuid", "primaryKey": true }] }] } }
21. "json-viewer": { "data": { "title": "...", "json": { ... } } }
22. "comparison": { "data": { "headers": [...], "rows": [{ "cells": [...] }] } }
23. "benchmark": { "data": { "title": "...", "metrics": [{ "label": "...", "value": "...", "unit": "..." }] } }
24. "pros-cons": { "data": { "pros": [...], "cons": [...] } }
25. "takeaways": { "data": { "items": [...] } }
26. "definition": { "data": { "term": "...", "definition": "...", "example": "..." } }
27. "steps": { "data": { "steps": [{ "title": "...", "description": "...", "code": "..." }] } }
28. "react-component": { "data": { "componentName": "...", "description": "...", "previewType": "counter|rag-calculator|telemetry" } }
29. "image": { "data": { "src": "...", "caption": "...", "alt": "..." } }
30. "embed": { "data": { "provider": "github|codesandbox|youtube", "url": "..." } }
31. "rich-text": { "data": { "text": "..." } }

─────────────────────────────────────────────────────────────
SECTION 4: EXECUTOR MANDATE
─────────────────────────────────────────────────────────────
1. Output ONLY valid JSON matching the schema above without markdown code fences or explanatory conversational wrappers.
2. PRESERVE THE EXACT BREVITY AND LENGTH OF THE USER'S RAW INPUT. DO NOT WRITE PARAGRAPHS FOR BULLET POINTS.
`.trim();
  }

  const config = MODE_CONFIGS[mode];
  return `
YOU ARE AN EXPERT TECHNICAL AUTHOR, SEO/GEO (GENERATIVE ENGINE OPTIMIZATION) SPECIALIST, AND SDE.GUIDE JSON COMPILER FOR SDE.GUIDE.

YOUR MISSION:
Take any rough notes, outline, technical script, code repo description, or draft markdown, and transform it into an SDE.GUIDE ArticleDocument JSON object matching the sde.guide specification.

${config.promptDirective}

─────────────────────────────────────────────────────────────
SECTION 1: MANDATORY SEO & AI SEARCH (GEO) OPTIMIZATION RULES
─────────────────────────────────────────────────────────────
To maximize ranking in Google Search, Perplexity AI, SearchGPT, and Gemini AI Overviews, enforce the following SEO & AI SEO standards:

1. META TITLE & META DESCRIPTION:
   - metaTitle: Must be between 50 and 60 characters. Must contain the primary keyword near the beginning.
   - metaDescription: Must be between 120 and 160 characters. Must include a clear value proposition and primary + secondary keywords.

2. ENTITY DENSITY & KNOWLEDGE GRAPH (aiSeo.entities):
   - Extract at least 4-8 recognized technical entities (e.g., "Next.js 16", "MongoDB Driver", "TypeScript 5", "JWT Cookies", "Docker").

3. FAQ SCHEMA & QUESTION ANSWERING (aiSeo.questionsAnswered):
   - Formulate 2-5 explicit questions that the article directly answers.

4. CONTENT GAP COVERAGE (aiSeo.topicCoverage & contentGaps):
   - Set topicCoverage between 90 and 100%.

5. TOP-LEVEL SEO BLOCK ("seo-block"):
   - EVERY article MUST include an "seo-block" as the FIRST block in the article's "blocks" array.
   - NOTE: The "seo-block" is used for meta tag generation, JSON-LD schemas, and AI indexing. On public published article pages, this block is non-rendering (returns null).

─────────────────────────────────────────────────────────────
SECTION 2: TOP-LEVEL ARTICLE DOCUMENT JSON SCHEMA
─────────────────────────────────────────────────────────────
{
  "schemaVersion": "1.0.0",
  "article": {
    "id": "art-1741234567890",
    "slug": "kebab-case-url-slug-here",
    "title": "Exact Catchy Technical Title (50-70 characters)",
    "subtitle": "Detailed subtitle summarizing the engineering breakdown (100-160 characters)",
    "author": {
      "id": "author-mrinal",
      "name": "Mrinal",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "role": "Full-Stack Developer"
    },
    "category": "Frontend | Backend | System Design | React | Next.js | Node.js | TypeScript | DevOps | Cloud | Databases | AI / ML | Security | Architecture",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "status": "published",
    "blocks": [ /* ARRAY OF BASE BLOCK OBJECTS - SEE SECTION 3 */ ],
    "seo": {
      "metaTitle": "Primary Keyword Included Title (50-60 chars)",
      "metaDescription": "Compelling search description with keywords (120-160 chars)",
      "primaryKeyword": "Primary Focus Keyword",
      "secondaryKeywords": ["Secondary Keyword 1", "Secondary Keyword 2"],
      "canonicalUrl": "http://localhost:3000/articles/kebab-case-url-slug-here"
    },
    "aiSeo": {
      "primaryTopic": "Core Technical Engineering Subject",
      "searchIntent": "Technical Guide & Architecture Breakdown",
      "entities": ["Entity 1", "Entity 2", "Entity 3", "Entity 4"],
      "relatedConcepts": ["Concept 1", "Concept 2"],
      "questionsAnswered": [
        "What is X and why is it used?",
        "How do you implement Y in production safely?"
      ],
      "contentGaps": ["Edge cases", "Serverless memory limits"],
      "suggestedSchema": ["TechArticle", "HowTo", "SoftwareSourceCode"],
      "topicCoverage": 96
    },
    "metadata": {
      "title": "Exact Catchy Technical Title",
      "slug": "kebab-case-url-slug-here",
      "description": "Short summary",
      "author": {
        "id": "author-mrinal",
        "name": "Mrinal",
        "role": "Full-Stack Developer"
      },
      "category": "Category Name",
      "tags": ["Tag1", "Tag2"],
      "createdAt": "2026-09-27T10:00:00.000Z",
      "readingTime": 10,
      "difficulty": "advanced",
      "technologies": ["React", "TypeScript", "Node.js"]
    },
    "settings": {
      "readingTime": 10,
      "allowComments": true,
      "showTableOfContents": true,
      "showAuthorBio": true
    },
    "createdAt": "2026-09-27T10:00:00.000Z",
    "updatedAt": "2026-09-27T10:00:00.000Z"
  }
}

─────────────────────────────────────────────────────────────
SECTION 3: EXHAUSTIVE SPECIFICATION FOR ALL 31 SUPPORTED BLOCK TYPES
─────────────────────────────────────────────────────────────
Standard block JSON structure:
{
  "id": "blk-1",
  "type": "<block-type-name>",
  "version": 1,
  "data": { ... }
}

Block Data Specifications:
1. "seo-block": { "data": { "primaryKeyword": "...", "targetIntent": "...", "entities": [...], "questionsAnswered": [...], "topicCoverage": 100, "suggestedSchema": ["TechArticle"] } }
2. "heading": { "data": { "level": 2 | 3 | 4, "text": "..." } }
3. "paragraph": { "data": { "text": "..." } }
4. "bullet-list": { "data": { "items": ["..."] } }
5. "numbered-list": { "data": { "items": ["..."] } }
6. "callout": { "data": { "variant": "info|tip|warning|danger", "title": "...", "text": "..." } }
7. "code": { "data": { "code": "...", "language": "...", "filename": "..." } }
8. "terminal": { "data": { "lines": [{ "type": "command", "text": "..." }], "title": "Terminal" } }
9. "file-tree": { "data": { "root": "cloud-application/", "files": [{ "path": "cloud-application/", "type": "directory" }, { "path": "cloud-application/app/", "type": "directory" }] } }
10. "inline-code": { "data": { "code": "...", "description": "..." } }
11. "config": { "data": { "filename": ".env.local", "content": "...", "language": "json|env|yaml|toml" } }
12. "code-diff": { "data": { "language": "...", "filename": "...", "diff": "..." } }
13. "before-after": { "data": { "language": "...", "before": { "code": "..." }, "after": { "code": "..." } } }
14. "playground": { "data": { "code": "...", "output": "...", "language": "javascript" } }
15. "api-request": { "data": { "method": "GET|POST|PUT|DELETE", "url": "/api/v1/...", "responseStatus": 200, "response": "{...}" } }
16. "http": { "data": { "steps": [{ "from": "Client", "to": "API", "method": "POST", "path": "/login", "statusCode": 200 }] } }
17. "architecture": { "data": { "title": "...", "nodes": [{ "id": "1", "label": "API Gateway", "type": "Gateway" }] } }
18. "flow": { "data": { "steps": [{ "title": "Step 1", "description": "..." }] } }
19. "sequence": { "data": { "actors": ["Client", "Server"], "messages": [{ "from": "Client", "to": "Server", "label": "Request" }] } }
20. "database-schema": { "data": { "tables": [{ "name": "users", "columns": [{ "name": "id", "type": "uuid", "primaryKey": true }] }] } }
21. "json-viewer": { "data": { "title": "...", "json": { ... } } }
22. "comparison": { "data": { "headers": [...], "rows": [{ "cells": [...] }] } }
23. "benchmark": { "data": { "title": "...", "metrics": [{ "label": "...", "value": "...", "unit": "..." }] } }
24. "pros-cons": { "data": { "pros": [...], "cons": [...] } }
25. "takeaways": { "data": { "items": [...] } }
26. "definition": { "data": { "term": "...", "definition": "...", "example": "..." } }
27. "steps": { "data": { "steps": [{ "title": "...", "description": "...", "code": "..." }] } }
28. "react-component": { "data": { "componentName": "...", "description": "...", "previewType": "counter|rag-calculator|telemetry" } }
29. "image": { "data": { "src": "...", "caption": "...", "alt": "..." } }
30. "embed": { "data": { "provider": "github|codesandbox|youtube", "url": "..." } }
31. "rich-text": { "data": { "text": "..." } }

─────────────────────────────────────────────────────────────
SECTION 4: INSTRUCTIONS FOR LLM EXECUTOR
─────────────────────────────────────────────────────────────
1. Output ONLY valid JSON matching the schema above without markdown code fences or explanatory conversational wrappers.
2. Ensure every block has a unique "id" (e.g. "blk-1", "blk-2", "blk-3").
3. Make sure "seo-block" is ALWAYS the first element in "blocks".
4. Calculate a realistic readingTime (e.g. 8-15 mins) and include rich, accurate technical prose matching the mode instructions above.
`.trim();
}

export default function GuidePage() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [activeTab, setActiveTab] = useState<"prompt" | "seo-rules" | "schema" | "blocks" | "example">("prompt");
  const [elaborationMode, setElaborationMode] = useState<ElaborationMode>("strict");

  const currentPrompt = buildSystemPrompt(elaborationMode);
  const currentConfig = MODE_CONFIGS[elaborationMode];

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const FULL_EXAMPLE_JSON = {
    schemaVersion: "1.0.0",
    article: {
      id: "art-example-seo-001",
      slug: "building-high-performance-nextjs-mongodb-engines",
      title: "Building High-Performance Next.js 16 & MongoDB Engineering Engines",
      subtitle:
        "An exhaustive deep dive into Server Components, connection pooling, indexing strategies, dynamic theme customizers, and JWT auth boundaries.",
      author: {
        id: "author-mrinal",
        name: "Mrinal",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Full-Stack Developer",
      },
      category: "Architecture",
      tags: ["Next.js", "MongoDB", "React", "TypeScript", "Performance"],
      status: "published",
      blocks: [
        {
          id: "blk-seo",
          type: "seo-block",
          version: 1,
          data: {
            primaryKeyword: "Next.js MongoDB Engine",
            targetIntent: "Technical Guide & Architecture Breakdown",
            entities: ["Next.js 16", "MongoDB Driver", "React Server Components", "TypeScript 5", "JWT Cookies"],
            questionsAnswered: [
              "How to prevent MongoClient connection pool exhaustion in Next.js?",
              "How to implement dynamic theme accent customizers with CSS variables?",
              "What are the latency benefits of Server Components vs traditional APIs?",
            ],
            topicCoverage: 98,
            suggestedSchema: ["TechArticle", "SoftwareSourceCode", "HowTo"],
          },
        },
        {
          id: "blk-1",
          type: "heading",
          version: 1,
          data: { level: 2, text: "1. Architecture Overview & Core Objectives" },
        },
        {
          id: "blk-2",
          type: "paragraph",
          version: 1,
          data: {
            text: "Modern engineering platforms require zero-bundle-size server execution alongside instant real-time client responsiveness. By combining Next.js 16 Server Components with a singleton MongoDB driver connection pool, we eliminate client fetching waterfalls while keeping server query latencies under 15ms.",
          },
        },
        {
          id: "blk-file-tree",
          type: "file-tree",
          version: 1,
          data: {
            root: "cloud-application/",
            files: [
              { path: "cloud-application/", type: "directory" },
              { path: "cloud-application/app/", type: "directory" },
              { path: "cloud-application/app/api/", type: "directory" },
              { path: "cloud-application/app/api/articles/", type: "directory" },
              { path: "cloud-application/app/api/articles/route.ts", type: "file" },
              { path: "cloud-application/infrastructure/", type: "directory" },
              { path: "cloud-application/infrastructure/vpc/", type: "directory" },
              { path: "cloud-application/infrastructure/vpc/main.tf", type: "file" },
              { path: "cloud-application/infrastructure/compute/", type: "directory" },
              { path: "cloud-application/infrastructure/database/", type: "directory" },
              { path: "cloud-application/infrastructure/storage/", type: "directory" },
              { path: "cloud-application/package.json", type: "file" },
              { path: "cloud-application/tsconfig.json", type: "file" }
            ]
          }
        },
        {
          id: "blk-3",
          type: "callout",
          version: 1,
          data: {
            variant: "warning",
            title: "CRITICAL CONNECTION POOL RULE",
            text: "Never instantiate a new MongoClient() per HTTP request. Serverless environments like Vercel and Next.js hot-reloading loopers will rapidly exhaust database sockets without a global caching wrapper.",
          },
        },
        {
          id: "blk-4",
          type: "code",
          version: 1,
          data: {
            language: "typescript",
            filename: "src/lib/mongodb.ts",
            code: `import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/devarticle_db";
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;`,
          },
        },
        {
          id: "blk-architecture",
          type: "architecture",
          version: 1,
          data: {
            title: "Cloud Infrastructure Gateway Topology",
            nodes: [
              { id: "n1", label: "Edge Cloudflare CDN", type: "Edge" },
              { id: "n2", label: "Next.js App Router (Vercel Node)", type: "Server" },
              { id: "n3", label: "MongoDB Atlas Primary Cluster", type: "Database" }
            ]
          }
        },
        {
          id: "blk-api-req",
          type: "api-request",
          version: 1,
          data: {
            method: "POST",
            url: "/api/articles",
            responseStatus: 201,
            response: `{\n  "success": true,\n  "id": "art-1741234567890",\n  "slug": "building-high-performance-nextjs-mongodb-engines"\n}`
          }
        },
        {
          id: "blk-code-diff",
          type: "code-diff",
          version: 1,
          data: {
            filename: "src/app/api/articles/route.ts",
            diff: `@@ -12,4 +12,4 @@
- const client = new MongoClient(process.env.MONGODB_URI);
+ const client = await clientPromise;
- const db = client.db("test");
+ const db = client.db("devarticle_db");`
          }
        },
        {
          id: "blk-db-schema",
          type: "database-schema",
          version: 1,
          data: {
            tables: [
              {
                name: "articles",
                columns: [
                  { name: "id", type: "string", primaryKey: true },
                  { name: "title", type: "string" },
                  { name: "slug", type: "string" },
                  { name: "blocks", type: "array" }
                ]
              }
            ]
          }
        },
        {
          id: "blk-5",
          type: "comparison",
          version: 1,
          data: {
            headers: ["Metric / Paradigm", "Traditional Client API Fetch", "Next.js SSR Server Component"],
            rows: [
              ["Initial Load Waterfall", "3 Roundtrips (HTML -> JS -> API)", "1 Roundtrip (Streaming HTML)"],
              ["Client JS Bundle Impact", "Includes Axios/React-Query + Types", "0 Bytes (Server Only)"],
              ["Database Latency", "Network HTTP Latency + DB", "Direct Sub-millisecond Loopback"],
            ],
          },
        },
        {
          id: "blk-6",
          type: "benchmark",
          version: 1,
          data: {
            title: "MongoDB Index Performance Metrics",
            metrics: [
              { label: "INDEX READ LATENCY", value: "2.4", unit: "ms" },
              { label: "UNINDEXED READ LATENCY", value: "340", unit: "ms" },
              { label: "THROUGHPUT GAIN", value: "142x", unit: "speedup" },
            ],
          },
        },
        {
          id: "blk-steps",
          type: "steps",
          version: 1,
          data: {
            steps: [
              { title: "Step 1: Connection Pooling", description: "Initialize a global MongoClient singleton promise." },
              { title: "Step 2: Server Component Fetch", description: "Query database directly inside async React Server Components." },
              { title: "Step 3: Streaming Response", description: "Stream HTML payload directly to client browsers." }
            ]
          }
        },
        {
          id: "blk-takeaways",
          type: "takeaways",
          version: 1,
          data: {
            items: [
              "Always reuse MongoDB client promises across serverless invocations.",
              "Use indexes on primary slug and category fields for sub-5ms queries.",
              "Utilize file-tree and architecture blocks for clear developer documentation."
            ]
          }
        }
      ],
      seo: {
        metaTitle: "Building High-Performance Next.js 16 & MongoDB Engines",
        metaDescription:
          "An exhaustive deep dive into Server Components, connection pooling, indexing strategies, dynamic theme customizers, and JWT auth boundaries.",
        primaryKeyword: "Next.js MongoDB Engine",
        secondaryKeywords: ["React Server Components", "DevArticle", "Full-Stack Architecture"],
        canonicalUrl: "http://localhost:3000/articles/building-high-performance-nextjs-mongodb-engines",
      },
      aiSeo: {
        primaryTopic: "Next.js & MongoDB Full-Stack Architecture",
        searchIntent: "Engineering Architecture & Performance Optimization",
        entities: ["Next.js 16", "MongoDB Driver", "TypeScript", "JWT Auth"],
        relatedConcepts: ["Connection Pooling", "Streaming SSR", "CSS Variables Theme"],
        questionsAnswered: [
          "How do you connect Next.js 16 directly to MongoDB Compass?",
          "How to make dynamic accent theme color switchers in React?",
        ],
        contentGaps: ["Production clustering multi-region failover"],
        suggestedSchema: ["TechArticle", "SoftwareSourceCode"],
        topicCoverage: 98,
      },
      metadata: {
        title: "Building High-Performance Next.js 16 & MongoDB Engineering Engines",
        slug: "building-high-performance-nextjs-mongodb-engines",
        description: "An exhaustive deep dive into Server Components and MongoDB optimization.",
        author: {
          id: "author-mrinal",
          name: "Mrinal",
          role: "Full-Stack Developer",
        },
        category: "Architecture",
        tags: ["Next.js", "MongoDB", "React", "TypeScript"],
        createdAt: "2026-09-27T10:00:00.000Z",
        readingTime: 10,
        difficulty: "advanced",
        technologies: ["Next.js", "MongoDB", "TypeScript", "React"],
      },
      settings: {
        readingTime: 10,
        allowComments: true,
        showTableOfContents: true,
        showAuthorBio: true,
      },
      createdAt: "2026-09-27T10:00:00.000Z",
      updatedAt: "2026-09-27T10:00:00.000Z",
    },
  };

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(FULL_EXAMPLE_JSON, null, 2));
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <ProtectedAuthRoute>
      <div className="min-h-screen text-[#cccccc] font-sans pb-24" style={{ backgroundColor: "#121212" }}>
        {/* TOP HEADER */}
        <header className="border-b border-[#2a2a2a] bg-[#161616] py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-3 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 border max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    backgroundColor: "#181818",
                    borderColor: "var(--accent-theme)",
                    color: "var(--accent-theme)",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-theme)" }} />
                  <span className="truncate">SEO & AI SEARCH (GEO) MASTER COMPILER SPECIFICATION</span>
                </div>

                <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-[#ffffff]">
                  LLM SDE.GUIDE & SEO Formatting Guide
                </h1>
                <p className="mt-2 sm:mt-3 text-xs sm:text-base text-[#aaaaaa] max-w-2xl leading-relaxed">
                  Provide this master prompt generator to any LLM (Claude, ChatGPT, Gemini) along with your raw notes or code data. Choose an <strong>Elaboration Mode (0% to 100% Berserk)</strong> to generate exact JSON payloads featuring all 31 block types and mandatory <code>seo-block</code>.
                </p>
              </div>

              {/* Main Action Call to Copy Selected Prompt */}
              <div className="shrink-0 flex flex-col gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-3 text-xs font-mono font-bold shadow-2xl transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-theme)",
                    color: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {copiedPrompt ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedPrompt ? "Copied Mode Prompt!" : `Copy ${currentConfig.liberty} Liberty Prompt`}</span>
                </button>

                <Link
                  href="/create"
                  className="flex items-center justify-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-mono font-bold border transition-colors hover:bg-[#252525]"
                  style={{ backgroundColor: "#181818", borderColor: "#3a3a3a", color: "#ffffff" }}
                >
                  <span>Go to Creator (/create)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Navigation Tabs (Scrollable on mobile) */}
            <div className="mt-8 sm:mt-10 flex border-t pt-4 sm:pt-6 border-[#2a2a2a] overflow-x-auto no-scrollbar gap-2 pb-2 sm:pb-0 flex-nowrap sm:flex-wrap">
              {[
                { id: "prompt", label: "1. AI Prompt Generator (5 Modes)", icon: Copy },
                { id: "seo-rules", label: "2. SEO & AI Search (GEO) Rules", icon: Search },
                { id: "schema", label: "3. Top-Level JSON Schema", icon: Code2 },
                { id: "blocks", label: "4. All 31 Supported Block Types", icon: Layers },
                { id: "example", label: "5. Ready-to-Import JSON Example", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className="flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs font-mono font-bold transition-all shrink-0"
                    style={{
                      backgroundColor: isActive ? "#222222" : "#181818",
                      color: isActive ? "#ffffff" : "#888888",
                      border: `1px solid ${isActive ? "var(--accent-theme)" : "#2a2a2a"}`,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: isActive ? "var(--accent-theme)" : "inherit" }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT BODY */}
        <main className="mx-auto max-w-6xl px-3 sm:px-6 pt-6 sm:pt-10">
          {/* TAB 1: COPYABLE MASTER PROMPT WITH 5 ELABORATION MODES */}
          {activeTab === "prompt" && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-[#2a2a2a]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#ffffff] flex items-center gap-2">
                    <Terminal className="h-5 w-5 shrink-0" style={{ color: "var(--accent-theme)" }} />
                    Master LLM System Prompt Generator
                  </h2>
                  <p className="text-xs text-[#888888] mt-1">
                    Select your desired AI liberty level below. Each tab updates the prompt instructions to control how strictly or creatively the LLM expands your raw input data.
                  </p>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center justify-center gap-1.5 shrink-0 rounded-lg px-4 py-2 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors"
                >
                  {copiedPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />}
                  <span>{copiedPrompt ? "Copied!" : `Copy ${currentConfig.liberty} Mode Prompt`}</span>
                </button>
              </div>

              {/* 5 ELABORATION LEVEL TABS */}
              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#888888]">
                  Select AI Elaboration Level & Liberty Mode:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(["strict", "beginner", "medium", "pro", "promax"] as ElaborationMode[]).map((mode) => {
                    const cfg = MODE_CONFIGS[mode];
                    const isSelected = elaborationMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setElaborationMode(mode)}
                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? "#222222" : "#161616",
                          borderColor: isSelected ? "var(--accent-theme)" : "#2a2a2a",
                          boxShadow: isSelected ? "0 0 15px rgba(0,0,0,0.5)" : "none",
                        }}
                      >
                        <span className="text-base sm:text-lg mb-0.5">{cfg.icon}</span>
                        <span className="text-xs font-mono font-bold text-[#ffffff]">{cfg.shortName}</span>
                        <span className="text-[10px] text-[#888888] mt-0.5">{cfg.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MODE DESCRIPTION CARD */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: "#181818", borderColor: "var(--accent-theme)" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#ffffff] font-mono flex items-center gap-2">
                    <span>{currentConfig.icon}</span>
                    <span>{currentConfig.name}</span>
                  </h3>
                  <span
                    className="rounded px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#121212] border"
                    style={{ borderColor: "var(--accent-theme)", color: "var(--accent-theme)" }}
                  >
                    Liberty Level: {currentConfig.liberty}
                  </span>
                </div>
                <p className="text-xs text-[#cccccc] leading-relaxed">{currentConfig.description}</p>
                <div className="p-2.5 rounded bg-[#121212] border border-[#2a2a2a] text-[11px] text-[#aaaaaa]">
                  <strong className="text-[#ffffff] font-mono block mb-0.5">Best Use Case:</strong>
                  {currentConfig.useCase}
                </div>
              </div>

              {/* THE DYNAMIC GENERATED PROMPT CODE BLOCK */}
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1c] border-b border-[#2a2a2a]">
                  <span className="font-mono text-xs text-[#888888]">
                    LLM_SYSTEM_PROMPT_{elaborationMode.toUpperCase()}_({currentConfig.liberty}).txt
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121212] border border-[#333]"
                    style={{ color: "var(--accent-theme)" }}
                  >
                    Active Mode: {currentConfig.name}
                  </span>
                </div>
                <pre className="p-6 font-mono text-xs text-[#e8e8e8] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
                  {currentPrompt}
                </pre>
              </div>
            </section>
          )}

          {/* TAB 2: SEO & AI SEARCH (GEO) RULES */}
          {activeTab === "seo-rules" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#ffffff] flex items-center gap-2">
                  <Search className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
                  SEO & Generative Engine Optimization (GEO) Standards
                </h2>
                <p className="text-xs text-[#888888] mt-1">
                  How SDE.GUIDE structures content for maximum indexability in Google Search, Perplexity AI, SearchGPT, and Gemini AI Overviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl border space-y-3 bg-[#181818] border-[#2a2a2a]">
                  <h3 className="text-sm font-bold font-mono text-[#ffffff] uppercase border-b pb-2 border-[#2a2a2a]">
                    1. Knowledge Graph Entities
                  </h3>
                  <p className="text-xs text-[#aaaaaa] leading-relaxed">
                    Extract 4-8 recognized technical entities (e.g. <code>Next.js 16</code>, <code>MongoDB</code>, <code>TypeScript</code>) into <code>aiSeo.entities</code>. This allows LLM search crawlers to link your article to verified software engineering nodes.
                  </p>
                </div>

                <div className="p-5 rounded-xl border space-y-3 bg-[#181818] border-[#2a2a2a]">
                  <h3 className="text-sm font-bold font-mono text-[#ffffff] uppercase border-b pb-2 border-[#2a2a2a]">
                    2. FAQ Question Answering
                  </h3>
                  <p className="text-xs text-[#aaaaaa] leading-relaxed">
                    Formulate explicit technical questions into <code>aiSeo.questionsAnswered</code> and render them inside the mandatory <code>seo-block</code>. Perplexity and Google SearchGPT rely heavily on these question-answer pairs for AI summaries.
                  </p>
                </div>

                <div className="p-5 rounded-xl border space-y-3 bg-[#181818] border-[#2a2a2a]">
                  <h3 className="text-sm font-bold font-mono text-[#ffffff] uppercase border-b pb-2 border-[#2a2a2a]">
                    3. Mandatory SEO Overview Block
                  </h3>
                  <p className="text-xs text-[#aaaaaa] leading-relaxed">
                    Every SDE.GUIDE article created automatically mounts an <code>seo-block</code> as the first item in the canvas. It provides search engine crawlers with an immediate 5-second overview of intent and keywords, while staying non-rendering for article readers.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: TOP-LEVEL JSON SCHEMA */}
          {activeTab === "schema" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#ffffff] flex items-center gap-2">
                  <Code2 className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
                  SDE.GUIDE Top-Level JSON Document Structure
                </h2>
                <p className="text-xs text-[#888888] mt-1">
                  The exact payload schema expected by MongoDB and the <code>POST /api/articles</code> endpoint.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
                  <h3 className="text-sm font-bold font-mono text-[#ffffff] uppercase border-b pb-2 border-[#2a2a2a]">
                    Root Fields Breakdown
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-[#aaaaaa]">
                    <li>
                      <strong className="text-[#ffffff]">schemaVersion:</strong> Always <code>"1.0.0"</code>.
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.id:</strong> Unique string ID (e.g. <code>"art-1741234567890"</code>).
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.slug:</strong> URL slug formatted in kebab-case.
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.title:</strong> High-impact technical title (50-70 characters).
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.subtitle:</strong> Comprehensive technical summary (100-160 characters).
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.category:</strong> One of: <code>Frontend</code>, <code>Backend</code>, <code>System Design</code>, <code>React</code>, <code>Next.js</code>, <code>Node.js</code>, <code>TypeScript</code>, <code>DevOps</code>, <code>Architecture</code>, <code>Cloud</code>, <code>Databases</code>, <code>AI / ML</code>, <code>Security</code>.
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">article.tags:</strong> Array of string tags (e.g. <code>["MongoDB", "Next.js", "JWT"]</code>).
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
                  <h3 className="text-sm font-bold font-mono text-[#ffffff] uppercase border-b pb-2 border-[#2a2a2a]">
                    Metadata & AI SEO Settings
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-[#aaaaaa]">
                    <li>
                      <strong className="text-[#ffffff]">seo:</strong> Object containing <code>metaTitle</code>, <code>metaDescription</code>, <code>primaryKeyword</code>, <code>secondaryKeywords</code>, and <code>canonicalUrl</code>.
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">aiSeo:</strong> Advanced AI SEO object with <code>primaryTopic</code>, <code>searchIntent</code>, <code>entities</code>, <code>questionsAnswered</code>, <code>contentGaps</code>, and <code>topicCoverage</code> (0-100).
                    </li>
                    <li>
                      <strong className="text-[#ffffff]">settings:</strong> Object containing <code>readingTime</code> (number of minutes), <code>allowComments</code>, <code>showTableOfContents</code>, <code>showAuthorBio</code>.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: ALL 31 SUPPORTED BLOCK TYPES */}
          {activeTab === "blocks" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-[#ffffff] flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
                  Exhaustive Block Type Reference (All 31 Supported Blocks)
                </h2>
                <p className="text-xs text-[#888888] mt-1">
                  Every block component supported by the SDE.GUIDE renderer & block editor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    type: "seo-block",
                    title: "1. SEO & AI Overview Block (MANDATORY)",
                    desc: "Renders an AI Overview summary box displaying focus keyword, intent, entities, and questions answered.",
                    json: { primaryKeyword: "Next.js & MongoDB Engine", targetIntent: "Technical Guide & Architecture Breakdown", entities: ["Next.js 16", "MongoDB Driver", "TypeScript"], questionsAnswered: ["How to prevent pool exhaustion?"], topicCoverage: 96, suggestedSchema: ["TechArticle", "HowTo"] },
                  },
                  {
                    type: "heading",
                    title: "2. Heading Block",
                    desc: "Section titles and sub-headings (h2, h3, h4).",
                    json: { level: 2, text: "Architecture Overview & Performance Goals" },
                  },
                  {
                    type: "paragraph",
                    title: "3. Paragraph Block",
                    desc: "Standard body text paragraphs with technical prose.",
                    json: { text: "Server Components execute exclusively on the server node during initial request rendering." },
                  },
                  {
                    type: "bullet-list",
                    title: "4. Bullet List Block",
                    desc: "Unordered bulleted points for lists of features or takeaways.",
                    json: { items: ["Zero client bundle impact", "Direct DB connection pooling"] },
                  },
                  {
                    type: "numbered-list",
                    title: "5. Numbered List Block",
                    desc: "Sequential action steps or ordered list.",
                    json: { items: ["Initialize MongoDB driver singleton", "Authenticate author via JWT cookie"] },
                  },
                  {
                    type: "callout",
                    title: "6. Callout / Alert Block",
                    desc: "Highlighted banner for important rules or architecture warnings.",
                    json: { variant: "warning", title: "PRODUCTION WARNING", text: "Never expose raw MongoDB connection strings in client-side code." },
                  },
                  {
                    type: "code",
                    title: "7. VS Code Syntax Highlighter",
                    desc: "Syntax-highlighted code block with language and filename header.",
                    json: { language: "typescript", filename: "src/lib/db.ts", code: "export const db = await client.db('devarticle_db');" },
                  },
                  {
                    type: "terminal",
                    title: "8. Terminal Commands Block",
                    desc: "Interactive CLI terminal showing shell commands and outputs.",
                    json: { lines: [{ type: "command", text: "npm install mongodb jsonwebtoken" }], title: "Terminal" },
                  },
                  {
                    type: "file-tree",
                    title: "9. Visual File Tree Directory Structure",
                    desc: "Visual collapsible folder and file directory structure.",
                    json: { root: "cloud-application/", files: [{ path: "cloud-application/", type: "directory" }, { path: "cloud-application/app/", type: "directory" }, { path: "cloud-application/infrastructure/vpc/", type: "directory" }] },
                  },
                  {
                    type: "inline-code",
                    title: "10. Inline Code Expression",
                    desc: "Single code expression or variable badge with optional description.",
                    json: { code: "const pool = new Pool();", description: "Database connection pool" },
                  },
                  {
                    type: "config",
                    title: "11. Configuration File Display",
                    desc: "Config file container for ENV, YAML, JSON, or TOML files.",
                    json: { filename: ".env.local", language: "env", content: "MONGODB_URI=mongodb://127.0.0.1:27017/devarticle_db" },
                  },
                  {
                    type: "code-diff",
                    title: "12. Git Unified Code Diff",
                    desc: "Unified code diff block showing additions (+), removals (-), and context.",
                    json: { filename: "src/app/api/articles/route.ts", diff: "@@ -5,2 +5,2 @@\n- const res = fetch();\n+ const doc = await db.findOne();" },
                  },
                  {
                    type: "before-after",
                    title: "13. Before & After Code Comparison",
                    desc: "Side-by-side code snippet comparison.",
                    json: { before: { label: "OLD", code: "await db.find()" }, after: { label: "NEW", code: "await db.aggregate()" } },
                  },
                  {
                    type: "playground",
                    title: "14. Interactive Code Playground",
                    desc: "Interactive code playground container with live output simulation.",
                    json: { language: "javascript", code: "console.log('DevArticle Engine Loaded');", output: "DevArticle Engine Loaded" },
                  },
                  {
                    type: "api-request",
                    title: "15. HTTP API Endpoint Card",
                    desc: "HTTP API endpoint card displaying method badge, URL, and response status.",
                    json: { method: "POST", url: "/api/v1/articles", responseStatus: 200, response: "{\n  \"success\": true\n}" },
                  },
                  {
                    type: "http",
                    title: "16. HTTP Protocol Flow Sequence",
                    desc: "Client to server HTTP request and response step sequence visualization.",
                    json: { steps: [{ from: "Client", to: "Auth Server", method: "POST", path: "/api/auth/login", statusCode: 200 }] },
                  },
                  {
                    type: "architecture",
                    title: "17. System Architecture Diagram",
                    desc: "System service node breakdown container.",
                    json: { title: "Subsea Architecture", nodes: [{ id: "1", label: "Port Blair Gateway", type: "Gateway" }, { id: "2", label: "Subsea Cable Node", type: "Fiber" }] },
                  },
                  {
                    type: "flow",
                    title: "18. Process Flowchart Steps",
                    desc: "Step-by-step flowchart process sequence.",
                    json: { steps: [{ title: "1. Receive Payload", description: "Validate incoming JSON schema version" }] },
                  },
                  {
                    type: "sequence",
                    title: "19. UML Sequence Diagram",
                    desc: "Actor timeline and message exchange diagram.",
                    json: { actors: ["Client", "Server", "Database"], messages: [{ from: "Client", to: "Server", label: "Authenticate" }] },
                  },
                  {
                    type: "database-schema",
                    title: "20. Database Schema ER Tables",
                    desc: "Visual ER table schema editor with columns and primary keys.",
                    json: { tables: [{ name: "users", columns: [{ name: "id", type: "uuid", primaryKey: true }, { name: "email", type: "varchar" }] }] },
                  },
                  {
                    type: "json-viewer",
                    title: "21. Collapsible JSON Viewer",
                    desc: "Collapsible syntax-highlighted JSON payload viewer.",
                    json: { title: "Article Payload JSON", json: { status: "ok", latencyMs: 4 } },
                  },
                  {
                    type: "comparison",
                    title: "22. Multi-Column Comparison Table",
                    desc: "Multi-column structured data table.",
                    json: { headers: ["Feature", "SSR", "CSR"], rows: [["SEO", "Excellent", "Poor"], ["Latency", "Sub-20ms", "100-300ms"]] },
                  },
                  {
                    type: "benchmark",
                    title: "23. Empirical Performance Benchmark",
                    desc: "Performance stats grid displaying metrics with units.",
                    json: { title: "Query Speed benchmark", metrics: [{ label: "P99 LATENCY", value: "8.2", unit: "ms" }] },
                  },
                  {
                    type: "pros-cons",
                    title: "24. Pros & Cons Tradeoff Card",
                    desc: "Side-by-side breakdown of advantages vs trade-offs.",
                    json: { pros: ["Fast cold starts", "Sub-10ms queries"], cons: ["Requires serverless pool management"] },
                  },
                  {
                    type: "takeaways",
                    title: "25. Key Takeaways Card",
                    desc: "Summary box highlighting core lessons.",
                    json: { items: ["Always use connection singleton", "Validate JWT on mutation routes"] },
                  },
                  {
                    type: "definition",
                    title: "26. Technical Definition Card",
                    desc: "Highlighted term definition box for technical glossaries.",
                    json: { term: "Server Component", definition: "A React component rendered strictly on the server with zero client bundle impact." },
                  },
                  {
                    type: "steps",
                    title: "27. Step-by-Step Tutorial Guide",
                    desc: "Numbered step-by-step guide with descriptions and optional code.",
                    json: { steps: [{ title: "Step 1: Create Pool", description: "Initialize driver pool instance", code: "const client = new MongoClient(uri);" }] },
                  },
                  {
                    type: "react-component",
                    title: "28. Interactive React Widget Embed",
                    desc: "Live interactive widget component (RAG calculator, counter, telemetry).",
                    json: { componentName: "RAGCalculator", previewType: "rag-calculator", description: "Test chunk size vs latency." },
                  },
                  {
                    type: "image",
                    title: "29. Image & Diagram Block",
                    desc: "High-resolution diagram with caption and alt text.",
                    json: { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800", caption: "Microservices Network Diagram", alt: "Architecture Diagram" },
                  },
                  {
                    type: "embed",
                    title: "30. External Resource Embed",
                    desc: "Embed external assets (GitHub, CodeSandbox, YouTube, Figma).",
                    json: { provider: "github", url: "https://gist.github.com/mrinal/123456", title: "GitHub Gist Demo" },
                  },
                  {
                    type: "rich-text",
                    title: "31. Rich Text Container",
                    desc: "Formatted rich text container supporting inline annotations.",
                    json: { text: "Use React.memo to prevent unnecessary child re-renders." },
                  },
                ].map((blk) => (
                  <div key={blk.type} className="p-5 rounded-xl border space-y-3 bg-[#181818] border-[#2a2a2a]">
                    <div className="flex items-center justify-between border-b pb-2 border-[#2a2a2a]">
                      <h3 className="text-sm font-bold text-[#ffffff] font-mono">{blk.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121212] border border-[#333]" style={{ color: "var(--accent-theme)" }}>
                        type: "{blk.type}"
                      </span>
                    </div>
                    <p className="text-xs text-[#888888]">{blk.desc}</p>
                    <pre className="p-3 rounded-lg bg-[#121212] font-mono text-[11px] text-[#e8e8e8] overflow-x-auto border border-[#2a2a2a]">
                      {JSON.stringify({ id: `blk-sample`, type: blk.type, version: 1, data: blk.json }, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: READY-TO-IMPORT JSON EXAMPLE */}
          {activeTab === "example" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#ffffff] flex items-center gap-2">
                    <FileText className="h-5 w-5" style={{ color: "var(--accent-theme)" }} />
                    Complete Working SEO-Optimized Article Document JSON
                  </h2>
                  <p className="text-xs text-[#888888] mt-1">
                    Copy this exact payload and paste it into the JSON Import box on <code>/create</code> to test instant importing!
                  </p>
                </div>

                <button
                  onClick={handleCopyExample}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors"
                >
                  {copiedExample ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />}
                  <span>{copiedExample ? "Copied JSON!" : "Copy Full JSON Payload"}</span>
                </button>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}>
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1c] border-b border-[#2a2a2a]">
                  <span className="font-mono text-xs text-[#888888]">seo-optimized-nextjs-mongodb-article.json</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121212] border border-[#333] text-[#aaaaaa]">
                    Valid SDE.GUIDE Payload
                  </span>
                </div>
                <pre className="p-6 font-mono text-xs text-[#e8e8e8] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
                  {JSON.stringify(FULL_EXAMPLE_JSON, null, 2)}
                </pre>
              </div>
            </section>
          )}
        </main>
      </div>
    </ProtectedAuthRoute>
  );
}
