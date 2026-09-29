"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

interface PortalTooltipProps {
  title: string;
  explanation: string;
  example?: string;
  children?: React.ReactNode;
  iconSize?: string;
}

export function PortalTooltip({
  title,
  explanation,
  example,
  children,
  iconSize = "h-3.5 w-3.5",
}: PortalTooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: true,
  });
  const triggerRef = useRef<HTMLButtonElement | HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 280; // width of tooltip card
      const tooltipHeight = 150; // approximate height

      // Check if space exists above
      const placeAbove = rect.top > tooltipHeight + 15;

      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      // Clamp within screen boundaries
      if (left < 12) left = 12;
      if (left + tooltipWidth > window.innerWidth - 12) {
        left = window.innerWidth - tooltipWidth - 12;
      }

      let top = placeAbove
        ? rect.top - tooltipHeight - 6
        : rect.bottom + 6;

      if (top < 10) top = 10;

      setCoords({ top, left, placeAbove });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePosition();
    setShow((prev) => !prev);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="inline-flex items-center cursor-pointer select-none"
      >
        {children || (
          <button
            type="button"
            className="p-0.5 text-[#666666] hover:text-[#ffffff] transition-colors rounded focus:outline-none"
            title="View details & example"
          >
            <Info className={iconSize} />
          </button>
        )}
      </span>

      {mounted &&
        show &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 999999, // Highest z-index on top of all layers
            }}
            className="w-72 rounded-xl p-3 shadow-2xl bg-[#1c1c1c] border border-[#3a3a3a] text-xs font-mono select-none pointer-events-none animate-in fade-in zoom-in-95"
          >
            <div className="font-bold text-[#ffffff] border-b pb-1.5 border-[#333333] mb-2 flex items-center justify-between">
              <span className="text-xs text-[#ffffff]">{title}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#888888] font-normal uppercase">
                Info
              </span>
            </div>
            <p className="text-[11px] text-[#cccccc] leading-relaxed mb-2 font-sans normal-case">
              {explanation}
            </p>
            {example && (
              <div className="p-2 rounded bg-[#111111] border border-[#2a2a2a] text-[10px] text-[#aaaaaa]">
                <span
                  className="font-bold block mb-0.5 font-mono"
                  style={{ color: "var(--accent-theme)" }}
                >
                  Example:
                </span>
                <code className="break-all whitespace-pre-wrap font-mono text-[10px] text-[#e8e8e8]">
                  {example}
                </code>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
