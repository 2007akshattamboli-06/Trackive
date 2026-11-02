import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserHabits, getDailyLogsForDateRange } from '../services/habitService';
import type { Habit, DailyLog } from '../types/habit';
import { ChevronLeft, ChevronRight, Calendar, Check, X, TrendingUp, Award } from 'lucide-react';

export const WeeklyTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const loadWeeklyData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      const [userHabits, rangeLogs] = await Promise.all([
        getUserHabits(currentUser.uid),
        getDailyLogsForDateRange(currentUser.uid, startDate, endDate),
      ]);
      setHabits(userHabits);
      setLogs(rangeLogs);
    } catch (err) {
      console.error('Error loading weekly data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeeklyData();
  }, [currentUser, currentWeekStart]);

  const changeWeek = (weeks: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + weeks * 7);
    setCurrentWeekStart(newStart);
  };

  const isHabitCompletedOnDate = (habitId: string, dateStr: string) => {
    const found = logs.find(l => l.habitId === habitId && l.date === dateStr);
    return found?.completed || false;
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const totalSlots = habits.length * 7;
  const completedSlots = habits.reduce((acc, habit) => {
    if (!habit.id) return acc;
    const count = weekDates.filter(d => isHabitCompletedOnDate(habit.id!, d)).length;
    return acc + count;
  }, 0);
  const completionRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Week Controls */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-400" /> Weekly Habit Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review your 7-day consistency and track completion across habits.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-2 rounded-xl">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold text-white px-3">
            {weekDates[0]} to {weekDates[6]}
          </span>

          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Weekly Success Rate</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{completionRate}%</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Check className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Completed Check-ins</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{completedSlots} / {totalSlots}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Active Habits</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{habits.length}</p>
        </div>
      </div>

      {/* Weekly Matrix Table */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h2 className="text-lg font-bold text-white mb-4">Habit Completion Grid</h2>

        {loading ? (
          <div className="text-slate-400 py-8 text-center">Loading weekly matrix...</div>
        ) : habits.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No active habits found for this week.</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-3 px-4 text-xs font-bold uppercase text-slate-400 w-1/3">Habit Title</th>
                {dayNames.map((day, idx) => (
                  <th key={day} className="py-3 px-2 text-center text-xs font-bold uppercase text-slate-400">
                    <div>{day}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{weekDates[idx].split('-').slice(1).join('/')}</div>
                  </th>
                ))}
                <th className="py-3 px-4 text-center text-xs font-bold uppercase text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {habits.map((habit) => {
                const habitCompletedDays = weekDates.filter(d => habit.id && isHabitCompletedOnDate(habit.id, d)).length;
                return (
                  <tr key={habit.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{habit.title}</div>
                      <div className="text-xs text-slate-400 capitalize font-normal">{habit.category}</div>
                    </td>
                    {weekDates.map((dateStr) => {
                      const done = habit.id ? isHabitCompletedOnDate(habit.id, dateStr) : false;
                      return (
                        <td key={dateStr} className="py-3 px-2 text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center transition-all ${
                              done
                                ? 'bg-teal-500 text-slate-900 font-bold'
                                : 'bg-slate-900 text-slate-600 border border-slate-700'
                            }`}
                          >
                            {done ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5 opacity-40" />}
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center font-bold text-teal-400">
                      {habitCompletedDays} / 7
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};