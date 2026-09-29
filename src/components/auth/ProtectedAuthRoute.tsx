"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";

interface ProtectedAuthRouteProps {
  children: React.ReactNode;
}

export function ProtectedAuthRoute({ children }: ProtectedAuthRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            return;
          }
        }
      } catch {
        // ignore
      }
      setIsAuthenticated(false);
      router.replace("/login");
    }

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#cccccc] select-none" style={{ backgroundColor: "#121212" }}>
        <div className="p-8 rounded-2xl border text-center space-y-3 max-w-sm" style={{ backgroundColor: "#181818", borderColor: "#2a2a2a" }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto bg-[#1a1a1a] border border-[#2a2a2a]">
            <Lock className="h-6 w-6 animate-pulse" style={{ color: "var(--accent-theme)" }} />
          </div>
          <h2 className="text-base font-bold text-[#ffffff]">Verifying JWT Session...</h2>
          <p className="text-xs text-[#888888]">
            Checking author permissions for protected creator route
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
