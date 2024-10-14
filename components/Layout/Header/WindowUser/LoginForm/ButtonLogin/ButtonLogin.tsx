import '@/components/Layout/Header/WindowUser/LoginForm/ButtonLogin/styles/button-login.scss';

interface ButtonLoginProps {
  onClick: () => void;
  text: string;
  variant?: 'login' | 'register' | 'google' | 'back';
}

export const ButtonLogin = ({ onClick, text, variant }: ButtonLoginProps) => {
  return (
    <button
      className={`button-login button-login--${variant} ${variant == 'google' ? '_en' : ''}`}
      onClick={onClick}
    >
      {variant === 'google' ? (
        <span>
          Sign in with
          <span> </span>
          <span className="button-login__char--google">G</span>
          <span className="button-login__char--google">o</span>
          <span className="button-login__char--google">o</span>
          <span className="button-login__char--google">g</span>
          <span className="button-login__char--google">l</span>
          <span className="button-login__char--google">e</span>
        </span>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};
