import React, { useState } from 'react';
import { Pencil, Trash2, X, Check, Upload, Eye, FileText } from 'lucide-react';

const MOCK_CLIENTS = [
  'Jean Dupont',
  'Marie Martin',
  'Pierre Bernard',
  'Sophie Petit',
  'Laurent Michel',
  'Client par défaut'
];

const MOCK_COLLABORATORS = [
  'Eric FOIN',
  'Sophie MARTIN',
  'Laurent DUBOIS',
  'Marie PETIT',
  'Non assigné'
];

const MOCK_CONTRACTS = [
  'Contrat Vie 123456',
  'PER 789012',
  'Capitalisation 345678',
  'Prévoyance 901234',
  'Retraite 567890'
];

const PREDEFINED_CATEGORIES = [
  'Arbitrages',
  'Avances',
  'Crise Covid 19',
  'Déclaration fiscale',
  'Facturation',
  'Gestion de la retraite',
  'Gestion décès',
  'Investissement immobilier',
  'Modification administrative',
  'Modification adresse',
  'Modification clause beneficiaire',
  'Préparation dossier',
  'Prévoyance',
  'Rachat partiel',
  'Rachat total',
  'Rachats',
  'Recherche de financement',
  'Réclamation Client',
  'Rédactionnel',
  'Résiliation',
  'Souscription placement financier',
  'Versements'
];

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

type TaskDetailsProps = {
  task: Task;
  onUpdate: (task: Partial<Task>) => void;
  onDelete: () => void;
};

export default function TaskDetails({ task, onUpdate, onDelete }: TaskDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setEditedTask(prev => ({
            ...prev,
            documents: [
              ...(prev.documents || []),
              {
                id: crypto.randomUUID(),
                name: file.name,
                url,
                type: file.type
              }
            ]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCustomCategories(prev => [...prev, newCategory.trim()]);
      setEditedTask(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const allCategories = [...PREDEFINED_CATEGORIES, ...customCategories];

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Modifier la tâche</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 rounded-full text-green-600 hover:bg-green-50"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Informations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Libellé de contrat</span>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                />
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Client</span>
                <select
                  value={editedTask.client}
                  onChange={(e) => setEditedTask({ ...editedTask, client: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                >
                  {MOCK_CLIENTS.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Collaborateur</span>
                <select
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                >
                  {MOCK_COLLABORATORS.map(collaborator => (
                    <option key={collaborator} value={collaborator}>{collaborator}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Contrat</span>
                <select
                  value={editedTask.contract}
                  onChange={(e) => setEditedTask({ ...editedTask, contract: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                >
                  <option value="">Sélectionner un contrat</option>
                  {MOCK_CONTRACTS.map(contract => (
                    <option key={contract} value={contract}>{contract}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Catégorie</span>
                <select
                  value={editedTask.category}
                  onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                >
                  {allCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Date d'échéance</span>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={editedTask.date}
                    onChange={(e) => setEditedTask({ ...editedTask, date: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                  />
                  <input
                    type="time"
                    value={editedTask.time}
                    onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500">Statut</span>
                <div className="flex gap-4">
                  {['pending', 'completed', 'cancelled'].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={editedTask.status === status}
                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                        className="text-[#4761C8] focus:ring-[#4761C8]"
                      />
                      <span className="text-sm">
                        {status === 'pending' ? 'En cours' : 
                         status === 'completed' ? 'Exécuté' : 'Annulé'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Documents</h3>
            <div className="mb-4">
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#4761C8] transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Glissez vos fichiers ici ou cliquez pour sélectionner
                    <br />
                    <span className="text-xs">(PDF, JPEG, PNG uniquement)</span>
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/jpeg,image/png"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <div className="space-y-2">
              {editedTask.documents?.map((doc, index) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4761C8]" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(doc.url, '_blank')}
                      className="p-1 text-gray-500 hover:text-[#4761C8] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditedTask(prev => ({
                        ...prev,
                        documents: prev.documents?.filter(d => d.id !== doc.id)
                      }))}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Commentaire</h3>
            <textarea
              value={editedTask.comment}
              onChange={(e) => setEditedTask({ ...editedTask, comment: e.target.value })}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8] resize-none"
              placeholder="Ajouter un commentaire..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{task.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-50"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Informations</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Client</span>
              <span>{task.client || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Collaborateur</span>
              <span>{task.assignee || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Catégorie</span>
              <span>{task.category || 'Général'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Date de création</span>
              <span>{task.date || 'Non définie'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Date d'échéance</span>
              <span className={task.status === 'overdue' ? 'text-red-600' : ''}>
                {task.date} {task.time}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Statut</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                task.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.status === 'completed' ? 'Exécuté' :
                 task.status === 'overdue' ? 'En retard' :
                 task.status === 'cancelled' ? 'Annulé' :
                 'En cours'}
              </span>
            </div>
          </div>
        </div>

        {task.documents && task.documents.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Documents</h3>
            <div className="space-y-2">
              {task.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4761C8]" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="p-1 text-gray-500 hover:text-[#4761C8] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.comment && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Commentaire</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{task.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
}