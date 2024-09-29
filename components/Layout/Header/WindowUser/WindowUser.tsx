'use client';

import '@/components/Layout/Header/WindowUser/styles/window-user.scss';
import '@/components/Layout/Header/WindowUser/styles/overlay-user.scss';

import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import { editorStore } from '@/store/editorStore';

const LoginForm = () => <div>Login Form</div>;
const RegisterForm = () => <div>Register Form</div>;
const UserInfoForm = () => <div>User Info Form</div>;

interface WindowUserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowUser = ({ isOpen, onClose }: WindowUserProps) => {
  const { isLoggedIn } = useSnapshot(editorStore);
  const [activeView, setActiveView] = useState<'login' | 'register' | 'userInfo'>(
    isLoggedIn ? 'userInfo' : 'login'
  );

  if (!isOpen) return null;

  return (
    <>
      <div className={`window-user ${isOpen ? 'window-user--is-open' : 'window-user--is-close'}`}>
        <div className="window-user__inner">
          <button onClick={onClose}>Close</button>
          {!isLoggedIn ? (
            <>
              {activeView === 'login' ? (
                <>
                  <LoginForm />
                  <button onClick={() => setActiveView('register')}>新規登録</button>
                </>
              ) : (
                <>
                  <RegisterForm />
                  <button onClick={() => setActiveView('login')}>ログイン</button>
                </>
              )}
            </>
          ) : (
            <UserInfoForm />
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
