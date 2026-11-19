import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart2, Target, Award, BookOpen, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '../../services/authService';

export const Sidebar: React.FC = () => {
  return (
    <aside className="flex flex-col h-full p-4 bg-slate-800 border-r border-slate-700">
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-900">HF</div>
        <div>
          <h1 className="font-bold text-lg text-white">HabitFlow</h1>
          <p className="text-xs text-slate-400">Better Habits, A Better You</p>
        </div>
      </div>
      <nav className="flex-1 mt-6 space-y-1">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </NavLink>
        <NavLink to="/daily" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <CheckSquare className="w-5 h-5" /> Daily Tracker
        </NavLink>
        <NavLink to="/weekly" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <Calendar className="w-5 h-5" /> Weekly Matrix
        </NavLink>
        <NavLink to="/monthly" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <BarChart2 className="w-5 h-5" /> Monthly Reports
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <Target className="w-5 h-5" /> Goal Planner
        </NavLink>
        <NavLink to="/achievements" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <Award className="w-5 h-5" /> Achievements
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <BookOpen className="w-5 h-5" /> Journal
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>
          <Settings className="w-5 h-5" /> Settings
        </NavLink>
      </nav>
      <button onClick={() => logoutUser()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left mt-auto cursor-pointer">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </aside>
  );
};