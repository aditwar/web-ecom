'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { CheckoutFormProps } from '@/app/type';
import { CheckoutPaymentForm } from './CheckoutPaymentForm';
import { useAppSelector } from '@/redux/hooks';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

export function CheckoutForm({ event }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const buyerEmail = useAppSelector((state) => state.author.email);

  useEffect(() => {
    if (!buyerEmail) return;

    fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id, email: buyerEmail }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Unknown error');
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        console.error('CheckoutForm fetch error:', err);
      });
  }, [event.id, buyerEmail]);

  if (!clientSecret) {
    return <p>Loading payment form...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 h-[calc(100vh-300px)]">
        <img
          src={event.image}
          alt={event.title}
          className="flex w-full h-full object-cover rounded-xl shadow-lg"
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPaymentForm
            priceRupiah={event.priceRupiah}
            eventId={event.id}
            slug={event.slug}
            title={event.title}
          />
        </Elements>
      </div>
    </div>
  );
}
