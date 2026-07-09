'use client';

import { IAuthorUpdate } from '@/app/type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconBrandGithub,
  IconBrandGoogleFilled,
  IconPencil,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { CustomRole } from '../CustomRole';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getSession, signIn } from 'next-auth/react';
import { deleteAuthor, updateAuthor } from '@/lib/author';
import { getToken, deleteToken } from '@/lib/server';
import { useEffect, useState } from 'react';
import { loginAction } from '@/redux/slice/authorSlice';
import { loginUserAction } from '@/redux/slice/authSlice';
import { signOut } from 'next-auth/react';

function getAvatarUrl(
  avatar: string | File | { url: string } | null | undefined,
): string {
  if (!avatar) return '/assets/svg/defaultAvatar.svg';
  if (typeof avatar === 'string') return avatar;
  if (avatar instanceof File) return URL.createObjectURL(avatar);
  if ('url' in avatar) return avatar.url;
  return '/assets/svg/defaultAvatar.svg';
}

const RegisterSchema = yup.object().shape({
  name: yup.string().nullable(),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .nullable(),
  role: yup.string().nullable(),
  avatar: yup.string().nullable(),
});

export default function ProfileSettingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // dapat token dulu
  const [token, setToken] = useState('');
  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };

  const author = useAppSelector((state) => state.author);
  const users = useAppSelector((state) => state.auth);

  const initialValues: IAuthorUpdate & { file?: File } = {
    id: author?.id,
    name: author?.name || '',
    email: author?.email || '',
    password: author?.password || '',
    role: author?.role ?? 'Seller',
    avatar: author?.avatar ?? users?.avatar ?? '',
    usersEmail: users?.email || '',
  };

  const onDeleteAuthor = async (
    data: IAuthorUpdate,
    action: FormikHelpers<IAuthorUpdate>,
  ) => {
    if (!token) {
      toast.error('Login dulu yaa');
      return;
    }
    if (!data) {
      toast.error('Author id tidak ditemukan');
      return;
    }

    try {
      const { id, email } = data;
      if (!id || !email) {
        toast.error('Author id atau email tidak ditemukan');
        return;
      }

      const { result, ok } = await deleteAuthor(token, id, email);
      if (!ok) throw result.msg;
      router.push('/');
      toast.success(result.msg);
      router.refresh();

      await deleteToken();
      setToken('');
      signOut();
    } catch (err: any) {
      console.log(err);
      toast.error(err as string);
    }
  };

  const handleConnectProvider = async (
    provider: 'google' | 'github',
    authorEmail?: string,
    usersEmail?: string,
  ) => {
    try {
      const result = await signIn(provider, { redirect: true });
      if (result?.error) {
        toast.error(`Gagal login dengan ${provider}`);
        return;
      }

      const session = await getSession();
      if (!session?.user?.email) {
        toast.error('Gagal mendapatkan session OAuth');
        return;
      }

      dispatch(
        loginUserAction({
          email: session.user.email,
          provider: session.provider,
          avatar: session.user.image ?? '',
        }),
      );
      toast.success(`${provider} account ready to link`);
    } catch (err: any) {
      console.error('connect provider error:', err);
      toast.error('Terjadi kesalahan saat menghubungkan akun');
    }
  };

  const handleConnectGoogle = async (authorEmail?: string) => {
    await handleConnectProvider('google', authorEmail);
  };
  const handleConnectGithub = async (authorEmail?: string) => {
    await handleConnectProvider('github', authorEmail);
  };

  const connectedProvider = users?.provider ?? 'null';
  const isGoogleConnected = connectedProvider === 'google';
  const isGithubConnected = connectedProvider === 'github';

  const onUpdateAuthor = async (data: IAuthorUpdate) => {
    const appToken = author?.token ?? token;
    if (!appToken) {
      toast.error('Token aplikasi tidak tersedia. Silakan login ulang.');
      return;
    }

    const payload = {
      ...data,
      usersEmail: users?.email ?? null,
    };

    try {
      const { result, ok } = await updateAuthor(payload, appToken);
      if (!ok) throw result.msg;
      dispatch(
        loginAction({
          ...result.author,
          token: result.token ?? appToken,
        }),
      );

      if (users?.email) {
        dispatch(
          loginUserAction({
            email: users.email,
            provider: users.provider,
            avatar: users.avatar,
          }),
        );
      }

      router.refresh();
      toast.success(result.msg);
      router.push('/');
    } catch (err: any) {
      console.log(err);
      toast.error(err as string);
    }
  };

  useEffect(() => {
    getData().catch((err) => console.error('Token error:', err));
  }, []);

  return (
    <Formik<IAuthorUpdate>
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={onUpdateAuthor}
    >
      {({ values, isSubmitting, resetForm, setSubmitting, setFieldValue }) => {
        return (
          <>
            <Form>
              <FieldGroup>
                <div className="flex flex-col-reverse w-full max-w-4xl gap-8 mx-auto lg:flex-row">
                  <div className="flex flex-col flex-1 space-y-4">
                    <div className="flex flex-col gap-2">
                      <FieldLabel
                        htmlFor="name"
                        className="text-base font-semibold"
                      >
                        Full Name
                      </FieldLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                      />
                      <FieldDescription className="text-xs text-muted-foreground">
                        Provide your complete name as it will appear on your
                        profile.
                      </FieldDescription>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <FieldLabel
                        htmlFor="email"
                        className="text-base font-semibold"
                      >
                        Email Address
                      </FieldLabel>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@domain.com"
                        readOnly
                      />
                      <FieldDescription className="text-xs text-muted-foreground">
                        Email digunakan sebagai identifier. Untuk mengganti
                        email, gunakan proses verifikasi terpisah.
                      </FieldDescription>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <FieldLabel
                        htmlFor="password"
                        className="text-base font-semibold"
                      >
                        Password
                      </FieldLabel>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="*****"
                      />
                      <FieldDescription className="text-xs text-muted-foreground">
                        Kosongkan jika tidak ingin mengganti password.
                      </FieldDescription>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
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
                      <FieldDescription className="text-xs text-muted-foreground">
                        Choose the role that defines your level of access and
                        responsibilities.
                      </FieldDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-64 h-64 rounded-full mx-auto">
                      <div
                        className="overflow-hidden rounded-full transition-shadow duration-300 
                  hover:shadow-lg hover:shadow-black/50 
                  dark:hover:shadow-lg dark:hover:shadow-white/70"
                      >
                        <img
                          className="object-cover w-full h-full"
                          src={
                            getAvatarUrl(author.avatar) ||
                            getAvatarUrl(users.avatar)
                          }
                          alt={author.name || users.name || 'Your Name'}
                          onError={(e: any) =>
                            (e.currentTarget.src =
                              '/assets/svg/defaultAvatar.svg')
                          }
                        />
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <label
                          htmlFor="avatarFile"
                          className="flex justify-center items-center w-12 h-12 
                 rounded-full shadow-md cursor-pointer
                 transition-all duration-300 ease-in-out
                 bg-black text-white
                 hover:bg-white hover:text-black
                 dark:bg-white dark:text-black
                 dark:hover:bg-black dark:hover:text-white"
                        >
                          <IconPencil className="w-6 h-6" />
                        </label>
                        <input
                          type="file"
                          id="avatarFile"
                          name="avatarFile"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) {
                              setFieldValue('file', file); // untuk backend
                              setFieldValue('avatar', file); // simpan File, bukan blob URL
                            } else {
                              setFieldValue('avatar', null); // fallback
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-7 w-full">
                      <Button
                        type="button"
                        className="w-full font-semibold ..."
                        onClick={async () => {
                          setSubmitting(true);
                          try {
                            await onDeleteAuthor(values, {
                              resetForm: (nextState?: any) =>
                                resetForm(nextState),
                              setSubmitting: (b: boolean) => setSubmitting(b),
                              // cast ke FormikHelpers jika perlu
                            } as unknown as FormikHelpers<IAuthorUpdate>);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex flex-col gap-2 pb-7">
                    <FieldLabel htmlFor="provider">
                      Connect your Account
                    </FieldLabel>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant={isGoogleConnected ? 'default' : 'outline'}
                        type="button"
                        onClick={() => {
                          setFieldValue('provider', 'google');
                          handleConnectGoogle(values.email);
                        }}
                        disabled={isGoogleConnected || isSubmitting}
                        aria-label={
                          isGoogleConnected
                            ? 'Google connected'
                            : 'Connect with Google'
                        }
                        className="flex items-center gap-2"
                      >
                        <IconBrandGoogleFilled className="w-4 h-4" />
                        {isGoogleConnected
                          ? 'Connected with Google'
                          : 'Connect with Google'}
                      </Button>

                      {/* GitHub */}
                      <Button
                        variant={isGithubConnected ? 'default' : 'outline'}
                        type="button"
                        onClick={() => handleConnectGithub(values?.email)}
                        disabled={isGithubConnected || isSubmitting}
                        aria-label={
                          isGithubConnected
                            ? 'GitHub connected'
                            : 'Connect with GitHub'
                        }
                        className="flex items-center gap-2"
                      >
                        <IconBrandGithub className="w-4 h-4" />
                        {isGithubConnected
                          ? 'Connected with GitHub'
                          : 'Connect with GitHub'}
                      </Button>
                    </div>

                    <FieldDescription className="text-xs text-muted-foreground">
                      Connect your account with Google or GitHub. If already
                      connected, the button is disabled.
                    </FieldDescription>

                    <Field
                      as="input"
                      type="hidden"
                      id="provider"
                      name="provider"
                    />
                    <ErrorMessage
                      name="provider"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="w-full ...">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      className="w-full ..."
                      onClick={() => router.push('/')}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FieldGroup>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
