import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { eventId, email } = await req.json();
    if (!eventId || !email) {
      return NextResponse.json(
        { error: 'Missing eventId or email' },
        { status: 400 },
      );
    }

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let customer;

    try {
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({ email });
      }
    } catch (err) {
      console.error('Error listing customers, fallback create:', err);
      customer = await stripe.customers.create({ email: process.env.AUTHOR_EMAIL });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.priceRupiah * 100,
      currency: 'idr',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: {
        eventId: event.id.toString(),
        eventTitle: event.title,
        userEmail: email,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('API /api/payment error:', err);
    return NextResponse.json(
      { error: 'Failed to create PaymentIntent' },
      { status: 500 },
    );
  }
}
