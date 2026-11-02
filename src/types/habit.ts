export type HabitCategory = 
  | 'study' 
  | 'work' 
  | 'exercise' 
  | 'water' 
  | 'sleep' 
  | 'nutrition' 
  | 'mindfulness' 
  | 'custom';

export type TrackingType = 'boolean' | 'quantity' | 'duration';

export interface Habit {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: HabitCategory;
  trackingType: TrackingType;
  targetValue: number;
  unit?: string;
  frequency: 'daily' | 'weekly';
  completedDates?: string[];
  createdAt: string;
}

export interface DailyLog {
  id?: string;
  habitId: string;
  date: string;
  completed: boolean;
  value: number;
}