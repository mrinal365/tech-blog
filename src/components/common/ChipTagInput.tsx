"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface ChipTagInputProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function ChipTagInput({
  tags = [],
  onChange,
  placeholder = "Type and press Space, Enter, or comma...",
  maxTags = 20,
}: ChipTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (text: string) => {
    const trimmed = text.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (tags.length >= maxTags) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      onChange(tags.slice(0, tags.length - 1));
    }
  };

  const handleRemove = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 rounded-lg p-2 text-xs font-mono border transition-all focus-within:border-[#555555]"
      style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
    >
      {/* Rendered Chips */}
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono border transition-all animate-in fade-in zoom-in-95"
          style={{
            backgroundColor: "#1c1917",
            borderColor: "var(--accent-theme)",
            color: "var(--accent-theme)",
          }}
        >
          <span>#{tag}</span>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="rounded p-0.5 text-[#aaaaaa] hover:text-[#ffffff] hover:bg-white/10 transition-colors"
            title="Remove tag"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val.includes(",")) {
            addTag(val);
          } else {
            setInputValue(val);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue) addTag(inputValue);
        }}
        placeholder={tags.length === 0 ? placeholder : "Add tag..."}
        className="flex-1 min-w-[120px] bg-transparent text-xs outline-none text-[#ffffff] placeholder-[#555555]"
      />
    </div>
  );
}
