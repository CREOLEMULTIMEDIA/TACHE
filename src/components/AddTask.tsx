import React, { useState } from 'react';
import { Check, X, Plus, Upload, Eye, FileText, Trash2 } from 'lucide-react';

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

type AddTaskProps = {
  onAddTask: (task: {
    title: string;
    client: string;
    assignee: string;
    category: string;
    contract?: string;
    date: string;
    time?: string;
    comment?: string;
    documents?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }) => void;
  selectedDate: Date;
  onClose?: () => void;
  initialTask?: {
    title: string;
    client: string;
    assignee: string;
    category: string;
    contract?: string;
    date: string;
    time?: string;
    comment?: string;
    documents?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  };
};

export default function AddTask({ onAddTask, selectedDate, onClose, initialTask }: AddTaskProps) {
  const [task, setTask] = useState({
    title: initialTask?.title || '',
    client: initialTask?.client || 'Client par défaut',
    assignee: initialTask?.assignee || 'Non assigné',
    category: initialTask?.category || 'Général',
    contract: initialTask?.contract || '',
    date: initialTask?.date || selectedDate.toISOString().split('T')[0],
    time: initialTask?.time || '',
    comment: initialTask?.comment || ''
  });

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Array<{name: string, url: string, type: string}>>(
    initialTask?.documents || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      onAddTask({ ...task, documents });
      if (onClose) onClose();
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCustomCategories(prev => [...prev, newCategory.trim()]);
      setTask(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setDocuments(prev => [...prev, {
            name: file.name,
            url,
            type: file.type
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const allCategories = [...PREDEFINED_CATEGORIES, ...customCategories];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {initialTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="p-2 rounded-full text-green-600 hover:bg-green-50"
          >
            <Check className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Informations</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Libellé de contrat</span>
              <input
                type="text"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                placeholder="Titre de la tâche"
              />
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Client</span>
              <select
                value={task.client}
                onChange={(e) => setTask({ ...task, client: e.target.value })}
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
                value={task.assignee}
                onChange={(e) => setTask({ ...task, assignee: e.target.value })}
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
                value={task.contract}
                onChange={(e) => setTask({ ...task, contract: e.target.value })}
                className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
              >
                <option value="">Sélectionner un contrat</option>
                {MOCK_CONTRACTS.map(contract => (
                  <option key={contract} value={contract}>{contract}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Catégorie</span>
                <button
                  type="button"
                  onClick={() => setShowCategoryInput(true)}
                  className="w-5 h-5 rounded-full bg-[#4761C8] text-white flex items-center justify-center hover:bg-[#3951B8] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              {showCategoryInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                    placeholder="Nouvelle catégorie"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryInput(false);
                      setNewCategory('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <select
                  value={task.category}
                  onChange={(e) => setTask({ ...task, category: e.target.value })}
                  className="text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                >
                  {allCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-500">Date d'échéance</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => setTask({ ...task, date: e.target.value })}
                  className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                />
                <input
                  type="time"
                  value={task.time}
                  onChange={(e) => setTask({ ...task, time: e.target.value })}
                  className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8]"
                />
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
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                    onClick={() => setDocuments(prev => prev.filter((_, i) => i !== index))}
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
            value={task.comment}
            onChange={(e) => setTask({ ...task, comment: e.target.value })}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4761C8] focus:border-[#4761C8] resize-none"
            placeholder="Ajouter un commentaire..."
          />
        </div>
      </form>
    </div>
  );
}