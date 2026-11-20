import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (onSessionComplete) onSessionComplete(customMinutes);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, customMinutes, onSessionComplete]);

  const applyCustomDuration = (mins: number) => {
    const validMins = Math.max(1, Math.min(180, mins));
    setIsRunning(false);
    setCustomMinutes(validMins);
    setTimeLeft(validMins * 60);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Focus Pomodoro</h3>
            <p className="text-xs text-slate-400">{customMinutes} Min Study / Work Session</p>
          </div>
        </div>
      </div>

      {/* Quick Presets + Custom Minutes Input */}
      <div className="flex items-center gap-1.5">
        {[15, 25, 45, 60].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => applyCustomDuration(preset)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              customMinutes === preset
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {preset}m
          </button>
        ))}
        <input
          type="number"
          min="1"
          max="180"
          value={customMinutes}
          onChange={(e) => applyCustomDuration(Number(e.target.value) || 1)}
          className="w-16 ml-auto px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white text-center focus:outline-none focus:border-amber-500"
          title="Custom Minutes"
        />
      </div>

      {/* Countdown */}
      <div className="text-center py-1">
        <span className="text-4xl font-extrabold text-white tracking-wider font-mono">
          {formattedTime}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTimer}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isRunning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-teal-500 hover:bg-teal-400 text-slate-900'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause Session' : 'Start Focus'}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="p-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};