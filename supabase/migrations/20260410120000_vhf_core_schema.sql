-- VHF Nutrition App — Core Schema (F8.1 + F8.2 + F8.3)
-- Migration: 20260410120000_vhf_core_schema.sql
-- Covers: clients, recipes, meal_plans, coach profiles, agent interactions
-- Naming: YYYYMMDDHHMMSS per PFC convention

-- ============================================================
-- ENUMS
-- ============================================================

create type vhf_activity_level as enum (
  'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
);

create type vhf_plan_status as enum (
  'draft', 'pending', 'approved', 'active', 'completed', 'rejected', 'archived'
);

create type vhf_goal_type as enum (
  'weight_loss', 'muscle_gain', 'maintenance', 'sports_performance', 'medical_management'
);

create type vhf_data_quality as enum (
  'good', 'fair', 'poor'
);

create type vhf_meal_type as enum (
  'breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack'
);

create type vhf_difficulty as enum (
  'easy', 'medium', 'hard'
);

-- ============================================================
-- COACHES
-- ============================================================

create table vhf_coaches (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id),
  given_name text not null,
  family_name text not null,
  job_title text,
  qualifications text[] default '{}',
  specialisms text[] default '{}',
  organisation_name text,
  organisation_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- CLIENTS
-- ============================================================

create table vhf_clients (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references vhf_coaches(id),
  external_id text unique,  -- e.g. 'tp-001' from test data
  given_name text not null,
  family_name text not null,
  gender text,
  birth_date date,
  data_quality vhf_data_quality default 'good',

  -- Health profile (denormalised for query speed)
  height_cm numeric,
  weight_kg numeric,
  bmi numeric generated always as (
    case when height_cm > 0 then round(weight_kg / ((height_cm / 100.0) ^ 2), 1) else null end
  ) stored,
  activity_level vhf_activity_level,
  medical_conditions jsonb default '[]',  -- array of {name, icd10, status}

  -- Goal & macros
  goal vhf_goal_type,
  daily_calories integer,
  protein_grams integer,
  carbs_grams integer,
  fats_grams integer,
  macro_rationale text,

  -- Diet & restrictions
  diets text[] default '{}',              -- e.g. {'halal', 'low-carb'}
  dietary_restrictions text[] default '{}',
  allergens text[] default '{}',          -- UK 14 allergens
  preferred_themes text[] default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clients_coach on vhf_clients(coach_id);

-- ============================================================
-- RECIPES
-- ============================================================

create table vhf_recipes (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,  -- e.g. 'r-001'
  name text not null,
  description text,
  cuisine text,
  category text,             -- Breakfast, Lunch, Dinner, Snack
  difficulty vhf_difficulty default 'easy',

  -- Timing (ISO 8601 durations stored as minutes for queryability)
  prep_time_mins integer,
  cook_time_mins integer,
  total_time_mins integer,
  servings integer default 2,

  -- Cost & availability
  cost_per_serving_gbp numeric,
  uk_available boolean default true,
  seasonal boolean default false,

  -- Nutrition per serving
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fibre_g numeric,
  sodium_mg numeric,

  -- Ingredients (array of text for display, jsonb for structured)
  ingredients text[] default '{}',
  instructions text,

  -- Diet suitability & allergen exclusions
  suitable_diets text[] default '{}',     -- e.g. {'halal', 'gluten-free', 'high-protein'}
  excluded_allergens text[] default '{}', -- allergens this recipe is FREE of
  themes text[] default '{}',             -- e.g. {'HighProtein', 'Mediterranean'}

  -- Source tracking
  is_generated boolean default false,     -- AI-generated vs curated
  source_ref text,                        -- original recipe source

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_recipes_category on vhf_recipes(category);
create index idx_recipes_diets on vhf_recipes using gin(suitable_diets);
create index idx_recipes_allergens on vhf_recipes using gin(excluded_allergens);

-- ============================================================
-- MEAL PLANS
-- ============================================================

create table vhf_meal_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references vhf_clients(id),
  coach_id uuid not null references vhf_coaches(id),

  name text not null,
  description text,
  status vhf_plan_status not null default 'draft',
  duration_days integer not null default 7,

  -- Snapshot of targets at plan creation (immutable record)
  target_calories integer,
  target_protein_g integer,
  target_carbs_g integer,
  target_fats_g integer,

  -- Themes used in generation
  themes text[] default '{}',

  -- Validation & quality
  profile_validation jsonb,   -- snapshot of client validation at generation time
  quality_metrics jsonb,      -- constraint compliance, variety score, etc.

  -- Lifecycle
  generated_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references vhf_coaches(id),
  rejected_at timestamptz,
  rejection_reason text,
  activated_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_meal_plans_client on vhf_meal_plans(client_id);
create index idx_meal_plans_coach on vhf_meal_plans(coach_id);
create index idx_meal_plans_status on vhf_meal_plans(status);

-- ============================================================
-- MEAL PLAN DAYS & ENTRIES
-- ============================================================

create table vhf_meal_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references vhf_meal_plans(id) on delete cascade,
  day_number integer not null,  -- 1-based
  day_date date,                -- optional absolute date

  -- Daily totals (computed from entries)
  total_calories integer,
  total_protein_g numeric,
  total_carbs_g numeric,
  total_fats_g numeric,

  constraint uq_plan_day unique (plan_id, day_number)
);

create table vhf_meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references vhf_meal_plan_days(id) on delete cascade,
  meal_type vhf_meal_type not null,
  recipe_id uuid references vhf_recipes(id),

  -- Override values (if recipe is modified for this entry)
  portion_multiplier numeric default 1.0,
  calories_override integer,
  notes text,

  sort_order integer default 0
);

create index idx_entries_day on vhf_meal_plan_entries(day_id);

-- ============================================================
-- SHOPPING LISTS (derived from meal plans)
-- ============================================================

create table vhf_shopping_lists (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references vhf_meal_plans(id) on delete cascade,
  week_number integer not null default 1,
  generated_at timestamptz not null default now()
);

create table vhf_shopping_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references vhf_shopping_lists(id) on delete cascade,
  ingredient text not null,
  quantity text,
  aisle text,               -- e.g. 'Protein', 'Dairy', 'Produce'
  is_bought boolean default false,
  sort_order integer default 0
);

-- ============================================================
-- AGENT INTERACTIONS (for CAST + advisor conversation history)
-- ============================================================

create table vhf_agent_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references vhf_clients(id),
  coach_id uuid references vhf_coaches(id),
  agent_type text not null,  -- 'nutrition_advisor', 'meal_planner', 'progress_analyst', 'pmf_feedback'
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  metadata jsonb default '{}'
);

create table vhf_agent_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references vhf_agent_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool_use', 'tool_result')),
  content text not null,
  tool_name text,
  tool_input jsonb,
  tool_result jsonb,
  tokens_in integer,
  tokens_out integer,
  created_at timestamptz not null default now()
);

create index idx_messages_session on vhf_agent_messages(session_id);

-- ============================================================
-- PROGRESS TRACKING
-- ============================================================

create table vhf_progress_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references vhf_clients(id),
  log_date date not null,
  weight_kg numeric,
  notes text,
  meal_adherence_pct numeric,  -- 0-100, how closely they followed the plan
  mood text,
  energy_level integer check (energy_level between 1 and 5),
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),

  constraint uq_progress_date unique (client_id, log_date)
);

-- ============================================================
-- SUBSCRIPTIONS & PAYMENTS (Stripe)
-- ============================================================

create type vhf_subscription_tier as enum (
  'included_pt',       -- Tier 1: free with active PT package
  'nutrition_only',    -- Tier 2: £29/mo standalone
  'enterprise_coach',  -- Tier 3: £99/mo per coach
  'enterprise_client'  -- Tier 3: £4.99/mo per client (under enterprise coach)
);

create type vhf_subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused', 'incomplete'
);

create type vhf_payment_status as enum (
  'pending', 'succeeded', 'failed', 'refunded', 'disputed'
);

-- Stripe customer record (1:1 with coach for Tier 2/3, or client for Tier 2 standalone)
create table vhf_stripe_customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id),
  stripe_customer_id text unique not null,
  email text,
  name text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subscription lifecycle
create table vhf_subscriptions (
  id uuid primary key default gen_random_uuid(),
  stripe_customer_id uuid not null references vhf_stripe_customers(id),
  stripe_subscription_id text unique not null,
  tier vhf_subscription_tier not null,
  status vhf_subscription_status not null default 'incomplete',

  -- Pricing snapshot
  price_gbp numeric not null,              -- monthly price at subscription time
  currency text not null default 'gbp',
  stripe_price_id text,

  -- Enterprise: coach who owns the subscription
  coach_id uuid references vhf_coaches(id),

  -- Lifecycle dates
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_customer on vhf_subscriptions(stripe_customer_id);
create index idx_subscriptions_coach on vhf_subscriptions(coach_id);
create index idx_subscriptions_status on vhf_subscriptions(status);

-- Enterprise Tier 3: per-client seats under a coach subscription
create table vhf_subscription_seats (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references vhf_subscriptions(id) on delete cascade,
  client_id uuid not null references vhf_clients(id),
  seat_price_gbp numeric not null default 4.99,
  is_active boolean not null default true,
  activated_at timestamptz not null default now(),
  deactivated_at timestamptz,

  constraint uq_sub_client unique (subscription_id, client_id)
);

-- Payment history (mirrors Stripe invoices)
create table vhf_payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references vhf_subscriptions(id),
  stripe_invoice_id text unique,
  stripe_payment_intent_id text,
  status vhf_payment_status not null default 'pending',

  amount_gbp numeric not null,
  currency text not null default 'gbp',
  description text,

  -- Breakdown
  base_amount_gbp numeric,       -- tier base price
  seat_count integer,             -- enterprise client count
  seat_amount_gbp numeric,        -- seat_count * per-client price
  promo_code text,
  discount_gbp numeric default 0,

  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  refund_reason text,

  created_at timestamptz not null default now()
);

create index idx_payments_subscription on vhf_payments(subscription_id);
create index idx_payments_status on vhf_payments(status);

-- Stripe webhook event log (idempotency + audit)
create table vhf_stripe_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type text not null,      -- e.g. 'customer.subscription.updated'
  payload jsonb not null,
  processed boolean default false,
  processed_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index idx_stripe_events_type on vhf_stripe_events(event_type);
create index idx_stripe_events_processed on vhf_stripe_events(processed) where not processed;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table vhf_coaches enable row level security;
alter table vhf_clients enable row level security;
alter table vhf_recipes enable row level security;
alter table vhf_meal_plans enable row level security;
alter table vhf_meal_plan_days enable row level security;
alter table vhf_meal_plan_entries enable row level security;
alter table vhf_shopping_lists enable row level security;
alter table vhf_shopping_items enable row level security;
alter table vhf_agent_sessions enable row level security;
alter table vhf_agent_messages enable row level security;
alter table vhf_progress_logs enable row level security;

-- Coach sees own record
create policy "coach_own" on vhf_coaches
  for all using (auth_user_id = auth.uid());

-- Coach sees own clients
create policy "coach_clients" on vhf_clients
  for all using (
    coach_id in (select id from vhf_coaches where auth_user_id = auth.uid())
  );

-- Recipes are readable by all authenticated users
create policy "recipes_read" on vhf_recipes
  for select using (auth.role() = 'authenticated');

-- Recipes writable by coaches only
create policy "recipes_write" on vhf_recipes
  for insert with check (auth.role() = 'authenticated');

create policy "recipes_update" on vhf_recipes
  for update using (auth.role() = 'authenticated');

-- Coach sees own meal plans
create policy "coach_plans" on vhf_meal_plans
  for all using (
    coach_id in (select id from vhf_coaches where auth_user_id = auth.uid())
  );

-- Plan days/entries follow plan access
create policy "plan_days" on vhf_meal_plan_days
  for all using (
    plan_id in (select id from vhf_meal_plans where coach_id in (
      select id from vhf_coaches where auth_user_id = auth.uid()
    ))
  );

create policy "plan_entries" on vhf_meal_plan_entries
  for all using (
    day_id in (select id from vhf_meal_plan_days where plan_id in (
      select id from vhf_meal_plans where coach_id in (
        select id from vhf_coaches where auth_user_id = auth.uid()
      )
    ))
  );

-- Shopping lists follow plan access
create policy "shopping_lists" on vhf_shopping_lists
  for all using (
    plan_id in (select id from vhf_meal_plans where coach_id in (
      select id from vhf_coaches where auth_user_id = auth.uid()
    ))
  );

create policy "shopping_items" on vhf_shopping_items
  for all using (
    list_id in (select id from vhf_shopping_lists where plan_id in (
      select id from vhf_meal_plans where coach_id in (
        select id from vhf_coaches where auth_user_id = auth.uid()
      )
    ))
  );

-- Agent sessions: coach sees own
create policy "agent_sessions" on vhf_agent_sessions
  for all using (
    coach_id in (select id from vhf_coaches where auth_user_id = auth.uid())
  );

create policy "agent_messages" on vhf_agent_messages
  for all using (
    session_id in (select id from vhf_agent_sessions where coach_id in (
      select id from vhf_coaches where auth_user_id = auth.uid()
    ))
  );

-- Progress logs: coach sees own clients
create policy "progress_logs" on vhf_progress_logs
  for all using (
    client_id in (select id from vhf_clients where coach_id in (
      select id from vhf_coaches where auth_user_id = auth.uid()
    ))
  );

-- Stripe: user sees own customer record
alter table vhf_stripe_customers enable row level security;
create policy "stripe_customer_own" on vhf_stripe_customers
  for all using (auth_user_id = auth.uid());

-- Subscriptions: user sees own
alter table vhf_subscriptions enable row level security;
create policy "subscriptions_own" on vhf_subscriptions
  for all using (
    stripe_customer_id in (select id from vhf_stripe_customers where auth_user_id = auth.uid())
  );

-- Seats: coach sees own subscription seats
alter table vhf_subscription_seats enable row level security;
create policy "seats_own" on vhf_subscription_seats
  for all using (
    subscription_id in (select id from vhf_subscriptions where
      stripe_customer_id in (select id from vhf_stripe_customers where auth_user_id = auth.uid())
    )
  );

-- Payments: user sees own
alter table vhf_payments enable row level security;
create policy "payments_own" on vhf_payments
  for all using (
    subscription_id in (select id from vhf_subscriptions where
      stripe_customer_id in (select id from vhf_stripe_customers where auth_user_id = auth.uid())
    )
  );

-- Stripe events: service role only (no user access — processed by Edge Functions)
alter table vhf_stripe_events enable row level security;

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

create or replace function vhf_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_coaches_updated before update on vhf_coaches
  for each row execute function vhf_set_updated_at();

create trigger trg_clients_updated before update on vhf_clients
  for each row execute function vhf_set_updated_at();

create trigger trg_recipes_updated before update on vhf_recipes
  for each row execute function vhf_set_updated_at();

create trigger trg_plans_updated before update on vhf_meal_plans
  for each row execute function vhf_set_updated_at();

create trigger trg_stripe_customers_updated before update on vhf_stripe_customers
  for each row execute function vhf_set_updated_at();

create trigger trg_subscriptions_updated before update on vhf_subscriptions
  for each row execute function vhf_set_updated_at();
