import { useSession, signIn, signOut } from 'next-auth/react';

export const LoginForm = () => {
  return (
    <>
      <button
        onClick={() => {
          signIn('google');
        }}
      >
        Sign in with Google
      </button>
    </>
  );
};
