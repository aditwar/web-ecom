import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import EventList from '@/components/EventList';
import { Suspense } from 'react';
import LoadingComp from '../loading';
import { getEvent } from '@/lib/event';

export const metadata: Metadata = {
  title: 'Event Commerce | Events',
  description: 'Description Explore Events Now',
};

export default async function EventPage() {
  const { event } = await getEvent();
  if (!event) throw 'EventPage event tidak ditemukan';

  return (
    <>
      <div className="flex items-center justify-center pt-[100px] mb-[50px]">
        <div className="container min-h-[calc(100vh-250px)]">
          <div className="flex w-full items-center justify-center">
            <div className="flex w-full items-center justify-center">
              <SearchBar />
            </div>
          </div>

          <div className="pt-[20px] w-full">
            <h3>Best Value</h3>
          </div>
          <div className="w-full">
            <Suspense fallback={<LoadingComp />}>
              <EventList event={event} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
