import { NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/seedDb";

export async function POST() {
  try {
    await ensureDbSeeded();
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("[Seed API Error]:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureDbSeeded();
    return NextResponse.json({ success: true, message: "Database connection & seed verified" });
  } catch (error) {
    console.error("[Seed API GET Error]:", error);
    return NextResponse.json({ error: "Failed to verify database" }, { status: 500 });
  }
}
