import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Target, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="flex items-center justify-around h-16 bg-slate-800 border-t border-slate-700 px-2">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
        <LayoutDashboard className="w-5 h-5" /> Dashboard
      </NavLink>
      <NavLink to="/daily" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
        <CheckSquare className="w-5 h-5" /> Daily
      </NavLink>
      <NavLink to="/goals" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
        <Target className="w-5 h-5" /> Goals
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
        <Settings className="w-5 h-5" /> Settings
      </NavLink>
    </nav>
  );
};