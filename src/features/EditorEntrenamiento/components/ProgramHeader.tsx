import React, { useState } from 'react';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Plus, X } from 'lucide-react';

export const ProgramHeader: React.FC = () => {
  // State for the title
  const [title, setTitle] = useState('Semana 1: Fase de Adaptación');

  // State for Mesocycle/Microcycle
  const [mesocycle, setMesocycle] = useState('1');
  const [microcycle, setMicrocycle] = useState('1');

  // State for Tags
  const [tags, setTags] = useState<string[]>(['Adaptación', 'Técnica']);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const mesocycleOptions = [
    { value: '1', label: 'Mesociclo 1: Base' },
    { value: '2', label: 'Mesociclo 2: Acumulación' },
    { value: '3', label: 'Mesociclo 3: Intensificación' },
  ];

  const microcycleOptions = Array.from({ length: 4 }, (_, i) => ({
    value: String(i + 1),
    label: `Microciclo ${i + 1}`,
  }));

  return (
    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        {/* Editable Title */}
        <div className="flex-1 group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none w-full placeholder-gray-400 hover:bg-gray-50 rounded px-2 -ml-2 transition-colors"
            placeholder="Nombre del Programa / Semana"
          />
        </div>

        {/* Selectors */}
        <div className="flex gap-3 shrink-0">
          <div className="w-48">
            <Select
              options={mesocycleOptions}
              value={mesocycle}
              onChange={(e) => setMesocycle(e.target.value)}
              className="bg-gray-50 border-gray-200 text-sm !mt-0"
              fullWidth
            />
          </div>
          <div className="w-32">
            <Select
              options={microcycleOptions}
              value={microcycle}
              onChange={(e) => setMicrocycle(e.target.value)}
              className="bg-gray-50 border-gray-200 text-sm !mt-0"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-sm text-gray-500 font-medium mr-2">Tags:</span>
        {tags.map((tag) => (
          <Badge key={tag} variant="gray" className="pl-3 pr-1 py-1 gap-1 hover:bg-gray-200 transition-colors group cursor-default">
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="p-0.5 hover:bg-gray-300 rounded-full text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {isAddingTag ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setIsAddingTag(false);
              }}
              autoFocus
              className="text-xs bg-gray-50 border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:border-blue-500 w-32"
              placeholder="Nuevo tag..."
              onBlur={() => {
                if (newTag) handleAddTag();
                else setIsAddingTag(false);
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          >
            <Plus className="w-3 h-3" />
            Agregar tag
          </button>
        )}
      </div>
    </div>
  );
};
