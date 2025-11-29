import React, { useState, useEffect } from 'react';
import { KPI } from '../types';
import { getKPIs, updateKPIVisibility, updateKPITarget, updateKPIThresholds } from '../api/metrics';
import { Card, Button, Input, Tabs, Switch, Badge } from '../../../components/componentsreutilizables';
import { Settings, Loader2, CheckCircle2, AlertCircle, Info, Eye, EyeOff, Target, AlertTriangle } from 'lucide-react';

interface KPIConfiguratorProps {
  role: 'entrenador' | 'gimnasio';
}

type Mode = 'simple' | 'advanced';

export const KPIConfigurator: React.FC<KPIConfiguratorProps> = ({ role }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('simple');
  const [editingKPI, setEditingKPI] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    target?: number;
    warningThreshold?: number;
    dangerThreshold?: number;
  }>({});

  useEffect(() => {
    loadKPIs();
  }, [role]);

  // Limpiar mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const data = await getKPIs(role);
      setKpis(data);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (kpi: KPI) => {
    const newVisibility = !kpi.isVisible;
    setSaving(kpi.id);
    setSaveSuccess(null);
    
    try {
      await updateKPIVisibility(kpi.id, newVisibility);
      await loadKPIs();
      setSaveSuccess(kpi.id);
    } catch (error) {
      console.error('Error updating KPI visibility:', error);
      alert('Error al actualizar la visibilidad del KPI');
    } finally {
      setSaving(null);
    }
  };

  const handleStartEdit = (kpi: KPI) => {
    setEditingKPI(kpi.id);
    setEditFormData({
      target: kpi.targetValue || kpi.target,
      warningThreshold: kpi.warningThreshold,
      dangerThreshold: kpi.dangerThreshold,
    });
  };

  const handleCancelEdit = () => {
    setEditingKPI(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (kpi: KPI) => {
    setSaving(kpi.id);
    setSaveSuccess(null);
    
    try {
      await updateKPITarget(
        kpi.id,
        editFormData.target ?? kpi.targetValue ?? kpi.target ?? 0,
        editFormData.warningThreshold,
        editFormData.dangerThreshold
      );
      await loadKPIs();
      setEditingKPI(null);
      setEditFormData({});
      setSaveSuccess(kpi.id);
    } catch (error) {
      console.error('Error updating KPI:', error);
      alert('Error al guardar los cambios del KPI');
    } finally {
      setSaving(null);
    }
  };

  const getCategoryBadgeVariant = (category: string): 'blue' | 'green' | 'purple' | 'yellow' | 'red' => {
    const categoryMap: Record<string, 'blue' | 'green' | 'purple' | 'yellow' | 'red'> = {
      'financiero': 'green',
      'finanzas': 'green',
      'clientes': 'blue',
      'operacional': 'purple',
      'operaciones': 'purple',
      'marketing': 'yellow',
      'calidad': 'red',
    };
    return categoryMap[category.toLowerCase()] || 'blue';
  };

  const tabs = [
    {
      id: 'simple',
      label: 'Modo Simple',
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: 'advanced',
      label: 'Modo Avanzado',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Información explicativa */}
      <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-500">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Configuración de KPIs
            </h3>
            <p className="text-sm text-blue-800">
              Los KPIs configurados aquí impactan directamente en el Dashboard y en otros módulos del sistema. 
              Activa o desactiva KPIs para personalizar tu vista, o edita objetivos y umbrales de alerta en modo avanzado.
            </p>
          </div>
        </div>
      </Card>

      {/* Selector de modo */}
      <Card className="p-4 bg-white shadow-sm">
        <Tabs
          items={tabs}
          activeTab={mode}
          onTabChange={(tabId) => setMode(tabId as Mode)}
          variant="pills"
          fullWidth
        />
      </Card>

      {/* Contenido según el modo */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando KPIs...</p>
        </Card>
      ) : kpis.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay KPIs disponibles</h3>
          <p className="text-gray-600">
            No se encontraron KPIs para tu rol. Contacta al administrador del sistema.
          </p>
        </Card>
      ) : mode === 'simple' ? (
        /* Modo Simple: Lista con toggle de visibilidad */
        <div className="space-y-3">
          {kpis.map((kpi) => (
            <Card
              key={kpi.id}
              className={`p-4 bg-white shadow-sm transition-all ${
                saveSuccess === kpi.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                    <Badge variant={getCategoryBadgeVariant(kpi.category)}>
                      {kpi.category}
                    </Badge>
                    {saveSuccess === kpi.id && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Guardado</span>
                      </div>
                    )}
                  </div>
                  {kpi.description && (
                    <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Unidad: {kpi.unit}</span>
                    {kpi.targetValue && (
                      <span>Objetivo: {kpi.targetValue.toLocaleString()} {kpi.unit}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  {saving === kpi.id ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      {kpi.isVisible ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={kpi.isVisible ?? kpi.enabled}
                        onChange={() => handleToggleVisibility(kpi)}
                        size="md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Modo Avanzado: Edición de objetivos y umbrales */
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.id}
              className={`p-5 bg-white shadow-sm ${
                saveSuccess === kpi.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header del KPI */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                      <Badge variant={getCategoryBadgeVariant(kpi.category)}>
                        {kpi.category}
                      </Badge>
                      {saveSuccess === kpi.id && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Cambios guardados</span>
                        </div>
                      )}
                    </div>
                    {kpi.description && (
                      <p className="text-sm text-gray-600">{kpi.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {kpi.isVisible ? (
                      <Badge variant="green">Visible</Badge>
                    ) : (
                      <Badge variant="gray">Oculto</Badge>
                    )}
                  </div>
                </div>

                {/* Formulario de edición */}
                {editingKPI === kpi.id ? (
                  <div className="space-y-4 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Target className="w-4 h-4 inline mr-1" />
                          Valor Objetivo
                        </label>
                        <Input
                          type="number"
                          value={editFormData.target?.toString() || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              target: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          placeholder="Ej: 50000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Unidad: {kpi.unit}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-600" />
                          Umbral de Advertencia
                        </label>
                        <Input
                          type="number"
                          value={editFormData.warningThreshold?.toString() || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              warningThreshold: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          placeholder="Opcional"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Activa alerta de advertencia
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <AlertCircle className="w-4 h-4 inline mr-1 text-red-600" />
                          Umbral de Peligro
                        </label>
                        <Input
                          type="number"
                          value={editFormData.dangerThreshold?.toString() || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              dangerThreshold: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          placeholder="Opcional"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Activa alerta crítica
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
                      <Button
                        variant="secondary"
                        onClick={handleCancelEdit}
                        disabled={saving === kpi.id}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleSaveEdit(kpi)}
                        disabled={saving === kpi.id}
                        loading={saving === kpi.id}
                      >
                        {saving === kpi.id ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Valor Objetivo</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {kpi.targetValue || kpi.target ? (
                            <>
                              {(kpi.targetValue || kpi.target)?.toLocaleString()} {kpi.unit}
                            </>
                          ) : (
                            <span className="text-gray-400">No definido</span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Umbral de Advertencia</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {kpi.warningThreshold !== undefined ? (
                            <>
                              {kpi.warningThreshold.toLocaleString()} {kpi.unit}
                            </>
                          ) : (
                            <span className="text-gray-400">No configurado</span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Umbral de Peligro</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {kpi.dangerThreshold !== undefined ? (
                            <>
                              {kpi.dangerThreshold.toLocaleString()} {kpi.unit}
                            </>
                          ) : (
                            <span className="text-gray-400">No configurado</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        variant="primary"
                        onClick={() => handleStartEdit(kpi)}
                        disabled={saving === kpi.id}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Editar Configuración
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
