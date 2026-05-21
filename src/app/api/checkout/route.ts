import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`,
  });

  return NextResponse.json({ url: session.url });
}
