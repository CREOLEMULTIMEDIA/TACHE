import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Calendar from './Calendar';
import AddTask from './AddTask';
import TaskDetails from './TaskDetails';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  date?: string;
  status?: 'overdue' | 'completed' | 'pending' | 'cancelled';
  category?: string;
  assignee?: string;
  client?: string;
  comment?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
};

type TaskSummaryProps = {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'status'>) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
};

export default function TaskSummary({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskSummaryProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(tasks.map(task => task.category || 'Général'));
    return Array.from(uniqueCategories).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      const taskDate = task.date ? new Date(task.date) : null;
      const matchesDate = taskDate ? 
        taskDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0] : 
        false;
      return matchesCategory && matchesDate;
    });
  }, [tasks, selectedCategory, selectedDate]);

  const getCategoryTaskCount = (category: string) => {
    return tasks.filter(task => 
      category === 'all' ? true : task.category === category
    ).length;
  };

  const isTaskOverdue = (task: Task) => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    if (task.time) {
      const [hours, minutes] = task.time.split(':').map(Number);
      taskDate.setHours(hours, minutes);
    }
    return taskDate < new Date() && task.status !== 'completed';
  };

  return (
    <div className="grid grid-cols-[250px_1fr_400px] gap-6">
      {/* Left Sidebar - Categories */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-3">Catégories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-50 text-[#4761C8]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span>Toutes</span>
              <span className={`${
                selectedCategory === 'all' 
                  ? 'bg-[#4761C8] text-white' 
                  : 'bg-gray-100 text-gray-600'
              } text-sm px-2 py-0.5 rounded-full min-w-[1.5rem]`}>
                {getCategoryTaskCount('all')}
              </span>
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-50 text-[#4761C8]'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{category}</span>
                <span className={`${
                  selectedCategory === category 
                    ? 'bg-[#4761C8] text-white' 
                    : 'bg-gray-100 text-gray-600'
                } text-sm px-2 py-0.5 rounded-full min-w-[1.5rem]`}>
                  {getCategoryTaskCount(category)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Calendar
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Main Content - Task List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 bg-[#4761C8] text-white px-4 py-2 rounded-lg hover:bg-[#3951B8] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter une tâche
          </button>
        </div>

        <div className="space-y-4">
          {filteredTasks.map(task => {
            const isOverdue = isTaskOverdue(task);
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  task.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : isOverdue
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200 hover:border-[#4761C8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.client && (
                      <p className="text-sm text-gray-500 mt-1">Client: {task.client}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {task.time && (
                      <span className="text-sm text-gray-500">{task.time}</span>
                    )}
                    {task.status === 'completed' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Exécuté
                      </span>
                    )}
                    {isOverdue && task.status !== 'completed' && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        Expiré
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - Task Details or Add Task */}
      <div>
        {showAddTask ? (
          <AddTask
            onAddTask={(taskData) => {
              onAddTask(taskData);
              setShowAddTask(false);
            }}
            selectedDate={selectedDate}
            onClose={() => setShowAddTask(false)}
          />
        ) : selectedTask ? (
          <TaskDetails
            task={selectedTask}
            onUpdate={(updatedData) => {
              onUpdateTask(selectedTask.id, updatedData);
              setSelectedTask(null);
            }}
            onDelete={() => {
              onDeleteTask(selectedTask.id);
              setSelectedTask(null);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}