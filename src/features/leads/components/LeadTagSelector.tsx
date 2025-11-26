import React, { useState } from 'react';
import { X, Plus, Tag as TagIcon, Search } from 'lucide-react';
import { LeadTag, TAG_COLORS } from '../types/tags';
import { TagService } from '../services/tagService';

interface LeadTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export const LeadTagSelector: React.FC<LeadTagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 10,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<LeadTag['category']>('objetivo');

  const allTags = TagService.getAllTags();
  const selectedTagObjects = TagService.getTagsByIds(selectedTags);

  const filteredTags = allTags.filter(tag => {
    const matchesCategory = tag.category === activeCategory;
    const matchesSearch = !searchQuery || 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tagId]);
      }
    }
  };

  const categories = [
    { id: 'objetivo' as const, label: 'Objetivos' },
    { id: 'servicio' as const, label: 'Servicios' },
  ];

  return (
    <div className="relative">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        {selectedTagObjects.map(tag => {
          const colors = TAG_COLORS[tag.color];
          return (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {tag.name}
              <button
                onClick={() => handleToggleTag(tag.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        
        {selectedTags.length < maxTags && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Agregar etiqueta
          </button>
        )}
      </div>

      {/* Tag Picker Modal */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar etiquetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {filteredTags.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No se encontraron etiquetas
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTags.map(tag => {
                  const colors = TAG_COLORS[tag.color];
                  const isSelected = selectedTags.includes(tag.id);
                  
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? `${colors.bg} ${colors.text} font-medium`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <TagIcon className="w-4 h-4" />
                      <span className="flex-1 text-left">{tag.name}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowPicker(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close picker */}
      {showPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

