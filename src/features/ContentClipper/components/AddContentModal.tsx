import React, { useState } from 'react';
import { createClip, Category, Tag, getCategories, getTags, createTag } from '../api/clips';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Loader2, Plus, Search } from 'lucide-react';

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

  const categoryOptions = [
    { value: '', label: 'Sin categoría' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={isLoading || !url.trim() || !formData.title.trim()}
        loading={isLoading}
      >
        Guardar Contenido
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Nuevo Contenido"
      size="xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Campo URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL del Contenido
          </label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com/articulo"
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleScrape}
              disabled={isScraping || !url.trim()}
              loading={isScraping}
            >
              Extraer
            </Button>
          </div>
        </div>

        {/* Vista previa de imagen */}
        {scrapedData?.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
        <Input
          label="Título *"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Título del contenido"
          required
        />

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <Textarea
            value={scrapedData?.description || ''}
            readOnly
            rows={3}
            className="bg-gray-50 text-gray-600"
          />
        </div>

        {/* Notas personales */}
        <Textarea
          label="Notas Personales"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Añade tus notas o ideas sobre cómo usar este contenido..."
          rows={3}
        />

        {/* Categoría */}
        <Select
          label="Categoría"
          value={formData.categoryId}
          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
          options={categoryOptions}
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Etiquetas
          </label>
          
          {/* Crear nuevo tag */}
          <div className="flex gap-2 mb-3">
            <Input
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
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={handleAddTag}
              leftIcon={<Plus size={16} />}
              size="sm"
            >
              Añadir
            </Button>
          </div>

          {/* Búsqueda de tags */}
          <div className="mb-3">
            <Input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Buscar etiquetas..."
              leftIcon={<Search size={18} />}
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
                      ? 'bg-blue-600 text-white'
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
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};


