import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
});

const newstripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 5000)
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    const paymentIntent = await newstripe.paymentIntents.create({
      amount, // dalam sen (cent)
      currency: 'idr',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
