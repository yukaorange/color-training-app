import '@/components/Layout/Header/WindowUser/AuthForm/styles/auth-form.scss';

import { useEffect, useState } from 'react';

import { ButtonSubmit } from './ButtonSubmit/ButtonSubmit';

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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    console.log(email.length);

    if (!re.test(email)) {
      if (email.length !== 0) {
        setEmailError('有効なメールアドレスを入力してください');
      } else {
        setEmailError('');
      }

      return false;
    }

    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      if (password.length !== 0) {
        setPasswordError('パスワードは6文字以上である必要があります。');
      } else {
        setPasswordError('');
      }
      return false;
    }
    if (password.length > 21) {
      setPasswordError('パスワードは20文字以内である必要があります。');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('パスワードには少なくとも1つの数字を含める必要があります。');
      return false;
    }

    setPasswordError('');
    return true;
  };

  useEffect(() => {
    const isValid = validateEmail(email) && validatePassword(password);

    setIsFormValid(isValid);
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <div className="auth-form__field">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="メールアドレス"
          required
          className={`auth-form__input ${emailError ? 'auth-form__input--error' : ''}`}
        />
        {emailError && (
          <p className="auth-form__error-message auth-form__error-message--input">{emailError}</p>
        )}
      </div>
      <div className="auth-form__field">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="パスワード"
          required
          className={`auth-form__input ${passwordError ? 'auth-form__input--error' : ''}`}
        />
        {passwordError && (
          <p className="auth-form__error-message auth-form__error-message--input">
            {passwordError}
          </p>
        )}
      </div>
      {errorMessage && <p className="auth-form__error-message">{errorMessage}</p>}
      {successMessage && <p className="auth-form__success-message">{successMessage}</p>}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`button-submit ${authMode == 'login' ? 'button-submit--login' : 'button-submit--register'} ${!isFormValid && 'button-submit--disabled'}`}
      >
        {authMode === 'register' ? '登録' : 'ログイン'}
      </button>
      <ButtonSubmit onClick={() => setAuthMode('initial')} variant="back" text={'戻る'} />
    </form>
  );
};
