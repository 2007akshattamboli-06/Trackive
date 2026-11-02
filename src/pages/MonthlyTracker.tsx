import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserHabits, getDailyLogsForDateRange } from '../services/habitService';
import type { Habit, DailyLog } from '../types/habit';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, BarChart2, Flame, Award } from 'lucide-react';

export const MonthlyTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleString('default', { month: 'long' });

  const startDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
  const endDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(totalDays).padStart(2, '0')}`;

  const loadMonthlyData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [userHabits, rangeLogs] = await Promise.all([
        getUserHabits(currentUser.uid),
        getDailyLogsForDateRange(currentUser.uid, startDateStr, endDateStr),
      ]);
      setHabits(userHabits);
      setLogs(rangeLogs);
    } catch (err) {
      console.error('Error loading monthly analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlyData();
  }, [currentUser, selectedYear, selectedMonth]);

  const changeMonth = (delta: number) => {
    let newM = selectedMonth + delta;
    let newY = selectedYear;
    if (newM < 0) {
      newM = 11;
      newY -= 1;
    } else if (newM > 11) {
      newM = 0;
      newY += 1;
    }
    setSelectedMonth(newM);
    setSelectedYear(newY);
  };

  const chartData = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayLogs = logs.filter(l => l.date === dateStr && l.completed);
    return {
      day: dayNum,
      date: dateStr,
      completedCount: dayLogs.length,
      completionRate: habits.length > 0 ? Math.round((dayLogs.length / habits.length) * 100) : 0,
    };
  });

  const totalCompletions = chartData.reduce((acc, curr) => acc + curr.completedCount, 0);
  const maxPossible = habits.length * totalDays;
  const overallRate = maxPossible > 0 ? Math.round((totalCompletions / maxPossible) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Month Selector */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-teal-400" /> Monthly Analytics & Heatmap
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze monthly consistency trends and visual habit performance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-2 rounded-xl">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold text-white px-3 min-w-[140px] text-center">
            {monthName} {selectedYear}
          </span>

          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-teal-400 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Monthly Completion Rate</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{overallRate}%</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Total Check-ins</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{totalCompletions}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Flame className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase text-slate-400">Active Habits Tracked</span>
          </div>
          <p className="text-3xl font-extrabold text-white">{habits.length}</p>
        </div>
      </div>

      {/* Daily Trend Chart (Recharts) */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Daily Completion Trend ({monthName})</h2>
        <div className="h-64 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="completedCount" name="Habits Completed" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Consistency Calendar Grid / Heatmap */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Consistency Calendar Grid</h2>
        {loading ? (
          <div className="text-slate-400 py-8 text-center">Loading heatmap...</div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {chartData.map((d) => {
                const rate = d.completionRate;
                let bgClass = 'bg-slate-900 border-slate-700 text-slate-500';
                if (rate > 75) bgClass = 'bg-teal-500 border-teal-400 text-slate-900 font-bold';
                else if (rate > 40) bgClass = 'bg-teal-600/60 border-teal-500/50 text-white font-bold';
                else if (rate > 0) bgClass = 'bg-teal-900/40 border-teal-700/40 text-teal-300';

                return (
                  <div
                    key={d.day}
                    className={`aspect-square rounded-xl border p-2 flex flex-col justify-between transition-all ${bgClass}`}
                    title={`Day ${d.day}: ${d.completedCount} habits completed (${rate}%)`}
                  >
                    <span className="text-xs font-semibold">{d.day}</span>
                    <span className="text-[10px] text-right font-mono">{d.completedCount} done</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700">
              <span>Less</span>
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700" />
              <div className="w-4 h-4 rounded bg-teal-900/40 border border-teal-700/40" />
              <div className="w-4 h-4 rounded bg-teal-600/60 border border-teal-500/50" />
              <div className="w-4 h-4 rounded bg-teal-500 border border-teal-400" />
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};