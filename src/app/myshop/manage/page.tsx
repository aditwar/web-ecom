import Wrapper from '@/components/wrapper';
import { Metadata } from 'next';
import { getEvent } from '@/lib/event';


export const metadata: Metadata = {
  title: 'Event Commerce | Manage Tickets',
  description: 'manage all tickets',
};

export default async function ManagePage() {
  const { event } = await getEvent();
  if (!event) throw 'EventPage event tidak ditemukan';

  return (
    <>
      <Wrapper>
        <div className="w-full">
          <div>
            <h1 className="flex justify-center items-center pt-[100px] pb-[40px]">
              Manage Tickets
            </h1>
          </div>
          <DataTable data={event} />
        </div>
      </Wrapper>
    </>
  );
}
