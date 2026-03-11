import { loadStripe, type Stripe } from "@stripe/stripe-js";

/**
 * Stripe client-side singleton.
 * Uses NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from env.
 */
let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    );
  }
  return stripePromise;
}

/** Redirect to Stripe Checkout for subscription or one-time purchase */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe failed to load");
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw new Error(error.message);
}
