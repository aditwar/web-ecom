'use client';

import * as yup from 'yup';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';

import { EventsInput } from '@/app/type';
import { toast } from 'react-toastify';
import { CustomCalendar } from '@/components/CustomCalendar';
import { CustomCategory } from '@/components/CustomCategory';
import { CustomLocation } from '@/components/CustomLocation';
import { createEvent } from '@/lib/event';
import { getToken } from '@/lib/server';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const EventSchema = yup.object().shape({
  title: yup.string().required('title required'),
  priceRupiah: yup.number().required('Price is required').min(0, 'Minimal 0'),
  date: yup.string().required('date required'),
  location: yup.string().required('Pick one location'),
  seats: yup.number().required('Seats is required').min(1, 'Minimal seat is 1'),
  isAvailable: yup.boolean().required('Availability is required'),
  category: yup.string().required('Pick one category'),
  content: yup.string().required('content required'),
  image: yup.mixed<File | string>().required('image required'),
});

const initialValues: EventsInput = {
  title: '',
  slug: '',
  priceRupiah: 0,
  date: '',
  location: '',
  seats: 1,
  isAvailable: true,
  category: '',
  content: '',
  image: '',
};

export function CreateEvent() {
  const router = useRouter();

  const [token, setToken] = useState('');
  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };

  const author = useAppSelector((state) => state.author);
  const users = useAppSelector((state) => state.auth);

  const onCreateEvents = async (
    data: EventsInput,
    action: FormikHelpers<EventsInput>,
  ) => {
    const appToken = author?.token ?? token;
    if (!appToken) {
      toast.error('Token aplikasi tidak tersedia. Silakan login ulang.');
      return;
    }

    const payload = { ...data, author, users };

    try {
      const { result, ok } = await createEvent(payload, appToken);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      action.resetForm();

      router.push('/events');
      router.refresh();
    } catch (err: any) {
      toast.error(err as string);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <span className="flex font-black w-full justify-center items-center min-w-[130px]">
            Quick Create
          </span>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Event Form</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Formik<EventsInput>
            initialValues={initialValues}
            validationSchema={EventSchema}
            onSubmit={(values, action) => {
              onCreateEvents(values, action);
            }}
          >
            {({
              setFieldValue,
            }) => {
              return (
                <>
                  <Form>
                    <div className="grid gap-4">
                      <div className="grid grid-flow-col grid-cols-11 gap-5">
                        <div className="grid col-span-8 gap-3">
                          <Label htmlFor="name-1">Title</Label>
                          <Field
                            name="title"
                            type="text"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="grid col-span-3 gap-3">
                          <Label htmlFor="name-1">Price</Label>
                          <Field
                            name="priceRupiah"
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="grid grid-flow-col grid-cols-4 gap-3">
                        <ErrorMessage
                          name="title"
                          component={'div'}
                          className="grid col-span-3 text-sm text-red-500"
                        />
                        <ErrorMessage
                          name="priceRupiah"
                          component={'div'}
                          className="grid text-sm text-red-500"
                        />
                      </div>

                      <div className="grid grid-flow-col grid-cols-11 gap-4">
                        <div className="grid col-span-5 gap-3">
                          <Label htmlFor="username-1">Location</Label>
                          <Field name="location">
                            {({ field, form }: { field: any; form: any }) => (
                              <CustomLocation
                                value={field.value ?? ''}
                                onValueChange={(val: any) =>
                                  form.setFieldValue(field.name, val)
                                }
                              />
                            )}
                          </Field>
                        </div>
                        <div className="grid col-span-6 gap-3 pl-3">
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
                      </div>
                      <div className="grid grid-flow-col grid-cols-3 gap-3">
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="grid col-span-1 text-red-500 mt-1"
                        />
                        <ErrorMessage
                          name="date"
                          component={'div'}
                          className="grid col-span-2 text-sm text-red-500"
                        />
                      </div>

                      <div className="grid grid-flow-col grid-cols-11 gap-4">
                        <div className="grid col-span-5 gap-3">
                          <Label htmlFor="username-1">Category</Label>
                          <Field name="category">
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
                        <div className="grid col-span-3 gap-3 pl-3">
                          <Label htmlFor="name-1">Seats</Label>
                          <Field
                            name="seats"
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="grid col-span-3 gap-3 w-full">
                          <Label
                            className="flex justify-center"
                            htmlFor="username-1"
                          >
                            Availability
                          </Label>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="grid grid-rows-2 gap-1">
                              <Field
                                name="isAvailable"
                                type="radio"
                                value="true"
                                className="flex items-center justify-center"
                              />
                              <Label
                                htmlFor="username-3"
                                className="flex items-center justify-center"
                              >
                                Yes
                              </Label>
                            </div>
                            <div className="grid grid-rows-2 gap-1">
                              <Field
                                name="isAvailable"
                                type="radio"
                                value="false"
                                className="flex items-center justify-center"
                              />
                              <Label
                                htmlFor="username-3"
                                className="flex items-center justify-center"
                              >
                                No
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-flow-col grid-cols-3 gap-3">
                        <ErrorMessage
                          name="category"
                          component="div"
                          className="grid col-span-2 text-red-500 mt-1"
                        />
                        <ErrorMessage
                          name="seats"
                          component={'div'}
                          className="grid text-sm text-red-500"
                        />
                        <ErrorMessage
                          name="isAvailable"
                          component="div"
                          className="grid text-red-500 mt-1"
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Content</Label>
                        <Field
                          as="textarea"
                          name="content"
                          id="content"
                          rows={2}
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
               ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
               focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-y overflow-y-auto"
                        />
                        <ErrorMessage
                          name="content"
                          component={'div'}
                          className="text-sm text-red-500"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="username-1">Image</Label>
                        <div className="mt-2">
                          <input
                            name="image"
                            type="file"
                            onChange={(e) =>
                              setFieldValue(
                                'image',
                                e.currentTarget.files?.[0] as File,
                              )
                            }
                          />
                          <ErrorMessage
                            name="image"
                            component={'div'}
                            className="text-sm text-red-500"
                          />
                        </div>
                      </div>
                      <div className="grid">
                      </div>
                    </div>
                    <DialogFooter>
                      <Link
                        href={'/myshop/create'}
                        className="flex items-center w-full hover:drop-shadow-[0_0_0.3rem_#ffffff] transition"
                      >
                        Having Problem?
                      </Link>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Create Now</Button>
                    </DialogFooter>
                  </Form>
                </>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
