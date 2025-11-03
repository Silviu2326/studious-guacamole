import React, { useState } from 'react';
import { createClip, Category, Tag, getCategories, getTags, createTag } from '../api/clips';
import { X, Loader2, Plus, Search } from 'lucide-react';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentAdded: () => void;
}

/**
 * Modal para agregar nuevo contenido pegando una URL.
 * Incluye scraping de datos y formulario para editar metadatos.
 */
export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onContentAdded
}) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
  } | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    notes: string;
    categoryId: string;
    tags: Tag[];
  }>({
    title: '',
    notes: '',
    categoryId: '',
    tags: []
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState<string>('');
  const [tagSearch, setTagSearch] = useState<string>('');

  // Cargar categorías y tags al abrir el modal
  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadTags();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadTags = async () => {
    try {
      const data = await getTags();
      setAvailableTags(data);
    } catch (error) {
      console.error('Error cargando tags:', error);
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) return;

    setIsScraping(true);
    try {
      const clip = await createClip(url, formData.categoryId || undefined);
      
      setScrapedData({
        title: clip.title,
        description: clip.scrapedDescription || '',
        imageUrl: clip.thumbnailUrl || ''
      });
      
      setFormData(prev => ({
        ...prev,
        title: clip.title,
        categoryId: clip.categoryId || ''
      }));
    } catch (error) {
      console.error('Error scraping URL:', error);
      alert('No se pudo extraer información de la URL. Por favor, completa los datos manualmente.');
      setScrapedData({
        title: '',
        description: '',
        imageUrl: ''
      });
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = async () => {
    if (!url.trim() || !formData.title.trim()) {
      alert('Por favor, completa la URL y el título');
      return;
    }

    setIsLoading(true);
    try {
      // En producción, aquí se actualizaría el clip con los datos del formulario
      await createClip(url, formData.categoryId || undefined);
      
      // Resetear formulario
      setUrl('');
      setScrapedData(null);
      setFormData({
        title: '',
        notes: '',
        categoryId: '',
        tags: []
      });
      
      onContentAdded();
      onClose();
    } catch (error) {
      console.error('Error guardando contenido:', error);
      alert('Error al guardar el contenido. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTag(newTagName.trim());
      setAvailableTags([...availableTags, newTag]);
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTagName('');
    } catch (error) {
      console.error('Error creando tag:', error);
    }
  };

  const handleToggleTag = (tag: Tag) => {
    setFormData(prev => {
      const isSelected = prev.tags.some(t => t.id === tag.id);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter(t => t.id !== tag.id)
          : [...prev.tags, tag]
      };
    });
  };

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Contenido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Campo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Contenido
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ejemplo.com/articulo"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleScrape}
                disabled={isScraping || !url.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {isScraping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Extraer'
                )}
              </button>
            </div>
          </div>

          {/* Vista previa de imagen */}
          {scrapedData?.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista Previa
              </label>
              <img
                src={scrapedData.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Título del contenido"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={scrapedData?.description || ''}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              rows={3}
            />
          </div>

          {/* Notas personales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Personales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Añade tus notas o ideas sobre cómo usar este contenido..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sin categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            
            {/* Crear nuevo tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Crear nueva etiqueta"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Añadir
              </button>
            </div>

            {/* Búsqueda de tags */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Buscar etiquetas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Lista de tags disponibles */}
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {filteredTags.map(tag => {
                const isSelected = formData.tags.some(t => t.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>

            {/* Tags seleccionados */}
            {formData.tags.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !url.trim() || !formData.title.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Contenido'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


