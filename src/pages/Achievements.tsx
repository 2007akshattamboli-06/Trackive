import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, ALL_BADGES } from '../services/gamificationService';
import type { UserStats } from '../services/gamificationService';
import { Award, Flame, Zap, Trophy, Target, Footprints, Lock, ShieldCheck } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getUserStats(currentUser.uid).then((res: UserStats) => {
        setStats(res);
        setLoading(false);
      });
    }
  }, [currentUser]);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-7 h-7 ${unlocked ? 'text-amber-400' : 'text-slate-500'}` };
    switch (iconName) {
      case 'Footprints': return <Footprints {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      default: return <Award {...props} />;
    }
  };

  if (loading) {
    return <div className="text-slate-400 py-8 text-center">Loading achievements...</div>;
  }

  const currentLevel = stats?.level || 1;
  const currentXP = stats?.xp || 0;
  const xpForNextLevel = currentLevel * 100;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" /> Gamification & Achievements
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your consistency, earn XP, level up, and unlock milestone badges.
        </p>
      </div>

      {/* Level & XP Progress Card */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex flex-col items-center justify-center">
              <span className="text-xs uppercase font-bold text-amber-400">Level</span>
              <span className="text-xl font-extrabold text-amber-300">{currentLevel}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Flow Explorer</h3>
              <p className="text-xs text-slate-400">{currentXP} Total XP Earned</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="w-4 h-4" /> {stats?.currentStreak || 0} Days
              <span className="text-xs text-slate-500 font-normal block">Current Streak</span>
            </div>
            <div className="flex items-center gap-2 text-teal-400">
              <Trophy className="w-4 h-4" /> {stats?.bestStreak || 0} Days
              <span className="text-xs text-slate-500 font-normal block">Best Streak</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Level {currentLevel} Progress</span>
            <span>{currentXP} / {xpForNextLevel} XP to Level {currentLevel + 1}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentXP / xpForNextLevel) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestone Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" /> Milestone Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const unlocked = stats?.unlockedBadges.includes(badge.id) || false;
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-slate-800 border-teal-500/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${unlocked ? 'bg-amber-400/10 border border-amber-400/20' : 'bg-slate-800'}`}>
                    {renderBadgeIcon(badge.icon, unlocked)}
                  </div>
                  {unlocked ? (
                    <span className="text-xs px-2.5 py-1 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-md font-semibold">
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <h4 className="font-bold text-white">{badge.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
                <div className="mt-3 text-[11px] font-semibold text-teal-400/80">
                  {badge.xpRequired} XP Required
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};