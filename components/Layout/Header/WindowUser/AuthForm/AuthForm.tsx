import '@/components/Layout/Header/WindowUser/AuthForm/styles/auth-form.scss';
import { ButtonLogin } from '@/components/Layout/Header/WindowUser/LoginForm/ButtonLogin/ButtonLogin';

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

export const AuthForm = ({
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
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
        className="auth-form__input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        required
        className="auth-form__input"
      />
      {errorMessage && <p className="auth-form__error-message">{errorMessage}</p>}
      {successMessage && <p className="auth-form__success-message">{successMessage}</p>}
      <button
        type="submit"
        className={`button-login ${authMode == 'login' ? 'button-login--login' : 'button-login--register'}`}
      >
        {authMode === 'register' ? '登録' : 'ログイン'}
      </button>
      <ButtonLogin onClick={() => setAuthMode('initial')} variant="back" text={'戻る'} />
    </form>
  );
};
