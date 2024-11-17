import React from 'react';
import { Bell, X, Check } from 'lucide-react';

type ReminderModalProps = {
  task: {
    id: string;
    title: string;
    time?: string;
  };
  onClose: () => void;
  onComplete: (id: string) => void;
};

export default function ReminderModal({ task, onClose, onComplete }: ReminderModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-indigo-600">
            <Bell className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Rappel de tâche</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-lg text-gray-700 mb-2">{task.title}</p>
          {task.time && (
            <p className="text-gray-500">Heure prévue : {task.time}</p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              onComplete(task.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-5 h-5" />
            Marquer comme terminée
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}