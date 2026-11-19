import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Habit {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: 'study' | 'work' | 'exercise' | 'water' | 'sleep' | 'nutrition' | 'mindfulness' | 'custom';
  trackingType: 'boolean' | 'quantity' | 'duration';
  targetValue: number;
  unit?: string;
  frequency: 'daily' | 'weekly';
  completedDates?: string[];
  createdAt: string;
}

export interface DailyLog {
  id?: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value: number;
}

export const createHabit = async (
  userId: string,
  habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'completedDates'>
) => {
  const habitsRef = collection(db, 'users', userId, 'habits');
  return await addDoc(habitsRef, {
    ...habitData,
    userId,
    completedDates: [],
    createdAt: new Date().toISOString(),
  });
};

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habitsRef = collection(db, 'users', userId, 'habits');
  const snapshot = await getDocs(habitsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
};

export const toggleHabitCompletion = async (
  userId: string,
  habitId: string,
  dateStr: string,
  completed: boolean
) => {
  const habitRef = doc(db, 'users', userId, 'habits', habitId);
  const snap = await getDoc(habitRef);
  if (!snap.exists()) return;

  const habit = snap.data() as Habit;
  let completedDates = habit.completedDates || [];

  if (completed) {
    if (!completedDates.includes(dateStr)) {
      completedDates.push(dateStr);
    }
  } else {
    completedDates = completedDates.filter(d => d !== dateStr);
  }

  await updateDoc(habitRef, { completedDates });
};

export const getDailyLogsForDate = async (userId: string, dateStr: string): Promise<Record<string, DailyLog>> => {
  const habits = await getUserHabits(userId);
  const logsMap: Record<string, DailyLog> = {};

  habits.forEach(habit => {
    if (habit.id) {
      const isCompleted = habit.completedDates?.includes(dateStr) || false;
      logsMap[habit.id] = {
        habitId: habit.id,
        date: dateStr,
        completed: isCompleted,
        value: isCompleted ? habit.targetValue : 0,
      };
    }
  });

  return logsMap;
};

export const getDailyLogsForDateRange = async (userId: string, startDate: string, endDate: string): Promise<DailyLog[]> => {
  const habits = await getUserHabits(userId);
  const logs: DailyLog[] = [];

  habits.forEach(habit => {
    if (habit.id && habit.completedDates) {
      habit.completedDates.forEach(date => {
        if (date >= startDate && date <= endDate) {
          logs.push({
            habitId: habit.id!,
            date,
            completed: true,
            value: habit.targetValue,
          });
        }
      });
    }
  });

  return logs;
};

export const logHabitProgress = async (
  userId: string,
  habitId: string,
  dateStr: string,
  value: number,
  targetValue: number
) => {
  const completed = value >= targetValue;
  await toggleHabitCompletion(userId, habitId, dateStr, completed);
};

export const deleteHabit = async (userId: string, habitId: string) => {
  const habitRef = doc(db, 'users', userId, 'habits', habitId);
  await deleteDoc(habitRef);
};