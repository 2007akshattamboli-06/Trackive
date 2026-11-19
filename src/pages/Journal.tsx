import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
  type JournalEntry
} from '../services/journalService';
import {
  BookOpen,
  Plus,
  Trash2,
  Smile,
  Zap,
  Calendar,
  Heart,
  Search,
  X,
  Loader2
} from 'lucide-react';

export const Journal: React.FC = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [mood, setMood] = useState<JournalEntry['mood']>('good');
  const [energy, setEnergy] = useState<number>(4);
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadJournal = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserJournalEntries(currentUser.uid);
      setEntries(data || []);
    } catch (err) {
      console.error('Error loading journal entries:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournal();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;

    setSubmitting(true);
    try {
      await createJournalEntry(currentUser.uid, {
        date: new Date().toISOString().split('T')[0],
        mood,
        energy,
        content: content.trim(),
        gratitude: gratitude.trim() || undefined,
      });

      setContent('');
      setGratitude('');
      setMood('good');
      setEnergy(4);
      setIsModalOpen(false);
      await loadJournal();
    } catch (err) {
      console.error('Error creating journal entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId?: string) => {
    if (!currentUser || !entryId || !confirm('Are you sure you want to delete this reflection?')) return;
    try {
      await deleteJournalEntry(currentUser.uid, entryId);
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
    }
  };

  const filteredEntries = entries.filter(e =>
    e.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.gratitude && e.gratitude.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodBadge = (m: JournalEntry['mood']) => {
    switch (m) {
      case 'great': return '🤩 Great';
      case 'good': return '😊 Good';
      case 'okay': return '😐 Okay';
      case 'bad': return '😔 Bad';
      case 'terrible': return '😫 Terrible';
      default: return '😊 Good';
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-teal-400" /> Wellbeing Journal & Reflections
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Reflect on your day, track mood & energy, and build gratitude habits.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> New Daily Reflection
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search journal reflections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Entries Display List */}
      {loading ? (
        <div className="text-slate-400 py-12 text-center animate-pulse">Loading journal entries...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Journal Entries Found</h3>
          <p className="text-slate-400 text-sm mb-4">Start recording daily reflections and gratitude notes.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            + Write First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" /> {entry.date}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-amber-300">
                    {getMoodBadge(entry.mood)}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-cyan-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-400" /> Energy: {entry.energy}/5
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.gratitude && (
                <div className="mt-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-start gap-2 text-xs text-teal-300">
                  <Heart className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Gratitude: </span>
                    <span>{entry.gratitude}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Reflection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Smile className="w-5 h-5 text-teal-400" /> Write Daily Reflection
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Today's Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as JournalEntry['mood'])}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="great">🤩 Great</option>
                    <option value="good">😊 Good</option>
                    <option value="okay">😐 Okay</option>
                    <option value="bad">😔 Bad</option>
                    <option value="terrible">😫 Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Energy Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reflection & Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How was your day? What went well or could be improved?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Gratitude (Optional)</label>
                <input
                  type="text"
                  placeholder="One thing you are grateful for today..."
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-900 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};