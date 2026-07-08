'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAction, logoutUserAction } from '@/redux/slice/authSlice';
import { createToken, deleteToken } from '@/lib/server';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const isStored = useSelector((state: RootState) => state.auth.isStored);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken && !isStored) {
      const userData = {
        name: session.user?.name,
        email: session.user?.email,
        provider: session.provider,
        avatar: session.user?.image || '',
        token: session.accessToken,
      };

      fetch(`${base_url}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      dispatch(
        loginUserAction({
          name: session.user.name || '',
          email: session.user.email || '',
          provider: session.provider,
          avatar: session.user.image || '',
          token: session.accessToken,
          isStored: true,
        }),
      );

      createToken(session.accessToken);
      router.refresh();
    } else if (status === 'unauthenticated') {
      dispatch(logoutUserAction());
      router.refresh();
    }
  }, [status, session, dispatch]);

  return <>{children}</>;
}
