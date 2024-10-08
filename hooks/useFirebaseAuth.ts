import { signInWithCustomToken, User } from 'firebase/auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { auth } from '@/app/api/firebase';

declare module 'next-auth' {
  interface Session {
    firebaseToken?: string;
  }
}

export function useFirebaseAuth() {
  const { data: session } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.firebaseToken) {
      signInWithCustomToken(auth, session.firebaseToken)
        .then((userCredential) => {
          setFirebaseUser(userCredential.user);
        })
        .catch((error) => {
          console.error('Firebase authentication error:', error);
        });
    }
  }, [session]);

  return { firebaseUser };
}
