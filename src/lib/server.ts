'use server';

import { cookies } from 'next/headers';

export async function createToken(token: string) {

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    path: '/',
    expires: Date.now() + 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token;
}

export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
