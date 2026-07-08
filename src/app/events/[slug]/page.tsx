import { formatDate, formatTime, formatRupiah } from '@/helper/formatters';
import Link from 'next/link';
import { Suspense } from 'react';
import LoadingComp from '@/app/loading';
import { getEvent, getEventSlug } from '@/lib/event';
import { IEvents } from '@/app/type';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarClock, Clock, Users } from 'lucide-react';
import EventList from '@/components/EventList';

export const revalidate = 3600;

export const generateStaticParams = async () => {
  const { event } = await getEvent();
  return event.map((items: IEvents) => ({ slug: items.slug }));
};

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = await props.params;
  const { event } = await getEventSlug(slug);

  return {
    title: event.title,
    description: event.title,
    author: event.author.name,
    openGraph: { images: [event?.image] },
  };
}

export default async function EventDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const { event } = await getEventSlug(slug);
  if (!event.author) throw 'TIDAK DAPAT fetch EVENT';

  const { event: events } = await getEvent();
  if (!events) throw 'EventPage event tidak ditemukan';

  return (
    <div className="flex items-center justify-center pt-[100px] pb-5">
      <div className="container min-h-[calc(100vh-200px)]">
        <div className="flex flex-col xl:flex-row w-full gap-6">
          <div className="overflow-hidden w-full xl:w-2/3 rounded-lg shadow-md">
            <div className="w-full sm:aspect-video hidden sm:flex">
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                width={1000}
                height={1000}
                className="w-full h-auto sm:h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col w-full xl:w-1/3 px-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs sm:text-sm">
              <p className="font-medium text-gray-600 dark:text-gray-400">
                {formatDate(event.createdAt)}
              </p>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                by {event.author?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                className="text-xs sm:text-sm font-medium"
                variant="secondary"
              >
                {event.category}
              </Badge>
              <Badge
                className="text-xs sm:text-sm font-medium"
                variant={event.isAvailable ? 'default' : 'destructive'}
              >
                {event.isAvailable ? 'Available' : 'Sold Out'}
              </Badge>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span>{event.seats}</span>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm sm:text-base font-medium">
              <div className="flex gap-2 items-center">
                <CalendarClock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                {formatDate(event.date)}
              </div>
              <div className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                {formatTime(event.date)}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base font-medium mb-3">
              <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span>{event.location}</span>
            </div>

            <Separator className="my-3" />

            <div className="text-sm sm:text-base font-normal mb-6 leading-relaxed">
              {event.content}
            </div>

            <div className="mt-auto">
              <Link href={`/events/${slug}/purchase`}>
                <Button
                  className="
                w-full font-bold text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3
                bg-white text-black border border-gray-300
                transition-all duration-300 ease-in-out
                hover:bg-gradient-to-r 
                hover:from-[rgb(25,60,150)] hover:via-[rgb(37,99,235)] hover:to-[rgb(20,40,100)]
                hover:text-white hover:shadow-lg hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              "
                  type="submit"
                >
                  {formatRupiah(event.priceRupiah)}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-10 w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Explore More
          </h3>
          <Suspense fallback={<LoadingComp />}>
            <EventList event={events} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
