import React, { useState, useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Card } from '../../../components/componentsreutilizables/Card';
import { getTemplates, deleteTemplate, duplicateTemplate } from '../api';
import { Template, TemplateFilters } from '../types';
import { Search, Plus, Filter, X, Loader2, Package, AlertCircle } from 'lucide-react';

interface TemplateLibraryContainerProps {
  onEdit: (template: Template) => void;
  onCreate: () => void;
  refreshKey?: number; // Para forzar actualización desde el padre
}

export const TemplateLibraryContainer: React.FC<TemplateLibraryContainerProps> = ({
  onEdit,
  onCreate,
  refreshKey,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    searchQuery: '',
    tags: [],
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Tags disponibles (esto podría venir de la API)
  const availableTags = ['hipertrofia', 'fuerza', 'resistencia', 'principiante', 'avanzado', 'pérdida de peso', 'full-body'];

  useEffect(() => {
    loadTemplates();
  }, [filters, refreshKey]);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTemplates(filters);
      setTemplates(response.data);
      setPagination({
        currentPage: response.pagination.page,
        totalPages: response.pagination.totalPages,
        total: response.pagination.total,
      });
    } catch (err) {
      setError('Error al cargar las plantillas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query, page: 1 });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setFilters({ ...filters, tags: newTags, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      try {
        await deleteTemplate(id);
        loadTemplates();
      } catch (err) {
        alert('Error al eliminar la plantilla');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateTemplate(id);
      loadTemplates();
    } catch (err) {
      alert('Error al duplicar la plantilla');
    }
  };

  const handleEdit = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      onEdit(template);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setFilters({ ...filters, searchQuery: '', tags: [], page: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button onClick={onCreate}>
          <Plus size={20} className="mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar plantillas..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              {selectedTags.length > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros - Tags */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-slate-600" />
              <label className="block text-sm font-medium text-slate-700">
                Filtrar por etiquetas:
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'blue' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Resumen de resultados */}
          {!isLoading && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{pagination.total} plantillas encontradas</span>
              {selectedTags.length > 0 && (
                <span>{selectedTags.length} filtros aplicados</span>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando plantillas...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTemplates}>Reintentar</Button>
        </Card>
      )}

      {/* Templates Grid */}
      {!isLoading && !error && (
        <>
          {templates.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas</h3>
              <p className="text-gray-600 mb-4">
                No se encontraron plantillas. Crea tu primera plantilla para comenzar.
              </p>
              <Button onClick={onCreate}>
                <Plus size={20} className="mr-2" />
                Crear Plantilla
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

