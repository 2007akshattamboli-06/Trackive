import { getUserHabits } from './habitService';
import { getUserJournalEntries } from './journalService';
import { getUserGoals } from './goalService';

// 1. Full User Data JSON Backup Export
export const exportUserDataAsJSON = async (userId: string) => {
  const [habits, goals, journal] = await Promise.all([
    getUserHabits(userId),
    getUserGoals(userId),
    getUserJournalEntries(userId),
  ]);

  const exportData = {
    exportDate: new Date().toISOString(),
    habits,
    goals,
    journal,
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportData, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `HabitFlow_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// 2. Habits List CSV Export
export const exportHabitsToCSV = async (userId: string) => {
  const habits = await getUserHabits(userId);
  if (habits.length === 0) {
    alert('No habits available to export.');
    return;
  }

  const headers = ['ID', 'Title', 'Category', 'Tracking Type', 'Target Value', 'Unit', 'Created At'];
  const rows = habits.map(h => [
    `"${h.id || ''}"`,
    `"${h.title.replace(/"/g, '""')}"`,
    `"${h.category}"`,
    `"${h.trackingType}"`,
    `"${h.targetValue}"`,
    `"${h.unit || ''}"`,
    `"${h.createdAt}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `HabitFlow_Habits_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};