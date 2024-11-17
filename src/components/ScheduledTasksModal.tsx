import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Filter } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  date?: string;
  reminder?: boolean;
  status?: 'overdue' | 'completed' | 'pending';
};

type ScheduledTasksModalProps = {
  tasks: Task[];
  onClose: () => void;
  onSelectDate: (date: Date) => void;
};

export default function ScheduledTasksModal({ tasks, onClose, onSelectDate }: ScheduledTasksModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (!task.date) return !startDate && !endDate;
    
    const taskDate = new Date(task.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && taskDate < start) return false;
    if (end) {
      end.setHours(23, 59, 59, 999);
      if (taskDate > end) return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;

    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (a.time) dateA.setHours(...a.time.split(':').map(Number));
    if (b.time) dateB.setHours(...b.time.split(':').map(Number));
    return dateA.getTime() - dateB.getTime();
  });

  const isOverdue = (task: Task) => {
    if (!task.date || !task.time) return false;
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    return taskDateTime < new Date() && !task.completed;
  };

  const getStatusColor = (task: Task) => {
    if (task.status === 'completed') return 'bg-green-50 border-green-200';
    if (task.status === 'overdue' || isOverdue(task)) return 'bg-red-50 border-red-200';
    return 'bg-white border-gray-200';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sans date';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleTaskClick = (date?: string) => {
    if (date) {
      onSelectDate(new Date(date));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-fade-in">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Toutes les tâches
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {sortedTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucune tâche trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task.date)}
                  className={`w-full text-left p-4 rounded-lg border ${getStatusColor(
                    task
                  )} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-medium ${isOverdue(task) ? 'text-red-700' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(task.date)}</span>
                        </div>
                        {task.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {task.reminder && (
                      <Bell className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    )}
                  </div>
                  {task.status && (
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'overdue' || isOverdue(task)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.status === 'completed'
                          ? 'Terminée'
                          : task.status === 'overdue' || isOverdue(task)
                          ? 'En retard'
                          : 'En attente'}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}