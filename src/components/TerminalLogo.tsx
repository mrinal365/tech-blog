"use client";

import Image from "next/image";
import Link from "next/link";

interface TerminalLogoProps {
  size?: number; // size in pixels for the icon (default 32)
  showText?: boolean;
  className?: string;
  useImage?: boolean; // if true, uses the generated PNG image; else SVG icon
}

export function TerminalLogo({
  size = 32,
  showText = true,
  className = "",
  useImage = true,
}: TerminalLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-xl transition-transform hover:scale-105"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#161616",
          border: "1px solid #2e2e2e",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        }}
      >
        {useImage ? (
          <Image
            src="/logo.png"
            alt="sde.guide logo"
            width={size}
            height={size}
            className="object-cover w-full h-full rounded-xl"
            priority
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 32 30 L 52 48 L 32 66"
              fill="none"
              stroke="#84cc16"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="56"
              y1="66"
              x2="74"
              y2="66"
              stroke="#84cc16"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {showText && (
        <span className="font-mono text-sm font-extrabold tracking-wider text-[#ffffff]">
          sde<span style={{ color: "#84cc16" }}>.guide</span>
        </span>
      )}
    </div>
  );
}
