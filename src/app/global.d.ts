import NextAuth, { DefaultSession } from 'next-auth';

declare module '*.css';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface JWT {
    accessToken?: string;
    provider?: string;
  }
}