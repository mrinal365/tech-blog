"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TerminalLogo } from "@/components/TerminalLogo";
import { AlertCircle, Mail, Lock, ArrowRight } from "lucide-react";

export default function AuthorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Successful JWT Login
      if (data.token) {
        localStorage.setItem("sde_auth_token", data.token);
      }

      router.push("/create");
    } catch {
      setError("Network error connecting to authentication service");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 text-[#cccccc] select-none"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Branding Logo Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link href="/" className="inline-flex transition-transform hover:scale-105">
            <TerminalLogo size={44} showText={true} />
          </Link>
          <h1 className="text-xl font-extrabold text-[#ffffff] pt-2">Author Access</h1>
          <p className="text-xs text-[#888888]">
            Sign in with JWT credentials to access SDE.GUIDE creator & admin tools
          </p>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl border space-y-4 shadow-2xl"
          style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}
        >
          {error && (
            <div className="p-3 rounded-lg border bg-[#271212] border-[#772222] text-[#ffaaaa] text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff6666]" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase text-[#777777] mb-1.5">
              Author Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@sde.guide"
                className="w-full rounded-lg pl-9 pr-3 py-2 text-xs font-mono outline-none transition-colors"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid #2a2a2a",
                  color: "#ffffff",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase text-[#777777] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg pl-9 pr-3 py-2 text-xs font-mono outline-none transition-colors"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid #2a2a2a",
                  color: "#ffffff",
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all hover:bg-[#e0e0e0]"
              style={{ backgroundColor: "#ffffff", color: "#121212" }}
            >
              <span>{isLoading ? "Verifying JWT..." : "Sign In to Creator Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="pt-2 text-center border-t border-[#2a2a2a]">
            <p className="text-[11px] font-mono text-[#666666]">
              MongoDB Authenticated Access
            </p>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center text-xs font-mono text-[#666666]">
          <Link href="/" className="hover:text-[#ffffff] transition-colors">
            ← Return to sde.guide
          </Link>
          <span className="mx-2">•</span>
          <Link href="/user/mrinal" className="hover:text-[#ffffff] transition-colors">
            Author Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
