import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  PlusCircle,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  Clock,
  Filter,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { CelebrationEvent, Task } from '../types.ts';
import { formatShortDate } from '../utils/formatters.ts';

interface TaskManagerProps {
  event: CelebrationEvent;
  onUpdateTasks: (tasks: Task[]) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  event,
  onUpdateTasks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Form States
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [formDeadline, setFormDeadline] = useState('');
  const [formPhase, setFormPhase] = useState('Production');

  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = event.tasks.filter((t) => t.status === 'Pending').length;
  const overdueTasks = event.tasks.filter(
    (t) => t.status === 'Pending' && t.deadline && t.deadline < todayStr
  ).length;

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (task: Task) => {
    const updated = event.tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: (t.status === 'Completed' ? 'Pending' : 'Completed') as 'Pending' | 'Completed' }
        : t
    );
    onUpdateTasks(updated);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormName('');
    setFormDesc('');
    setFormPriority('High');
    setFormDeadline(event.date || todayStr);
    setFormPhase('Preparation');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormName(task.name);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormDeadline(task.deadline);
    setFormPhase(task.phase || 'Preparation');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this milestone task?')) {
      onUpdateTasks(event.tasks.filter((t) => t.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingTask) {
      const updated = event.tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              name: formName.trim(),
              description: formDesc.trim(),
              priority: formPriority,
              deadline: formDeadline,
              phase: formPhase
            }
          : t
      );
      onUpdateTasks(updated);
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        priority: formPriority,
        deadline: formDeadline || event.date || todayStr,
        status: 'Pending',
        phase: formPhase
      };
      onUpdateTasks([...event.tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredTasks = event.tasks.filter((t) => {
    const isOverdue = t.status === 'Pending' && t.deadline && t.deadline < todayStr;
    if (statusFilter === 'Completed' && t.status !== 'Completed') return false;
    if (statusFilter === 'Pending' && t.status !== 'Pending') return false;
    if (statusFilter === 'Overdue' && !isOverdue) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Top Planning Progress Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Celebration Planning Progress
            </h3>
          </div>
          <p className="text-xs text-stone-600">
            {completedTasks} of {totalTasks} milestones finalized ({progressPercent}% ready for event day)
          </p>

          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden mt-3">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-center min-w-[70px]">
            <p className="text-lg font-serif font-bold text-purple-900">{pendingTasks}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Pending</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[70px]">
            <p className="text-lg font-serif font-bold text-emerald-900">{completedTasks}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Done</p>
          </div>
          {overdueTasks > 0 && (
            <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-center min-w-[70px]">
              <p className="text-lg font-serif font-bold text-rose-900">{overdueTasks}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Overdue</p>
            </div>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer ml-2"
          >
            <PlusCircle className="w-4 h-4 text-rose-300" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and View Control */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-stone-400 mr-1.5 uppercase tracking-wider">
            Status:
          </span>
          {(['All', 'Pending', 'Completed', 'Overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-stone-400 mr-1.5 uppercase tracking-wider">
            Priority:
          </span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((pr) => (
            <button
              key={pr}
              onClick={() => setPriorityFilter(pr)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                priorityFilter === pr
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 text-stone-500 text-xs">
            No tasks match the active filters.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue = !isCompleted && task.deadline && task.deadline < todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-stone-50/70 border-stone-200 text-stone-500'
                    : isOverdue
                    ? 'bg-rose-50/50 border-rose-200/80 text-stone-900 shadow-xs'
                    : 'bg-white border-stone-200/90 hover:border-purple-300 text-stone-900 shadow-xs'
                }`}
              >
                {/* Checkbox & Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="mt-0.5 text-stone-400 hover:text-purple-600 transition-colors cursor-pointer shrink-0"
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-purple-600" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold ${
                          isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {task.name}
                      </span>

                      {/* Priority tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : task.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Phase tag */}
                      {task.phase && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-100">
                          {task.phase}
                        </span>
                      )}

                      {/* Assignee tag */}
                      {task.assignedToName && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100">
                          Lead: {task.assignedToName}
                        </span>
                      )}

                      {/* Dependency tag */}
                      {task.dependencyTaskName && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                          Requires: {task.dependencyTaskName}
                        </span>
                      )}

                      {/* Overdue tag */}
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${isCompleted ? 'text-stone-400' : 'text-stone-600'}`}>
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Deadline: {formatShortDate(task.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingTask ? 'Edit Milestone Task' : 'Add Celebration Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct food tasting with catering captain"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Action Items
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific details, vendor contacts, or deliverable deliverables"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white outline-hidden"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Timeline Phase
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Weeks Prior"
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
