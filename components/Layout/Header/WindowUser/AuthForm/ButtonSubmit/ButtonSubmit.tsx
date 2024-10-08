import '@/components/Layout/Header/WindowUser/AuthForm/ButtonSubmit/styles/button-submit.scss';

interface ButtonSubmitProps {
  onClick: () => void;
  text: string;
  variant?: 'login' | 'register' | 'google' | 'back';
}

export const ButtonSubmit = ({ onClick, text, variant }: ButtonSubmitProps) => {
  return (
    <button
      className={`button-submit button-submit--${variant} ${variant == 'google' ? '_en' : ''}`}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
};
