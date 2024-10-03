'use client';

import { SessionProvider } from 'next-auth/react';
import { Auth } from '@/components/Auth/Auth';

export default function ClientProvider({ children, session }: any) {
  return (
    <SessionProvider session={session}>
      <Auth>{children}</Auth>
    </SessionProvider>
  );
}
