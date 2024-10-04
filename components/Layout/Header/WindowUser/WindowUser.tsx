'use client';

import '@/components/Layout/Header/WindowUser/styles/window-user.scss';
import '@/components/Layout/Header/WindowUser/styles/overlay-user.scss';

import React, { useState } from 'react';
import { useSession,  signOut } from 'next-auth/react';
import { useSnapshot } from 'valtio';
import { editorStore } from '@/store/editorStore';

import { LoginForm } from '@/components/Layout/Header/WindowUser/LoginForm/LoginForm';

const UserInfo = ({ user, onSignOut }: { user: any; onSignOut: () => void }) => {
  return (
    <div className="">
      <div>Signed in as {user.email}</div>
      <button className="" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
};

interface WindowUserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowUser = ({ isOpen, onClose }: WindowUserProps) => {
  const { data: session, status } = useSession();
  const { isLoggedIn } = useSnapshot(editorStore);
  const [activeView, setActiveView] = useState<'login' | 'register' | 'userInfo'>(
    isLoggedIn ? 'userInfo' : 'login'
  );

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`window-user ${isOpen ? 'window-user--is-open' : 'window-user--is-close'}`}>
        <div className="window-user__inner">
          <button onClick={onClose}>Close</button>
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : status === 'authenticated' ? (
            <UserInfo user={session.user} onSignOut={handleSignOut} />
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
      <div
        className={`overlay-user ${isOpen ? 'overlay-user--is-open' : 'overlay-user--is-close'}`}
        onClick={onClose}
      ></div>
    </>
  );
};
