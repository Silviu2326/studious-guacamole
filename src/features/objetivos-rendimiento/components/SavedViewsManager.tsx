import React, { useState, useEffect } from 'react';
import { SavedMetricView } from '../types';
import {
  getSavedViews,
  createSavedView,
  updateSavedView,
  deleteSavedView,
  duplicateSavedView,
  getShareUrl,
} from '../api/savedViews';
import { Card, Button, Modal, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { 
  Bookmark, Plus, Edit2, Trash2, Copy, Share2, Loader2, 
  Eye, Calendar, User, Link as LinkIcon, X, Check 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface SavedViewsManagerProps {
  onLoadView?: (view: SavedMetricView) => void;
}

export const SavedViewsManager: React.FC<SavedViewsManagerProps> = ({ onLoadView }) => {
  const { user } = useAuth();
  const [views, setViews] = useState<SavedMetricView[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingView, setEditingView] = useState<SavedMetricView | null>(null);
  const [shareView, setShareView] = useState<SavedMetricView | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadViews();
  }, []);

  const loadViews = async () => {
    setLoading(true);
    try {
      const data = await getSavedViews();
      setViews(data);
    } catch (error) {
      console.error('Error loading saved views:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateView = () => {
    setEditingView(null);
    setIsModalOpen(true);
  };

  const handleEditView = (view: SavedMetricView) => {
    setEditingView(view);
    setIsModalOpen(true);
  };

  const handleDeleteView = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta vista guardada?')) {
      try {
        await deleteSavedView(id);
        await loadViews();
      } catch (error) {
        console.error('Error deleting view:', error);
      }
    }
  };

  const handleDuplicateView = async (view: SavedMetricView) => {
    try {
      await duplicateSavedView(view.id, `${view.name} (Copia)`);
      await loadViews();
    } catch (error) {
      console.error('Error duplicating view:', error);
    }
  };

  const handleShareView = async (view: SavedMetricView) => {
    try {
      if (!view.shared) {
        await updateSavedView(view.id, { shared: true });
        await loadViews();
      }
      const updatedView = await getSavedViews();
      const sharedView = updatedView.find(v => v.id === view.id);
      if (sharedView) {
        setShareView(sharedView);
      }
    } catch (error) {
      console.error('Error sharing view:', error);
    }
  };

  const handleCopyShareUrl = async (view: SavedMetricView) => {
    try {
      const url = getShareUrl(view);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
      alert('Error al copiar la URL');
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
        <p className="text-gray-600 mt-4">Cargando vistas guardadas...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Vistas Personalizadas Guardadas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Guarda y comparte vistas personalizadas de métricas para consultarlas después
          </p>
        </div>
        <Button onClick={handleCreateView}>
          <Plus className="w-4 h-4 mr-2" />
          Guardar Vista Actual
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {views.map((view) => (
          <Card key={view.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{view.name}</h3>
                  {view.shared && (
                    <Badge variant="green" className="mt-1">
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartida
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onLoadView && onLoadView(view)}
                  className="p-1.5 rounded hover:bg-blue-100 transition-colors"
                  title="Cargar vista"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleEditView(view)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleShareView(view)}
                  className="p-1.5 rounded hover:bg-green-100 transition-colors"
                  title="Compartir"
                >
                  <Share2 className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => handleDuplicateView(view)}
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteView(view.id)}
                  className="p-1.5 rounded hover:bg-red-100 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            {view.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{view.description}</p>
            )}
            
            <div className="space-y-2 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Creada: {new Date(view.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>Creada por: {view.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span>Tipo: {view.config.chartType}</span>
              </div>
            </div>
            
            {view.shared && view.shareToken && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyShareUrl(view)}
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    URL Copiada
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Copiar URL de Compartir
                  </>
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {views.length === 0 && (
        <Card className="p-8 text-center">
          <Bookmark className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay vistas guardadas</h3>
          <p className="text-gray-600 mb-4">Guarda una vista personalizada para comenzar</p>
          <Button onClick={handleCreateView}>
            <Plus className="w-4 h-4 mr-2" />
            Guardar Primera Vista
          </Button>
        </Card>
      )}

      {/* Modal para crear/editar vista */}
      <ViewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingView(null);
        }}
        view={editingView}
        currentUserId={user?.id || 'unknown'}
        onSave={async (viewData) => {
          if (editingView) {
            await updateSavedView(editingView.id, viewData);
          } else {
            await createSavedView({
              ...viewData,
              createdBy: user?.id || 'unknown',
            });
          }
          await loadViews();
          setIsModalOpen(false);
          setEditingView(null);
        }}
      />

      {/* Modal para compartir */}
      {shareView && shareView.shareToken && (
        <Modal
          isOpen={!!shareView}
          onClose={() => setShareView(null)}
          title="Compartir Vista"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Comparte esta vista con otros usuarios usando el siguiente enlace:
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={getShareUrl(shareView)}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => handleCopyShareUrl(shareView)}
                variant="secondary"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button onClick={() => setShareView(null)} className="w-full">
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Modal para crear/editar vista
interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: SavedMetricView | null;
  currentUserId: string;
  onSave: (view: Omit<SavedMetricView, 'id' | 'createdAt' | 'updatedAt' | 'shareToken'>) => Promise<void>;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, view, currentUserId, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shared: false,
    config: {
      chartType: 'list' as const,
      selectedMetrics: [] as string[],
      selectedKPIs: [] as string[],
      period: 'month' as const,
      filters: {} as any,
      category: '',
      chartOptions: {
        showTargets: true,
        showTrends: true,
        showAnnotations: true,
      },
    },
  });

  useEffect(() => {
    if (view) {
      setFormData({
        name: view.name,
        description: view.description || '',
        shared: view.shared,
        config: view.config,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        shared: false,
        config: {
          chartType: 'list',
          selectedMetrics: [],
          selectedKPIs: [],
          period: 'month',
          filters: {},
          category: '',
          chartOptions: {
            showTargets: true,
            showTrends: true,
            showAnnotations: true,
          },
        },
      });
    }
  }, [view, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name: formData.name,
      description: formData.description,
      createdBy: currentUserId,
      shared: formData.shared,
      sharedWith: [],
      config: formData.config,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={view ? 'Editar Vista Guardada' : 'Guardar Vista Personalizada'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ej: Vista Mensual de Facturación"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Describe esta vista personalizada..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="shared"
            checked={formData.shared}
            onChange={(e) => setFormData({ ...formData, shared: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="shared" className="text-sm text-gray-700">
            Permitir compartir esta vista con otros usuarios
          </label>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">
            La configuración actual de la vista se guardará automáticamente
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {view ? 'Guardar Cambios' : 'Guardar Vista'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

