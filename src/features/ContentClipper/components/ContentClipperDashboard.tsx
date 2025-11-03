import React, { useState } from 'react';
import { useContentLibrary } from '../hooks/useContentLibrary';
import { ClippedContentCard } from './ClippedContentCard';
import { AddContentModal } from './AddContentModal';
import { getCategories, Category } from '../api/clips';
import { Plus, Search, Filter, X, Loader2 } from 'lucide-react';

/**
 * Componente principal que orquesta la página del Content Clipper.
 * Gestiona el estado de los filtros, la búsqueda y la paginación.
 */
export const ContentClipperDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    clips,
    isLoading,
    error,
    pagination,
    removeClip,
    refreshClips,
    setFilters
  } = useContentLibrary();

  // Cargar categorías al montar
  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({
      search: query,
      category: selectedCategory || undefined,
      tags: []
    });
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFilters({
      search: searchQuery || undefined,
      category: categoryId || undefined,
      tags: []
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setFilters({});
  };

  const handleEdit = (clipId: string) => {
    // TODO: Implementar modal de edición
    console.log('Editar clip:', clipId);
  };

  const handleDelete = async (clipId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) return;
    
    try {
      await removeClip(clipId);
    } catch (error) {
      console.error('Error eliminando clip:', error);
      alert('Error al eliminar el contenido. Por favor, intenta nuevamente.');
    }
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Biblioteca de Contenido</h2>
          <p className="text-gray-600 mt-1">
            {pagination.totalItems} {pagination.totalItems === 1 ? 'contenido guardado' : 'contenidos guardados'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Agregar Contenido
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por título, descripción o notas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de categoría */}
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* Lista de contenido */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : clips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map(clip => (
            <ClippedContentCard
              key={clip.id}
              clip={clip}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasActiveFilters ? 'No se encontraron resultados' : 'No tienes contenido guardado todavía'}
          </h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza capturando contenido valioso para tu biblioteca'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar Primer Contenido
            </button>
          )}
        </div>
      )}

      {/* Paginación (si hay múltiples páginas) */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal para agregar contenido */}
      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContentAdded={refreshClips}
      />
    </div>
  );
};


