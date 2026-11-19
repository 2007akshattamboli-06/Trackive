import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserHabits, getDailyLogsForDate, logHabitProgress } from '../services/habitService';
import type { Habit, DailyLog } from '../types/habit';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Plus, Minus, Search } from 'lucide-react';

export const DailyTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadDailyData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [userHabits, dailyLogs] = await Promise.all([
        getUserHabits(currentUser.uid),
        getDailyLogsForDate(currentUser.uid, selectedDate)
      ]);
      setHabits(userHabits);
      setLogs(dailyLogs);
    } catch (err) {
      console.error('Error loading daily tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyData();
  }, [currentUser, selectedDate]);

  const handleDateChange = (daysOffset: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + daysOffset);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const handleQuantityChange = async (habit: Habit, delta: number) => {
    if (!currentUser || !habit.id) return;
    const currentVal = logs[habit.id]?.value || 0;
    const newVal = Math.max(0, currentVal + delta);

    setLogs(prev => ({
      ...prev,
      [habit.id!]: {
        userId: currentUser.uid,
        habitId: habit.id!,
        date: selectedDate,
        value: newVal,
        completed: newVal >= habit.targetValue,
        updatedAt: new Date().toISOString()
      }
    }));

    await logHabitProgress(currentUser.uid, habit.id, selectedDate, newVal, habit.targetValue);
  };

  const handleToggleCheck = async (habit: Habit) => {
    if (!currentUser || !habit.id) return;
    const isDone = logs[habit.id]?.completed;
    const newVal = isDone ? 0 : habit.targetValue;

    setLogs(prev => ({
      ...prev,
      [habit.id!]: {
        userId: currentUser.uid,
        habitId: habit.id!,
        date: selectedDate,
        value: newVal,
        completed: !isDone,
        updatedAt: new Date().toISOString()
      }
    }));

    await logHabitProgress(currentUser.uid, habit.id, selectedDate, newVal, habit.targetValue);
  };

  const filteredHabits = habits.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-400" /> Daily Habit Log
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track, update, and manage your daily habits date-by-date.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-2 rounded-xl">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer px-2"
          />

          <button
            onClick={() => handleDateChange(1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {selectedDate !== todayStr && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold rounded-lg hover:bg-teal-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="water">Water & Hydration</option>
          <option value="exercise">Exercise & Fitness</option>
          <option value="study">Study & Learning</option>
          <option value="work">Work & Productivity</option>
          <option value="sleep">Sleep & Health</option>
          <option value="nutrition">Nutrition</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Habits List */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="text-slate-400 py-8 text-center">Loading logs for {selectedDate}...</div>
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No active habits found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit) => {
              const log = habit.id ? logs[habit.id] : undefined;
              const currentVal = log?.value || 0;
              const isDone = log?.completed || false;
              const progressPct = Math.min(100, Math.round((currentVal / habit.targetValue) * 100));

              return (
                <div
                  key={habit.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isDone
                      ? 'bg-teal-500/10 border-teal-500/40 text-white'
                      : 'bg-slate-900 border-slate-700/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                        {habit.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{habit.title}</h3>
                      {habit.description && (
                        <p className="text-xs text-slate-400 mt-1">{habit.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleCheck(habit)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isDone
                          ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20'
                          : 'border-2 border-slate-600 hover:border-teal-400 text-transparent'
                      }`}
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>

                  {habit.trackingType !== 'boolean' ? (
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-teal-400">
                          {currentVal} / {habit.targetValue} {habit.unit} ({progressPct}%)
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleQuantityChange(habit, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuantityChange(habit, 1)}
                          className="w-8 h-8 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                      <span>Status</span>
                      <span className={isDone ? 'text-teal-400 font-bold' : 'text-slate-500'}>
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};