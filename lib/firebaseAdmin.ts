import * as admin from 'firebase-admin';

console.log('FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY?.length);
console.log(
  'FIREBASE_PRIVATE_KEY first 10 chars:',
  process.env.FIREBASE_PRIVATE_KEY?.substring(0, 10)
);
console.log(
  'FIREBASE_PRIVATE_KEY last 10 chars:',
  process.env.FIREBASE_PRIVATE_KEY?.substring(process.env.FIREBASE_PRIVATE_KEY?.length - 10)
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
