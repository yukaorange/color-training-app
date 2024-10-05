'use client';

import '@/components/Layout/Header/WindowUser/styles/window-user.scss';
import '@/components/Layout/Header/WindowUser/styles/overlay-user.scss';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSnapshot } from 'valtio';
import { editorStore } from '@/store/editorStore';
import { LoginForm } from '@/components/Layout/Header/WindowUser/LoginForm/LoginForm';
import { UserInfo } from '@/components/Layout/Header/WindowUser/UserInfo/UserInfo';

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
          {status === 'loading' ? (
            <div className="_en">Loading...</div>
          ) : status === 'authenticated' ? (
            <UserInfo user={session.user} onSignOut={handleSignOut} />
          ) : (
            <LoginForm />
          )}
        </div>
        <div className="window-user__corner">
          <Corner />
        </div>
        <div className="window-user__close">
          <ButtonClose onClick={onClose} />
        </div>
      </div>
      <div
        className={`overlay-user ${isOpen ? 'overlay-user--is-open' : 'overlay-user--is-close'}`}
        onClick={onClose}
      ></div>
    </>
  );
};

const Corner = () => {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V40L40 0H0Z" fill="#5f5f5f" />
    </svg>
  );
};

const ButtonClose = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      id="button-close"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 41.5 41.5"
      width={41.5}
      height={41.5}
      className="button-close"
      onClick={onClick}
    >
      <defs>
        <style>
          {`
          .cls-1 {
            fill: none;
            stroke: currentColor;
            stroke-linecap: round;
            stroke-miterlimit: 10;
            stroke-width: 1.5px;
          }
        `}
        </style>
      </defs>
      <g id="" data-name="">
        <g id="button-close__lines">
          <line className="cls-1" x1=".75" y1=".75" x2="17.42" y2="17.42" />
          <line className="cls-1" x1="24.08" y1="17.42" x2="40.75" y2=".75" />
          <line className="cls-1" x1="24.08" y1="24.08" x2="40.75" y2="40.75" />
          <line className="cls-1" x1=".75" y1="40.75" x2="17.42" y2="24.08" />
        </g>
      </g>
    </svg>
  );
};
