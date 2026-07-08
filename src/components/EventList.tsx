'use client';

import { IEvents } from '@/app/type';
import { CardEvent } from '@/components/cardEvent';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';

export default function EventList({ event }: { event: IEvents[] }) {
  const eventsArray = Array.isArray(event) ? event : [];

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = Math.ceil(eventsArray.length / pageSize);
  const currentPageData = eventsArray.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3">
        {currentPageData.map((items: IEvents) => (
          <CardEvent
            key={items.id}
            title={items.title}
            slug={items.slug}
            category={items.category}
            priceRupiah={items.priceRupiah}
            content={items.content}
            image={items?.image}
            avatar={items.author?.avatar || '/assets/svg/defaultAvatar.svg'}
            author={items.author?.name}
            email={items.author?.email}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-4 mt-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[3, 5, 10, 20].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
            }
            disabled={pageIndex >= pageCount - 1}
          >
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
