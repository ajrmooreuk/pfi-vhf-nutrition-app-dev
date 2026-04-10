"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSkeleton } from "@/hooks/use-app-skeleton";
import { useBrandTokens } from "@/hooks/use-brand-tokens";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { skeleton, loading: skeletonLoading } = useAppSkeleton();
  const { loading: tokensLoading } = useBrandTokens();
  const supabase = createBrowserSupabaseClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const visibleNavItems = skeleton?.navItems.filter((item) => {
    const zone = skeleton.zones.find((z) => z.id === item.zoneId);
    return zone?.visible !== false;
  }) ?? [];

  if (skeletonLoading || tokensLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-card">
        {/* Brand header */}
        <div className="border-b border-border p-6">
          <h1 className="text-xl font-bold text-primary">VHF Nutrition</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Viridian Health &amp; Fitness
          </p>
        </div>

        {/* Navigation — driven by skeleton zones */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleSignOut}
            className="w-full rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
