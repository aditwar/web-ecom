import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingComp from '../loading';

export const metadata: Metadata = {
  title: 'Event Commerce | Explore Discount',
  description: 'list all discount',
};

export default async function DiscountPage() {
  return (
    <div>
      <Suspense fallback={<LoadingComp />}>
        <div className="flex h-screen justify-center items-center">
          <h1 className="text-2xl font-bold">WANT THIS FEATURE? CONTACT US!</h1>
        </div>
      </Suspense>
    </div>
  );
}
