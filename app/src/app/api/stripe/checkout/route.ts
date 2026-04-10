import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

const TIER_PRICES: Record<string, { amount: number; name: string }> = {
  tier_2: { amount: 2900, name: "VHF Professional" },
  tier_3: { amount: 9900, name: "VHF Enterprise" },
};

export async function POST(request: NextRequest) {
  try {
    const { tier } = await request.json();

    if (!tier || !TIER_PRICES[tier]) {
      return NextResponse.json(
        { error: "Invalid tier. Must be tier_2 or tier_3." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const priceInfo = TIER_PRICES[tier];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: priceInfo.name },
            unit_amount: priceInfo.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        tier,
      },
      success_url: `${appUrl}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
