import React from 'react';
import { Droplet, Plus } from 'lucide-react';

interface WaterTrackerProps {
  currentValue: number;
  targetValue: number;
  onUpdate: (val: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentValue,
  targetValue,
  onUpdate,
}) => {
  const progressPct = Math.min(100, Math.round((currentValue / targetValue) * 100));

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Water Intake</h3>
            <p className="text-xs text-slate-400">Daily Goal: {targetValue} ml</p>
          </div>
        </div>
        <span className="text-xl font-bold text-cyan-400">{currentValue} / {targetValue} ml</span>
      </div>

      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
        <div
          className="bg-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onUpdate(currentValue + 250)}
          className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> +250 ml
        </button>
        <button
          onClick={() => onUpdate(currentValue + 500)}
          className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> +500 ml
        </button>
      </div>
    </div>
  );
};