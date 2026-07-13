'use client';

import { deleteToken, getToken } from '@/lib/server';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function LoginLogoutHidde() {
  const router = useRouter();

  const [token, setToken] = useState('');

  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };
  const author = useAppSelector((state) => state.author);

  const onLogout = async () => {
    await deleteToken();
    setToken('');
    Cookies.remove('token');
    await signOut({ redirect: false });

    router.refresh();
    router.push('/');
  };
  const onLogin = async () => {
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div>
        {token ? (
          <div onClick={onLogout}>
            <div onClick={() => signOut()}>LogOut</div>
          </div>
        ) : (
          <div onClick={onLogin} className="">
            LogIn
          </div>
        )}
      </div>
    </>
  );
}
