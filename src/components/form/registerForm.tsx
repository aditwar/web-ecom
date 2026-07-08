'use client';

import { regAuthor } from '@/lib/author';
import { IAuthorReg } from '@/app/type';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CustomRole } from '@/components/CustomRole';

const RegisterSchema = yup.object().shape({
  name: yup.string().required('Name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  role: yup.string().required('Pick one role'),
});

const initialValues: IAuthorReg = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
};

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();

  const onRegister = async (
    data: IAuthorReg,
    action: FormikHelpers<IAuthorReg>,
  ) => {
    try {
      const { result, ok } = await regAuthor(data);
      if (!ok) throw result.msg;
      toast.success(result.msg);
      router.refresh();
      router.push('/login');
    } catch (err: any) {
      toast.error(err as string);
      action.resetForm();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={(values, action) => {
        const { name, email, password, confirmPassword, role } = values;
        onRegister({ name, email, password, confirmPassword, role }, action);
      }}
    >
      {() => (
        <Form className={cn('flex flex-col gap-6', className)} {...props}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Create your account First</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the form below to create your account
              </p>
            </div>

            <div>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Field
                as={Input}
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-500"
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </div>

            <div>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Field
                as={Input}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-500"
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </div>

            <div>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Field
                as={Input}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-sm text-red-500"
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </div>

            <div>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Field name="role">
                {({ field, form }: { field: any; form: any }) => (
                  <CustomRole
                    value={field.value ?? ''}
                    onValueChange={(val: any) =>
                      form.setFieldValue(field.name, val)
                    }
                  />
                )}
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-sm text-red-500"
              />
              <FieldDescription>Please select your role.</FieldDescription>
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit">Create Account</Button>
            </div>

            <div className="flex flex-col gap-4">
              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </div>
          </FieldGroup>
        </Form>
      )}
    </Formik>
  );
}
