import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { DailyTracker } from './pages/DailyTracker';
import { WeeklyTracker } from './pages/WeeklyTracker';
import { MonthlyTracker } from './pages/MonthlyTracker';
import { GoalPlanner } from './pages/GoalPlanner';
import { Achievements } from './pages/Achievements';
import { Journal } from './pages/Journal';
import { Settings } from './pages/Setting';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="daily" element={<DailyTracker />} />
            <Route path="weekly" element={<WeeklyTracker />} />
            <Route path="monthly" element={<MonthlyTracker />} />
            <Route path="goals" element={<GoalPlanner />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="journal" element={<Journal />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;