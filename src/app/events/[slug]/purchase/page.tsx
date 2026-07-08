import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingComp from '@/app/loading';

import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckoutForm } from '@/components/form/CheckoutForm';

export const metadata: Metadata = {
  title: 'Event Commerce | Purchase',
  description: 'Order Events Tickets Now',
};

export default async function PurchasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await db.event.findUnique({ where: { slug } });
  if (!event) return notFound();

  return (
    <div className="flex items-center justify-center pt-[100px] pb-[50px]">
      <div className="container">
        <div className="h-[calc(100vh-260px)]">
          <Suspense fallback={<LoadingComp />}>
            <CheckoutForm event={event} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
