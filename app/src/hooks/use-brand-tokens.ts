"use client";

import { useEffect, useState } from "react";
import {
  resolveTokens,
  applyBrandTokens,
  type DsTokenMap,
} from "@/lib/skeleton/token-bridge";

/** Default Viridian DS-ONT instance tokens. */
const DEFAULT_VIRIDIAN_TOKENS = {
  colours: {
    primary: "#007c74",
    "primary-foreground": "#ffffff",
    secondary: "#f16a21",
    "secondary-foreground": "#ffffff",
    background: "#ffffff",
    foreground: "#1a1a1a",
    muted: "#f4f4f5",
    "muted-foreground": "#71717a",
    accent: "#e6f5f4",
    "accent-foreground": "#005a54",
    card: "#ffffff",
    "card-foreground": "#1a1a1a",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#007c74",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
  },
  typography: {
    fontFamily: '"PT Sans", sans-serif',
  },
  radii: {
    lg: "0.5rem",
    md: "0.375rem",
    sm: "0.25rem",
  },
};

interface UseBrandTokensResult {
  appliedTokens: DsTokenMap | null;
  loading: boolean;
}

export function useBrandTokens(dsInstanceUrl?: string): UseBrandTokensResult {
  const [appliedTokens, setAppliedTokens] = useState<DsTokenMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let instance;

        if (dsInstanceUrl) {
          const res = await fetch(dsInstanceUrl, { cache: "no-store" });
          if (!res.ok)
            throw new Error(`Failed to fetch DS instance: ${res.status}`);
          instance = await res.json();
        } else {
          instance = DEFAULT_VIRIDIAN_TOKENS;
        }

        if (cancelled) return;

        const tokens = resolveTokens(instance);
        applyBrandTokens(tokens);
        setAppliedTokens(tokens);
      } catch {
        // Fall back to CSS defaults already in globals.css
        setAppliedTokens(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [dsInstanceUrl]);

  return { appliedTokens, loading };
}
