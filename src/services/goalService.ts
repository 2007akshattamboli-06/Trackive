import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  createdAt: string;
}

// 1. Create a New Goal
export const createGoal = async (
  userId: string,
  goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>
) => {
  const goalsRef = collection(db, 'users', userId, 'goals');
  return await addDoc(goalsRef, {
    ...goalData,
    userId,
    createdAt: new Date().toISOString(),
  });
};

// 2. Fetch User Goals
export const getUserGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = collection(db, 'users', userId, 'goals');
  const snapshot = await getDocs(goalsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
};

// 3. Update Goal / Toggle Milestone
export const updateGoal = async (userId: string, goalId: string, updatedData: Partial<Goal>) => {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  await setDoc(goalRef, updatedData, { merge: true });
};

// 4. Delete Goal
export const deleteGoal = async (userId: string, goalId: string) => {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  await deleteDoc(goalRef);
};