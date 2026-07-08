import { formatRupiah } from '@/helper/formatters';
import { splitStr } from '@/helper/splitStr';
import Link from 'next/link';
import { Badge } from './ui/badge';

//! TYPE DATA ICardBlog
export interface ICardEvent {
  id?: number;
  title: string;
  slug: string;
  priceRupiah: number;
  category: string;
  content: string;
  image: string;
  author: string;
  email: string;
  avatar: string;
}

export const CardEvent: React.FC<ICardEvent> = ({
  id,
  title,
  slug,
  priceRupiah,
  category,
  content,
  image,
  author,
  email,
  avatar,
}) => {

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="relative overflow-hidden w-full min-h-[100px] max-h-[160px] md:h-[130px]">
        <Link href={`/events/${slug}`} className="">
          <img
            className="rounded-t-lg min-h-[131px]"
            src={`${image}`}
            alt={title}
          />
          <Badge
            variant="outline"
            className="absolute top-2 right-2 text-[#ffffff93] font-bold bg-[#00000065] backdrop-blur-lg px-1.5 z-5"
          >
            {category}
          </Badge>
        </Link>
      </div>
      <div className="w-full p-4">
        <div className="">
          <h5 className="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white">
            {splitStr(title, 25)}
          </h5>
          <div className="text-sm text-gray-500 dark:text-gray-400 hidden 2xl:flex">
            {splitStr(content, 70)}
          </div>
        </div>

        <div className="flex items-center my-3 gap-3">
          <div className="flex-shrink-0 hidden xl:block">
            <img
              className="w-10 h-10 rounded-full overflow-hidden"
              src={`${avatar}`}
              alt={author}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {splitStr(author, 20)}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {splitStr(email, 20)}
            </p>
          </div>
        </div>
        <Link
          href={`/events/${slug}/purchase`}
          className="w-full inline-flex justify-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <div className="flex items-center gap-2">
            <div className="flex font-bold ">{formatRupiah(priceRupiah)}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
