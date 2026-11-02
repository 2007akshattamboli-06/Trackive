import React, { useState } from 'react';
import { Dumbbell, Flame } from 'lucide-react';

interface FitnessTrackerProps {
  onLogWorkout: (category: string, minutes: number) => void;
}

export const FitnessTracker: React.FC<FitnessTrackerProps> = ({ onLogWorkout }) => {
  const [workoutType, setWorkoutType] = useState('Gym Workout');
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration > 0) {
      onLogWorkout(workoutType, Number(duration));
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Fitness & Workout Log</h3>
          <p className="text-xs text-slate-400">Track workout duration and exercise sessions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
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
              min="5"
              step="5"
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
          <Flame className="w-4 h-4" /> Log Exercise Session
        </button>
      </form>
    </div>
  );
};