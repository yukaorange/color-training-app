import NextAuth, { Account, NextAuthOptions } from 'next-auth'; //認証プロバイダ統合ライブラリ
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serverFirebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

if (
  !serverFirebaseConfig.projectId ||
  !serverFirebaseConfig.clientEmail ||
  !serverFirebaseConfig.privateKey
) {
  console.error('Missing serverFirebaseConfig');
  throw new Error('Missing serverFirebaseConfig');
}

const firestore = {
  credential: cert(serverFirebaseConfig),
};

interface FirebaseToken {
  firebaseToken?: string;
}

/**
 * document
 *  https://next-auth.js.org/configuration/options
 *  https://authjs.dev/getting-started/adapters/firebase
 * https://firebase.google.com/docs/auth/web/start?hl=ja
 */
export const authOptions: NextAuthOptions = {
  providers: [
    //ユーザーはgoogleアカウントでログイン可能になる
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent', //毎回ユーザーに許可を求める
          access_type: 'offline', //リフレッシュトークンを取得する
          response_type: 'code', //許可コードを取得
        },
      },
    }),
  ],
  //認証情報をfirestoreに保存できるようにする
  adapter: FirestoreAdapter(firestore),
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      console.log('JWT callback fired:', token);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッションが作成・更新されるたびに呼び出される
    async session({
      session,
      token,
    }: {
      session: Session & FirebaseToken;
      token: JWT;
    }): Promise<Session & FirebaseToken> {
      console.log('session token:', token);
      if (session?.user && token?.sub) {
        session.user.id = token.sub; //ユーザーIDをセッションに追加
        try {
          console.log('my id :', token.sub);
          const firebaseToken = await getAuth().createCustomToken(token.sub); //クライアントサイドでfirebase認証を行うために使用するトークンを作成し、
          session.firebaseToken = firebaseToken; //sesssionに追加。
        } catch (err) {
          console.error('Error caused when create Firebase custom token :', err);
        }
      }
      console.log('session:', session);
      return session; //セッション情報を返す(このユーザー情報を利用して、fireStoreからユーザーのデータを取り出す。)
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
