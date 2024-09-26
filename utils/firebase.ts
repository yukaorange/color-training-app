import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { editorStore } from '@/store/editorStore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface CellColors {
  square: string;
  circle: string;
}

interface HistoryEntry {
  cellColors: CellColors[];
}

interface ArchivedSet {
  id: number;
  title: string;
  cellColors: CellColors[];
  createdAt: Date;
  modifiedAt: Date;
  history: HistoryEntry[];
  historyIndex: number;
}

const DOCUMENT = 'userId';
const USER_ID = 'takaoka';

export const fetchUserData = async () => {
  try {
    const userDocRef = doc(db, 'users', DOCUMENT);

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      editorStore.currentSetId = userData.currentSetId || -1;
      editorStore.lastArchivedId = userData.lastArchivedId || -1;

      editorStore.archivedSets = Object.entries(userData.archivedSets || {}).map(([id, data]) => {
        const archivedSet = data as ArchivedSet;

        return {
          ...archivedSet,
          id: parseInt(id),
          createdAt:
            archivedSet.createdAt instanceof Date
              ? archivedSet.createdAt
              : new Date(archivedSet.createdAt),
          modifiedAt:
            archivedSet.modifiedAt instanceof Date
              ? archivedSet.modifiedAt
              : new Date(archivedSet.modifiedAt),
        };
      });

      console.log('User data fetched successfully:', editorStore);
    } else {
      await setDoc(userDocRef, {
        currentSetId: -1,
        lastArchivedId: -1,
        archivedSets: {},
      });
      editorStore.currentSetId = -1;
      editorStore.lastArchivedId = -1;
      editorStore.archivedSets = [];

      console.log('New user document created');
    }
  } catch (err) {
    console.error(err);
  }
};

export const createArchivedSet = async (newSet: ArchivedSet) => {
  try {
    const userDocRef = doc(db, 'users', DOCUMENT);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const newLastArchivedId = Math.max(userData.lastArchivedId || 0, newSet.id);

      await updateDoc(userDocRef, {
        [`archivedSets.${newSet.id}`]: newSet,
        currentSetId: newSet.id,
        lastArchivedId: newLastArchivedId,
      });

      console.log('New archived set created:', newSet);
      return newLastArchivedId;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (err) {
    console.error('Error creating archived set:', err);
    throw err;
  }
};

export const updateArchivedSet = async (
  id: number,
  updates: Partial<Omit<ArchivedSet, 'id' | 'createdAt'>>
) => {
  try {
    const userDocRef = doc(db, 'users', DOCUMENT);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const now = new Date();
      const updatedSet = {
        ...updates,
        modifiedAt: now,
      };

      await updateDoc(userDocRef, {
        [`archivedSets.${id}`]: updatedSet,
      });

      console.log('Archived set updated in Firestore:', id);
      return updatedSet;
    } else {
      throw new Error('User document does not exist');
    }
  } catch (err) {
    console.error('Error updating archived set:', err);
    throw err;
  }
};

export const deleteArchivedSet = async (id: number) => {
  try {
    const userDocRef = doc(db, 'users', DOCUMENT);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, {
        [`archivedSets.${id}`]: deleteField(),
      });

      const userData = userDocSnap.data();
      if (userData.currentSetId === id) {
        await updateDoc(userDocRef, { currentSetId: -1 });
      }

      console.log('Archived set deleted:', id);
    } else {
      throw new Error('User document does not exist');
    }
  } catch (err) {
    console.error('Error deleting archived set:', err);
    throw err;
  }
};

export const setCurrentSetId = async (id: number) => {
  try {
    const userDocRef = doc(db, 'users', DOCUMENT);
    await updateDoc(userDocRef, { currentSetId: id });
    editorStore.currentSetId = id;
    console.log('Current set ID updated:', id);
  } catch (err) {
    console.error('Error updating current set ID:', err);
    throw err;
  }
};
