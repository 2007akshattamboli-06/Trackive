import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { exportUserDataAsJSON, exportHabitsToCSV } from '../services/exportService';
import { logoutUser } from '../services/authService';
import {
  Settings as SettingsIcon,
  Download,
  User,
  Palette,
  FileText,
  Check,
  Moon,
  Sun,
  LogOut,
  Shield,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    if (!currentUser) return;
    setExporting(true);
    try {
      await exportUserDataAsJSON(currentUser.uid);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!currentUser) return;
    setExporting(true);
    try {
      await exportHabitsToCSV(currentUser.uid);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-teal-400" /> Account & App Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your appearance theme, profile details, and data backups for Trackive.
        </p>
      </div>

      {/* Appearance: 1 Light & 1 Dark Theme */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-teal-400" /> Appearance Theme
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select your preferred interface theme. Changes apply immediately across all pages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-teal-500 ring-2 ring-teal-500/25'
                : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] border border-slate-700 flex items-center justify-center text-teal-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Midnight Dark</span>
                <span className="text-xs text-slate-400">Deep navy & slate interface</span>
              </div>
            </div>
            {theme === 'dark' && (
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-400" />
              </div>
            )}
          </button>

          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-900 border-teal-500 ring-2 ring-teal-500/25'
                : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#f8fafc] border border-slate-300 flex items-center justify-center text-amber-500">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Crisp Light</span>
                <span className="text-xs text-slate-400">Clean daylight workspace</span>
              </div>
            </div>
            {theme === 'light' && (
              <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-400" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" /> Profile Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Display Name</span>
            <span className="text-base font-bold text-white mt-1 block">
              {currentUser?.displayName || 'Trackive User'}
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Email Address</span>
            <span className="text-base font-bold text-white mt-1 block">
              {currentUser?.email || 'user@example.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-teal-400" /> Data Backup & Export
        </h2>
        <p className="text-xs text-slate-400">
          Download your habit history, goals, and journal entries in standard formats.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJSON}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export JSON Backup
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-teal-400 font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4" /> Export Habits CSV
          </button>
        </div>
      </div>

      {/* Security & Sign Out */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-white">Account Session</h3>
            <p className="text-xs text-slate-400">Your data is securely synced and isolated to your account.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logoutUser()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl text-sm transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};