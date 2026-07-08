import CreateEventForms from '@/components/form/CreateEventForms';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Event Commerce | Create Event',
  description: 'create all events',
};

export default function CreateEvent() {
  return (
    <>
      <div className="grid grid-flow-col grid-cols-10 w-full h-screen">
        <div className="grid col-span-5 overflow-y-auto">
          <div className="p-[100px]">
            <CreateEventForms />
          </div>
        </div>
        <div className="grid col-span-5 ">
          <div className="flex overflow-hidden">
            <Image
              src="/assets/png/createform.png"
              alt="me"
              width="1000"
              height="1000"
              className="flex h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
