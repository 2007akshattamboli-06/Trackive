import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createGoal, getUserGoals, updateGoal, deleteGoal } from '../services/goalService';
import type { Goal, Milestone } from '../services/goalService';
import { Target, Plus, CheckCircle2, Circle, Trash2, Calendar, Flag } from 'lucide-react';

export const GoalPlanner: React.FC = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [targetDate, setTargetDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  const loadGoals = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userGoals = await getUserGoals(currentUser.uid);
      setGoals(userGoals);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [currentUser]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim() || !targetDate) return;

    const parsedMilestones: Milestone[] = milestonesInput
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map((line, idx) => ({
        id: `ms_${Date.now()}_${idx}`,
        title: line.trim(),
        dueDate: targetDate,
        completed: false,
      }));

    try {
      await createGoal(currentUser.uid, {
        title,
        description,
        category,
        startDate: new Date().toISOString().split('T')[0],
        targetDate,
        status: 'active',
        milestones: parsedMilestones,
      });

      setTitle('');
      setDescription('');
      setCategory('Personal');
      setTargetDate('');
      setMilestonesInput('');
      setIsModalOpen(false);
      loadGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  const toggleMilestone = async (goal: Goal, milestoneId: string) => {
    if (!currentUser || !goal.id) return;

    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);
    const newStatus = allCompleted ? 'completed' : 'active';

    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: updatedMilestones, status: newStatus } : g));

    await updateGoal(currentUser.uid, goal.id, {
      milestones: updatedMilestones,
      status: newStatus,
    });
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!currentUser || !confirm('Are you sure you want to delete this goal?')) return;
    await deleteGoal(currentUser.uid, goalId);
    loadGoals();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-teal-400" /> Goal Planner & Milestones
          </h1>
          <p className="text-slate-400 text-sm mt-1">Set long-term objectives and break them into manageable milestones.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
        >
          <Plus className="w-5 h-5" /> Create New Goal
        </button>
      </div>

      {/* Goal Cards */}
      {loading ? (
        <div className="text-slate-400 py-8 text-center">Loading your goals...</div>
      ) : goals.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-12 text-center">
          <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Active Goals Yet</h3>
          <p className="text-slate-400 text-sm mb-4">Set your first high-impact goal to track long-term progress.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            + Add First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const completedCount = goal.milestones.filter(m => m.completed).length;
            const totalCount = goal.milestones.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div key={goal.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">{goal.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{goal.title}</h3>
                    {goal.description && <p className="text-xs text-slate-400 mt-1">{goal.description}</p>}
                  </div>
                  <button
                    onClick={() => goal.id && handleDeleteGoal(goal.id)}
                    className="text-slate-500 hover:text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Target: {goal.targetDate}</span>
                    <span className="text-teal-400">{progress}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-teal-400" /> Milestones ({completedCount}/{totalCount})
                  </h4>
                  {goal.milestones.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No sub-milestones added.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {goal.milestones.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => toggleMilestone(goal, m.id)}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 text-left transition-colors cursor-pointer"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className={`text-xs ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {m.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Create Long-Term Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Run a Half Marathon, Read 12 Books"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Career">Career & Work</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Why this goal matters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Milestones (Enter one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Run 5K without stopping&#10;Run 10K&#10;Complete 15K training run"
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
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
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};