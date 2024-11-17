import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  date?: string;
  reminder?: boolean;
  status?: 'overdue' | 'completed' | 'pending';
};

type CalendarProps = {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export default function Calendar({ tasks, selectedDate, onSelectDate }: CalendarProps) {
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === selectedDate.getMonth() &&
      selectedDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getTasksForDay = (day: number) => {
    // Créer une date au format local pour le jour en cours
    const currentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
      12 // Midi pour éviter les problèmes de fuseau horaire
    );
    
    // Format de la date pour comparaison (YYYY-MM-DD)
    const dateStr = currentDate.toISOString().slice(0, 10);
    
    return tasks.filter(task => {
      if (!task.date) return false;
      
      // Normaliser la date de la tâche en ignorant l'heure
      const taskDateStr = task.date.slice(0, 10);
      return taskDateStr === dateStr;
    });
  };

  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onSelectDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onSelectDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        
        {days.map(day => {
          const tasksForDay = getTasksForDay(day);
          const hasOverdueTasks = tasksForDay.some(task => task.status === 'overdue');
          const hasCompletedTasks = tasksForDay.some(task => task.status === 'completed');
          
          return (
            <button
              key={day}
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(day);
                onSelectDate(newDate);
              }}
              className={`h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative
                ${
                  isSelected(day)
                    ? 'bg-[#4761C8] text-white hover:bg-[#3951B8]'
                    : isToday(day)
                    ? 'bg-blue-100 text-[#4761C8] hover:bg-blue-200'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              {day}
              {tasksForDay.length > 0 && (
                <div className="absolute bottom-1 flex gap-1">
                  {hasOverdueTasks && (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  {hasCompletedTasks && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                  {!hasOverdueTasks && !hasCompletedTasks && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4761C8]" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}