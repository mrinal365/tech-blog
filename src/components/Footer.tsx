import Link from "next/link";
import { Globe, Share2, Code2 } from "lucide-react";
import { TerminalLogo } from "./TerminalLogo";

export function Footer() {
  return (
    <footer className="border-t py-10 select-none" style={{ borderColor: "#2a2a2a", backgroundColor: "#121212" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <TerminalLogo size={24} showText={false} />
            <span className="font-mono text-xs font-semibold text-[#ffffff]">
              sde<span style={{ color: "#84cc16" }}>.guide</span> &copy; {new Date().getFullYear()} — Full-Stack Engineering Journal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#888888]">
            <Link href="/" className="transition-colors hover:text-[#ffffff]">Home</Link>
            <span style={{ color: "#2a2a2a" }}>·</span>
            <Link href="/user/mrinal" className="transition-colors hover:text-[#ffffff]">Author Profile</Link>
            <span style={{ color: "#2a2a2a" }}>·</span>
            <Link href="/articles" className="transition-colors hover:text-[#ffffff]">Articles</Link>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer"
              className="rounded-md p-2 transition-colors hover:bg-[#1a1a1a]" style={{ color: "#777777" }}>
              <Code2 className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"
              className="rounded-md p-2 transition-colors hover:bg-[#1a1a1a]" style={{ color: "#777777" }}>
              <Share2 className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-md p-2 transition-colors hover:bg-[#1a1a1a]" style={{ color: "#777777" }}>
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
