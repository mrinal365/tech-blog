"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { moveBlock, duplicateBlock, removeBlock } from "@/store/articleStore";
import { ChevronUp, ChevronDown, Copy, Trash2, GripVertical } from "lucide-react";
import { PortalTooltip } from "@/components/common/PortalTooltip";

interface BlockToolbarProps {
  blockId: string;
  index: number;
  total: number;
}

export function BlockToolbar({ blockId, index, total }: BlockToolbarProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="flex items-center gap-0.5 rounded-md px-1.5 py-1 shadow-2xl z-50 select-none"
      style={{ backgroundColor: "#1c1c1c", border: "1px solid #3a3a3a" }}
    >
      <span className="px-0.5 cursor-grab text-[#666666] hover:text-[#ffffff]" title="Drag block">
        <GripVertical className="h-3.5 w-3.5" />
      </span>

      <div className="mx-0.5 h-4 w-px bg-[#333333]" />

      <PortalTooltip title="Move Up" explanation="Move block up 1 position in article canvas.">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(moveBlock({ blockId, direction: "up" }));
          }}
          disabled={index === 0}
          className="rounded p-1 transition-colors hover:bg-[#282828] disabled:opacity-20 text-[#aaaaaa] hover:text-[#ffffff]"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </PortalTooltip>

      <PortalTooltip title="Move Down" explanation="Move block down 1 position in article canvas.">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(moveBlock({ blockId, direction: "down" }));
          }}
          disabled={index === total - 1}
          className="rounded p-1 transition-colors hover:bg-[#282828] disabled:opacity-20 text-[#aaaaaa] hover:text-[#ffffff]"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </PortalTooltip>

      <div className="mx-0.5 h-4 w-px bg-[#333333]" />

      <PortalTooltip title="Duplicate Block" explanation="Clone this block with all its content directly below.">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(duplicateBlock(blockId));
          }}
          className="rounded p-1 transition-colors hover:bg-[#282828] text-[#aaaaaa] hover:text-[#ffffff]"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </PortalTooltip>

      <PortalTooltip title="Delete Block" explanation="Remove this block from the article document.">
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeBlock(blockId));
          }}
          className="rounded p-1 transition-colors hover:bg-[#3b1212] text-[#aaaaaa] hover:text-[#ef4444]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </PortalTooltip>
    </div>
  );
}
