import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { getSession } from 'next-auth/react';

import { db } from '@/app/api/firebase';
import { editorStore , actions } from '@/store/editorStore';


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

interface UserData {
  archivedSets: { [key: string]: ArchivedSet };
  lastArchivedId: number;
  currentSetId: number | null;
}

async function getUserDocRef() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log('user not authenticated');
    return null;
  }

  const session = await getSession();

  console.log('session user :', session?.user);
  console.log('session user id :', session?.user?.id);

  if (!session?.user?.id) {
    // ユーザーがログインしていない場合、セッションストレージを使用
    console.log('User ID not found in session');
    return null;
  }

  const userDocRef = doc(db, 'users', session.user.id);

  // console.log('user document:', userDocRef);

  const userDocSnap = await getDoc(userDocRef);

  // console.log('user document snap is exist:', userDocSnap.exists());

  if (!userDocSnap.exists()) {
    console.log('User document does not exist.');

    await setDoc(userDocRef, { archivedSets: {}, lastArchivedId: 0, currentSetId: null });
  }

  return userDocRef;
}

function getSessionData(): UserData {
  // const sessionData = sessionStorage.getItem('userData');
  const sessionData = localStorage.getItem('userData');

  if (sessionData) {
    return JSON.parse(sessionData);
  }

  return { archivedSets: {}, lastArchivedId: 0, currentSetId: null };
}

function setSessionData(data: UserData) {
  // sessionStorage.setItem('userData', JSON.stringify(data));
  localStorage.setItem('userData', JSON.stringify(data));
}

/**
 * Create
 */
export const archiveCurrentSetToStore = async (newSet: ArchivedSet) => {
  try {
    const userDocRef = await getUserDocRef();

    if (userDocRef) {
      await updateDoc(userDocRef, {
        [`archivedSets.${newSet.id}`]: {
          ...newSet,
          createdAt: newSet.createdAt.toISOString(),
          modifiedAt: newSet.modifiedAt.toISOString(),
        },
        lastArchivedId: newSet.id,
        currentSetId: newSet.id,
      });
    } else {
      const sessionData = sessionStorage.getItem('userData') ?? '{}';
      const userData = JSON.parse(sessionData);
      userData.archivedSets = userData.archivedSets ?? {};
      userData.archivedSets[newSet.id] = {
        ...newSet,
        createdAt: newSet.createdAt.toISOString(),
        modifiedAt: newSet.modifiedAt.toISOString(),
      };
      userData.lastArchivedId = newSet.id;
      userData.currentSetId = newSet.id;
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    console.log('Archived set created successfully:', newSet);

    return newSet.id;
  } catch (err) {
    console.error('Error creating archived set:', err);
    throw err;
  }
};

/**
 * Read
 */
export const fetchUserData = async () => {
  try {
    const userDocRef = await getUserDocRef();

    let userData: UserData;

    if (!userDocRef) {
      console.log('user not authenticated , use session storage');
      userData = getSessionData();
    } else {
      console.log('user authenticated , use fireStore storage');

      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.log('user document does not exist in firestore , creating new document.');

        userData = {
          archivedSets: {},
          lastArchivedId: 0,
          currentSetId: null,
        };

        await setDoc(userDocRef, userData);
      } else {
        userData = userDocSnap.data() as UserData;
      }
    }

    console.log('User data:', userData);

    editorStore.currentSetId = userData.currentSetId ?? null;
    editorStore.lastArchivedId = userData?.lastArchivedId ?? 0;

    editorStore.archivedSets = Object.entries(userData?.archivedSets || {}).map(([id, data]) => {
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

    console.log('User data fetched:', editorStore);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Update
 */
export const updateArchivedSetInStore = async (updatedSet: ArchivedSet) => {
  try {
    const userDocRef = await getUserDocRef();

    if (userDocRef) {
      await updateDoc(userDocRef, {
        [`archivedSets.${updatedSet.id}`]: {
          ...updatedSet,
          createdAt: updatedSet.createdAt.toISOString(),
          modifiedAt: updatedSet.modifiedAt.toISOString(),
        },
        currentSetId: updatedSet.id,
      });
    } else {
      const userData = getSessionData();

      userData.archivedSets[updatedSet.id] = {
        ...updatedSet,
        createdAt: updatedSet.createdAt.toISOString() as unknown as Date,
        modifiedAt: updatedSet.modifiedAt.toISOString() as unknown as Date,
      };

      userData.currentSetId = updatedSet.id;
      setSessionData(userData);
    }

    console.log('Archived set updated successfully:', updatedSet);

    return updatedSet.id;
  } catch (err) {
    console.error("error is happened when update archived set in store(session or firebase)",err);
  }
};

/**
 * Delete
 */
export const deleteArchivedSetInStore = async (id: number) => {
  try {
    const userDocRef = await getUserDocRef();

    if (userDocRef) {
      await updateDoc(userDocRef, {
        [`archivedSets.${id}`]: deleteField(),
      });

      if (editorStore.currentSetId === id) {
        await updateDoc(userDocRef, { currentSetId: null });
      }
    } else {
      const userData = getSessionData();
      delete userData.archivedSets[id];
      if (userData.currentSetId === id) {
        userData.currentSetId = null;
      }
      setSessionData(userData);
    }

    console.log('Archived set deleted successfully:', id);
    return id;
  } catch (err) {
    console.error('Error deleting archived set:', err);
    throw err;
  }
};
