import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2, Bell } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  reminder?: boolean;
  status?: 'overdue' | 'completed' | 'pending';
};

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const getStatusStyles = (task: Task) => {
    if (task.status === 'overdue') return 'bg-red-50';
    if (task.status === 'completed') return 'bg-green-50';
    return 'bg-white';
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${getStatusStyles(task)}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleTask(task.id)}
              className={`transition-colors ${
                task.completed ? 'text-green-600' : 'text-gray-400 hover:text-indigo-600'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
              {task.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {task.time && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {task.time}
              </div>
            )}
            {task.reminder && (
              <Bell className="w-4 h-4 text-indigo-500" />
            )}
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}