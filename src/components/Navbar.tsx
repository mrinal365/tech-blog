"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Terminal, BookOpen, User, Edit3, LogOut, Sparkles, Menu, X } from "lucide-react";

interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role?: string;
}

import { TerminalLogo } from "./TerminalLogo";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("sde_auth_token");
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      /* ignore */
    }
  };

  // Don't show navbar on /create or /login
  if (pathname === "/create" || pathname === "/login") return null;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ borderColor: "#2a2a2a", backgroundColor: "#121212" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="transition-opacity hover:opacity-90 shrink-0">
          <TerminalLogo size={32} showText={true} />
        </Link>

        {/* Mobile Hamburger Toggle Button (< md) */}
        <div className="flex items-center md:hidden gap-2">
          {user && (
            <Link
              href="/create"
              className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold bg-[#ffffff] text-[#121212]"
            >
              <Edit3 className="h-3 w-3" style={{ color: "var(--accent-theme)" }} />
              <span>Write</span>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#aaaaaa] hover:text-[#ffffff] hover:bg-[#1f1f1f] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop Navigation (>= md) */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            href="/user/mrinal"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: pathname.startsWith("/user/mrinal") ? "#222222" : "transparent",
              color: pathname.startsWith("/user/mrinal") ? "#ffffff" : "#888888",
              border: pathname.startsWith("/user/mrinal") ? "1px solid #2a2a2a" : "1px solid transparent",
            }}
          >
            <User className="h-3.5 w-3.5" />
            <span>Author</span>
          </Link>

          <Link
            href="/articles"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: pathname.startsWith("/articles") ? "#222222" : "transparent",
              color: pathname.startsWith("/articles") ? "#ffffff" : "#888888",
              border: pathname.startsWith("/articles") ? "1px solid #2a2a2a" : "1px solid transparent",
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Articles</span>
          </Link>

          {/* Logged-in User Info & Quick Author Controls */}
          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#2a2a2a]">
              {/* LLM Guide Link */}
              <Link
                href="/guide"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor: pathname.startsWith("/guide") ? "#222222" : "transparent",
                  color: pathname.startsWith("/guide") ? "#ffffff" : "#888888",
                  border: pathname.startsWith("/guide") ? "1px solid #2a2a2a" : "1px solid transparent",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
                <span>LLM Guide</span>
              </Link>

              {/* Write / Create Link */}
              <Link
                href="/create"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono font-bold bg-[#ffffff] text-[#121212] hover:bg-[#e0e0e0] transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" style={{ color: "var(--accent-theme)" }} />
                <span>Write</span>
              </Link>

              {/* User Info Badge */}
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1 border text-xs font-mono"
                style={{ backgroundColor: "#181818", borderColor: "#3a3a3a" }}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: "#1c1917",
                    color: "var(--accent-theme)",
                    border: "1px solid var(--accent-theme)",
                  }}
                >
                  MR
                </div>
                <span className="text-[#ffffff] font-semibold">{user.name || "Mrinal"}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-[#777777] hover:text-[#ffffff] hover:bg-[#222222] transition-colors"
                title="Sign out of Author Access"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Slide-Down Menu (< md down to 320px) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-3 py-3 space-y-2 bg-[#161616]" style={{ borderColor: "#2a2a2a" }}>
          <Link
            href="/user/mrinal"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#ffffff] hover:bg-[#222222]"
          >
            <User className="h-4 w-4 text-[#888888]" />
            <span>Author Profile (Mrinal)</span>
          </Link>

          <Link
            href="/articles"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#ffffff] hover:bg-[#222222]"
          >
            <BookOpen className="h-4 w-4 text-[#888888]" />
            <span>Explore Articles</span>
          </Link>

          {user && (
            <>
              <Link
                href="/guide"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#ffffff] hover:bg-[#222222]"
              >
                <Sparkles className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
                <span>LLM SDE.GUIDE & SEO Guide</span>
              </Link>

              <Link
                href="/create"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold bg-[#ffffff] text-[#121212]"
              >
                <Edit3 className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
                <span>Create New Article (/create)</span>
              </Link>

              <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a] px-3 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: "#181818", color: "var(--accent-theme)", border: "1px solid var(--accent-theme)" }}
                  >
                    MR
                  </div>
                  <span className="text-[#ffffff] font-medium">{user.name || "Mrinal"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 py-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

