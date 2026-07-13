import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    {
      headers: {
        'Set-Cookie':
          'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict; Secure',
      },
    },
  );
  response.cookies.set('token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
