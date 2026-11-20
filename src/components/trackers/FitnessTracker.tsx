import React, { useState, useEffect } from 'react';
import { Dumbbell, Flame, CheckCircle2, Trash2 } from 'lucide-react';

export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  time: string;
}

interface FitnessTrackerProps {
  onLogWorkout?: (category: string, minutes: number) => void;
}

export const FitnessTracker: React.FC<FitnessTrackerProps> = ({ onLogWorkout }) => {
  const todayKey = `trackive_workouts_${new Date().toISOString().split('T')[0]}`;

  const [workoutType, setWorkoutType] = useState('Gym Workout');
  const [duration, setDuration] = useState<number>(30);
  const [justLogged, setJustLogged] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => {
    const saved = localStorage.getItem(todayKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(todayKey, JSON.stringify(workouts));
  }, [workouts, todayKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Number(duration);
    if (mins <= 0) return;

    const newEntry: WorkoutEntry = {
      id: Date.now().toString(),
      type: workoutType,
      duration: mins,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWorkouts((prev) => [newEntry, ...prev]);
    if (onLogWorkout) onLogWorkout(workoutType, mins);

    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((item) => item.id !== id));
  };

  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Fitness & Workout Log</h3>
            <p className="text-xs text-slate-400">Today's Total: {totalMinutes} mins</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Exercise Type</label>
            <select
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Gym Workout">Gym Workout</option>
              <option value="Running / Jogging">Running / Jogging</option>
              <option value="Cycling">Cycling</option>
              <option value="Yoga / Stretching">Yoga / Stretching</option>
              <option value="Home Exercise">Home Exercise</option>
              <option value="Walking">Walking</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Mins)</label>
            <input
              type="number"
              min="1"
              max="300"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {justLogged ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Session Logged!
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" /> Log Exercise Session
            </>
          )}
        </button>
      </form>

      {/* Logged Workouts List */}
      {workouts.length > 0 && (
        <div className="pt-2 border-t border-slate-700/60 space-y-2 max-h-32 overflow-y-auto">
          {workouts.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-3 py-2 bg-slate-900/70 border border-slate-700/50 rounded-xl text-xs"
            >
              <div>
                <span className="font-semibold text-white">{item.type}</span>
                <span className="text-slate-400 ml-2">• {item.duration} mins ({item.time})</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteWorkout(item.id)}
                className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                title="Remove entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};