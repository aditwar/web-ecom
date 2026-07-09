'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaArrowDownWideShort } from 'react-icons/fa6';
import { IconChevronDown } from '@tabler/icons-react';
import { CardEvent } from './cardEvent';
import { IEvents } from '@/app/type';
import { getEvent } from '@/lib/event';
import { SearchFilter } from '@/components/form/SearchFilter';
import { useAppSelector } from '@/redux/hooks';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState<string>(querySearch || '');
  const [value] = useDebounce(search, 1000);
  const [data, setData] = useState<IEvents[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();
  const filter = useAppSelector((state) => state.search);

  const onChange = () => {
    if (searchRef.current) {
      setSearch(searchRef.current.value);
    }
  };

  const getData = async () => {
    try {
      if (!value || value.trim() === '') {
        setData([]);
        router.push('');
        return;
      }

      const params = new URLSearchParams();
      params.set('search', value);

      if (filter.location) params.set('location', filter.location);
      if (filter.category) params.set('category', filter.category);
      if (filter.startDate) params.set('startDate', filter.startDate);
      if (filter.endDate) params.set('endDate', filter.endDate);

      const queryString = params.toString();

      router.push(`?${queryString}`);

      const { event, result } = await getEvent(queryString);

      setData(event || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, [value, filter]);

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'Price') {
      return sortOrder === 'asc'
        ? a.priceRupiah - b.priceRupiah
        : b.priceRupiah - a.priceRupiah;
    }
    if (sortBy === 'Date') {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortLabel = sortBy ? `${sortBy} (${sortOrder})` : 'Sort by';

  return (
    <div className="justify-center w-full">
      <div className="relative w-full flex items-center">
        <div className="w-full flex justify-center">
          <input
            onChange={onChange}
            ref={searchRef}
            value={search}
            type="search"
            placeholder="Search Here"
            className="h-[44px] rounded-lg py-1.5 px-3 
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 
              placeholder:text-gray-500 focus:ring-2 focus:ring-inset 
              focus:ring-blue-600 sm:text-sm sm:leading-6 dark:text-white
              w-full lg:max-w-[300px] 2xl:max-w-[800px]"
          />
        </div>

        <div className="hidden lg:flex lg:flex-col absolute left-0">
          <h3 className="font-bold">FLASH SALE!</h3>
          <p className="text-muted-foreground text-xs">Get Your Tickets Now!</p>
        </div>

        <div className="absolute right-0 items-center gap-4 hidden lg:flex">
          <div className=" ">
            <SearchFilter />
          </div>

          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FaArrowDownWideShort />
                  <span>{sortLabel}</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => handleSort('Date')}>
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('Price')}>
                  Price
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="pt-[20px] grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3">
          {sortedData.map((items: IEvents) => (
            <CardEvent
              key={items.id}
              title={items.title}
              slug={items.slug}
              category={items.category}
              content={items.content}
              image={items?.image}
              avatar={items.author?.avatar || '/assets/svg/defaultAvatar.svg'}
              author={items.author?.name ?? 'Anonymous'}
              email={items.author?.email ?? 'anonymous@example.com'}
              priceRupiah={items.priceRupiah}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
