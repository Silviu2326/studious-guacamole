import React, { useState, useEffect } from 'react';
import { 
  ContentPackage, 
  ContentModule, 
  ContentItem, 
  ContentItemType,
  DripScheduleUnit,
  getContentPackage,
  updateContentPackage
} from '../api/contentPackages';
import { Plus, X, GripVertical, Save, Loader2, ArrowLeft, Video, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ContentBuilderProps {
  packageId: string | null;
  onSave: (packageStructure: ContentPackage) => void;
  onCancel?: () => void;
}

/**
 * Componente complejo para la creación y edición de la estructura
 * de un paquete de contenido con módulos e items.
 */
export const ContentBuilder: React.FC<ContentBuilderProps> = ({
  packageId,
  onSave,
  onCancel
}) => {
  const [packageData, setPackageData] = useState<ContentPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (packageId) {
      loadPackage();
    } else {
      // Crear paquete nuevo
      setPackageData({
        id: '',
        title: '',
        trainerId: 'trn_current',
        price: 0,
        accessType: 'one-time',
        modules: [],
        enrolledClients: 0,
        createdAt: new Date().toISOString()
      } as ContentPackage);
      setIsLoading(false);
    }
  }, [packageId]);

  const loadPackage = async () => {
    setIsLoading(true);
    try {
      const data = await getContentPackage(packageId!);
      setPackageData(data);
    } catch (error) {
      console.error('Error cargando paquete:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!packageData || !packageData.title) {
      alert('El título es requerido');
      return;
    }

    setIsSaving(true);
    try {
      const saved = packageId
        ? await updateContentPackage(packageId, packageData)
        : packageData; // En producción, crear nuevo
      
      onSave(saved);
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar el paquete');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = () => {
    if (!packageData) return;
    
    const newModule: ContentModule = {
      id: `mod_${Date.now()}`,
      title: 'Nuevo Módulo',
      items: [],
      order: packageData.modules.length + 1
    };
    
    setPackageData({
      ...packageData,
      modules: [...packageData.modules, newModule]
    });
    setSelectedModule(newModule.id);
  };

  const handleUpdateModule = (moduleId: string, updates: Partial<ContentModule>) => {
    if (!packageData) return;
    
    setPackageData({
      ...packageData,
      modules: packageData.modules.map(m => 
        m.id === moduleId ? { ...m, ...updates } : m
      )
    });
  };

  const handleRemoveModule = (moduleId: string) => {
    if (!packageData) return;
    
    setPackageData({
      ...packageData,
      modules: packageData.modules.filter(m => m.id !== moduleId).map((m, idx) => ({
        ...m,
        order: idx + 1
      }))
    });
    
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  };

  const handleAddItem = (moduleId: string, type: ContentItemType) => {
    if (!packageData) return;
    
    const module = packageData.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const newItem: ContentItem = {
      id: `item_${Date.now()}`,
      type,
      title: `Nuevo ${type}`,
      order: module.items.length + 1
    };
    
    setPackageData({
      ...packageData,
      modules: packageData.modules.map(m => 
        m.id === moduleId
          ? { ...m, items: [...m.items, newItem] }
          : m
      )
    });
  };

  const handleUpdateItem = (moduleId: string, itemId: string, updates: Partial<ContentItem>) => {
    if (!packageData) return;
    
    setPackageData({
      ...packageData,
      modules: packageData.modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              items: m.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
            }
          : m
      )
    });
  };

  const handleRemoveItem = (moduleId: string, itemId: string) => {
    if (!packageData) return;
    
    setPackageData({
      ...packageData,
      modules: packageData.modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              items: m.items.filter(i => i.id !== itemId).map((i, idx) => ({
                ...i,
                order: idx + 1
              }))
            }
          : m
      )
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!packageData) {
    return <div>Error cargando paquete</div>;
  }

  const currentModule = packageData.modules.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {packageId ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
              </h2>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Configuración básica */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={packageData.title}
                    onChange={(e) => setPackageData({ ...packageData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Programa de 12 Semanas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={packageData.description || ''}
                    onChange={(e) => setPackageData({ ...packageData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe el contenido de este paquete..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio
                    </label>
                    <input
                      type="number"
                      value={packageData.price}
                      onChange={(e) => setPackageData({ ...packageData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Acceso
                    </label>
                    <select
                      value={packageData.accessType}
                      onChange={(e) => setPackageData({ ...packageData, accessType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="one-time">Pago Único</option>
                      <option value="subscription">Suscripción</option>
                      <option value="free">Gratuito</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={packageData.isDripEnabled || false}
                      onChange={(e) => setPackageData({ ...packageData, isDripEnabled: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Habilitar Drip Content</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Lista de módulos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Módulos</h3>
                <button
                  onClick={handleAddModule}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  title="Agregar Módulo"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {packageData.modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition ${
                      selectedModule === module.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{module.title}</p>
                        <p className="text-xs text-gray-500">
                          {module.items.length} {module.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveModule(module.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
                
                {packageData.modules.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay módulos. Haz clic en + para agregar uno.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho - Editor de módulo seleccionado */}
          <div className="lg:col-span-2">
            {currentModule ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentModule.title}
                    onChange={(e) => handleUpdateModule(currentModule.id, { title: e.target.value })}
                    className="w-full px-4 py-2 text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Título del módulo"
                  />
                  <textarea
                    value={currentModule.description || ''}
                    onChange={(e) => handleUpdateModule(currentModule.id, { description: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={2}
                    placeholder="Descripción del módulo..."
                  />
                </div>

                {/* Drip Schedule */}
                {packageData.isDripEnabled && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liberar este módulo después de:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={currentModule.dripSchedule?.value || 0}
                        onChange={(e) => handleUpdateModule(currentModule.id, {
                          dripSchedule: {
                            unit: currentModule.dripSchedule?.unit || 'days',
                            value: Number(e.target.value)
                          }
                        })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                      />
                      <select
                        value={currentModule.dripSchedule?.unit || 'days'}
                        onChange={(e) => handleUpdateModule(currentModule.id, {
                          dripSchedule: {
                            unit: e.target.value as DripScheduleUnit,
                            value: currentModule.dripSchedule?.value || 0
                          }
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="days">Días</option>
                        <option value="weeks">Semanas</option>
                        <option value="immediate">Inmediato</option>
                      </select>
                      <span className="text-sm text-gray-600">
                        desde el acceso del cliente
                      </span>
                    </div>
                  </div>
                )}

                {/* Items del módulo */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Contenido del Módulo</h4>
                    <div className="flex items-center gap-2">
                      {(['video', 'pdf', 'text', 'link'] as ContentItemType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleAddItem(currentModule.id, type)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                          title={`Agregar ${type}`}
                        >
                          {type === 'video' && <Video className="w-4 h-4 text-gray-600" />}
                          {type === 'pdf' && <FileText className="w-4 h-4 text-gray-600" />}
                          {type === 'text' && <FileText className="w-4 h-4 text-gray-600" />}
                          {type === 'link' && <LinkIcon className="w-4 h-4 text-gray-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentModule.items.map((item) => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateItem(currentModule.id, item.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Título del item"
                            />
                            {item.type === 'video' && (
                              <input
                                type="url"
                                value={item.url || ''}
                                onChange={(e) => handleUpdateItem(currentModule.id, item.id, { url: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="URL del video"
                              />
                            )}
                            {item.type === 'pdf' && (
                              <input
                                type="url"
                                value={item.fileUrl || ''}
                                onChange={(e) => handleUpdateItem(currentModule.id, item.id, { fileUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="URL del PDF"
                              />
                            )}
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={item.isRequired || false}
                                  onChange={(e) => handleUpdateItem(currentModule.id, item.id, { isRequired: e.target.checked })}
                                  className="w-4 h-4 text-purple-600 rounded"
                                />
                                <span className="text-gray-700">Requerido</span>
                              </label>
                              <button
                                onClick={() => handleRemoveItem(currentModule.id, item.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {currentModule.items.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No hay contenido en este módulo. Agrega items usando los botones arriba.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Selecciona un módulo para editar su contenido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

