import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import { Metadata } from 'next';
import db from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const metadata: Metadata = {
  title: 'Event Commerce | Purchase',
  description: 'Purchase Tickets Now',
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>;
}) {
  const params = await searchParams;
  const intentId = params.payment_intent;
  if (!intentId) return notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(intentId, {
    expand: ['latest_charge'],
  });
  if (!paymentIntent.metadata.eventId) return notFound();

  const event = await db.event.findUnique({
    where: { id: +paymentIntent.metadata.eventId },
  });
  if (!event) return notFound();

  const charge = paymentIntent.latest_charge as Stripe.Charge;
  const receiptUrl = charge.receipt_url;


  const isSuccess = paymentIntent.status === 'succeeded';

  return (
    <div className="relative flex items-center justify-center pt-24 pb-12">
      <div className="container">
        <div className="relative w-full max-h-[calc(100vh-240px)] rounded-lg overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            width={1000}
            height={1000}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />

          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/70 via-white/40 to-transparent dark:from-black/80 dark:via-black/50 dark:to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-xl md:text-2xl font-extrabold drop-shadow-lg mb-5">
              {isSuccess ? 'Congratulations!' : 'Sorry'}
            </h2>
            <h1 className="text-5xl md:text-4xl font-semibold drop-shadow-md mb-2">
              {event.title}
            </h1>
            <p className="text-lg">
              {isSuccess
                ? 'Your Invoice can be downloaded directly from your Email.'
                : 'There was an error processing your payment.'}
            </p>
            <Button
              className="mt-10 px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg shadow-md transition-transform hover:scale-105"
              asChild
            >
              {isSuccess ? (
                <a
                  href={receiptUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Your Invoice
                </a>
              ) : (
                <Link href={`/events/${event.slug}/purchase`}>Try Again</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
