// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    firebaseToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare global {
  type AuthMode = 'login' | 'register' | 'initial';
}
