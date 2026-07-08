'use client';

import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconFilter } from '@tabler/icons-react';
import { CustomLocation } from '@/components/CustomLocation';
import { CustomCategory } from '@/components/CustomCategory';
import { CustomCalendar } from '@/components/CustomCalendar';
import { useAppDispatch } from '@/redux/hooks';
import { setSearchFilter } from '@/redux/slice/searchSlice';

interface SearchValues {
  location: string;
  category: string;
  startDate: string;
  endDate: string;
}

const initialValues: SearchValues = {
  location: '',
  category: '',
  startDate: '',
  endDate: '',
};

export function SearchFilter() {
  const dispatch = useAppDispatch();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconFilter />
          Filter by
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Filter</DialogTitle>
          <DialogDescription>
            Filter your search results here. Click apply when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Formik<SearchValues>
          initialValues={initialValues}
          onSubmit={(values) => {
            dispatch(setSearchFilter(values));
          }}
        >
          {({ setFieldValue }) => (
            <Form className="grid gap-4">
              <div className="grid grid-flow-col grid-cols-4 gap-5">
                <div className="grid col-span-2 gap-3">
                  <label>Location</label>
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

                <div className="grid col-span-2 gap-3">
                  <label>Category</label>
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
              </div>

              <div className="grid grid-flow-col grid-cols-4 gap-5 mt-5">
                <div className="grid col-span-2 gap-3">
                  <label>Start Date</label>
                  <Field name="startDate">
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
                  <label>End Date</label>
                  <Field name="endDate">
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

              <DialogClose asChild className='mt-5'>
                <Button type="submit">Apply Filter</Button>
              </DialogClose>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
