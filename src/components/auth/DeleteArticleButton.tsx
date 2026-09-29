"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteArticleButtonProps {
  slug: string;
  title: string;
  redirectOnDelete?: string;
}

export function DeleteArticleButton({
  slug,
  title,
  redirectOnDelete,
}: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("sde_auth_token") : null;

    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to delete article");
        setIsDeleting(false);
        return;
      }

      if (redirectOnDelete) {
        router.push(redirectOnDelete);
      }
      router.refresh();
    } catch (err) {
      console.error("Delete article error:", err);
      alert("Network error deleting article.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-mono font-medium text-[#ff7777] hover:text-[#ff4444] hover:bg-[#2a1515] transition-colors border border-[#3a2222] disabled:opacity-50"
      title={`Delete "${title}"`}
    >
      {isDeleting ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
