'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { actions } from '@/store/editorStore';

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { setLoggedIn } = actions;

  useEffect(() => {
    setLoggedIn(status === 'authenticated');
  }, [status]);

  return <>{children}</>;
};
