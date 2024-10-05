import { cert } from 'firebase-admin/app';

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

export const firestore = {
  credential: cert(serverFirebaseConfig),
};

