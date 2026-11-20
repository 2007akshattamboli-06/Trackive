import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart2,
  Target,
  Award,
  BookOpen,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { logoutUser } from '../../services/authService';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/daily', icon: CheckSquare, label: 'Daily Tracker' },
    { to: '/weekly', icon: Calendar, label: 'Weekly Matrix' },
    { to: '/monthly', icon: BarChart2, label: 'Monthly Reports' },
    { to: '/goals', icon: Target, label: 'Goal Planner' },
    { to: '/achievements', icon: Award, label: 'Achievements' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="flex flex-col h-full p-4 bg-slate-800 border-r border-slate-700 w-64">
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-900">
            TR
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Trackive</h1>
            <p className="text-xs text-slate-400">Better Habits, A Better You</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 mt-6 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-500/10 text-teal-400 font-semibold'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5" /> {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          if (onClose) onClose();
          logoutUser();
        }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left mt-auto cursor-pointer"
      >
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </aside>
  );
};