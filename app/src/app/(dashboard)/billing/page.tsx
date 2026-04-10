"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const TIER_LABELS: Record<string, string> = {
  tier_1: "Tier 1 -- Free",
  tier_2: "Tier 2 -- Professional",
  tier_3: "Tier 3 -- Enterprise",
};

const TIER_PRICES: Record<string, string> = {
  tier_2: "29",
  tier_3: "99",
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch subscription via coach
      const { data: coach } = await supabase
        .from("vhf_coaches")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (coach) {
        const coachId = (coach as Record<string, unknown>).id as string;
        const { data: sub } = await supabase
          .from("vhf_subscriptions")
          .select("*")
          .eq("coach_id", coachId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (sub) {
          const subRecord = sub as Record<string, unknown>;
          setSubscription(subRecord);

          const { data: pmts } = await supabase
            .from("vhf_payments")
            .select("*")
            .eq("subscription_id", subRecord.id as string)
            .order("created_at", { ascending: false })
            .limit(10);

          setPayments((pmts ?? []) as Record<string, unknown>[]);
        }
      }

      setLoading(false);
    }

    load();
  }, [supabase]);

  async function handleCheckout(tier: "tier_2" | "tier_3") {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      // Checkout failed silently
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading billing...</p>
      </div>
    );
  }

  const currentTier = (subscription?.tier as string) ?? "tier_1";

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Billing</h2>
      <p className="mt-1 text-muted-foreground">
        Manage your subscription and view payment history.
      </p>

      {/* Current plan */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h3 className="font-bold text-card-foreground">Current Plan</h3>
        <p className="mt-1 text-lg font-bold text-primary">
          {TIER_LABELS[currentTier] ?? currentTier}
        </p>
        {subscription && (
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {subscription.status as string} | Renews:{" "}
            {subscription.current_period_end as string}
          </p>
        )}
      </div>

      {/* Upgrade options */}
      {currentTier !== "tier_3" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {currentTier === "tier_1" && (
            <PlanCard
              title="Professional"
              price="29"
              features={[
                "Up to 25 clients",
                "AI meal plan generation",
                "Recipe library",
                "Client portal",
              ]}
              onSelect={() => handleCheckout("tier_2")}
              loading={checkoutLoading}
            />
          )}
          <PlanCard
            title="Enterprise"
            price="99"
            features={[
              "Unlimited clients",
              "Multi-seat team access",
              "Advanced analytics",
              "Priority support",
              "White-label branding",
            ]}
            onSelect={() => handleCheckout("tier_3")}
            loading={checkoutLoading}
          />
        </div>
      )}

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-bold text-foreground">Payment History</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id as string} className="border-t border-border">
                    <td className="px-4 py-2 text-foreground">
                      {(payment.paid_at ?? payment.created_at) as string}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      &pound;{Number(payment.amount_gbp).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          payment.status === "succeeded"
                            ? "bg-primary/10 text-primary"
                            : payment.status === "failed"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {payment.status as string}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanCard({
  title,
  price,
  features,
  onSelect,
  loading,
}: {
  title: string;
  price: string;
  features: string[];
  onSelect: () => void;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h4 className="text-lg font-bold text-card-foreground">{title}</h4>
      <p className="mt-1">
        <span className="text-3xl font-bold text-primary">&pound;{price}</span>
        <span className="text-sm text-muted-foreground">/month</span>
      </p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-0.5 text-primary">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Upgrade"}
      </button>
    </div>
  );
}
