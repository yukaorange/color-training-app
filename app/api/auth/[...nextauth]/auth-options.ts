import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { auth } from '@/app/api/firebase';

import type { NextAuthOptions } from 'next-auth';

// interface FirebaseToken {
//   firebaseToken?: string;
// }

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        try {
          if (credentials.action === 'register') {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          } else if (credentials.action === 'login') {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
            };
          } else {
            throw new Error('Invalid action');
          }
        } catch (error) {
          console.error('Error during email/password sign in:', error);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      // privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  }),
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        try {
          console.log('Attempting to create Firebase token');
          const firebaseToken = await getAuth().createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
          console.log('Firebase token created successfully');
        } catch (err) {
          console.error('Error caused when create Firebase custom token :', err);
        }
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
};
