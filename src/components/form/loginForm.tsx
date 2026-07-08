'use client';

import { loginAuthor } from '@/lib/author';
import { createToken } from '@/lib/server';
import { useAppDispatch } from '@/redux/hooks';
import { loginAction } from '@/redux/slice/authorSlice';
import { IAuthorLogin } from '@/app/type';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { IconBrandGoogleFilled, IconBrandGithub } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';

const LoginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password required'),
});

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const onLogin = async (
    data: IAuthorLogin,
    action: FormikHelpers<IAuthorLogin>,
  ) => {
    try {
      const { result, ok } = await loginAuthor(data);
      if (!ok) throw result.msg;
      dispatch(loginAction(result.author));
      createToken(result.token);
      await createToken(result.tokenAuthor);
      router.refresh();
      toast.success(result.msg);
      router.push('/events');
    } catch (err: any) {
      toast.error(err as string);
      action.resetForm();
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Register first before Login with your Google or Github account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => signIn('google')}
              >
                <IconBrandGoogleFilled className="size-4" />
                Login with Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => signIn('github')}
              >
                <IconBrandGithub className="size-4" />
                Login with GitHub
              </Button>
            </div>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={onLogin}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label>Email</label>
                    <Field
                      name="email"
                      type="text"
                      placeholder="yourmail@example.com"
                      autoComplete="email"
                      className="w-full border rounded px-2 py-1"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label>Password</label>
                    </div>
                    <Field
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="your password"
                      className="w-full border rounded px-2 py-1"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have any account?
                    <br />
                    <a href="login/register">SignUp Here</a>
                  </FieldDescription>
                </Form>
              )}
            </Formik>
          </FieldGroup>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
