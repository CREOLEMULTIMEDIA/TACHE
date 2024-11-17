import React, { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

type Note = {
  id: string;
  content: string;
  createdAt: Date;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        content: currentNote,
        createdAt: new Date(),
      };
      setNotes(prev => [newNote, ...prev]);
      setCurrentNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Écrivez votre note ici..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 resize-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={addNote}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="whitespace-pre-wrap text-gray-800">{note.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {note.createdAt.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}