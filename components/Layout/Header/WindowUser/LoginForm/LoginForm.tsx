import '@/components/Layout/Header/WindowUser/LoginForm/styles/login-form.scss';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { ButtonLogin } from '@/components/Layout/Header/WindowUser/LoginForm/ButtonLogin/ButtonLogin';
import { auth } from 'firebase-admin';

type AuthMode = 'login' | 'register' | 'initial';

interface initialButtonProps {
  setAuthMode: (mode: AuthMode) => void;
}

const InitialButtons = ({ setAuthMode }: initialButtonProps) => {
  return (
    <>
      <button onClick={() => setAuthMode('login')} className="button-login">
        ログイン
      </button>
      <button onClick={() => setAuthMode('register')} className="button-login">
        新規登録
      </button>
    </>
  );
};

interface AuthFormProps {
  authMode: AuthMode;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setAuthMode: (mode: AuthMode) => void;
  errorMessage: string;
  successMessage: string;
}

const AuthForm = ({
  authMode,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  setAuthMode,
  errorMessage,
  successMessage,
}: AuthFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        required
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button
        type="submit"
        className={`button-login ${authMode == 'login' ? 'button-login--login' : 'button-login--register'}`}
      >
        {authMode === 'register' ? '登録' : 'ログイン'}
      </button>
      <button onClick={() => setAuthMode('initial')} type="button">
        戻る
      </button>
    </form>
  );
};

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'initial') return;

    setErrorMessage('');

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
      } else if (authMode === 'register' && response.error === 'UserExists') {
        setErrorMessage('このメールアドレスは既に登録されています。');
      } else {
        setErrorMessage('認証エラーが発生しました。再度お試しください。');
      }
    } else {
      setEmail('');
      setPassword('');
    }
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
        <div className="login-form__form">
          {authMode === 'initial' ? (
            <InitialButtons setAuthMode={setAuthMode} />
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
        <div className="login-form__buttons">
          <ButtonLogin
            onClick={() => {
              signIn('google');
            }}
            text={'Sign In With Google'}
          />
        </div>
      </div>
    </div>
  );
};
