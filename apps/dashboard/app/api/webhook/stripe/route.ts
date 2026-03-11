import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe webhook handler (POST /api/webhook/stripe)
 * Handles: checkout.session.completed, invoice.paid, customer.subscription.*
 * Forwards relevant events to FastAPI backend for processing.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Forward to FastAPI backend for processing
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8000";
    await fetch(`${apiUrl}/api/v1/billing/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Stripe-Signature": signature,
      },
      body: JSON.stringify(event),
    });
  } catch (err) {
    console.error("Failed to forward webhook to API:", err);
  }

  return NextResponse.json({ received: true });
}
