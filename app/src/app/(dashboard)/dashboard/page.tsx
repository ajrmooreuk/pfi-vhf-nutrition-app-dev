import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: clients, error } = await supabase
    .from("vhf_clients")
    .select("*")
    .order("family_name");

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
      <p className="mt-1 text-muted-foreground">
        Overview of your clients and their nutrition plans.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load clients: {error.message}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients && clients.length > 0 ? (
          clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No clients yet. Add your first client to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: Record<string, unknown> }) {
  const name = `${client.given_name ?? ""} ${client.family_name ?? ""}`.trim();
  const goal = client.goal as string | null;
  const quality = client.data_quality as string | null;
  const calories = client.daily_calories as number | null;
  const protein = client.protein_grams as number | null;
  const carbs = client.carbs_grams as number | null;
  const fats = client.fats_grams as number | null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-card-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {goal ? goal.replace(/_/g, " ") : "No goal set"}
          </p>
        </div>
        {quality && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              quality === "good"
                ? "bg-primary/10 text-primary"
                : quality === "poor"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {quality}
          </span>
        )}
      </div>

      {(calories || protein) && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          <MacroBadge label="kcal" value={calories} />
          <MacroBadge label="P" value={protein} unit="g" />
          <MacroBadge label="C" value={carbs} unit="g" />
          <MacroBadge label="F" value={fats} unit="g" />
        </div>
      )}
    </div>
  );
}

function MacroBadge({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: number | null;
  unit?: string;
}) {
  return (
    <div className="rounded bg-muted px-1 py-1">
      <p className="font-bold text-foreground">
        {value != null ? `${value}${unit}` : "--"}
      </p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
