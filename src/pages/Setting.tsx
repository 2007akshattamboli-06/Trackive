import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { exportUserDataAsJSON, exportHabitsToCSV } from '../services/exportService';
import { logoutUser } from '../services/authService';
import { Settings as SettingsIcon, Download, User, FileText, Moon, Shield, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    if (!currentUser) return;
    setExporting(true);
    try {
      await exportUserDataAsJSON(currentUser.uid);
    } catch (err) {
      console.error('Error exporting JSON:', err);
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
      console.error('Error exporting CSV:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-teal-400" /> Account & App Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile, data backup export, preferences, and security.</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" /> Profile Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Display Name</span>
            <span className="text-base font-bold text-white">{currentUser?.displayName || 'Flow User'}</span>
          </div>
          <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Email Address</span>
            <span className="text-base font-bold text-white">{currentUser?.email || 'user@example.com'}</span>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-teal-400" /> Data Backup & Export
        </h2>
        <p className="text-xs text-slate-400">Download a full backup of your habit logs, goals, and reflections.</p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export Complete JSON Backup
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-teal-400 font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4" /> Export Habits CSV
          </button>
        </div>
      </div>

      {/* Preferences & Security */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" /> System Preferences
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700/60 rounded-xl">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-teal-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">Dark SaaS Theme</h4>
                <p className="text-xs text-slate-400">Default Dark Navy & Teal theme active</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700/60 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-teal-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">Firestore Security Isolation</h4>
                <p className="text-xs text-slate-400">Strict owner UID access controls active</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">Active</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Sign Out of Account</h3>
          <p className="text-xs text-slate-400">Safely log out of HabitFlow on this device.</p>
        </div>
        <button
          onClick={() => logoutUser()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};