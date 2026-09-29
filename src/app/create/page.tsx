"use client";

import { Suspense } from "react";
import { ArticleEditor } from "@/components/editor/ArticleEditor";
import { ProtectedAuthRoute } from "@/components/auth/ProtectedAuthRoute";

export default function CreateArticlePage() {
  return (
    <ProtectedAuthRoute>
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center font-mono text-xs text-[#888888]"
            style={{ backgroundColor: "#121212" }}
          >
            Loading SDE.GUIDE Editor...
          </div>
        }
      >
        <ArticleEditor />
      </Suspense>
    </ProtectedAuthRoute>
  );
}

