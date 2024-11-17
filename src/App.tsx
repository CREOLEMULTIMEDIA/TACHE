import React, { useState } from 'react';
import Header from './components/Header';
import Notes from './components/Notes';
import TaskSummary from './components/TaskSummary';
import { ListTodo, StickyNote } from 'lucide-react';

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

type View = 'tasks' | 'notes';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<View>('tasks');

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'status'>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      completed: false,
      status: 'pending',
      ...taskData,
      documents: taskData.documents?.map(doc => ({
        ...doc,
        id: crypto.randomUUID()
      }))
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        // Gérer les documents séparément pour maintenir les IDs existants
        const updatedDocuments = updatedData.documents?.map(doc => ({
          ...doc,
          id: doc.id || crypto.randomUUID()
        }));

        return {
          ...task,
          ...updatedData,
          documents: updatedDocuments || task.documents
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Header />

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView('tasks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentView === 'tasks'
                ? 'bg-[#4761C8] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            Tâches
          </button>
          <button
            onClick={() => setCurrentView('notes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              currentView === 'notes'
                ? 'bg-[#4761C8] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <StickyNote className="w-5 h-5" />
            Notes
          </button>
        </div>

        {currentView === 'tasks' ? (
          <TaskSummary
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        ) : (
          <Notes />
        )}
      </div>
    </div>
  );
}

export default App;