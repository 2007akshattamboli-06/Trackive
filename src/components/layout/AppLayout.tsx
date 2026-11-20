import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-bold">
        Loading HabitFlow...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Mobile Top Header with Three-Line Hamburger Menu */}
      <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700 shrink-0 z-30">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center font-bold text-sm text-slate-900">
            HF
          </div>
          <span className="font-bold text-base text-white">HabitFlow</span>
        </div>
      </header>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-800 border-r border-slate-700 shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* Mobile Slide-Over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 h-full bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};