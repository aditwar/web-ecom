'use client';

import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { formatRupiah } from '@/helper/formatters';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAuthorEmail } from '@/redux/slice/authorSlice';

const base_url =
  (process.env.BASE_URL_WEBS as string) || 'http://localhost:3000';

export function CheckoutPaymentForm({
  priceRupiah,
  eventId,
  slug,
  title,
}: {
  priceRupiah: number;
  eventId: number;
  slug: string;
  title: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.author.email);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${base_url}/events/${slug}/purchase/success`,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (err) {
      setErrorMessage('Unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          <CardDescription>
            Complete your purchase for <span className="font-semibold">{title}</span>
          </CardDescription>
          {errorMessage && <div className="mt-2 text-red-600 font-medium">{errorMessage}</div>}
        </CardHeader>

        <CardContent className="space-y-4">
          <PaymentElement />
          <LinkAuthenticationElement
            onChange={(event) => {
              const email = event.value.email;
              if (email) {
                dispatch(setAuthorEmail(email));
              }
            }}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full font-semibold text-lg"
            size="lg"
            disabled={!stripe || !elements || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <> {formatRupiah(priceRupiah)}</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
