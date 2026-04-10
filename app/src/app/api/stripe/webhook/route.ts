import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

// Use service role for webhook — no user session available
function createWebhookSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createWebhookSupabaseClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier as "tier_2" | "tier_3";

        if (!userId || !tier) break;

        // Find coach by user_id
        const { data: coach } = await supabase
          .from("vhf_coaches")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (!coach) break;

        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await supabase.from("vhf_subscriptions").upsert({
          coach_id: coach.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          tier,
          status: "active",
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        });

        // Update coach tier
        await supabase
          .from("vhf_coaches")
          .update({ tier })
          .eq("id", coach.id);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from("vhf_subscriptions")
          .update({
            status: subscription.status as
              | "active"
              | "past_due"
              | "cancelled"
              | "trialing"
              | "incomplete",
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from("vhf_subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        // Downgrade coach to tier_1
        const { data: sub } = await supabase
          .from("vhf_subscriptions")
          .select("coach_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (sub) {
          await supabase
            .from("vhf_coaches")
            .update({ tier: "tier_1" })
            .eq("id", sub.coach_id);
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        const { data: sub } = await supabase
          .from("vhf_subscriptions")
          .select("id")
          .eq(
            "stripe_subscription_id",
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription.id
          )
          .single();

        if (sub) {
          await supabase.from("vhf_payments").insert({
            subscription_id: sub.id,
            stripe_invoice_id: invoice.id!,
            amount_pence: invoice.amount_paid,
            currency: invoice.currency,
            status: "succeeded",
            paid_at: new Date().toISOString(),
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        const { data: sub } = await supabase
          .from("vhf_subscriptions")
          .select("id")
          .eq(
            "stripe_subscription_id",
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription.id
          )
          .single();

        if (sub) {
          await supabase.from("vhf_payments").insert({
            subscription_id: sub.id,
            stripe_invoice_id: invoice.id!,
            amount_pence: invoice.amount_due,
            currency: invoice.currency,
            status: "failed",
          });

          // Mark subscription as past_due
          await supabase
            .from("vhf_subscriptions")
            .update({ status: "past_due" })
            .eq("id", sub.id);
        }

        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
