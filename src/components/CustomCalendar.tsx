'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type CustomCalendarProps = {
  value: string;
  onValueChange: (val: string) => void;
};

export function CustomCalendar({ value, onValueChange }: CustomCalendarProps) {
  const [open, setOpen] = React.useState(false);

  const initialDate =
    value && !isNaN(new Date(value).getTime()) ? new Date(value) : undefined;

  const initialTime =
    value && value.includes('T') ? value.split('T')[1]?.slice(0, 5) : '';

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string>(initialTime);

  const updateFormikValue = (
    newDate: Date | undefined = date,
    newTime: string = time,
  ) => {
    if (!newDate || !newTime || isNaN(newDate.getTime())) return;

    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');

    const combined = `${yyyy}-${mm}-${dd}T${newTime}`;
    onValueChange(combined);
  };

  const handleDateChange = (selected?: Date) => {
    setDate(selected);
    updateFormikValue(selected, time);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    updateFormikValue(date, newTime);
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-auto justify-between font-normal"
            >
              {date
                ? date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Select Date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="">
          Time (24h)
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={time.slice(0, 5)}
          onChange={(e) => {
            const newTime = e.target.value.slice(0, 5);
            setTime(newTime);
            updateFormikValue(date, newTime);
          }}
          className="w-auto flex-initial justify-center bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
