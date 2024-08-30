import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_API_KEY) {
  console.error("STRIPE_SECRET_API_KEY is not set");
  throw new Error("STRIPE_SECRET_API_KEY is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
  apiVersion: "2023-10-16",
});
