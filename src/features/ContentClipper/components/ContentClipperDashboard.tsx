import React, { useState } from 'react';
import { useContentLibrary } from '../hooks/useContentLibrary';
import { ClippedContentCard } from './ClippedContentCard';
import { AddContentModal } from './AddContentModal';
import { getCategories, Category } from '../api/clips';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { Plus, Search, X, Loader2, Package, AlertCircle } from 'lucide-react';

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
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={20} />}
        >
          Agregar Contenido
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar por título, descripción o notas..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>

              {/* Filtro de categoría */}
              <div className="w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
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
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  leftIcon={<X size={18} />}
                  size="sm"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {pagination.totalItems} {pagination.totalItems === 1 ? 'contenido guardado' : 'contenidos guardados'}
            </span>
            {hasActiveFilters && (
              <span>Filtros aplicados</span>
            )}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">Error: {error.message}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      )}

      {/* Lista de contenido */}
      {isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : clips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasActiveFilters ? 'No se encontraron resultados' : 'No tienes contenido guardado todavía'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza capturando contenido valioso para tu biblioteca'}
          </p>
          {!hasActiveFilters && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus size={20} />}
            >
              Agregar Primer Contenido
            </Button>
          )}
        </Card>
      )}

      {/* Paginación (si hay múltiples páginas) */}
      {pagination.totalPages > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => {/* TODO: Implementar navegación */}}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-gray-700 text-sm">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => {/* TODO: Implementar navegación */}}
            >
              Siguiente
            </Button>
          </div>
        </Card>
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


