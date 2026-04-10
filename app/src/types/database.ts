export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      vhf_agent_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          tokens_in: number | null
          tokens_out: number | null
          tool_input: Json | null
          tool_name: string | null
          tool_result: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          tokens_in?: number | null
          tokens_out?: number | null
          tool_input?: Json | null
          tool_name?: string | null
          tool_result?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          tokens_in?: number | null
          tokens_out?: number | null
          tool_input?: Json | null
          tool_name?: string | null
          tool_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_agent_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "vhf_agent_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_agent_sessions: {
        Row: {
          agent_type: string
          client_id: string | null
          coach_id: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          started_at: string
        }
        Insert: {
          agent_type: string
          client_id?: string | null
          coach_id?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
        }
        Update: {
          agent_type?: string
          client_id?: string | null
          coach_id?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vhf_agent_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vhf_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_agent_sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "vhf_coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_clients: {
        Row: {
          activity_level:
            | Database["public"]["Enums"]["vhf_activity_level"]
            | null
          allergens: string[] | null
          birth_date: string | null
          bmi: number | null
          carbs_grams: number | null
          coach_id: string
          created_at: string
          daily_calories: number | null
          data_quality: Database["public"]["Enums"]["vhf_data_quality"] | null
          dietary_restrictions: string[] | null
          diets: string[] | null
          external_id: string | null
          family_name: string
          fats_grams: number | null
          gender: string | null
          given_name: string
          goal: Database["public"]["Enums"]["vhf_goal_type"] | null
          height_cm: number | null
          id: string
          macro_rationale: string | null
          medical_conditions: Json | null
          preferred_themes: string[] | null
          protein_grams: number | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?:
            | Database["public"]["Enums"]["vhf_activity_level"]
            | null
          allergens?: string[] | null
          birth_date?: string | null
          bmi?: number | null
          carbs_grams?: number | null
          coach_id: string
          created_at?: string
          daily_calories?: number | null
          data_quality?: Database["public"]["Enums"]["vhf_data_quality"] | null
          dietary_restrictions?: string[] | null
          diets?: string[] | null
          external_id?: string | null
          family_name: string
          fats_grams?: number | null
          gender?: string | null
          given_name: string
          goal?: Database["public"]["Enums"]["vhf_goal_type"] | null
          height_cm?: number | null
          id?: string
          macro_rationale?: string | null
          medical_conditions?: Json | null
          preferred_themes?: string[] | null
          protein_grams?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?:
            | Database["public"]["Enums"]["vhf_activity_level"]
            | null
          allergens?: string[] | null
          birth_date?: string | null
          bmi?: number | null
          carbs_grams?: number | null
          coach_id?: string
          created_at?: string
          daily_calories?: number | null
          data_quality?: Database["public"]["Enums"]["vhf_data_quality"] | null
          dietary_restrictions?: string[] | null
          diets?: string[] | null
          external_id?: string | null
          family_name?: string
          fats_grams?: number | null
          gender?: string | null
          given_name?: string
          goal?: Database["public"]["Enums"]["vhf_goal_type"] | null
          height_cm?: number | null
          id?: string
          macro_rationale?: string | null
          medical_conditions?: Json | null
          preferred_themes?: string[] | null
          protein_grams?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_clients_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "vhf_coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_coaches: {
        Row: {
          auth_user_id: string | null
          created_at: string
          family_name: string
          given_name: string
          id: string
          job_title: string | null
          organisation_address: Json | null
          organisation_name: string | null
          qualifications: string[] | null
          specialisms: string[] | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          family_name: string
          given_name: string
          id?: string
          job_title?: string | null
          organisation_address?: Json | null
          organisation_name?: string | null
          qualifications?: string[] | null
          specialisms?: string[] | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          family_name?: string
          given_name?: string
          id?: string
          job_title?: string | null
          organisation_address?: Json | null
          organisation_name?: string | null
          qualifications?: string[] | null
          specialisms?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      vhf_meal_plan_days: {
        Row: {
          day_date: string | null
          day_number: number
          id: string
          plan_id: string
          total_calories: number | null
          total_carbs_g: number | null
          total_fats_g: number | null
          total_protein_g: number | null
        }
        Insert: {
          day_date?: string | null
          day_number: number
          id?: string
          plan_id: string
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fats_g?: number | null
          total_protein_g?: number | null
        }
        Update: {
          day_date?: string | null
          day_number?: number
          id?: string
          plan_id?: string
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fats_g?: number | null
          total_protein_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_meal_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vhf_meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_meal_plan_entries: {
        Row: {
          calories_override: number | null
          day_id: string
          id: string
          meal_type: Database["public"]["Enums"]["vhf_meal_type"]
          notes: string | null
          portion_multiplier: number | null
          recipe_id: string | null
          sort_order: number | null
        }
        Insert: {
          calories_override?: number | null
          day_id: string
          id?: string
          meal_type: Database["public"]["Enums"]["vhf_meal_type"]
          notes?: string | null
          portion_multiplier?: number | null
          recipe_id?: string | null
          sort_order?: number | null
        }
        Update: {
          calories_override?: number | null
          day_id?: string
          id?: string
          meal_type?: Database["public"]["Enums"]["vhf_meal_type"]
          notes?: string | null
          portion_multiplier?: number | null
          recipe_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_meal_plan_entries_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "vhf_meal_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_meal_plan_entries_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "vhf_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_meal_plans: {
        Row: {
          activated_at: string | null
          approved_at: string | null
          approved_by: string | null
          client_id: string
          coach_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          duration_days: number
          generated_at: string | null
          id: string
          name: string
          profile_validation: Json | null
          quality_metrics: Json | null
          rejected_at: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["vhf_plan_status"]
          target_calories: number | null
          target_carbs_g: number | null
          target_fats_g: number | null
          target_protein_g: number | null
          themes: string[] | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          coach_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number
          generated_at?: string | null
          id?: string
          name: string
          profile_validation?: Json | null
          quality_metrics?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["vhf_plan_status"]
          target_calories?: number | null
          target_carbs_g?: number | null
          target_fats_g?: number | null
          target_protein_g?: number | null
          themes?: string[] | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          coach_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number
          generated_at?: string | null
          id?: string
          name?: string
          profile_validation?: Json | null
          quality_metrics?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["vhf_plan_status"]
          target_calories?: number | null
          target_carbs_g?: number | null
          target_fats_g?: number | null
          target_protein_g?: number | null
          themes?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vhf_meal_plans_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "vhf_coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_meal_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vhf_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_meal_plans_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "vhf_coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_payments: {
        Row: {
          amount_gbp: number
          base_amount_gbp: number | null
          created_at: string
          currency: string
          description: string | null
          discount_gbp: number | null
          failed_at: string | null
          id: string
          paid_at: string | null
          promo_code: string | null
          refund_reason: string | null
          refunded_at: string | null
          seat_amount_gbp: number | null
          seat_count: number | null
          status: Database["public"]["Enums"]["vhf_payment_status"]
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
        }
        Insert: {
          amount_gbp: number
          base_amount_gbp?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          discount_gbp?: number | null
          failed_at?: string | null
          id?: string
          paid_at?: string | null
          promo_code?: string | null
          refund_reason?: string | null
          refunded_at?: string | null
          seat_amount_gbp?: number | null
          seat_count?: number | null
          status?: Database["public"]["Enums"]["vhf_payment_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount_gbp?: number
          base_amount_gbp?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          discount_gbp?: number | null
          failed_at?: string | null
          id?: string
          paid_at?: string | null
          promo_code?: string | null
          refund_reason?: string | null
          refunded_at?: string | null
          seat_amount_gbp?: number | null
          seat_count?: number | null
          status?: Database["public"]["Enums"]["vhf_payment_status"]
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "vhf_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_progress_logs: {
        Row: {
          client_id: string
          created_at: string
          energy_level: number | null
          id: string
          log_date: string
          meal_adherence_pct: number | null
          metadata: Json | null
          mood: string | null
          notes: string | null
          weight_kg: number | null
        }
        Insert: {
          client_id: string
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date: string
          meal_adherence_pct?: number | null
          metadata?: Json | null
          mood?: string | null
          notes?: string | null
          weight_kg?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          meal_adherence_pct?: number | null
          metadata?: Json | null
          mood?: string | null
          notes?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_progress_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vhf_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_recipes: {
        Row: {
          calories: number | null
          carbs_g: number | null
          category: string | null
          cook_time_mins: number | null
          cost_per_serving_gbp: number | null
          created_at: string
          cuisine: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["vhf_difficulty"] | null
          excluded_allergens: string[] | null
          external_id: string | null
          fat_g: number | null
          fibre_g: number | null
          id: string
          ingredients: string[] | null
          instructions: string | null
          is_generated: boolean | null
          name: string
          prep_time_mins: number | null
          protein_g: number | null
          seasonal: boolean | null
          servings: number | null
          sodium_mg: number | null
          source_ref: string | null
          suitable_diets: string[] | null
          themes: string[] | null
          total_time_mins: number | null
          uk_available: boolean | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          category?: string | null
          cook_time_mins?: number | null
          cost_per_serving_gbp?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["vhf_difficulty"] | null
          excluded_allergens?: string[] | null
          external_id?: string | null
          fat_g?: number | null
          fibre_g?: number | null
          id?: string
          ingredients?: string[] | null
          instructions?: string | null
          is_generated?: boolean | null
          name: string
          prep_time_mins?: number | null
          protein_g?: number | null
          seasonal?: boolean | null
          servings?: number | null
          sodium_mg?: number | null
          source_ref?: string | null
          suitable_diets?: string[] | null
          themes?: string[] | null
          total_time_mins?: number | null
          uk_available?: boolean | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          category?: string | null
          cook_time_mins?: number | null
          cost_per_serving_gbp?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["vhf_difficulty"] | null
          excluded_allergens?: string[] | null
          external_id?: string | null
          fat_g?: number | null
          fibre_g?: number | null
          id?: string
          ingredients?: string[] | null
          instructions?: string | null
          is_generated?: boolean | null
          name?: string
          prep_time_mins?: number | null
          protein_g?: number | null
          seasonal?: boolean | null
          servings?: number | null
          sodium_mg?: number | null
          source_ref?: string | null
          suitable_diets?: string[] | null
          themes?: string[] | null
          total_time_mins?: number | null
          uk_available?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      vhf_shopping_items: {
        Row: {
          aisle: string | null
          id: string
          ingredient: string
          is_bought: boolean | null
          list_id: string
          quantity: string | null
          sort_order: number | null
        }
        Insert: {
          aisle?: string | null
          id?: string
          ingredient: string
          is_bought?: boolean | null
          list_id: string
          quantity?: string | null
          sort_order?: number | null
        }
        Update: {
          aisle?: string | null
          id?: string
          ingredient?: string
          is_bought?: boolean | null
          list_id?: string
          quantity?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vhf_shopping_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "vhf_shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_shopping_lists: {
        Row: {
          generated_at: string
          id: string
          plan_id: string
          week_number: number
        }
        Insert: {
          generated_at?: string
          id?: string
          plan_id: string
          week_number?: number
        }
        Update: {
          generated_at?: string
          id?: string
          plan_id?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "vhf_shopping_lists_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vhf_meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_stripe_customers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string | null
          stripe_customer_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          stripe_customer_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          stripe_customer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      vhf_stripe_events: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      vhf_subscription_seats: {
        Row: {
          activated_at: string
          client_id: string
          deactivated_at: string | null
          id: string
          is_active: boolean
          seat_price_gbp: number
          subscription_id: string
        }
        Insert: {
          activated_at?: string
          client_id: string
          deactivated_at?: string | null
          id?: string
          is_active?: boolean
          seat_price_gbp?: number
          subscription_id: string
        }
        Update: {
          activated_at?: string
          client_id?: string
          deactivated_at?: string | null
          id?: string
          is_active?: boolean
          seat_price_gbp?: number
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vhf_subscription_seats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vhf_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_subscription_seats_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "vhf_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      vhf_subscriptions: {
        Row: {
          cancel_at: string | null
          canceled_at: string | null
          coach_id: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          price_gbp: number
          status: Database["public"]["Enums"]["vhf_subscription_status"]
          stripe_customer_id: string
          stripe_price_id: string | null
          stripe_subscription_id: string
          tier: Database["public"]["Enums"]["vhf_subscription_tier"]
          trial_end: string | null
          trial_start: string | null
          updated_at: string
        }
        Insert: {
          cancel_at?: string | null
          canceled_at?: string | null
          coach_id?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          price_gbp: number
          status?: Database["public"]["Enums"]["vhf_subscription_status"]
          stripe_customer_id: string
          stripe_price_id?: string | null
          stripe_subscription_id: string
          tier: Database["public"]["Enums"]["vhf_subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at?: string | null
          canceled_at?: string | null
          coach_id?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          price_gbp?: number
          status?: Database["public"]["Enums"]["vhf_subscription_status"]
          stripe_customer_id?: string
          stripe_price_id?: string | null
          stripe_subscription_id?: string
          tier?: Database["public"]["Enums"]["vhf_subscription_tier"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vhf_subscriptions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "vhf_coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vhf_subscriptions_stripe_customer_id_fkey"
            columns: ["stripe_customer_id"]
            isOneToOne: false
            referencedRelation: "vhf_stripe_customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      vhf_activity_level:
        | "sedentary"
        | "lightly_active"
        | "moderately_active"
        | "very_active"
        | "extremely_active"
      vhf_data_quality: "good" | "fair" | "poor"
      vhf_difficulty: "easy" | "medium" | "hard"
      vhf_goal_type:
        | "weight_loss"
        | "muscle_gain"
        | "maintenance"
        | "sports_performance"
        | "medical_management"
      vhf_meal_type:
        | "breakfast"
        | "morning_snack"
        | "lunch"
        | "afternoon_snack"
        | "dinner"
        | "evening_snack"
      vhf_payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "refunded"
        | "disputed"
      vhf_plan_status:
        | "draft"
        | "pending"
        | "approved"
        | "active"
        | "completed"
        | "rejected"
        | "archived"
      vhf_subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
        | "incomplete"
      vhf_subscription_tier:
        | "included_pt"
        | "nutrition_only"
        | "enterprise_coach"
        | "enterprise_client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      vhf_activity_level: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extremely_active",
      ],
      vhf_data_quality: ["good", "fair", "poor"],
      vhf_difficulty: ["easy", "medium", "hard"],
      vhf_goal_type: [
        "weight_loss",
        "muscle_gain",
        "maintenance",
        "sports_performance",
        "medical_management",
      ],
      vhf_meal_type: [
        "breakfast",
        "morning_snack",
        "lunch",
        "afternoon_snack",
        "dinner",
        "evening_snack",
      ],
      vhf_payment_status: [
        "pending",
        "succeeded",
        "failed",
        "refunded",
        "disputed",
      ],
      vhf_plan_status: [
        "draft",
        "pending",
        "approved",
        "active",
        "completed",
        "rejected",
        "archived",
      ],
      vhf_subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
        "incomplete",
      ],
      vhf_subscription_tier: [
        "included_pt",
        "nutrition_only",
        "enterprise_coach",
        "enterprise_client",
      ],
    },
  },
} as const

// Convenience type aliases
export type Coach = Database["public"]["Tables"]["vhf_coaches"]["Row"];
export type Client = Database["public"]["Tables"]["vhf_clients"]["Row"];
export type Recipe = Database["public"]["Tables"]["vhf_recipes"]["Row"];
export type MealPlan = Database["public"]["Tables"]["vhf_meal_plans"]["Row"];
export type Subscription = Database["public"]["Tables"]["vhf_subscriptions"]["Row"];
export type Payment = Database["public"]["Tables"]["vhf_payments"]["Row"];
