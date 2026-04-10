/**
 * VHF Supabase Client — browser-side ES module
 *
 * Provides the Supabase client and helper functions for:
 *   - Fetching clients, recipes, plans from the VHF database
 *   - Invoking the generate-meal-plan Edge Function
 *   - Updating plan status
 *
 * Public keys only — safe for client-side use.
 */

import { createClient } from '@supabase/supabase-js';

// ── Config (public keys) ─────────────────────────────────────────────────────

export const SUPABASE_URL = 'https://qtxoueunjaqefrgadkcc.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0eG91ZXVuamFxZWZyZ2Fka2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzI2NTMsImV4cCI6MjA5MTQwODY1M30.aNXXCe63wEM-95CAvLAloP9i4O1aXWHaOTYKDeWZbSY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Helper: Fetch all clients ────────────────────────────────────────────────

/**
 * Fetch all clients from vhf_clients, ordered by family_name.
 * @returns {Promise<Array>} Array of client rows
 */
export async function fetchClients() {
  const { data, error } = await supabase
    .from('vhf_clients')
    .select('*')
    .order('family_name', { ascending: true });

  if (error) {
    console.error('[supabase] fetchClients error:', error.message);
    throw error;
  }
  return data ?? [];
}

// ── Helper: Fetch all recipes ────────────────────────────────────────────────

/**
 * Fetch all recipes from vhf_recipes.
 * @returns {Promise<Array>} Array of recipe rows
 */
export async function fetchRecipes() {
  const { data, error } = await supabase
    .from('vhf_recipes')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[supabase] fetchRecipes error:', error.message);
    throw error;
  }
  return data ?? [];
}

// ── Helper: Fetch meal plans ─────────────────────────────────────────────────

/**
 * Fetch meal plans from vhf_meal_plans, optionally filtered by client.
 * Includes plan days and entries via joins.
 * @param {string} [clientId] - Optional client ID to filter by
 * @returns {Promise<Array>} Array of plan rows with nested days/entries
 */
export async function fetchPlans(clientId) {
  let query = supabase
    .from('vhf_meal_plans')
    .select(`
      *,
      vhf_meal_plan_days (
        *,
        vhf_meal_plan_entries (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[supabase] fetchPlans error:', error.message);
    throw error;
  }
  return data ?? [];
}

// ── Helper: Generate meal plan via Edge Function ─────────────────────────────

/**
 * Invoke the generate-meal-plan Edge Function.
 * @param {string} clientId - The client UUID
 * @param {number} [durationDays=7] - Number of days (default 7)
 * @returns {Promise<Object>} The generated meal plan
 */
export async function generateMealPlan(clientId, durationDays = 7) {
  const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
    body: {
      client_id: clientId,
      duration_days: durationDays,
    },
  });

  if (error) {
    console.error('[supabase] generateMealPlan error:', error.message);
    throw error;
  }

  // Edge Function returns the plan directly as JSON
  return data;
}

// ── Helper: Update plan status ───────────────────────────────────────────────

/**
 * Update the status of a meal plan.
 * @param {string} planId - The plan UUID
 * @param {string} status - New status (e.g. 'approved', 'rejected', 'active')
 * @param {string} [coachNote] - Optional coach note (for rejections)
 * @returns {Promise<Object>} Updated plan row
 */
export async function updatePlanStatus(planId, status, coachNote) {
  const updates = { status };
  if (coachNote !== undefined) {
    updates.coach_note = coachNote;
  }

  const { data, error } = await supabase
    .from('vhf_meal_plans')
    .update(updates)
    .eq('id', planId)
    .select()
    .single();

  if (error) {
    console.error('[supabase] updatePlanStatus error:', error.message);
    throw error;
  }
  return data;
}
