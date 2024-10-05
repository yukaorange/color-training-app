import NextAuth, { NextAuthOptions } from 'next-auth'; //認証プロバイダ統合ライブラリ
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';
import { firestore } from '@/app/api/admin';
import { auth } from '@/app/api/firebase';
import { getAuth } from 'firebase-admin/auth';

/**
 * document
 *  https://next-auth.js.org/configuration/options
 *  https://authjs.dev/getting-started/adapters/firebase
 * https://firebase.google.com/docs/auth/web/start?hl=ja
 * https://next-auth.js.org/providers/credentials
 * https://zenn.dev/tentel/articles/cc76611f4010c9
 */
interface FirebaseToken {
  firebaseToken?: string;
}
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
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: {
          label: 'Action',
          type: 'text',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        try {
          if (credentials.action === 'register') {
            // Firebaseの認証システムを使用して、メールアドレスとパスワードでユーザーを作成する
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
            // Firebaseの認証システムを使用して、メールアドレスとパスワードでユーザーを認証する
            // 認証に成功すると、ユーザーの認証情報（userCredential）が返される
            const userCredential = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            // 認証成功時、ユーザー情報を含むオブジェクトを返す
            // このオブジェクトはNextAuthのセッションに保存される
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
  //認証情報をfirestoreに保存できるようにする
  adapter: FirestoreAdapter(firestore),
  //認証情報をJWTに変換する
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
    maxAge: 30 * 24 * 60 * 60, // 30日間有効
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
