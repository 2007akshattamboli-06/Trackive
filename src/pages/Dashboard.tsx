import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getHabits, toggleHabitCompletion } from '../services/habitService';
import type { Habit } from '../types/habit';
import { WaterTracker } from '../components/trackers/WaterTracker';
import { PomodoroTimer } from '../components/trackers/PomodoroTimer';
import { FitnessTracker } from '../components/trackers/FitnessTracker';
import { HabitModal } from '../components/forms/HabitModal';
import {
  CheckCircle2,
  Circle,
  Flame,
  PlusCircle,
  TrendingUp,
  Target,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Persistent Water Intake & Custom Target
  const [waterAmount, setWaterAmount] = useState<number>(() => {
    const saved = localStorage.getItem(`trackive_water_${todayStr}`);
    return saved ? Number(saved) : 0;
  });

  const [waterTarget, setWaterTarget] = useState<number>(() => {
    const saved = localStorage.getItem('trackive_water_target');
    return saved ? Number(saved) : 2500;
  });

  useEffect(() => {
    localStorage.setItem(`trackive_water_${todayStr}`, String(waterAmount));
  }, [waterAmount, todayStr]);

  useEffect(() => {
    localStorage.setItem('trackive_water_target', String(waterTarget));
  }, [waterTarget]);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getHabits(currentUser.uid);
      setHabits(data || []);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleToggle = async (habitId?: string, currentCompleted?: boolean) => {
    if (!currentUser || !habitId) return;
    try {
      await toggleHabitCompletion(currentUser.uid, habitId, todayStr, !currentCompleted);
      await loadData();
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  const activeHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedDates?.includes(todayStr)).length;
  const completionRate = activeHabits > 0 ? Math.round((completedToday / activeHabits) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header & Add Habit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Summary</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track daily active habits and maintain consistency.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add New Habit
          </button>
        </div>
      </div>

      {/* 1. Today's Active Habits (At the Top) */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" /> Today's Active Habits
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {completedToday} / {activeHabits} Completed
          </span>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm py-8 text-center animate-pulse">
            Loading active habits...
          </div>
        ) : habits.length === 0 ? (
          <div className="text-slate-400 text-sm py-8 text-center bg-slate-900/40 rounded-xl border border-slate-700/50">
            No habits created yet. Click <span className="text-teal-400 font-semibold">"+ Add New Habit"</span> to start!
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {habits.map((habit) => {
              const isDone = habit.completedDates?.includes(todayStr) || false;
              return (
                <div key={habit.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(habit.id, isDone)}
                      className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-teal-400 fill-teal-400/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500 hover:text-teal-400" />
                      )}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                        {habit.title}
                      </h4>
                      {habit.description && <p className="text-xs text-slate-400">{habit.description}</p>}
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-medium capitalize">
                    {habit.category}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Habits</span>
            <Target className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{activeHabits}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</span>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{completedToday}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-300 mt-2">{completionRate}%</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300 mt-2">
            {completedToday > 0 ? '1 Day' : '0 Days'}
          </p>
        </div>
      </div>

      {/* 3. Quick Category Trackers & Tools */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" /> Quick Category Trackers & Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WaterTracker
            currentValue={waterAmount}
            targetValue={waterTarget}
            onUpdate={(val) => setWaterAmount(val)}
            onTargetChange={(newTarget) => setWaterTarget(newTarget)}
          />
          <PomodoroTimer />
          <FitnessTracker />
        </div>
      </div>

      {/* Habit Creation Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitAdded={loadData}
      />
    </div>
  );
};