import Stripe from 'stripe';
import { stripe } from '@/lib/actions/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import PurchaseReceiptEmail from '@/components/PurchaseReceipt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.error('❌ Invalid signature:', error);
      return new NextResponse('invalid signature', { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const amount = pi.amount;
      const eventId = pi.metadata.eventId;
      const customerId = pi.customer as string;
      const email = pi.metadata.userEmail;
      const authorEmail = process.env.AUTHOR_EMAIL;

      if (!pi || !customerId || !email || !amount || !eventId) {
        return new NextResponse('Bad Request', { status: 400 });
      }

      const events = await db.event.findUnique({ where: { id: +eventId } });
      if (!events) return new NextResponse('Event not found', { status: 400 });

      let author = await db.author.findUnique({ where: { email } });
      if (!author) {
        author = await db.author.create({
          data: {
            name: 'Anonymous',
            email,
            password: crypto.randomUUID().toString(),
          },
        });
      }

      const order = await db.order.create({
        data: {
          pricePaid: amount,
          event: { connect: { id: +eventId } },
          author: { connect: { email: author.email } },
        },
      });

      await db.verification.create({
        data: {
          eventId: +eventId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      await stripe.prices.create({
        unit_amount: events.priceRupiah * 100 || amount,
        currency: 'idr',
        product_data: {
          name: events.title,
          metadata: {
            eventId: eventId,
            eventSlug: pi.metadata.eventSlug,
          },
        },
      });

      await stripe.invoiceItems.create({
        customer: customerId,
        amount: events.priceRupiah * 100 || amount,
        currency: 'idr',
        description: events.title,
        metadata: {
          eventId: eventId,
          eventSlug: pi.metadata.eventSlug,
        },
      });

      const invoice = await stripe.invoices.create({
        customer: customerId || (pi.customer as string),
        collection_method: 'send_invoice',
        description: events.title,
        days_until_due: 30,
        metadata: {
          eventId: eventId,
          eventSlug: pi.metadata.eventSlug,
          eventTitle: pi.metadata.eventTitle,
          userEmail: email,
          purchaseSource: pi.metadata.purchaseSource,
        },
      });

      const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
      const pdfUrl = finalized.invoice_pdf;

      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: authorEmail || email || author.email,
        subject: 'Invoice Event Commerce by adit_war',
        react: (
          <PurchaseReceiptEmail
            order={order}
            event={events}
            pdfUrl={pdfUrl as string}
          />
        ),
      });

      return new NextResponse('ok', { status: 200 });
    }
    return new NextResponse('Event type not handled', { status: 200 });
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
