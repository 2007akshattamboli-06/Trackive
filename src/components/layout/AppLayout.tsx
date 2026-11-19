import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();

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
    <div className="flex h-[100dvh] w-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-800 border-r border-slate-700 shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* Main Content Viewport */}
      {/* Humne yaha pb-24 add kiya hai mobile ke liye, aur h-full ki jagah h-[100dvh] use kiya hai */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 h-full bg-slate-900 scroll-smooth">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {/* Bottom Nav screen ke bottom par fix rahega */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-800 border-t border-slate-700 z-[999]">
        <BottomNav />
      </div>
    </div>
  );
};