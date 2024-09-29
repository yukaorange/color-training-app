import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { editorStore } from '@/store/editorStore';
import { actions } from '@/store/editorStore';
import { create, update } from 'lodash';

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

const USER_ID = 'userId'; // Should replace 'userId' to the actual user ID

export const fetchUserData = async () => {
  const userDocRef = doc(db, 'users', USER_ID);
  const userDocSnap = await getDoc(userDocRef);

  try {
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      editorStore.currentSetId = userData.currentSetId ?? null;
      editorStore.lastArchivedId = userData.lastArchivedId ?? 0;

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

      if (editorStore.currentSetId !== null) {
        const currentSet = editorStore.archivedSets.find((set) => {
          return set.id === editorStore.currentSetId;
        });

        if (currentSet) {
          // console.log('Current set found:', currentSet, '\n', 'currentSet.id:', currentSet.id);

          actions.loadArchivedSet(currentSet.id);
        }
      }

      // console.log('User data fetched successfully:', editorStore);
    } else {
      actions.resetToInitial();

      console.log('User document does not exist. Initializing with empty data.');
    }
  } catch (err) {
    console.error(err);
  }
};

export const archiveCurrentSetToStore = async (newSet: ArchivedSet) => {
  try {
    const userDocRef = doc(db, 'users', USER_ID);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      await updateDoc(userDocRef, {
        [`archivedSets.${newSet.id}`]: {
          ...newSet,
          createdAt: newSet.createdAt.toISOString(),
          modifiedAt: newSet.modifiedAt.toISOString(),
        },
        lastArchivedId: newSet.id,
        currentSetId: newSet.id,
      });

      console.log('Archived set created successfully:', newSet);
      return newSet.id;
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (err) {
    console.error('Error creating archived set:', err);
    throw err;
  }
};

export const updateArchivedSetInStore = async (updatedSet: ArchivedSet) => {
  try {
    const userDocRef = doc(db, 'users', USER_ID);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, {
        [`archivedSets.${updatedSet.id}`]: {
          ...updatedSet,
          createdAt: updatedSet.createdAt.toISOString(),
          modifiedAt: updatedSet.modifiedAt.toISOString(),
        },
        currentSetId: updatedSet.id,
      });

      console.log('Archived set updated successfully:', updatedSet);
      return updatedSet.id;
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteArchivedSet = async () => {};
