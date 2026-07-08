import { CallAction } from '@/components/CallAction';
import { FAQs } from '@/components/FAQs';
import { Features } from '@/components/Features';
import Hero from '@/components/Hero';
import { LogoTicker } from '@/components/LogoTicker';
import { Showcase } from '@/components/Showcase';
import { Suspense } from 'react';

import LoadingComp from './loading';

export default function Home() {
  return (
    <div className="">
      <Suspense fallback={<LoadingComp />}>
        <Hero />
        <Showcase />
        <FAQs />
        <Features />
        <LogoTicker />
        <CallAction />
      </Suspense>
    </div>
  );
}
