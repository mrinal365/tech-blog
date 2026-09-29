"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/articleStore";
import {
  setSubtitle,
  addBlock,
  selectBlock,
} from "@/store/articleStore";
import { BlockToolbar } from "./BlockToolbar";
import { BlockEditor } from "./BlockEditor";
import { Plus } from "lucide-react";
import type { BlockType } from "@/types/article";

export function BlockCanvas() {
  const dispatch = useDispatch<AppDispatch>();
  const { document, selectedBlockId } = useSelector(
    (state: RootState) => state.editor
  );

  const blocks = document.article.blocks;
  const subtitle = document.article.subtitle;

  const handleAddBlock = (type: BlockType, index: number) => {
    dispatch(addBlock({ type, index }));
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: "#121212" }}
      onClick={(e) => {
        // Deselect block when clicking canvas background
        if (e.target === e.currentTarget) {
          dispatch(selectBlock(null));
        }
      }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Subtitle */}
        <input
          type="text"
          value={subtitle}
          onChange={(e) => dispatch(setSubtitle(e.target.value))}
          placeholder="Add a subtitle..."
          className="mb-8 w-full bg-transparent text-base outline-none placeholder:text-[#666666]"
          style={{ color: "#aaaaaa" }}
        />

        {/* Block List */}
        {blocks.length === 0 ? (
          // Empty State
          <div
            className="flex flex-col items-center justify-center rounded-xl py-20"
            style={{ border: "1px dashed #2a2a2a" }}
          >
            <p className="mb-4 text-sm" style={{ color: "#777777" }}>
              Start writing your article
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(["heading", "paragraph", "code", "callout"] as BlockType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type, 0)}
                  className="rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors hover:bg-[#222222]"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#e8e8e8",
                  }}
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {blocks.map((block, index) => (
              <div key={block.id}>
                {/* Add Block Gap (between blocks) */}
                <AddBlockGap index={index} onAdd={handleAddBlock} />

                {/* Block */}
                <div
                  className="group relative rounded-lg transition-all"
                  style={{
                    border: selectedBlockId === block.id ? "1px solid #444444" : "1px solid transparent",
                    backgroundColor: selectedBlockId === block.id ? "#1a1a1a" : "transparent",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(selectBlock(block.id));
                  }}
                >
                  {/* Toolbar appears on hover/selection */}
                  <div className="absolute -top-3 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ opacity: selectedBlockId === block.id ? 1 : undefined }}>
                    <BlockToolbar blockId={block.id} index={index} total={blocks.length} />
                  </div>

                  {/* Block Editor */}
                  <div className="px-3 py-2">
                    <BlockEditor block={block} />
                  </div>
                </div>
              </div>
            ))}

            {/* Final add block gap */}
            <AddBlockGap index={blocks.length} onAdd={handleAddBlock} />
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Add Block Button
function AddBlockGap({
  index,
  onAdd,
}: {
  index: number;
  onAdd: (type: BlockType, index: number) => void;
}) {
  return (
    <div className="group/gap relative flex h-6 items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-0 transition-opacity group-hover/gap:opacity-100" style={{ backgroundColor: "#2a2a2a" }} />
      <button
        onClick={() => onAdd("paragraph", index)}
        className="relative z-10 flex h-5 w-5 items-center justify-center rounded opacity-0 transition-all group-hover/gap:opacity-100 hover:scale-110"
        style={{ backgroundColor: "#2a2a2a", color: "#e8e8e8" }}
        title="Add block"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
