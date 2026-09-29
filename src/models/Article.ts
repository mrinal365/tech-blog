import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticleDoc extends Document {
  schemaVersion: string;
  article: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      role?: string;
    };
    category: string;
    tags: string[];
    status: "draft" | "ready" | "published" | "archived";
    createdAt: string;
    updatedAt: string;
    views: number;
    likes: number;
    seo?: Record<string, unknown>;
    aiSeo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    blocks: Array<Record<string, unknown>>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticleDoc>(
  {
    schemaVersion: { type: String, default: "1.0" },
    article: {
      id: { type: String, required: true, index: true },
      slug: { type: String, required: true, unique: true, index: true },
      title: { type: String, required: true },
      subtitle: { type: String, default: "" },
      author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String, default: "" },
        role: { type: String, default: "Full-Stack Developer" },
      },
      category: { type: String, required: true, index: true },
      tags: [{ type: String, index: true }],
      status: {
        type: String,
        enum: ["draft", "ready", "published", "archived"],
        default: "published",
        index: true,
      },
      createdAt: { type: String, required: true },
      updatedAt: { type: String, required: true },
      views: { type: Number, default: 100 },
      likes: { type: Number, default: 10 },
      seo: { type: Schema.Types.Mixed, default: {} },
      aiSeo: { type: Schema.Types.Mixed, default: {} },
      metadata: { type: Schema.Types.Mixed, default: {} },
      settings: { type: Schema.Types.Mixed, default: {} },
      // The heavy blocks array
      blocks: [{ type: Schema.Types.Mixed }],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-speed queries
ArticleSchema.index({ "article.status": 1, "article.createdAt": -1 });
ArticleSchema.index({ "article.category": 1, "article.status": 1 });
ArticleSchema.index({ "article.tags": 1, "article.status": 1 });

export const ArticleModel: Model<IArticleDoc> =
  mongoose.models.ArticleDoc || mongoose.model<IArticleDoc>("ArticleDoc", ArticleSchema);
