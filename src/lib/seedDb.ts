import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { ArticleModel } from "@/models/Article";
import { DETAILED_SAMPLE_ARTICLES } from "@/data/sampleArticlesData";

export async function ensureDbSeeded() {
  try {
    await connectToDatabase();

    // 1. Ensure Admin User exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const defaultPassword = process.env.ADMIN_PASSWORD || "change_me_in_env";
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      await User.create({
        email: adminEmail,
        passwordHash,
        name: "Mrinal",
        role: "admin",
      });
      console.log(`[Seed] Admin user created: ${adminEmail}`);
    }

    // 2. Clear out dummy sample articles from MongoDB so /articles stays clean
    const sampleSlugs = DETAILED_SAMPLE_ARTICLES.map((item) => item.article.slug);
    const deleteResult = await ArticleModel.deleteMany({
      "article.slug": { $in: sampleSlugs },
    });
    if (deleteResult.deletedCount > 0) {
      console.log(`[Seed] Purged ${deleteResult.deletedCount} dummy sample articles from MongoDB.`);
    }
  } catch (err) {
    console.error("[Seed] Error during seeding:", err);
  }
}

