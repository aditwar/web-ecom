'use client';

import * as React from 'react';
import { InferType } from 'yup';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/server';
import { useAppSelector } from '@/redux/hooks';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { toast } from 'sonner';
import * as yup from 'yup';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsUpdate } from '@/app/type';
import { updateEvent } from '@/lib/event';
import { CustomLocation } from './CustomLocation';
import { CustomAvailable } from './CustomAvailable';
import { CustomCalendar } from './CustomCalendar';
import { CustomCategory } from './CustomCategory';

import { format, toZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { splitStr } from '@/helper/splitStr';

const schema = yup.object({
  id: yup.number().required(),
  title: yup.string().required(),
  priceRupiah: yup.number().required(),
  date: yup.string(),
  location: yup.string().required(),
  seats: yup.number().required(),
  isAvailable: yup.boolean().required(),
  category: yup.string().required(),
  content: yup.string(),
  image: yup.mixed<File | string | any>(),
});

type SchemaType = InferType<typeof schema>;

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
    </Button>
  );
}

function formatIndoDate(dateString?: string) {
  if (!dateString) return '-';
  const timeZone = 'Asia/Jakarta';
  const date = new Date(dateString);
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'd MMMM yyyy | HH.mm', { locale: id });
}

const columns: ColumnDef<SchemaType>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center ml-[-20px]">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Price',
    header: () => <div className="w-full text-right">Price</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.title}`,
            success: 'true',
            error: 'Error',
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-priceRupiah`} className="sr-only">
          Price
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.priceRupiah}
          id={`${row.original.id}-priceRupiah`}
        />
      </form>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date | Time (24h)',
    cell: ({ row }) => {
      return <span>{formatIndoDate(row.original.date)}</span>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.category}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground p-1.5">
        {row.original.isAvailable === true ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
      </Badge>
    ),
  },

  {
    accessorKey: 'seats',
    header: () => <div className="w-full text-right">Seats</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.title}`,
            success: 'true',
            error: 'Error',
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-seats`} className="sr-only">
          Seats
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.seats}
          id={`${row.original.id}-seats`}
        />
      </form>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const isAssigned = row.original.location !== 'Choose Location';

      if (isAssigned) {
        return row.original.location;
      }

      return (
        <>
          <Select>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Choose Location" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Semarang">Semarang</SelectItem>
              <SelectItem value="Jakarta">Jakarta</SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<SchemaType> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData }: { data: SchemaType[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-5 pb-15 lg:pb-0"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 pt-4">
        <Label htmlFor="view-selector" className="not-sr-only font-semibold">
          Manage Your Tickets Here
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[20px]">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[3, 5, 10, 20].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TableCellViewer({ item }: { item: SchemaType }) {
  const isMobile = useIsMobile();
  const timeZone = 'Asia/Jakarta';

  const router = useRouter();

  const [token, setToken] = useState('');

  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };

  //! ini ambil data dari REDUX HOOK GLOBAL
  const author = useAppSelector((state) => state.author);

  const onUpdateEvents = async (
    data: EventsUpdate,
    action: FormikHelpers<EventsUpdate>,
  ) => {
    const appToken = author?.token ?? token; // token global fallback
    if (!appToken) {
      toast.error('Token aplikasi tidak tersedia. Silakan login ulang.');
      return;
    }

    const payload = { ...data, author };

    try {
      const { result, ok } = await updateEvent(payload, appToken);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      action.resetForm();
      router.push('/myshop');
      router.refresh();
    } catch (err: any) {
      toast.error(err as string);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{splitStr(item.title!, 20)}</DrawerTitle>
          <DrawerDescription>{splitStr(item.content!, 42)}</DrawerDescription>
          <div className="overflow-hidden w-full max-h-[250px] max-sm:h-[25px] max-md:h-[50px] my-1">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              width={1000}
              height={1000}
              className="w-full"
            />
          </div>
        </DrawerHeader>
        <Separator />
        <div className="flex overflow-y-auto px-4 text-sm">
          <Formik<EventsUpdate>
            initialValues={{
              ...item,
              date: item.date
                ? format(
                    toZonedTime(new Date(item.date), timeZone),
                    "yyyy-MM-dd'T'HH:mm",
                  )
                : '',
              content: item.content ?? '',
              image: item.image ?? '',
              title: item.title ?? '',
              priceRupiah: item.priceRupiah ?? 0,
              location: item.location ?? '',
              seats: item.seats ?? 0,
              isAvailable: item.isAvailable ?? false,
              category: item.category ?? '',
            }}
            validationSchema={schema}
            onSubmit={(values, action) => {
              const utcDate: string = values.date
                ? new Date(values.date).toISOString()
                : new Date().toISOString();

              onUpdateEvents(
                {
                  ...values,
                  date: utcDate,
                },
                action,
              );
            }}
          >
            {({ setFieldValue }) => {
              return (
                <>
                  <Form>
                    <div className="flex flex-col gap-6 w-full mt-[20px]">
                      <div className="grid grid-flow-col grid-cols-10 gap-5">
                        <div className="grid col-span-6 gap-3">
                          <Label htmlFor="title">Title</Label>
                          <Field
                            id="title"
                            name="title"
                            type="text"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="grid col-span-4 gap-3">
                          <Label htmlFor="location">Location</Label>
                          <Field
                            id="location"
                            name="location"
                            type="string"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            {({ field, form }: { field: any; form: any }) => (
                              <CustomLocation
                                value={field.value ?? ''}
                                onValueChange={(val: string) =>
                                  form.setFieldValue(field.name, val)
                                }
                              />
                            )}
                          </Field>
                        </div>
                      </div>

                      <div className="grid grid-flow-col grid-cols-9 gap-5">
                        <div className="grid col-span-3 gap-3">
                          <Label htmlFor="isAvailable">Availability</Label>
                          <Field id="isAvailable" name="isAvailable">
                            {({ field, form }: { field: any; form: any }) => (
                              <CustomAvailable
                                value={String(field.value ?? false)}
                                onValueChange={(val: string) =>
                                  form.setFieldValue(field.name, val === 'true')
                                }
                              />
                            )}
                          </Field>
                        </div>

                        <div className="grid col-span-2 gap-3">
                          <Label htmlFor="seats">Seats</Label>
                          <Field
                            id="seats"
                            name="seats"
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="grid col-span-4 gap-3">
                          <Label htmlFor="category">Category</Label>
                          <Field id="category" name="category" type="string">
                            {({ field, form }: { field: any; form: any }) => (
                              <CustomCategory
                                value={field.value ?? ''}
                                onValueChange={(val: any) =>
                                  form.setFieldValue(field.name, val)
                                }
                              />
                            )}
                          </Field>
                        </div>
                      </div>

                      <div className="grid grid-flow-col grid-cols-10 gap-5">
                        <div className="grid col-span-8 gap-3">
                          <Field name="date">
                            {({ field, form }: { field: any; form: any }) => (
                              <CustomCalendar
                                value={field.value ?? ''}
                                onValueChange={(val: string) =>
                                  form.setFieldValue(field.name, val)
                                }
                              />
                            )}
                          </Field>
                        </div>
                        <div className="grid col-span-2 gap-3">
                          <Label htmlFor="priceRupiah">Price</Label>
                          <Field
                            id="priceRupiah"
                            name="priceRupiah"
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="content">Content</Label>
                        <Field
                          id="content"
                          name="content"
                          type="text"
                          as="textarea"
                          rows={10}
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                        ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                        focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-y overflow-y-auto"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="image">Image</Label>
                        <div className="mt-2">
                          <input
                            id="image"
                            name="image"
                            type="file"
                            onChange={(e) =>
                              setFieldValue(
                                'image',
                                e.currentTarget.files?.[0] as File,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full py-[20px]">
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button type="submit">Submit</Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
