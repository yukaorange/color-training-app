import '@/components/Layout/Header/WindowUser/LoginForm/ButtonLogin/styles/button-login.scss';

interface ButtonLoginProps {
  onClick: () => void;
  text: string;
}

export const ButtonLogin = ({ onClick, text }: ButtonLoginProps) => {
  return (
    <button className="button-login _en" onClick={onClick}>
      {text}
    </button>
  );
};
