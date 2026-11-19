import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export interface JournalEntry {
  id?: string;
  userId: string;
  date: string; // Format: YYYY-MM-DD
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  energy: number; // 1 to 5
  content: string;
  gratitude?: string;
  createdAt: string;
}

export const createJournalEntry = async (
  userId: string,
  entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>
) => {
  const journalRef = collection(db, 'users', userId, 'journal');
  return await addDoc(journalRef, {
    ...entry,
    userId,
    createdAt: new Date().toISOString(),
  });
};

export const getUserJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  const journalRef = collection(db, 'users', userId, 'journal');
  const q = query(journalRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
};

export const deleteJournalEntry = async (userId: string, entryId: string) => {
  const entryRef = doc(db, 'users', userId, 'journal', entryId);
  await deleteDoc(entryRef);
};