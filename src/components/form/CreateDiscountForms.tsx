'use client';

import { tagRevalidate } from '@/app/action';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';

const createSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup
    .number()
    .required('Price is required')
    .min(1, 'Minimal price is 1'),
});

interface FormValue {
  name: string;
  price: number;
}

export default function CreateDiscountForms() {
  const dbname = process.env.NEXT_PUBLIC_BASE_API_URL;
  const initialValues: FormValue = { name: '', price: 0 };

  const handleCreate = async (data: FormValue) => {
    try {
      const res = await fetch(`${dbname}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Create Discount failed');

      tagRevalidate('users');

      alert('Discount Created');
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={createSchema}
        onSubmit={(values) => {
          handleCreate(values);
        }}
      >
        {() => (
          <div>
            <Form>
              <div className="mt-[10px]">
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" className="border border-1" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <div className="mt-[10px]">
                <label htmlFor="price">Price</label>
                <Field type="number" name="price" className="border border-1" />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-[12px] text-red-500"
                />
              </div>

              <button type="submit" className="bg-teal-500 p-2 mt-2">
                Create
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}
