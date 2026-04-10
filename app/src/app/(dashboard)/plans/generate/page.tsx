"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { MealPlan } from "@/lib/agents/types";

interface ClientOption {
  id: string;
  given_name: string;
  family_name: string;
}

type PlanStatus = "idle" | "loading" | "success" | "error";

export default function GeneratePlanPage() {
  const supabase = createBrowserSupabaseClient();

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [avoidRepetition, setAvoidRepetition] = useState(true);
  const [mealPrepFriendly, setMealPrepFriendly] = useState(false);

  const [status, setStatus] = useState<PlanStatus>("idle");
  const [progressText, setProgressText] = useState("");
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch clients on mount
  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase
        .from("vhf_clients")
        .select("id, given_name, family_name")
        .order("family_name");
      if (data) setClients(data);
    }
    fetchClients();
  }, []);

  async function handleGenerate() {
    if (!selectedClientId) return;

    setStatus("loading");
    setPlan(null);
    setPlanId(null);
    setErrorMessage("");
    setProgressText("Initialising meal planner agent...");

    const progressMessages = [
      "Analysing client profile and dietary requirements...",
      "Calculating macro targets...",
      "Searching recipe database...",
      "Building daily meal structure...",
      "Optimising nutritional balance...",
      "Generating shopping list...",
      "Finalising meal plan...",
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < progressMessages.length) {
        setProgressText(progressMessages[msgIndex]);
        msgIndex++;
      }
    }, 4000);

    try {
      const response = await fetch("/api/agents/meal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: selectedClientId,
          duration_days: durationDays,
          preferences: {
            avoidRepetition,
            mealPrepFriendly,
          },
        }),
      });

      clearInterval(interval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate meal plan");
      }

      setPlan(data.plan);
      setPlanId(data.plan_id ?? null);
      setStatus("success");
      setProgressText("");
    } catch (err) {
      clearInterval(interval);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setStatus("error");
      setProgressText("");
    }
  }

  async function handleApprove() {
    if (!planId) return;
    await supabase
      .from("vhf_meal_plans")
      .update({ status: "approved" })
      .eq("id", planId);
    setProgressText("Plan approved.");
  }

  async function handleReject() {
    if (!planId) return;
    await supabase
      .from("vhf_meal_plans")
      .update({ status: "rejected" })
      .eq("id", planId);
    setProgressText("Plan rejected.");
    setPlan(null);
    setPlanId(null);
    setStatus("idle");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Generate Meal Plan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a client and generate an AI-powered meal plan using the VHF
          recipe database.
        </p>
      </div>

      {/* Configuration */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div>
          <label
            htmlFor="client-select"
            className="block text-sm font-medium text-foreground"
          >
            Client
          </label>
          <select
            id="client-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.family_name}, {c.given_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="duration-select"
              className="block text-sm font-medium text-foreground"
            >
              Duration (days)
            </label>
            <select
              id="duration-select"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={3}>3 days</option>
              <option value={5}>5 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
            </select>
          </div>

          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={avoidRepetition}
                onChange={(e) => setAvoidRepetition(e.target.checked)}
                className="rounded border-input"
              />
              Avoid repetition
            </label>
          </div>

          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={mealPrepFriendly}
                onChange={(e) => setMealPrepFriendly(e.target.checked)}
                className="rounded border-input"
              />
              Meal prep friendly
            </label>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedClientId || status === "loading"}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">{progressText}</p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      {/* Plan output */}
      {status === "success" && plan && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Plan Summary
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">
                  {plan.duration_days} days
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Daily Calories</p>
                <p className="text-sm font-medium">
                  {plan.daily_targets.calories} kcal
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="text-sm font-medium">
                  {plan.daily_targets.protein}g
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-medium">{plan.start_date}</p>
              </div>
            </div>
            {plan.notes && (
              <p className="mt-3 text-sm text-muted-foreground">
                {plan.notes}
              </p>
            )}
          </div>

          {/* Daily breakdown */}
          {plan.days.map((day) => (
            <div
              key={day.day}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Day {day.day}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({day.date})
                  </span>
                </h3>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{day.daily_totals.calories} kcal</span>
                  <span>P: {day.daily_totals.protein}g</span>
                  <span>C: {day.daily_totals.carbs}g</span>
                  <span>F: {day.daily_totals.fats}g</span>
                </div>
              </div>

              <div className="mt-3 divide-y divide-border">
                {(
                  [
                    ["Breakfast", day.meals.breakfast],
                    ["AM Snack", day.meals.snack_am],
                    ["Lunch", day.meals.lunch],
                    ["PM Snack", day.meals.snack_pm],
                    ["Dinner", day.meals.dinner],
                  ] as const
                ).map(([label, meal]) =>
                  meal ? (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {label}
                        </span>
                        <p className="text-sm text-foreground">
                          {meal.recipe_name}
                          {meal.servings !== 1 && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({meal.servings} servings)
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {meal.nutrition.calories} kcal
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}

          {/* Shopping list */}
          {plan.shopping_list && plan.shopping_list.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Shopping List
              </h2>
              <div className="mt-3 space-y-4">
                {Object.entries(
                  plan.shopping_list.reduce(
                    (acc, item) => {
                      const cat = item.aisle_category ?? "Other";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    },
                    {} as Record<string, typeof plan.shopping_list>
                  )
                ).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-foreground">
                      {category}
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground"
                        >
                          {item.quantity} {item.unit} {item.item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approve/Reject */}
          {planId && (
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Approve Plan
              </button>
              <button
                onClick={handleReject}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Reject Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
