import React, { useState } from 'react';
import { Droplet, Plus, Pencil, Check, RotateCcw } from 'lucide-react';

interface WaterTrackerProps {
  currentValue: number;
  targetValue: number;
  onUpdate: (val: number) => void;
  onTargetChange: (newTarget: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentValue,
  targetValue,
  onUpdate,
  onTargetChange,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(String(targetValue));

  const safeTarget = targetValue > 0 ? targetValue : 2500;
  const progressPct = Math.min(100, Math.round((currentValue / safeTarget) * 100));

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(targetInput);
    if (parsed >= 250) {
      onTargetChange(parsed);
      setIsEditingTarget(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header with Custom Daily Target */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Water Intake</h3>
            {isEditingTarget ? (
              <form onSubmit={handleSaveTarget} className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  min="250"
                  step="50"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-24 px-2 py-1 bg-slate-900 border border-cyan-500 rounded-lg text-xs text-white focus:outline-none"
                  placeholder="e.g. 3000"
                  autoFocus
                />
                <span className="text-xs text-slate-400">ml</span>
                <button
                  type="submit"
                  className="p-1 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 cursor-pointer"
                  title="Save Custom Target"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTargetInput(String(safeTarget));
                  setIsEditingTarget(true);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mt-0.5 cursor-pointer"
                title="Click to set custom daily water target"
              >
                <span>Daily Goal: {safeTarget} ml</span>
                <Pencil className="w-3 h-3 text-cyan-400" />
              </button>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-cyan-400 block">
            {currentValue} / {safeTarget} ml
          </span>
          <button
            type="button"
            onClick={() => onUpdate(0)}
            className="text-[11px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 mt-0.5 cursor-pointer"
            title="Reset today's intake"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
        <div
          className="bg-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Add Water Intake Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => onUpdate(currentValue + 250)}
          className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> +250 ml
        </button>
        <button
          type="button"
          onClick={() => onUpdate(currentValue + 500)}
          className="flex-1 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> +500 ml
        </button>
      </div>
    </div>
  );
};