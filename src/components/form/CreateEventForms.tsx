'use client';

import { EventsInput } from '@/app/type';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createEvent } from '@/lib/event';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/server';
import { useAppSelector } from '@/redux/hooks';
import { CustomLocation } from '@/components/CustomLocation';
import { CustomCategory } from '@/components/CustomCategory';
import { CustomCalendar } from '../CustomCalendar';
import { Label } from '../ui/label';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

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

export default function CreateEventForms() {
  const router = useRouter();

  // dapat token dulu
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
            <Form>
              <div className="grid gap-4">
                <div className="grid grid-flow-col justify-center items-center">
                  <h2>Event Form</h2>
                </div>
                <div className="grid grid-flow-col grid-cols-11 gap-5">
                  <div className="grid col-span-8 gap-3">
                    <Label htmlFor="title">Title</Label>
                    <Field
                      name="title"
                      type="text"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="grid col-span-3 gap-3">
                    <Label htmlFor="priceRupiah">Price</Label>
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

                <div className="grid grid-flow-col grid-cols-10 gap-5">
                  <div className="grid col-span-4 gap-3">
                    <Label htmlFor="location">Location</Label>
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
                  <div className="grid col-span-6">
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
                    <Label htmlFor="category">Category</Label>
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
                    <Label htmlFor="seats">Seats</Label>
                    <Field
                      name="seats"
                      type="number"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="grid col-span-3 gap-3 w-full">
                    <Label
                      className="flex justify-center"
                      htmlFor="isAvailable"
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
                  <Label htmlFor="content">Content</Label>
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
                  <Label htmlFor="image">Image</Label>
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
                <Button type="submit">Create Now</Button>
              </DialogFooter>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
