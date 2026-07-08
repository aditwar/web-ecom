import NavbarDashboard from '@/components/NavDashboard';
import Wrapper from '@/components/wrapper';
import { getEvent } from '@/lib/event';
import { Suspense } from 'react';
import LoadingComp from '../loading';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';

export default async function MyShopPage() {
  const { event } = await getEvent();
  if (!event) throw 'EventPage event tidak ditemukan';

  return (
    <>
      <Suspense fallback={<LoadingComp />}>
        <div className="mb-[50px]">
          <NavbarDashboard />
          <div className="flex w-auto min-h-screen pl-0 sm:pl-[20px] md:pl-[181px] lg:pl-[181px] justify-center items-center mt-[100px]">
            <div className="container">
              <div className="flex justify-center items-center pb-5">
                <h2>Dashboard</h2>
              </div>
              <Wrapper>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 pt-4 md:gap-6">
                      <SectionCards />
                      <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                      </div>
                      <DataTable data={event} />
                    </div>
                  </div>
                </div>
              </Wrapper>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
