import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired: number;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  unlockedBadges: string[];
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit check-in',
    icon: 'Footprints',
    xpRequired: 10,
  },
  {
    id: 'consistency_novice',
    title: 'Consistency Novice',
    description: 'Maintain a 3-day completion streak',
    icon: 'Flame',
    xpRequired: 50,
  },
  {
    id: 'habit_warrior',
    title: 'Habit Warrior',
    description: 'Maintain a 7-day completion streak',
    icon: 'Zap',
    xpRequired: 150,
  },
  {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Complete your first major goal',
    icon: 'Target',
    xpRequired: 300,
  },
  {
    id: 'flow_master',
    title: 'Flow Master',
    description: 'Reach 500 Total XP points',
    icon: 'Trophy',
    xpRequired: 500,
  },
];

// Fetch or initialize user stats in Firestore
export const getUserStats = async (userId: string): Promise<UserStats> => {
  const statsRef = doc(db, 'users', userId, 'gamification', 'stats');
  const snap = await getDoc(statsRef);
  
  if (snap.exists()) {
    return snap.data() as UserStats;
  }
  
  const initialStats: UserStats = {
    xp: 0,
    level: 1,
    currentStreak: 0,
    bestStreak: 0,
    unlockedBadges: [],
  };
  
  await setDoc(statsRef, initialStats);
  return initialStats;
};