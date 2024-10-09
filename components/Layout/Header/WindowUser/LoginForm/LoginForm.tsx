import '@/components/Layout/Header/WindowUser/LoginForm/styles/login-form.scss';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { AuthForm } from '@/components/Layout/Header/WindowUser/AuthForm/AuthForm';
import { ButtonLogin } from '@/components/Layout/Header/WindowUser/LoginForm/ButtonLogin/ButtonLogin';
import { waitingActions } from '@/store/waitingStore';

interface LoginFormProps {
  onAuthSuccess: () => void;
}

export const LoginForm = ({ onAuthSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'initial') return;

    setErrorMessage('');
    waitingActions.setIsWaiting(true);
    try {
      const response = await signIn('credentials', {
        email,
        password,
        action: authMode,
        redirect: false,
      });

      if (response?.error) {
        console.error('Authentication error:', response.error);
        if (authMode === 'login' && response.error === 'CredentialsSignin') {
          setErrorMessage('メールアドレスまたはパスワードが正しくありません。');
        } else if (authMode === 'register' && response.error === 'CredentialsSignin') {
          setErrorMessage('このメールアドレスは既に登録されています。');
        } else {
          setErrorMessage('認証エラーが発生しました。再度お試しください。');
        }
      } else {
        setEmail('');
        setPassword('');
        onAuthSuccess();
      }
    } catch (err) {
      console.log(err);
    } finally {
      waitingActions.setIsWaiting(false);
    }
  };

  const handleGoogleSignIn = () => {
    waitingActions.setIsWaiting(true);
    signIn('google');
    // waitingActions.setIsWaiting(false);
  };

  return (
    <div className="login-form">
      <div className="login-form__inner">
        <div className="login-form__header">
          <h2 className="login-form__title">
            {authMode === 'initial'
              ? 'アカウント'
              : authMode === 'register'
                ? '新規登録'
                : 'ログイン'}
          </h2>
        </div>
        {authMode === 'initial' ? (
          <div className="login-form__form">
            <div className="login-form__buttons">
              <InitialButtons setAuthMode={setAuthMode} />
            </div>
            <div className="login-form__button-google">
              <ButtonLogin
                onClick={handleGoogleSignIn}
                text={'Google Sign In'}
                variant={'google'}
              />
            </div>
          </div>
        ) : (
          <AuthForm
            authMode={authMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            setAuthMode={setAuthMode}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        )}
      </div>
    </div>
  );
};

interface initialButtonProps {
  setAuthMode: (mode: AuthMode) => void;
}

const InitialButtons = ({ setAuthMode }: initialButtonProps) => {
  return (
    <>
      <ButtonLogin onClick={() => setAuthMode('login')} text={'ログイン'} variant={'login'} />
      <ButtonLogin onClick={() => setAuthMode('register')} text={'新規登録'} variant={'register'} />
    </>
  );
};
