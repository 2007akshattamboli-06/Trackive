import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserHabits, toggleHabitCompletion } from '../services/habitService';
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
  Settings2,
  Eye,
  EyeOff,
  Droplet,
  Dumbbell
} from 'lucide-react';

export interface WidgetPreferences {
  water: boolean;
  pomodoro: boolean;
  fitness: boolean;
}

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);

  // Quick Tracker States
  const [waterAmount, setWaterAmount] = useState<number>(0);

  // Widget Preferences State (Saved in LocalStorage)
  const [widgetPrefs, setWidgetPrefs] = useState<WidgetPreferences>(() => {
    const saved = localStorage.getItem('habitflow_widget_prefs');
    return saved
      ? JSON.parse(saved)
      : { water: true, pomodoro: true, fitness: true };
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserHabits(currentUser.uid);
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

  const toggleWidget = (key: keyof WidgetPreferences) => {
    const updated = { ...widgetPrefs, [key]: !widgetPrefs[key] };
    setWidgetPrefs(updated);
    localStorage.setItem('habitflow_widget_prefs', JSON.stringify(updated));
  };

  const handleToggle = async (habitId?: string, currentCompleted?: boolean) => {
    if (!currentUser || !habitId) return;
    try {
      await toggleHabitCompletion(currentUser.uid, habitId, todayStr, !currentCompleted);
      await loadData();
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  // Summary Metrics
  const activeHabits = habits.length;
  const completedToday = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const completionRate = activeHabits > 0 ? Math.round((completedToday / activeHabits) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header & Customization Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Summary</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track daily active habits, customize widgets, and maintain consistency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Customize Widgets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              title="Customize Visible Widgets"
            >
              <Settings2 className="w-4 h-4 text-teal-400" /> Customize Widgets
            </button>

            {isWidgetMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                  Toggle Widgets
                </div>
                {(Object.keys(widgetPrefs) as Array<Extract<keyof WidgetPreferences, string>>).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleWidget(key)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/50 text-xs text-slate-200 capitalize cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {key === 'water' && <Droplet className="w-3.5 h-3.5 text-cyan-400" />}
                      {key === 'pomodoro' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      {key === 'fitness' && <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />}
                      {key} Tracker
                    </span>
                    {widgetPrefs[key] ? (
                      <Eye className="w-4 h-4 text-teal-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add New Habit
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
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

      {/* Active Habits Section */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400" /> Today's Active Habits
        </h2>

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
                <div
                  key={habit.id}
                  className="py-3.5 flex items-center justify-between gap-4 group"
                >
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
                      {habit.description && (
                        <p className="text-xs text-slate-400">{habit.description}</p>
                      )}
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

      {/* Customizable Category Trackers Grid */}
      {(widgetPrefs.water || widgetPrefs.pomodoro || widgetPrefs.fitness) && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Quick Category Trackers & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgetPrefs.water && (
              <WaterTracker
                currentValue={waterAmount}
                targetValue={2500}
                onUpdate={(val) => setWaterAmount(val)}
              />
            )}
            {widgetPrefs.pomodoro && <PomodoroTimer />}
            {widgetPrefs.fitness && (
              <FitnessTracker onLogWorkout={(cat, min) => console.log('Logged:', cat, min)} />
            )}
          </div>
        </div>
      )}

      {/* Habit Creation Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitAdded={loadData}
      />
    </div>
  );
};