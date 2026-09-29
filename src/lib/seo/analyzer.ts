import { ArticleDocument, SEOCheck, BaseBlock } from "@/types/article";
import type { HeadingBlockData, ImageBlockData, ParagraphBlockData, CodeBlockData } from "@/types/blocks";

// Run SEO Analysis
export function analyzeSEO(doc: ArticleDocument): {
  score: number;
  checks: SEOCheck[];
} {
  const checks: SEOCheck[] = [];
  const article = doc.article;

  // 1. Title length
  const titleLen = article.title.length;
  checks.push({
    id: "title-length",
    label: "Title length",
    status: titleLen >= 30 && titleLen <= 70 ? "pass" : titleLen > 0 ? "warning" : "fail",
    message:
      titleLen === 0
        ? "No title set"
        : titleLen < 30
          ? `Title is short (${titleLen} chars, recommend 30-70)`
          : titleLen > 70
            ? `Title is long (${titleLen} chars, recommend 30-70)`
            : `Good length (${titleLen} chars)`,
  });

  // 2. Meta description
  const descLen = article.seo.metaDescription.length;
  checks.push({
    id: "meta-description",
    label: "Meta description",
    status: descLen >= 120 && descLen <= 160 ? "pass" : descLen > 0 ? "warning" : "fail",
    message:
      descLen === 0
        ? "No meta description"
        : descLen < 120
          ? `Description is short (${descLen} chars, recommend 120-160)`
          : descLen > 160
            ? `Description is long (${descLen} chars, recommend 120-160)`
            : `Good length (${descLen} chars)`,
  });

  // 3. Primary keyword
  const hasKeyword = article.seo.primaryKeyword.length > 0;
  checks.push({
    id: "primary-keyword",
    label: "Primary keyword",
    status: hasKeyword ? "pass" : "fail",
    message: hasKeyword ? `Set: "${article.seo.primaryKeyword}"` : "No primary keyword defined",
  });

  // 4. URL slug
  const hasSlug = article.slug.length > 0;
  const slugClean = /^[a-z0-9-]+$/.test(article.slug);
  checks.push({
    id: "url-slug",
    label: "URL slug",
    status: hasSlug && slugClean ? "pass" : hasSlug ? "warning" : "fail",
    message: !hasSlug
      ? "No slug set"
      : !slugClean
        ? "Slug contains invalid characters"
        : "Clean URL slug",
  });

  // 5. H1 (title acts as H1)
  checks.push({
    id: "h1-present",
    label: "H1 heading",
    status: article.title.length > 0 ? "pass" : "fail",
    message: article.title.length > 0 ? "Article title serves as H1" : "Missing H1 (article title)",
  });

  // 6. H2 structure
  const headingBlocks = article.blocks.filter((b) => b.type === "heading");
  const h2Count = headingBlocks.filter((b) => (b.data as unknown as HeadingBlockData).level === 2).length;
  checks.push({
    id: "h2-structure",
    label: "H2 headings",
    status: h2Count >= 2 ? "pass" : h2Count >= 1 ? "warning" : "fail",
    message: h2Count === 0 ? "No H2 headings found" : `${h2Count} H2 heading(s) found`,
  });

  // 7. Heading hierarchy
  const levels = headingBlocks.map((b) => (b.data as unknown as HeadingBlockData).level);
  let hierarchyOk = true;
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      hierarchyOk = false;
      break;
    }
  }
  checks.push({
    id: "heading-hierarchy",
    label: "Heading hierarchy",
    status: levels.length === 0 ? "warning" : hierarchyOk ? "pass" : "warning",
    message: hierarchyOk ? "Correct heading hierarchy" : "Heading levels skip (e.g., H2 → H4)",
  });

  // 8. Image alt text
  const imageBlocks = article.blocks.filter((b) => b.type === "image");
  const imagesWithAlt = imageBlocks.filter((b) => (b.data as unknown as ImageBlockData).alt?.length > 0);
  checks.push({
    id: "image-alt",
    label: "Image alt text",
    status:
      imageBlocks.length === 0
        ? "warning"
        : imagesWithAlt.length === imageBlocks.length
          ? "pass"
          : "fail",
    message:
      imageBlocks.length === 0
        ? "No images in article"
        : `${imagesWithAlt.length}/${imageBlocks.length} images have alt text`,
  });

  // 9. Code blocks presence
  const codeBlocks = article.blocks.filter((b) => b.type === "code");
  checks.push({
    id: "code-blocks",
    label: "Code examples",
    status: codeBlocks.length > 0 ? "pass" : "warning",
    message: codeBlocks.length > 0 ? `${codeBlocks.length} code block(s)` : "No code examples (recommended for tech articles)",
  });

  // 10. Article length (block count)
  const blockCount = article.blocks.length;
  checks.push({
    id: "article-length",
    label: "Article length",
    status: blockCount >= 8 ? "pass" : blockCount >= 3 ? "warning" : "fail",
    message: `${blockCount} block(s) — ${blockCount < 3 ? "very short" : blockCount < 8 ? "consider expanding" : "good content depth"}`,
  });

  // 11. Content variety
  const blockTypes = new Set(article.blocks.map((b) => b.type));
  checks.push({
    id: "content-variety",
    label: "Content variety",
    status: blockTypes.size >= 4 ? "pass" : blockTypes.size >= 2 ? "warning" : "fail",
    message: `${blockTypes.size} unique block type(s) used`,
  });

  // 12. Tags
  checks.push({
    id: "tags",
    label: "Article tags",
    status: article.tags.length >= 3 ? "pass" : article.tags.length > 0 ? "warning" : "fail",
    message: article.tags.length === 0 ? "No tags set" : `${article.tags.length} tag(s)`,
  });

  // Calculate overall score
  const passCount = checks.filter((c) => c.status === "pass").length;
  const score = Math.round((passCount / checks.length) * 100);

  return { score, checks };
}
