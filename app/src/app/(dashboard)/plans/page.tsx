import { createServerSupabaseClient } from "@/lib/supabase/server";

const STATUS_ORDER = ["active", "approved", "pending", "draft", "completed", "rejected", "archived"] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-secondary/10 text-secondary",
  approved: "bg-primary/10 text-primary",
  active: "bg-primary text-primary-foreground",
  completed: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
  archived: "bg-muted text-muted-foreground",
};

export default async function PlansPage() {
  const supabase = await createServerSupabaseClient();

  const { data: plans, error } = await supabase
    .from("vhf_meal_plans")
    .select("*, vhf_clients(given_name, family_name)")
    .order("updated_at", { ascending: false });

  // Group by status
  const grouped = new Map<string, Record<string, unknown>[]>();
  for (const status of STATUS_ORDER) {
    grouped.set(status, []);
  }
  if (plans) {
    for (const plan of plans) {
      const bucket = grouped.get(plan.status) ?? [];
      bucket.push(plan);
      grouped.set(plan.status, bucket);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Meal Plans</h2>
          <p className="mt-1 text-muted-foreground">
            Create and manage meal plans for your clients.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load plans: {error.message}
          </p>
        </div>
      )}

      <div className="mt-6 space-y-8">
        {STATUS_ORDER.map((status) => {
          const statusPlans = grouped.get(status) ?? [];
          if (statusPlans.length === 0) return null;

          return (
            <section key={status}>
              <h3 className="mb-3 text-lg font-bold capitalize text-foreground">
                {status}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({statusPlans.length})
                </span>
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statusPlans.map((plan) => (
                  <PlanCard key={plan.id as string} plan={plan} />
                ))}
              </div>
            </section>
          );
        })}

        {plans && plans.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No meal plans yet. Create your first plan to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Record<string, unknown> }) {
  const client = plan.vhf_clients as { given_name?: string; family_name?: string } | null;
  const clientName = client
    ? `${client.given_name ?? ""} ${client.family_name ?? ""}`.trim()
    : "Unknown client";
  const status = plan.status as string;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-card-foreground">{plan.name as string}</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">{clientName}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            STATUS_STYLES[status] ?? STATUS_STYLES.draft
          }`}
        >
          {status}
        </span>
      </div>

      {typeof plan.description === "string" && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {plan.description}
        </p>
      )}

      <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
        <span>{plan.duration_days as number} days</span>
        {typeof plan.target_calories === "number" && <span>{plan.target_calories} kcal/day</span>}
      </div>
    </div>
  );
}
