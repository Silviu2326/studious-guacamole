import React, { useState, useEffect } from 'react';
import { KPI, GlobalFilters, KPIFamily, KPIFramework, KPIDataSource, KPIFormula, KPIThresholds, KPIResponsible, DataSourceType } from '../types';
import { getKPIs, createKPI, updateKPI, updateKPIsOrder } from '../api/metrics';
import { Card, Button, Table, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Settings, Plus, Edit2, ToggleLeft, ToggleRight, Loader2, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, Save, Calculator, Database, Users, AlertTriangle, Layers, X, Link2, History, Shield, MessageSquare } from 'lucide-react';
import { KPIToObjectiveMapper } from './KPIToObjectiveMapper';
import { KPIVersionHistory } from './KPIVersionHistory';
import { KPIImportModal } from './KPIImportModal';
import { PermissionsManager } from './PermissionsManager';
import { ObjectiveKPIComments } from './ObjectiveKPIComments';
import { updateKPIPermissions } from '../api/permissions';

interface KPIConfiguratorProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

export const KPIConfigurator: React.FC<KPIConfiguratorProps> = ({ role, globalFilters, periodo }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [workingKPIs, setWorkingKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpis' | 'families' | 'mapping' | 'versions'>('kpis');
  const [frameworks, setFrameworks] = useState<KPIFramework[]>([]);
  const [selectedKPIForHistory, setSelectedKPIForHistory] = useState<KPI | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedKPIForPermissions, setSelectedKPIForPermissions] = useState<KPI | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedKPIForComments, setSelectedKPIForComments] = useState<KPI | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    loadKPIs();
    loadFrameworks();
  }, [role]);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const data = await getKPIs(role);
      setKpis(data);
      setWorkingKPIs([...data]);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFrameworks = async () => {
    try {
      const saved = localStorage.getItem(`kpi-frameworks-${role}`);
      if (saved) {
        setFrameworks(JSON.parse(saved));
      } else {
        // Frameworks por defecto
        const defaultFrameworks: KPIFramework[] = [
          {
            id: 'finanzas-default',
            name: 'Marco Financiero',
            family: 'finanzas',
            description: 'KPIs relacionados con finanzas y rentabilidad',
            color: '#10B981',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'operaciones-default',
            name: 'Marco Operacional',
            family: 'operaciones',
            description: 'KPIs relacionados con operaciones y eficiencia',
            color: '#3B82F6',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'satisfaccion-default',
            name: 'Marco de Satisfacción',
            family: 'satisfaccion',
            description: 'KPIs relacionados con satisfacción del cliente',
            color: '#F59E0B',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'salud-default',
            name: 'Marco de Salud',
            family: 'salud',
            description: 'KPIs relacionados con salud y bienestar',
            color: '#EF4444',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setFrameworks(defaultFrameworks);
        localStorage.setItem(`kpi-frameworks-${role}`, JSON.stringify(defaultFrameworks));
      }
    } catch (error) {
      console.error('Error loading frameworks:', error);
    }
  };

  const handleCreate = () => {
    setEditingKPI(null);
    setIsModalOpen(true);
  };

  const handleEdit = (kpi: KPI) => {
    setEditingKPI(kpi);
    setIsModalOpen(true);
  };

  const handleToggle = async (kpi: KPI) => {
    try {
      await updateKPI(kpi.id, { enabled: !kpi.enabled });
      loadKPIs();
    } catch (error) {
      console.error('Error toggling KPI:', error);
    }
  };

  const handleToggleVisibility = (kpiId: string) => {
    const updated = workingKPIs.map(kpi => 
      kpi.id === kpiId ? { ...kpi, visible: !(kpi.visible !== false) } : kpi
    );
    setWorkingKPIs(updated);
    setHasChanges(true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...workingKPIs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated[index - 1].order = index - 1;
    updated[index].order = index;
    setWorkingKPIs(updated);
    setHasChanges(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === workingKPIs.length - 1) return;
    const updated = [...workingKPIs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated[index].order = index;
    updated[index + 1].order = index + 1;
    setWorkingKPIs(updated);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      const kpiIds = workingKPIs.map(kpi => kpi.id);
      await updateKPIsOrder(kpiIds, role);
      
      // Update visibility for each KPI
      for (const kpi of workingKPIs) {
        if (kpi.visible !== kpis.find(k => k.id === kpi.id)?.visible) {
          await updateKPI(kpi.id, { visible: kpi.visible });
        }
      }
      
      await loadKPIs();
      
      // Dispatch event to refresh dashboard
      window.dispatchEvent(new CustomEvent('kpi-config-updated'));
    } catch (error) {
      console.error('Error saving KPI order:', error);
      alert('Error al guardar la configuración');
    }
  };

  const columns = [
    {
      key: 'order',
      label: 'Orden',
      render: (_: any, row: KPI, index: number) => (
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <span className="text-sm font-medium text-gray-600">{index + 1}</span>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'KPI',
      render: (value: string, row: KPI) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          {row.description && (
            <div className="text-xs text-gray-500 mt-1">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (value: string) => (
        <Badge variant="blue">{value}</Badge>
      ),
    },
    {
      key: 'family',
      label: 'Familia/Marco',
      render: (value: KPIFamily | undefined, row: KPI) => {
        if (!value && !row.frameworkName) return <span className="text-gray-400">-</span>;
        const familyColors: Record<KPIFamily, string> = {
          finanzas: 'bg-green-100 text-green-800',
          operaciones: 'bg-blue-100 text-blue-800',
          satisfaccion: 'bg-yellow-100 text-yellow-800',
          salud: 'bg-red-100 text-red-800',
        };
        const familyLabels: Record<KPIFamily, string> = {
          finanzas: 'Finanzas',
          operaciones: 'Operaciones',
          satisfaccion: 'Satisfacción',
          salud: 'Salud',
        };
        return (
          <div className="flex flex-col gap-1">
            {value && (
              <Badge className={familyColors[value]}>
                {familyLabels[value]}
              </Badge>
            )}
            {row.frameworkName && (
              <span className="text-xs text-gray-600">{row.frameworkName}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'isCustom',
      label: 'Tipo',
      render: (value: boolean | undefined, row: KPI) => {
        if (value || row.isCustom) {
          return (
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-600" />
              <Badge variant="purple">Personalizado</Badge>
            </div>
          );
        }
        return <Badge variant="gray">Estándar</Badge>;
      },
    },
    {
      key: 'unit',
      label: 'Unidad',
    },
    {
      key: 'visible',
      label: 'Visible en Dashboard',
      render: (value: boolean | undefined, row: KPI, index: number) => {
        const isVisible = value !== false;
        return (
          <button
            onClick={() => handleToggleVisibility(row.id)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all"
            title={isVisible ? 'Ocultar en dashboard' : 'Mostrar en dashboard'}
          >
            {isVisible ? (
              <Eye className="w-5 h-5 text-green-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            <Badge variant={isVisible ? 'green' : 'gray'}>
              {isVisible ? 'Visible' : 'Oculto'}
            </Badge>
          </button>
        );
      },
    },
    {
      key: 'enabled',
      label: 'Estado',
      render: (value: boolean, row: KPI) => (
        <button
          onClick={() => handleToggle(row)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          {value ? (
            <ToggleRight className="w-6 h-6 text-green-600" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
          <Badge variant={value ? 'green' : 'gray'}>
            {value ? 'Activo' : 'Inactivo'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: KPI, index: number) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMoveUp(index)}
            disabled={index === 0}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Mover arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMoveDown(index)}
            disabled={index === workingKPIs.length - 1}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Mover abajo"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedKPIForHistory(row);
              setShowVersionHistory(true);
            }}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
            title="Ver historial de versiones"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedKPIForPermissions(row);
              setShowPermissionsModal(true);
            }}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Gestionar permisos"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedKPIForComments(row);
              setShowCommentsModal(true);
            }}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Ver comentarios"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configuración de KPIs</h2>
          <p className="text-sm text-gray-600 mt-1">
            Define KPIs personalizados con fórmulas, fuentes de datos, umbrales y responsables. Organiza KPIs en familias o marcos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && activeTab === 'kpis' && (
            <Button variant="primary" onClick={handleSaveOrder}>
              <Save size={20} className="mr-2" />
              Guardar Cambios
            </Button>
          )}
          {activeTab === 'kpis' && (
            <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
              <Upload size={18} className="mr-2" />
              Importar KPIs
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              <Plus size={20} className="mr-2" />
              Nuevo KPI
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kpis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            KPIs
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mapping'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            Mapeo a Objetivos
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'versions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Historial de Versiones
          </button>
          <button
            onClick={() => setActiveTab('families')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'families'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Familias y Marcos
          </button>
        </nav>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'kpis' ? (
        <>
          {/* Información */}
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Configuración de KPIs</h3>
                <p className="text-sm text-blue-700">
                  Define KPIs personalizados con fórmulas, fuentes de datos, umbrales y responsables. 
                  Organiza KPIs en familias o marcos para mantener orden y claridad.
                </p>
              </div>
            </div>
          </Card>

          {/* Tabla de KPIs */}
          {loading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : (
            <Table
              data={workingKPIs}
              columns={columns}
              loading={false}
              emptyMessage="No hay KPIs configurados"
            />
          )}
        </>
      ) : activeTab === 'mapping' ? (
        <KPIToObjectiveMapper role={role} />
      ) : activeTab === 'versions' ? (
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-gray-600 mb-4">
              Selecciona un KPI de la lista para ver su historial de versiones, o usa el botón de historial en la columna de acciones de la pestaña KPIs.
            </p>
            {selectedKPIForHistory ? (
              <KPIVersionHistory
                kpi={selectedKPIForHistory}
                onClose={() => {
                  setSelectedKPIForHistory(null);
                  setShowVersionHistory(false);
                }}
                onVersionRestored={loadKPIs}
              />
            ) : (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona un KPI:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workingKPIs.map((kpi) => (
                    <button
                      key={kpi.id}
                      onClick={() => setSelectedKPIForHistory(kpi)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="font-semibold text-gray-900">{kpi.name}</div>
                      {kpi.description && (
                        <div className="text-sm text-gray-600 mt-1">{kpi.description}</div>
                      )}
                      {kpi.currentVersion && (
                        <Badge variant="blue" className="mt-2">
                          Versión: {kpi.currentVersion}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
                {workingKPIs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No hay KPIs disponibles</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      ) : (
        <FamiliesManager
          frameworks={frameworks}
          kpis={workingKPIs}
          role={role}
          onFrameworksChange={setFrameworks}
          onKPIsChange={(updatedKPIs) => {
            setWorkingKPIs(updatedKPIs);
            setHasChanges(true);
          }}
        />
      )}

      {/* Modal de historial de versiones */}
      {showVersionHistory && selectedKPIForHistory && (
        <Modal
          isOpen={showVersionHistory}
          onClose={() => {
            setShowVersionHistory(false);
            setSelectedKPIForHistory(null);
          }}
          title={`Historial de Versiones - ${selectedKPIForHistory.name}`}
          size="xl"
        >
          <KPIVersionHistory
            kpi={selectedKPIForHistory}
            onClose={() => {
              setShowVersionHistory(false);
              setSelectedKPIForHistory(null);
            }}
            onVersionRestored={loadKPIs}
          />
        </Modal>
      )}

      <KPIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKPI(null);
        }}
        onSave={loadKPIs}
        kpi={editingKPI}
        role={role}
      />

      {/* User Story 1: Modal para importar KPIs */}
      <KPIImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={() => {
          loadKPIs();
          setIsImportModalOpen(false);
        }}
        role={role}
      />

      {/* User Story 1: Modal de gestión de permisos */}
      {selectedKPIForPermissions && (
        <PermissionsManager
          kpi={selectedKPIForPermissions}
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedKPIForPermissions(null);
          }}
          onSave={async (permissions) => {
            await updateKPIPermissions(selectedKPIForPermissions.id, permissions);
            loadKPIs();
          }}
        />
      )}

      {/* User Story 2: Modal de comentarios */}
      {selectedKPIForComments && (
        <Modal
          isOpen={showCommentsModal}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedKPIForComments(null);
          }}
          title={`Comentarios - ${selectedKPIForComments.name}`}
          size="xl"
        >
          <ObjectiveKPIComments
            kpiId={selectedKPIForComments.id}
            onCommentAdded={loadKPIs}
          />
        </Modal>
      )}
    </div>
  );
};

interface KPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kpi?: KPI | null;
  role: 'entrenador' | 'gimnasio';
}

const KPIModal: React.FC<KPIModalProps> = ({ isOpen, onClose, onSave, kpi, role }) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'custom' | 'family'>('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metric: '',
    unit: '',
    category: '',
    enabled: true,
    target: '',
    isCustom: false,
    family: '' as KPIFamily | '',
    frameworkId: '',
    autoCalculate: false,
    calculationFrequency: 'daily' as 'realtime' | 'hourly' | 'daily' | 'weekly',
    // Fórmula
    formula: '',
    formulaDescription: '',
    // Fuente de datos
    dataSourceType: 'manual' as DataSourceType,
    dataSourceName: '',
    dataSourceConfig: {} as any,
    // Umbrales
    thresholdType: 'below' as 'above' | 'below' | 'range',
    thresholdWarning: '',
    thresholdCritical: '',
    thresholdExcellent: '',
    thresholdRangeMin: '',
    thresholdRangeMax: '',
    // Responsables
    responsibles: [] as Array<{ userId: string; userName: string; email?: string }>,
  });

  useEffect(() => {
    if (kpi) {
      setFormData({
        name: kpi.name,
        description: kpi.description || '',
        metric: kpi.metric,
        unit: kpi.unit,
        category: kpi.category,
        enabled: kpi.enabled,
        target: kpi.target?.toString() || '',
        isCustom: kpi.isCustom || false,
        family: kpi.family || '',
        frameworkId: kpi.frameworkId || '',
        autoCalculate: kpi.autoCalculate || false,
        calculationFrequency: kpi.calculationFrequency || 'daily',
        formula: kpi.formula?.formula || '',
        formulaDescription: kpi.formula?.description || '',
        dataSourceType: kpi.dataSource?.type || 'manual',
        dataSourceName: kpi.dataSource?.name || '',
        dataSourceConfig: kpi.dataSource?.config || {},
        thresholdType: kpi.thresholds?.type || 'below',
        thresholdWarning: kpi.thresholds?.warning?.toString() || '',
        thresholdCritical: kpi.thresholds?.critical?.toString() || '',
        thresholdExcellent: kpi.thresholds?.excellent?.toString() || '',
        thresholdRangeMin: kpi.thresholds?.rangeMin?.toString() || '',
        thresholdRangeMax: kpi.thresholds?.rangeMax?.toString() || '',
        responsibles: kpi.responsibles?.map(r => ({ userId: r.userId, userName: r.userName, email: r.email })) || [],
        changeNotes: '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        metric: '',
        unit: '',
        category: '',
        enabled: true,
        target: '',
        isCustom: false,
        family: '',
        frameworkId: '',
        autoCalculate: false,
        calculationFrequency: 'daily',
        formula: '',
        formulaDescription: '',
        dataSourceType: 'manual',
        dataSourceName: '',
        dataSourceConfig: {},
        thresholdType: 'below',
        thresholdWarning: '',
        thresholdCritical: '',
        thresholdExcellent: '',
        thresholdRangeMin: '',
        thresholdRangeMax: '',
        responsibles: [],
        changeNotes: '',
      });
    }
  }, [kpi, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const kpiData: Partial<KPI> = {
        name: formData.name,
        description: formData.description,
        metric: formData.metric,
        unit: formData.unit,
        category: formData.category,
        enabled: formData.enabled,
        target: formData.target ? parseFloat(formData.target) : undefined,
        isCustom: formData.isCustom,
        family: formData.family || undefined,
        frameworkId: formData.frameworkId || undefined,
        autoCalculate: formData.autoCalculate,
        calculationFrequency: formData.calculationFrequency,
      };

      // Agregar fórmula si es personalizado
      if (formData.isCustom && formData.formula) {
        kpiData.formula = {
          id: kpi?.formula?.id || Date.now().toString(),
          formula: formData.formula,
          description: formData.formulaDescription,
          variables: [],
          createdAt: kpi?.formula?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Agregar fuente de datos si es personalizado
      if (formData.isCustom && formData.dataSourceType !== 'manual') {
        kpiData.dataSource = {
          id: kpi?.dataSource?.id || Date.now().toString(),
          name: formData.dataSourceName || formData.name,
          type: formData.dataSourceType,
          config: formData.dataSourceConfig,
          enabled: true,
          createdAt: kpi?.dataSource?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Agregar umbrales
      if (formData.thresholdWarning || formData.thresholdCritical || formData.thresholdExcellent) {
        kpiData.thresholds = {
          type: formData.thresholdType,
          warning: formData.thresholdWarning ? parseFloat(formData.thresholdWarning) : undefined,
          critical: formData.thresholdCritical ? parseFloat(formData.thresholdCritical) : undefined,
          excellent: formData.thresholdExcellent ? parseFloat(formData.thresholdExcellent) : undefined,
          rangeMin: formData.thresholdRangeMin ? parseFloat(formData.thresholdRangeMin) : undefined,
          rangeMax: formData.thresholdRangeMax ? parseFloat(formData.thresholdRangeMax) : undefined,
        };
      }

      // Agregar responsables
      if (formData.responsibles.length > 0) {
        kpiData.responsibles = formData.responsibles.map(r => ({
          userId: r.userId,
          userName: r.userName,
          email: r.email,
          canEdit: true,
          canView: true,
          notifyOnThreshold: true,
          notifyOnCritical: true,
        }));
      }

      if (kpi) {
        await updateKPI(
          kpi.id, 
          kpiData, 
          true, // createVersion
          formData.changeNotes || undefined,
          'user-1', // userId - en producción usar usuario actual
          'Usuario' // userName - en producción usar nombre del usuario actual
        );
      } else {
        await createKPI({
          ...kpiData,
          role: [role],
        } as KPI);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving KPI:', error);
      alert('Error al guardar el KPI');
    }
  };

  const addResponsible = () => {
    const userName = prompt('Nombre del responsable:');
    if (userName) {
      setFormData({
        ...formData,
        responsibles: [...formData.responsibles, { userId: Date.now().toString(), userName }],
      });
    }
  };

  const removeResponsible = (index: number) => {
    setFormData({
      ...formData,
      responsibles: formData.responsibles.filter((_, i) => i !== index),
    });
  };

  // Cargar frameworks disponibles
  const [frameworks, setFrameworks] = useState<KPIFramework[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem(`kpi-frameworks-${role}`);
    if (saved) {
      setFrameworks(JSON.parse(saved));
    }
  }, [role]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={kpi ? 'Editar KPI' : 'Nuevo KPI'}
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs de secciones */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveSection('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Básico
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('custom')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'custom'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-1" />
              Personalizado
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('family')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'family'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Familia/Marco
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeSection === 'basic' && (
            <>
              <Input
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Textarea
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                label="Métrica"
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                placeholder="facturacion, adherencia, ocupacion..."
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Unidad"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="€, %, clientes..."
                  required
                />
                <Input
                  label="Categoría"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="financiero, operacional..."
                  required
                />
              </div>
              <Input
                label="Objetivo (opcional)"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="Valor objetivo"
              />
              {kpi && (
                <Textarea
                  label="Notas de Cambio (opcional)"
                  value={formData.changeNotes}
                  onChange={(e) => setFormData({ ...formData, changeNotes: e.target.value })}
                  placeholder="Describe los cambios realizados en esta versión..."
                  rows={3}
                />
              )}
            </>
          )}

          {activeSection === 'custom' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="isCustom"
                  checked={formData.isCustom}
                  onChange={(e) => setFormData({ ...formData, isCustom: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isCustom" className="text-sm font-medium text-gray-700">
                  KPI Personalizado (con fórmula y cálculo automático)
                </label>
              </div>

              {formData.isCustom && (
                <>
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calculator className="w-4 h-4 inline mr-1" />
                        Fórmula de Cálculo
                      </label>
                      <Textarea
                        value={formData.formula}
                        onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                        placeholder="Ej: SUM(facturacion_mensual) / COUNT(clientes_activos)"
                        rows={3}
                      />
                      <Input
                        label="Descripción de la fórmula"
                        value={formData.formulaDescription}
                        onChange={(e) => setFormData({ ...formData, formulaDescription: e.target.value })}
                        placeholder="Explicación de cómo se calcula el KPI"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Database className="w-4 h-4 inline mr-1" />
                        Fuente de Datos
                      </label>
                      <Select
                        value={formData.dataSourceType}
                        onChange={(e) => setFormData({ ...formData, dataSourceType: e.target.value as DataSourceType })}
                        options={[
                          { value: 'manual', label: 'Manual' },
                          { value: 'api', label: 'API Externa' },
                          { value: 'database', label: 'Base de Datos' },
                          { value: 'calculation', label: 'Cálculo' },
                          { value: 'external', label: 'Sistema Externo' },
                        ]}
                      />
                      {formData.dataSourceType !== 'manual' && (
                        <Input
                          label="Nombre de la fuente"
                          value={formData.dataSourceName}
                          onChange={(e) => setFormData({ ...formData, dataSourceName: e.target.value })}
                          className="mt-2"
                          placeholder="Nombre descriptivo de la fuente"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Umbrales
                      </label>
                      <Select
                        label="Tipo de umbral"
                        value={formData.thresholdType}
                        onChange={(e) => setFormData({ ...formData, thresholdType: e.target.value as any })}
                        options={[
                          { value: 'below', label: 'Por debajo' },
                          { value: 'above', label: 'Por encima' },
                          { value: 'range', label: 'Rango' },
                        ]}
                      />
                      {formData.thresholdType === 'range' ? (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <Input
                            label="Mínimo"
                            type="number"
                            value={formData.thresholdRangeMin}
                            onChange={(e) => setFormData({ ...formData, thresholdRangeMin: e.target.value })}
                            placeholder="Valor mínimo"
                          />
                          <Input
                            label="Máximo"
                            type="number"
                            value={formData.thresholdRangeMax}
                            onChange={(e) => setFormData({ ...formData, thresholdRangeMax: e.target.value })}
                            placeholder="Valor máximo"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <Input
                            label="Advertencia"
                            type="number"
                            value={formData.thresholdWarning}
                            onChange={(e) => setFormData({ ...formData, thresholdWarning: e.target.value })}
                            placeholder="Umbral advertencia"
                          />
                          <Input
                            label="Crítico"
                            type="number"
                            value={formData.thresholdCritical}
                            onChange={(e) => setFormData({ ...formData, thresholdCritical: e.target.value })}
                            placeholder="Umbral crítico"
                          />
                          <Input
                            label="Excelente"
                            type="number"
                            value={formData.thresholdExcellent}
                            onChange={(e) => setFormData({ ...formData, thresholdExcellent: e.target.value })}
                            placeholder="Umbral excelente"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Responsables
                      </label>
                      <div className="space-y-2">
                        {formData.responsibles.map((resp, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span className="flex-1">{resp.userName}</span>
                            <button
                              type="button"
                              onClick={() => removeResponsible(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addResponsible} size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Responsable
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cálculo Automático
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="autoCalculate"
                          checked={formData.autoCalculate}
                          onChange={(e) => setFormData({ ...formData, autoCalculate: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="autoCalculate" className="text-sm text-gray-700">
                          Calcular automáticamente
                        </label>
                      </div>
                      {formData.autoCalculate && (
                        <Select
                          label="Frecuencia de cálculo"
                          value={formData.calculationFrequency}
                          onChange={(e) => setFormData({ ...formData, calculationFrequency: e.target.value as any })}
                          options={[
                            { value: 'realtime', label: 'Tiempo real' },
                            { value: 'hourly', label: 'Cada hora' },
                            { value: 'daily', label: 'Diario' },
                            { value: 'weekly', label: 'Semanal' },
                          ]}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeSection === 'family' && (
            <>
              <Select
                label="Familia"
                value={formData.family}
                onChange={(e) => setFormData({ ...formData, family: e.target.value as KPIFamily })}
                options={[
                  { value: '', label: 'Sin familia' },
                  { value: 'finanzas', label: 'Finanzas' },
                  { value: 'operaciones', label: 'Operaciones' },
                  { value: 'satisfaccion', label: 'Satisfacción' },
                  { value: 'salud', label: 'Salud' },
                ]}
              />
              {frameworks.length > 0 && (
                <Select
                  label="Marco/Framework (opcional)"
                  value={formData.frameworkId}
                  onChange={(e) => {
                    const framework = frameworks.find(f => f.id === e.target.value);
                    setFormData({
                      ...formData,
                      frameworkId: e.target.value,
                      family: framework?.family || formData.family,
                    });
                  }}
                  options={[
                    { value: '', label: 'Sin marco' },
                    ...frameworks.map(f => ({ value: f.id, label: f.name })),
                  ]}
                />
              )}
            </>
          )}
        </form>
      </div>
    </Modal>
  );
};

// Componente para gestionar familias y marcos
interface FamiliesManagerProps {
  frameworks: KPIFramework[];
  kpis: KPI[];
  role: 'entrenador' | 'gimnasio';
  onFrameworksChange: (frameworks: KPIFramework[]) => void;
  onKPIsChange: (kpis: KPI[]) => void;
}

const FamiliesManager: React.FC<FamiliesManagerProps> = ({
  frameworks,
  kpis,
  role,
  onFrameworksChange,
  onKPIsChange,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<KPIFamily | ''>('');
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState<KPIFramework | null>(null);

  const familyColors: Record<KPIFamily, string> = {
    finanzas: 'bg-green-100 text-green-800 border-green-300',
    operaciones: 'bg-blue-100 text-blue-800 border-blue-300',
    satisfaccion: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    salud: 'bg-red-100 text-red-800 border-red-300',
  };

  const familyLabels: Record<KPIFamily, string> = {
    finanzas: 'Finanzas',
    operaciones: 'Operaciones',
    satisfaccion: 'Satisfacción',
    salud: 'Salud',
  };

  const filteredKPIs = selectedFamily
    ? kpis.filter(kpi => kpi.family === selectedFamily)
    : kpis;

  const handleAssignFamily = (kpiId: string, family: KPIFamily) => {
    const updated = kpis.map(kpi =>
      kpi.id === kpiId ? { ...kpi, family } : kpi
    );
    onKPIsChange(updated);
    // Guardar cambios
    updateKPI(kpiId, { family }).catch(console.error);
  };

  const handleAssignFramework = (kpiId: string, frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    const updated = kpis.map(kpi =>
      kpi.id === kpiId
        ? { ...kpi, frameworkId, frameworkName: framework?.name, family: framework?.family || kpi.family }
        : kpi
    );
    onKPIsChange(updated);
    // Guardar cambios
    updateKPI(kpiId, { frameworkId, frameworkName: framework?.name, family: framework?.family }).catch(console.error);
  };

  const handleSaveFramework = (framework: KPIFramework) => {
    const updated = editingFramework
      ? frameworks.map(f => f.id === framework.id ? framework : f)
      : [...frameworks, framework];
    onFrameworksChange(updated);
    localStorage.setItem(`kpi-frameworks-${role}`, JSON.stringify(updated));
    setIsFrameworkModalOpen(false);
    setEditingFramework(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Organización de KPIs</h3>
            <p className="text-sm text-blue-700">
              Organiza tus KPIs en familias (finanzas, operaciones, satisfacción, salud) y marcos personalizados 
              para mantener orden y claridad en tu dashboard.
            </p>
          </div>
        </div>
      </Card>

      {/* Filtro por familia */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filtrar por familia:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFamily('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedFamily === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {(Object.keys(familyLabels) as KPIFamily[]).map(family => (
            <button
              key={family}
              onClick={() => setSelectedFamily(family)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${
                selectedFamily === family
                  ? familyColors[family] + ' border-current'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {familyLabels[family]}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Button variant="primary" onClick={() => setIsFrameworkModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Marco
          </Button>
        </div>
      </div>

      {/* Lista de KPIs */}
      <div className="space-y-4">
        {filteredKPIs.map(kpi => (
          <Card key={kpi.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{kpi.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Familia</label>
                  <Select
                    value={kpi.family || ''}
                    onChange={(e) => handleAssignFamily(kpi.id, e.target.value as KPIFamily)}
                    options={[
                      { value: '', label: 'Sin familia' },
                      ...(Object.keys(familyLabels) as KPIFamily[]).map(f => ({
                        value: f,
                        label: familyLabels[f],
                      })),
                    ]}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Marco</label>
                  <Select
                    value={kpi.frameworkId || ''}
                    onChange={(e) => handleAssignFramework(kpi.id, e.target.value)}
                    options={[
                      { value: '', label: 'Sin marco' },
                      ...frameworks.map(f => ({ value: f.id, label: f.name })),
                    ]}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de marco */}
      {isFrameworkModalOpen && (
        <FrameworkModal
          isOpen={isFrameworkModalOpen}
          onClose={() => {
            setIsFrameworkModalOpen(false);
            setEditingFramework(null);
          }}
          onSave={handleSaveFramework}
          framework={editingFramework}
        />
      )}
    </div>
  );
};

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (framework: KPIFramework) => void;
  framework?: KPIFramework | null;
}

const FrameworkModal: React.FC<FrameworkModalProps> = ({ isOpen, onClose, onSave, framework }) => {
  const [formData, setFormData] = useState({
    name: '',
    family: 'finanzas' as KPIFamily,
    description: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    if (framework) {
      setFormData({
        name: framework.name,
        family: framework.family,
        description: framework.description || '',
        color: framework.color || '#3B82F6',
      });
    } else {
      setFormData({
        name: '',
        family: 'finanzas',
        description: '',
        color: '#3B82F6',
      });
    }
  }, [framework, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: framework?.id || Date.now().toString(),
      ...formData,
      createdAt: framework?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={framework ? 'Editar Marco' : 'Nuevo Marco'}
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Marco"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Select
          label="Familia"
          value={formData.family}
          onChange={(e) => setFormData({ ...formData, family: e.target.value as KPIFamily })}
          options={[
            { value: 'finanzas', label: 'Finanzas' },
            { value: 'operaciones', label: 'Operaciones' },
            { value: 'satisfaccion', label: 'Satisfacción' },
            { value: 'salud', label: 'Salud' },
          ]}
          required
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          label="Color (hex)"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          type="color"
        />
      </form>
    </Modal>
  );
};

