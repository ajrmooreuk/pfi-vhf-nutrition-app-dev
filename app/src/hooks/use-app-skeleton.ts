"use client";

import { useEffect, useState } from "react";
import {
  parseAppSkeleton,
  buildSkeletonRegistries,
  type ParsedSkeleton,
  type SkeletonRegistries,
} from "@/lib/skeleton/skeleton-loader";

/** Default VHF skeleton — used when no JSONLD endpoint is configured. */
const DEFAULT_VHF_SKELETON = {
  "@context": "https://schema.org",
  "@id": "vhf-nutrition-app",
  "@type": "WebApplication",
  name: "VHF Nutrition",
  description: "Viridian Health & Fitness Coaching Platform",
  version: "0.1.0",
  "@graph": [
    { "@type": "Zone", "@id": "dashboard", label: "Dashboard", slug: "dashboard", icon: "layout-dashboard", order: 1, visible: true },
    { "@type": "Zone", "@id": "plans", label: "Meal Plans", slug: "plans", icon: "calendar", order: 2, visible: true },
    { "@type": "Zone", "@id": "recipes", label: "Recipes", slug: "recipes", icon: "utensils", order: 3, visible: true },
    { "@type": "Zone", "@id": "shopping", label: "Shopping", slug: "shopping", icon: "shopping-cart", order: 4, visible: true },
    { "@type": "Zone", "@id": "quality", label: "Quality", slug: "quality", icon: "check-circle", order: 5, visible: true },
    { "@type": "Zone", "@id": "coach-panel", label: "Coach Panel", slug: "coach-panel", icon: "users", order: 6, visible: true, requiredRole: "coach" },
    { "@type": "Zone", "@id": "admin", label: "Admin", slug: "admin", icon: "settings", order: 7, visible: true, requiredRole: "admin" },
    { "@type": "Zone", "@id": "billing", label: "Billing", slug: "billing", icon: "credit-card", order: 8, visible: true },
    {
      "@type": "NavLayer",
      "@id": "sidebar-main",
      label: "Main Navigation",
      position: "sidebar",
      zones: ["dashboard", "plans", "recipes", "shopping", "quality", "coach-panel", "admin", "billing"],
    },
    { "@type": "NavItem", "@id": "nav-dashboard", label: "Dashboard", href: "/dashboard", zoneId: "dashboard", icon: "layout-dashboard", order: 1 },
    { "@type": "NavItem", "@id": "nav-plans", label: "Meal Plans", href: "/plans", zoneId: "plans", icon: "calendar", order: 2 },
    { "@type": "NavItem", "@id": "nav-recipes", label: "Recipes", href: "/recipes", zoneId: "recipes", icon: "utensils", order: 3 },
    { "@type": "NavItem", "@id": "nav-shopping", label: "Shopping", href: "/shopping", zoneId: "shopping", icon: "shopping-cart", order: 4 },
    { "@type": "NavItem", "@id": "nav-quality", label: "Quality", href: "/quality", zoneId: "quality", icon: "check-circle", order: 5 },
    { "@type": "NavItem", "@id": "nav-coach", label: "Coach Panel", href: "/coach-panel", zoneId: "coach-panel", icon: "users", order: 6 },
    { "@type": "NavItem", "@id": "nav-admin", label: "Admin", href: "/admin", zoneId: "admin", icon: "settings", order: 7 },
    { "@type": "NavItem", "@id": "nav-billing", label: "Billing", href: "/billing", zoneId: "billing", icon: "credit-card", order: 8 },
  ],
};

interface UseAppSkeletonResult {
  skeleton: ParsedSkeleton | null;
  registries: SkeletonRegistries | null;
  loading: boolean;
  error: string | null;
}

export function useAppSkeleton(
  skeletonUrl?: string
): UseAppSkeletonResult {
  const [skeleton, setSkeleton] = useState<ParsedSkeleton | null>(null);
  const [registries, setRegistries] = useState<SkeletonRegistries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let jsonld;

        if (skeletonUrl) {
          const res = await fetch(skeletonUrl, { cache: "no-store" });
          if (!res.ok) throw new Error(`Failed to fetch skeleton: ${res.status}`);
          jsonld = await res.json();
        } else {
          jsonld = DEFAULT_VHF_SKELETON;
        }

        if (cancelled) return;

        const parsed = parseAppSkeleton(jsonld);
        const regs = buildSkeletonRegistries(parsed);

        setSkeleton(parsed);
        setRegistries(regs);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load skeleton");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [skeletonUrl]);

  return { skeleton, registries, loading, error };
}
