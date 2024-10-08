'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { actions } from '@/store/editorStore';

/**
 * nextauthとfirebaseの認証をここで統合
 */
export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const { firebaseUser } = useFirebaseAuth();
  const { setLoggedIn } = actions;

  useEffect(() => {
    setLoggedIn(status === 'authenticated' && !!firebaseUser);
  }, [status, firebaseUser]);

  return <>{children}</>;
};
