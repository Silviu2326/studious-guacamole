import React, { useState } from 'react';
import { ContentLibraryItem } from '../api/social';
import { Card, Button } from '../../../components/componentsreutilizables';
import { BookOpen, TrendingUp, Eye, Clock, Search, Filter } from 'lucide-react';

interface ContentLibraryProps {
  items: ContentLibraryItem[];
  onItemSelect?: (item: ContentLibraryItem) => void;
  onItemSave?: (item: Omit<ContentLibraryItem, 'id' | 'createdAt'>) => void;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({
  items,
  onItemSelect,
  onItemSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'transformation', label: 'Transformaciones' },
    { value: 'exercise', label: 'Ejercicios' },
    { value: 'nutrition', label: 'Nutrición' },
    { value: 'motivation', label: 'Motivación' },
    { value: 'tip', label: 'Tips' }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      transformation: 'bg-purple-100 text-purple-700',
      exercise: 'bg-blue-100 text-blue-700',
      nutrition: 'bg-green-100 text-green-700',
      motivation: 'bg-yellow-100 text-yellow-700',
      tip: 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Biblioteca de Contenido</h3>
        <Button size="sm" leftIcon={<BookOpen size={18} />}>
          Guardar Contenido
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contenido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            variant="hover"
            className="p-4 ring-1 ring-gray-200 hover:ring-blue-400 transition-all cursor-pointer"
            onClick={() => onItemSelect?.(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 flex-1">{item.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {categories.find(c => c.value === item.category)?.label || item.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>

            {item.performance && (
              <div className="space-y-2 mb-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Engagement promedio</span>
                  <span className="font-semibold text-gray-900">{item.performance.avgEngagement}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Alcance promedio</span>
                  <span className="font-semibold text-gray-900">{item.performance.avgReach.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Veces usado</span>
                  <span className="font-semibold text-gray-900">{item.performance.timesUsed}</span>
                </div>
              </div>
            )}

            {item.lastUsed && (
              <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Clock size={12} />
                Último uso: {new Date(item.lastUsed).toLocaleDateString('es-ES')}
              </div>
            )}

            {item.hashtags && item.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.hashtags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-xs text-blue-600">#{tag}</span>
                ))}
                {item.hashtags.length > 3 && (
                  <span className="text-xs text-gray-500">+{item.hashtags.length - 3}</span>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontró contenido</h3>
          <p className="text-gray-600">Intenta con otros filtros o guarda nuevo contenido</p>
        </Card>
      )}
    </div>
  );
};

