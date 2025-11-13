import React, { useState, useEffect, useMemo } from 'react';
import { Objective, ObjectiveFilters, Metric, ObjectiveCheckIn } from '../types';
import { getObjectives, createObjective, updateObjective, deleteObjective, getObjectiveColor, createCheckIn, getCheckIns, addCheckInComment, cloneObjective, getObjectiveVersions } from '../api/objectives';
import { getPerformanceMetrics } from '../api/performance';
import { AISuggestedObjectives } from './AISuggestedObjectives';
import { QuickActionModal } from './QuickActionModal';
import { ObjectiveDependenciesView } from './ObjectiveDependenciesView';
import { ReminderConfigModal } from './ReminderConfigModal';
import { AIMicroActionsSuggestions } from './AIMicroActionsSuggestions';
import { AlertHistoryView } from './AlertHistoryView';
import { IntelligentActionPlanGenerator } from './IntelligentActionPlanGenerator';
import { AILearningSuggestions } from './AILearningSuggestions';
import { ObjectiveDocumentsManager } from './ObjectiveDocumentsManager';
import { AuditHistoryView } from './AuditHistoryView';
import { EconomicImpactView } from './EconomicImpactView';
import { ObsoleteObjectivesManager } from './ObsoleteObjectivesManager';
import { Card, Button, Table, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Target, Plus, Edit2, Trash2, Filter, X, Search, Loader2, LayoutGrid, List, TrendingUp, Calendar, BarChart3, Clock, Sparkles, Copy, GitBranch, Layers, CheckCircle2, FileText, MessageSquare, Upload, User, Image, Link as LinkIcon, Video, Paperclip, AlertTriangle, Settings, Network, Bell, History, CheckSquare, Square, FolderOpen, DollarSign, Archive } from 'lucide-react';

interface ObjectivesManagerProps {
  role: 'entrenador' | 'gimnasio';
}

export const ObjectivesManager: React.FC<ObjectivesManagerProps> = ({ role }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [filters, setFilters] = useState<ObjectiveFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMetrics, setCurrentMetrics] = useState<Metric[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  // User Story: Estados para clonación
  const [objectiveToClone, setObjectiveToClone] = useState<Objective | null>(null);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneVersionName, setCloneVersionName] = useState('');
  const [cloneVersionNotes, setCloneVersionNotes] = useState('');
  const [selectedObjectiveForVersions, setSelectedObjectiveForVersions] = useState<Objective | null>(null);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [objectiveVersions, setObjectiveVersions] = useState<Objective[]>([]);
  
  // User Story 2: Estados para check-ins
  const [selectedObjectiveForCheckIn, setSelectedObjectiveForCheckIn] = useState<Objective | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInFormData, setCheckInFormData] = useState({
    progress: 0,
    currentValue: 0,
    notes: '',
    evidence: [] as File[],
  });
  const [checkIns, setCheckIns] = useState<ObjectiveCheckIn[]>([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState<ObjectiveCheckIn | null>(null);
  const [showCheckInHistory, setShowCheckInHistory] = useState(false);
  
  // User Story 1: Estados para recordatorios automáticos
  const [selectedObjectiveForReminder, setSelectedObjectiveForReminder] = useState<Objective | null>(null);
  const [isReminderConfigModalOpen, setIsReminderConfigModalOpen] = useState(false);
  
  // User Story 2: Estados para sugerencias de IA de micro-acciones
  const [selectedObjectiveForAISuggestions, setSelectedObjectiveForAISuggestions] = useState<Objective | null>(null);
  
  // User Story 1: Estados para acciones rápidas (tareas/ajustes)
  const [selectedObjectiveForQuickAction, setSelectedObjectiveForQuickAction] = useState<Objective | null>(null);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  
  // User Story 2: Estados para dependencias
  const [selectedObjectiveForDependencies, setSelectedObjectiveForDependencies] = useState<Objective | null>(null);
  const [showDependenciesModal, setShowDependenciesModal] = useState(false);
  
  // User Story 1: Estado para mapeador de planes de acción
  const [showActionPlanMapper, setShowActionPlanMapper] = useState(false);
  
  // User Story: Estados para historial de alertas
  const [selectedObjectiveForAlertHistory, setSelectedObjectiveForAlertHistory] = useState<Objective | null>(null);
  const [showAlertHistoryModal, setShowAlertHistoryModal] = useState(false);
  
  // User Story 2: Estados para selección múltiple y generación de planes de acción
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [isActionPlanGeneratorOpen, setIsActionPlanGeneratorOpen] = useState(false);
  
  // User Story 1: Estados para gestión de permisos
  const [selectedObjectiveForPermissions, setSelectedObjectiveForPermissions] = useState<Objective | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  
  // User Story 2: Estados para comentarios
  const [selectedObjectiveForComments, setSelectedObjectiveForComments] = useState<Objective | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  // User Story: Estado para mostrar gestor de objetivos obsoletos
  const [showObsoleteManager, setShowObsoleteManager] = useState(false);
  
  // User Story 1: Estados para impacto económico y operativo
  const [selectedObjectiveForImpact, setSelectedObjectiveForImpact] = useState<Objective | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);

  useEffect(() => {
    loadObjectives();
    loadMetrics();
  }, [filters, role]);

  const loadMetrics = async () => {
    try {
      const metrics = await getPerformanceMetrics(role, 'mes');
      setCurrentMetrics(metrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadObjectives = async () => {
    setLoading(true);
    try {
      const data = await getObjectives(filters, role);
      setObjectives(data);
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingObjective(null);
    setIsModalOpen(true);
  };

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este objetivo?')) {
      try {
        await deleteObjective(id);
        loadObjectives();
      } catch (error) {
        console.error('Error deleting objective:', error);
      }
    }
  };

  // User Story: Handler para clonar objetivo
  const handleClone = (objective: Objective) => {
    setObjectiveToClone(objective);
    setCloneVersionName('');
    setCloneVersionNotes('');
    setShowCloneModal(true);
  };

  // User Story: Handler para confirmar clonación
  const handleConfirmClone = async () => {
    if (!objectiveToClone || !cloneVersionName.trim()) {
      alert('Por favor, ingresa un nombre de versión');
      return;
    }

    try {
      await cloneObjective(
        objectiveToClone.id,
        cloneVersionName,
        cloneVersionNotes || undefined,
        'user' // En producción, usar el ID del usuario actual
      );
      setShowCloneModal(false);
      setObjectiveToClone(null);
      setCloneVersionName('');
      setCloneVersionNotes('');
      loadObjectives();
    } catch (error) {
      console.error('Error cloning objective:', error);
      alert('Error al clonar el objetivo');
    }
  };

  // User Story: Handler para ver versiones
  const handleViewVersions = async (objective: Objective) => {
    setSelectedObjectiveForVersions(objective);
    try {
      const versions = await getObjectiveVersions(objective.version?.parentObjectiveId || objective.id);
      setObjectiveVersions(versions);
      setShowVersionsModal(true);
    } catch (error) {
      console.error('Error loading versions:', error);
      alert('Error al cargar las versiones');
    }
  };

  // User Story 1: Mapear estados a "on track", "at risk", "off track"
  const getStatusLabel = (status: Objective['status'], progress: number): string => {
    if (status === 'achieved') return 'Alcanzado';
    if (status === 'at_risk' || (status === 'in_progress' && progress < 50)) return 'At Risk';
    if (status === 'failed') return 'Off Track';
    if (status === 'in_progress') return 'On Track';
    return 'No iniciado';
  };

  const getStatusBadge = (status: Objective['status'], progress: number = 0) => {
    const label = getStatusLabel(status, progress);
    let variant: 'green' | 'yellow' | 'red' | 'blue' | 'purple' = 'blue';
    
    if (label === 'On Track' || label === 'Alcanzado') variant = 'green';
    else if (label === 'At Risk') variant = 'yellow';
    else if (label === 'Off Track') variant = 'red';
    else if (status === 'in_progress') variant = 'purple';
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  // User Story 2: Handler para abrir modal de check-in
  const handleOpenCheckIn = (objective: Objective) => {
    setSelectedObjectiveForCheckIn(objective);
    setCheckInFormData({
      progress: objective.progress,
      currentValue: objective.currentValue,
      notes: '',
      evidence: [],
    });
    setIsCheckInModalOpen(true);
  };

  // User Story 2: Handler para guardar check-in
  const handleSaveCheckIn = async () => {
    if (!selectedObjectiveForCheckIn) return;

    try {
      // Calcular progreso basado en el valor actual
      const progress = Math.min((checkInFormData.currentValue / selectedObjectiveForCheckIn.targetValue) * 100, 100);
      
      // Convertir archivos a evidencias (simulado - en producción se subirían a un servidor)
      const evidence = checkInFormData.evidence.map((file, idx) => ({
        type: file.type.startsWith('image/') ? 'image' as const : 
              file.type.startsWith('video/') ? 'video' as const : 'document' as const,
        url: URL.createObjectURL(file), // En producción sería la URL del servidor
        name: file.name,
        description: '',
      }));

      await createCheckIn(selectedObjectiveForCheckIn.id, {
        progress,
        currentValue: checkInFormData.currentValue,
        notes: checkInFormData.notes || undefined,
        evidence: evidence.length > 0 ? evidence : undefined,
        createdBy: 'user', // En producción usar el ID del usuario actual
        createdByName: 'Manager', // En producción usar el nombre del usuario actual
      });

      setIsCheckInModalOpen(false);
      setSelectedObjectiveForCheckIn(null);
      setCheckInFormData({ progress: 0, currentValue: 0, notes: '', evidence: [] });
      loadObjectives();
    } catch (error) {
      console.error('Error creating check-in:', error);
      alert('Error al registrar el check-in');
    }
  };

  // User Story 2: Handler para ver historial de check-ins
  const handleViewCheckInHistory = async (objective: Objective) => {
    setSelectedObjectiveForCheckIn(objective);
    try {
      const history = await getCheckIns(objective.id);
      setCheckIns(history);
      setShowCheckInHistory(true);
    } catch (error) {
      console.error('Error loading check-ins:', error);
      alert('Error al cargar el historial de check-ins');
    }
  };

  // User Story: Handler para ver historial de alertas
  const handleViewAlertHistory = (objective: Objective) => {
    setSelectedObjectiveForAlertHistory(objective);
    setShowAlertHistoryModal(true);
  };

  // User Story 1: Handler para abrir modal de configuración de recordatorios
  const handleOpenReminderConfig = (objective: Objective) => {
    setSelectedObjectiveForReminder(objective);
    setIsReminderConfigModalOpen(true);
  };

  // User Story 2: Handler para ver sugerencias de IA de micro-acciones
  const handleViewAISuggestions = (objective: Objective) => {
    setSelectedObjectiveForAISuggestions(objective);
  };

  // User Story 1: Handler para abrir modal de acción rápida
  const handleOpenQuickAction = (objective: Objective) => {
    setSelectedObjectiveForQuickAction(objective);
    setIsQuickActionModalOpen(true);
  };

  // User Story 2: Handler para ver dependencias
  const handleViewDependencies = (objective: Objective) => {
    setSelectedObjectiveForDependencies(objective);
    setShowDependenciesModal(true);
  };

  // Helper para detectar si un objetivo tiene bloqueos
  const hasBlockers = (objective: Objective): boolean => {
    return objective.status === 'at_risk' || 
           objective.status === 'failed' || 
           objective.progress < 50;
  };

  // User Story 2: Handler para toggle de selección
  const handleToggleSelection = (objectiveId: string) => {
    const newSelected = new Set(selectedObjectives);
    if (newSelected.has(objectiveId)) {
      newSelected.delete(objectiveId);
    } else {
      newSelected.add(objectiveId);
    }
    setSelectedObjectives(newSelected);
  };

  // User Story 2: Handler para seleccionar todos
  const handleSelectAll = () => {
    if (selectedObjectives.size === filteredObjectives.length) {
      setSelectedObjectives(new Set());
    } else {
      setSelectedObjectives(new Set(filteredObjectives.map(obj => obj.id)));
    }
  };

  // User Story 2: Handler para abrir generador de planes de acción
  const handleOpenActionPlanGenerator = () => {
    if (selectedObjectives.size === 0) {
      alert('Por favor, selecciona al menos un objetivo para generar el plan de acción');
      return;
    }
    setIsActionPlanGeneratorOpen(true);
  };

  const columns = [
    {
      key: '_select',
      label: '',
      render: (_: any, row: Objective) => (
        <button
          onClick={() => handleToggleSelection(row.id)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          {selectedObjectives.has(row.id) ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </button>
      ),
    },
    {
      key: 'title',
      label: 'Objetivo',
      render: (value: string, row: Objective) => (
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
      key: 'progress',
      label: 'Progreso',
      render: (value: number, row: Objective) => (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-900">
              {value.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500">
              {row.currentValue} / {row.targetValue} {row.unit}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            {(() => {
              const color = getObjectiveColor(row);
              const colorClass = color === 'green' ? 'bg-green-600' : color === 'yellow' ? 'bg-yellow-600' : color === 'red' ? 'bg-red-600' : value >= 100 ? 'bg-green-600' : value >= 75 ? 'bg-blue-600' : value >= 50 ? 'bg-yellow-600' : 'bg-red-600';
              return (
                <div
                  className={`h-2 rounded-full ${colorClass}`}
                  style={{ width: `${Math.min(value, 100)}%` }}
                />
              );
            })()}
          </div>
        </div>
      ),
    },
    {
      key: 'responsible',
      label: 'Responsable',
      render: (_: any, row: Objective) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {row.responsibleName || row.responsible || row.smartFields?.responsible?.userName || 'Sin asignar'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: Objective['status'], row: Objective) => getStatusBadge(value, row.progress),
    },
    {
      key: 'deadline',
      label: 'Fecha límite',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Objective) => (
        <div className="flex gap-2">
          {hasBlockers(row) && (
            <button
              onClick={() => handleOpenQuickAction(row)}
              className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
              title="Acción rápida (bloqueo detectado)"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleViewDependencies(row)}
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Ver dependencias"
          >
            <Network className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenCheckIn(row)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Registrar Check-in"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewCheckInHistory(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Ver Historial de Check-ins"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewAlertHistory(row)}
            className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
            title="Ver Historial de Alertas"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedObjectiveForImpact(row);
              setShowImpactModal(true);
            }}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Ver Impacto Económico y Operativo"
          >
            <DollarSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedObjectiveForDocuments(row);
              setShowDocumentsModal(true);
            }}
            className="p-2 rounded-lg text-teal-600 hover:bg-teal-50 transition-all"
            title="Gestionar Documentación"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedObjectiveForAudit(row);
              setShowAuditHistoryModal(true);
            }}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
            title="Ver Historial de Auditoría"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenReminderConfig(row)}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
            title="Configurar Recordatorios"
          >
            <Bell className="w-4 h-4" />
          </button>
          {(row.status === 'at_risk' || row.progress < 50) && (
            <button
              onClick={() => handleViewAISuggestions(row)}
              className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Ver Sugerencias de IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleClone(row)}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
            title="Clonar"
          >
            <Copy className="w-4 h-4" />
          </button>
          {row.version?.parentObjectiveId && (
            <button
              onClick={() => handleViewVersions(row)}
              className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
              title="Ver versiones"
            >
              <GitBranch className="w-4 h-4" />
            </button>
          )}
          {!row.version?.isClone && (
            <button
              onClick={() => handleViewVersions(row)}
              className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Ver versiones"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // User Story 1: Filtrar objetivos activos (in_progress, at_risk) y aplicar búsqueda
  const filteredObjectives = useMemo(() => {
    let filtered = [...objectives];
    
    // User Story 1: Filtrar solo objetivos activos (in_progress, at_risk)
    filtered = filtered.filter(obj => 
      obj.status === 'in_progress' || obj.status === 'at_risk'
    );
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(obj => 
        obj.title.toLowerCase().includes(query) ||
        obj.description?.toLowerCase().includes(query) ||
        obj.category.toLowerCase().includes(query) ||
        obj.responsibleName?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [objectives, searchQuery]);

  // User Story 1: Agrupar por estado para Kanban (solo objetivos activos)
  const kanbanColumns = useMemo(() => {
    // Solo mostrar columnas para estados activos (in_progress, at_risk)
    const statuses: { key: Objective['status']; label: string; color: string }[] = [
      { key: 'in_progress', label: 'On Track', color: 'bg-blue-100 border-blue-300' },
      { key: 'at_risk', label: 'At Risk', color: 'bg-yellow-100 border-yellow-300' },
    ];

    return statuses.map(status => ({
      ...status,
      items: filteredObjectives.filter(obj => obj.status === status.key),
    }));
  }, [filteredObjectives]);

  // Estadísticas de objetivos
  const stats = useMemo(() => {
    const total = filteredObjectives.length;
    const achieved = filteredObjectives.filter(o => o.status === 'achieved').length;
    const inProgress = filteredObjectives.filter(o => o.status === 'in_progress').length;
    const atRisk = filteredObjectives.filter(o => o.status === 'at_risk').length;
    const avgProgress = total > 0 
      ? filteredObjectives.reduce((acc, o) => acc + o.progress, 0) / total 
      : 0;

    return { total, achieved, inProgress, atRisk, avgProgress };
  }, [filteredObjectives]);

  // Objetivos próximos a vencer
  const upcomingObjectives = useMemo(() => {
    const now = new Date();
    return filteredObjectives
      .filter(obj => {
        const deadline = new Date(obj.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30 && obj.status !== 'achieved' && obj.status !== 'failed';
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [filteredObjectives]);

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.category ? 1 : 0) + (filters.responsible ? 1 : 0);

  const handleDragStart = (e: React.DragEvent, objectiveId: string) => {
    e.dataTransfer.setData('objectiveId', objectiveId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Objective['status']) => {
    e.preventDefault();
    const objectiveId = e.dataTransfer.getData('objectiveId');
    const objective = objectives.find(obj => obj.id === objectiveId);
    
    if (objective && objective.status !== newStatus) {
      try {
        await updateObjective(objectiveId, { status: newStatus });
        loadObjectives();
      } catch (error) {
        console.error('Error updating objective status:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior mejorado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 ring-1 ring-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4 inline mr-1" />
              Kanban
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedObjectives.size > 0 && (
            <Button variant="primary" onClick={handleOpenActionPlanGenerator}>
              <Sparkles size={18} className="mr-2" />
              Generar Plan de Acción ({selectedObjectives.size})
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowActionPlanMapper(true)}>
            <MapPin size={18} className="mr-2" />
            Mapear Planes de Acción
          </Button>
          <Button variant="secondary" onClick={() => setShowAISuggestions(!showAISuggestions)}>
            <Sparkles size={18} className="mr-2" />
            {showAISuggestions ? 'Ocultar' : 'Ver'} Sugerencias IA
          </Button>
          <Button variant="secondary" onClick={() => setShowObsoleteManager(!showObsoleteManager)}>
            <Archive size={18} className="mr-2" />
            {showObsoleteManager ? 'Ocultar' : 'Gestionar'} Obsoletos
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            <Plus size={20} className="mr-2" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      {/* User Story: Componente de sugerencias de IA */}
      {showAISuggestions && (
        <AISuggestedObjectives
          role={role}
          currentMetrics={currentMetrics}
          onObjectiveCreated={loadObjectives}
        />
      )}

      {/* User Story: Gestor de objetivos obsoletos */}
      {showObsoleteManager && (
        <ObsoleteObjectivesManager
          role={role}
          onObjectivesArchived={loadObjectives}
        />
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Alcanzados</p>
              <p className="text-2xl font-bold text-green-600">{stats.achieved}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">En Riesgo</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.atRisk}</p>
            </div>
            <X className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Progreso Medio</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Sistema de Filtros mejorado */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar objetivos por título, descripción o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="blue" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setFilters({})}
                >
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados mejorado */}
          {showFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as Objective['status'] || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'not_started', label: 'No iniciado' },
                      { value: 'in_progress', label: 'En progreso' },
                      { value: 'achieved', label: 'Alcanzado' },
                      { value: 'at_risk', label: 'En riesgo' },
                      { value: 'failed', label: 'Fallido' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Target size={16} className="inline mr-1" />
                    Categoría
                  </label>
                  <Input
                    value={filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                    placeholder="financiero, operacional..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha desde
                  </label>
                  <Input
                    type="date"
                    value={filters.deadlineFrom || ''}
                    onChange={(e) => setFilters({ ...filters, deadlineFrom: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.deadlineTo || ''}
                    onChange={(e) => setFilters({ ...filters, deadlineTo: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredObjectives.length} resultado{filteredObjectives.length !== 1 ? 's' : ''} encontrado{filteredObjectives.length !== 1 ? 's' : ''}</span>
            {activeFiltersCount > 0 && (
              <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Vista Kanban o Tabla */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : viewMode === 'kanban' ? (
        <div className="space-y-6">
          {/* Vista Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {kanbanColumns.map((column) => (
              <div
                key={column.key}
                className={`rounded-lg border-2 border-dashed ${column.color} p-4 min-h-[500px]`}
                onDrop={(e) => handleDrop(e, column.key)}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.label}</h3>
                  <Badge variant="blue">{column.items.length}</Badge>
                </div>
                <div className="space-y-3">
                  {column.items.map((objective) => (
                    <Card
                      key={objective.id}
                      className="p-3 bg-white shadow-sm cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, objective.id)}
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-900">{objective.title}</h4>
                        {objective.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{objective.description}</p>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-semibold">{objective.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                objective.progress >= 100 ? 'bg-green-600' :
                                objective.progress >= 75 ? 'bg-blue-600' :
                                objective.progress >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(objective.progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{objective.currentValue} / {objective.targetValue} {objective.unit}</span>
                          </div>
                        </div>
                        {/* User Story 1: Mostrar responsable */}
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{objective.responsibleName || objective.responsible || objective.smartFields?.responsible?.userName || 'Sin asignar'}</span>
                        </div>
                        {/* User Story 1: Mostrar estado */}
                        <div className="flex items-center gap-2">
                          {getStatusBadge(objective.status, objective.progress)}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(objective.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                            {objective.version && (
                              <Badge variant="purple" className="ml-1 text-xs">
                                {objective.version.version}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {hasBlockers(objective) && (
                              <button
                                onClick={() => handleOpenQuickAction(objective)}
                                className="p-1 rounded text-orange-600 hover:bg-orange-50 transition-all"
                                title="Acción rápida (bloqueo detectado)"
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDependencies(objective)}
                              className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-all"
                              title="Ver dependencias"
                            >
                              <Network className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleOpenCheckIn(objective)}
                              className="p-1 rounded text-green-600 hover:bg-green-50 transition-all"
                              title="Registrar Check-in"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleViewCheckInHistory(objective)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-all"
                              title="Ver Historial de Check-ins"
                            >
                              <FileText className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleViewAlertHistory(objective)}
                              className="p-1 rounded text-orange-600 hover:bg-orange-50 transition-all"
                              title="Ver Historial de Alertas"
                            >
                              <History className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleOpenReminderConfig(objective)}
                              className="p-1 rounded text-purple-600 hover:bg-purple-50 transition-all"
                              title="Configurar Recordatorios"
                            >
                              <Bell className="w-3 h-3" />
                            </button>
                            {(objective.status === 'at_risk' || objective.progress < 50) && (
                              <button
                                onClick={() => handleViewAISuggestions(objective)}
                                className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-all"
                                title="Ver Sugerencias de IA"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(objective)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleClone(objective)}
                              className="p-1 rounded text-purple-600 hover:bg-purple-50 transition-all"
                              title="Clonar"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {(objective.version?.parentObjectiveId || !objective.version?.isClone) && (
                              <button
                                onClick={() => handleViewVersions(objective)}
                                className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-all"
                                title="Ver versiones"
                              >
                                <Layers className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(objective.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-50 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {column.items.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No hay objetivos en este estado
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Table
          data={filteredObjectives}
          columns={columns}
          loading={false}
          emptyMessage="No hay objetivos registrados"
        />
      )}

      {/* Objetivos próximos a vencer */}
      {upcomingObjectives.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Objetivos Próximos a Vencer</h3>
            <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {upcomingObjectives.length}
            </span>
          </div>
          <div className="space-y-2">
            {upcomingObjectives.map((objective) => {
              const deadline = new Date(objective.deadline);
              const today = new Date();
              const diffTime = deadline.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={objective.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{objective.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span>Progreso: {objective.progress.toFixed(0)}%</span>
                      <span>Vence en {diffDays} día{diffDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          objective.progress >= 75 ? 'bg-green-600' :
                          objective.progress >= 50 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(objective.progress, 100)}%` }}
                      />
                    </div>
                    <button
                      onClick={() => handleEdit(objective)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <ObjectiveModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingObjective(null);
        }}
        onSave={loadObjectives}
        objective={editingObjective}
        role={role}
      />

      {/* User Story: Modal para clonar objetivo */}
      {showCloneModal && objectiveToClone && (
        <Modal
          isOpen={showCloneModal}
          onClose={() => {
            setShowCloneModal(false);
            setObjectiveToClone(null);
            setCloneVersionName('');
            setCloneVersionNotes('');
          }}
          title="Clonar Objetivo"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCloneModal(false);
                  setObjectiveToClone(null);
                  setCloneVersionName('');
                  setCloneVersionNotes('');
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleConfirmClone}>
                <Copy className="w-4 h-4 mr-2" />
                Clonar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo a clonar
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-900">{objectiveToClone.title}</div>
                {objectiveToClone.description && (
                  <div className="text-sm text-gray-600 mt-1">{objectiveToClone.description}</div>
                )}
              </div>
            </div>
            <Input
              label="Nombre de la versión"
              value={cloneVersionName}
              onChange={(e) => setCloneVersionName(e.target.value)}
              placeholder="Ej: Plan A, Plan B, v1, v2..."
              required
            />
            <Textarea
              label="Notas de la versión (opcional)"
              value={cloneVersionNotes}
              onChange={(e) => setCloneVersionNotes(e.target.value)}
              placeholder="Describe las diferencias o cambios de esta versión..."
              rows={3}
            />
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Copy className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <strong>Nota:</strong> El objetivo clonado se creará con el estado "No iniciado" y progreso 0%.
                  Los vínculos con KPIs, tareas y planes de acción no se clonarán.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* User Story: Modal para ver versiones */}
      {showVersionsModal && selectedObjectiveForVersions && (
        <VersionsModalComponent
          isOpen={showVersionsModal}
          onClose={() => {
            setShowVersionsModal(false);
            setSelectedObjectiveForVersions(null);
            setObjectiveVersions([]);
          }}
          objective={selectedObjectiveForVersions}
          versions={objectiveVersions}
          onEdit={handleEdit}
          onClone={handleClone}
        />
      )}

      {/* User Story 2: Modal para registrar check-in */}
      {isCheckInModalOpen && selectedObjectiveForCheckIn && (
        <Modal
          isOpen={isCheckInModalOpen}
          onClose={() => {
            setIsCheckInModalOpen(false);
            setSelectedObjectiveForCheckIn(null);
            setCheckInFormData({ progress: 0, currentValue: 0, notes: '', evidence: [] });
          }}
          title={`Registrar Check-in: ${selectedObjectiveForCheckIn.title}`}
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCheckInModalOpen(false);
                  setSelectedObjectiveForCheckIn(null);
                  setCheckInFormData({ progress: 0, currentValue: 0, notes: '', evidence: [] });
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveCheckIn}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Guardar Check-in
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Actual
                </label>
                <Input
                  type="number"
                  value={checkInFormData.currentValue}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setCheckInFormData({ ...checkInFormData, currentValue: value });
                  }}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Objetivo: {selectedObjectiveForCheckIn.targetValue} {selectedObjectiveForCheckIn.unit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progreso Calculado
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.min((checkInFormData.currentValue / selectedObjectiveForCheckIn.targetValue) * 100, 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((checkInFormData.currentValue / selectedObjectiveForCheckIn.targetValue) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <Textarea
                value={checkInFormData.notes}
                onChange={(e) => setCheckInFormData({ ...checkInFormData, notes: e.target.value })}
                placeholder="Añade notas sobre el progreso, obstáculos, logros, etc."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidencias (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setCheckInFormData({ ...checkInFormData, evidence: files });
                  }}
                  className="hidden"
                  id="evidence-upload"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="evidence-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Haz clic para subir archivos o arrastra y suelta
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Imágenes, videos, documentos (PDF, DOC, DOCX)
                  </span>
                </label>
                {checkInFormData.evidence.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {checkInFormData.evidence.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newEvidence = checkInFormData.evidence.filter((_, i) => i !== idx);
                            setCheckInFormData({ ...checkInFormData, evidence: newEvidence });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* User Story 2: Modal para ver historial de check-ins */}
      {showCheckInHistory && selectedObjectiveForCheckIn && (
        <Modal
          isOpen={showCheckInHistory}
          onClose={() => {
            setShowCheckInHistory(false);
            setSelectedObjectiveForCheckIn(null);
            setCheckIns([]);
          }}
          title={`Historial de Check-ins: ${selectedObjectiveForCheckIn.title}`}
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCheckInHistory(false);
                  setSelectedObjectiveForCheckIn(null);
                  setCheckIns([]);
                }}
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowCheckInHistory(false);
                  handleOpenCheckIn(selectedObjectiveForCheckIn);
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Nuevo Check-in
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {checkIns.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay check-ins registrados para este objetivo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {checkIns
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((checkIn) => (
                    <Card key={checkIn.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {new Date(checkIn.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{checkIn.createdByName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {checkIn.progress.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {checkIn.currentValue} / {selectedObjectiveForCheckIn.targetValue} {selectedObjectiveForCheckIn.unit}
                          </div>
                        </div>
                      </div>

                      {checkIn.notes && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{checkIn.notes}</p>
                        </div>
                      )}

                      {checkIn.evidence && checkIn.evidence.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Evidencias:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {checkIn.evidence.map((ev) => (
                              <div key={ev.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                {ev.type === 'image' && <Image className="w-4 h-4 text-gray-400" />}
                                {ev.type === 'video' && <Video className="w-4 h-4 text-gray-400" />}
                                {ev.type === 'document' && <FileText className="w-4 h-4 text-gray-400" />}
                                {ev.type === 'link' && <LinkIcon className="w-4 h-4 text-gray-400" />}
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {ev.name}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {checkIn.comments && checkIn.comments.length > 0 && (
                        <div className="border-t border-gray-200 pt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Comentarios:</div>
                          <div className="space-y-2">
                            {checkIn.comments.map((comment) => (
                              <div key={comment.id} className="p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs font-medium text-gray-700">{comment.createdByName}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* User Story 1: Modal para acciones rápidas (tareas/ajustes) */}
      <QuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => {
          setIsQuickActionModalOpen(false);
          setSelectedObjectiveForQuickAction(null);
        }}
        objective={selectedObjectiveForQuickAction}
        onActionComplete={loadObjectives}
      />

      {/* User Story 2: Modal para visualizar dependencias */}
      {showDependenciesModal && selectedObjectiveForDependencies && (
        <Modal
          isOpen={showDependenciesModal}
          onClose={() => {
            setShowDependenciesModal(false);
            setSelectedObjectiveForDependencies(null);
          }}
          title={`Dependencias: ${selectedObjectiveForDependencies.title}`}
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDependenciesModal(false);
                  setSelectedObjectiveForDependencies(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          }
        >
          <ObjectiveDependenciesView
            objective={selectedObjectiveForDependencies}
            onDependencyCreated={loadObjectives}
          />
        </Modal>
      )}

      {/* User Story 1: Modal para mapear objetivos a planes de acción */}
      {showActionPlanMapper && (
        <Modal
          isOpen={showActionPlanMapper}
          onClose={() => setShowActionPlanMapper(false)}
          title="Mapeo de Objetivos a Planes de Acción"
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowActionPlanMapper(false)}
              >
                Cerrar
              </Button>
            </div>
          }
        >
          <ObjectiveActionPlanMapper
            role={role}
            onClose={() => setShowActionPlanMapper(false)}
          />
        </Modal>
      )}

      {/* User Story 1: Modal para configurar recordatorios automáticos */}
      <ReminderConfigModal
        isOpen={isReminderConfigModalOpen}
        onClose={() => {
          setIsReminderConfigModalOpen(false);
          setSelectedObjectiveForReminder(null);
        }}
        objective={selectedObjectiveForReminder}
        onSave={loadObjectives}
      />

      {/* User Story 2: Modal para mostrar sugerencias de IA de micro-acciones */}
      {selectedObjectiveForAISuggestions && (
        <Modal
          isOpen={!!selectedObjectiveForAISuggestions}
          onClose={() => {
            setSelectedObjectiveForAISuggestions(null);
          }}
          title={`Sugerencias de IA: ${selectedObjectiveForAISuggestions.title}`}
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedObjectiveForAISuggestions(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          }
        >
          <AIMicroActionsSuggestions
            objective={selectedObjectiveForAISuggestions}
            onSuggestionApplied={() => {
              loadObjectives();
              setSelectedObjectiveForAISuggestions(null);
            }}
          />
        </Modal>
      )}

      {/* User Story: Modal para ver historial de alertas por objetivo */}
      {showAlertHistoryModal && selectedObjectiveForAlertHistory && (
        <Modal
          isOpen={showAlertHistoryModal}
          onClose={() => {
            setShowAlertHistoryModal(false);
            setSelectedObjectiveForAlertHistory(null);
          }}
          title={`Historial de Alertas: ${selectedObjectiveForAlertHistory.title}`}
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAlertHistoryModal(false);
                  setSelectedObjectiveForAlertHistory(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          }
        >
          <AlertHistoryView
            objective={selectedObjectiveForAlertHistory}
            onClose={() => {
              setShowAlertHistoryModal(false);
              setSelectedObjectiveForAlertHistory(null);
            }}
          />
        </Modal>
      )}

      {/* User Story 2: Modal para generar plan de acción inteligente */}
      <IntelligentActionPlanGenerator
        isOpen={isActionPlanGeneratorOpen}
        onClose={() => {
          setIsActionPlanGeneratorOpen(false);
          setSelectedObjectives(new Set());
        }}
        selectedObjectives={filteredObjectives.filter(obj => selectedObjectives.has(obj.id))}
        role={role}
        onPlanCreated={() => {
          loadObjectives();
          setSelectedObjectives(new Set());
        }}
      />

      {/* User Story 1: Modal de gestión de permisos */}
      {selectedObjectiveForPermissions && (
        <PermissionsManager
          objective={selectedObjectiveForPermissions}
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedObjectiveForPermissions(null);
          }}
          onSave={async (permissions) => {
            await updateObjectivePermissions(selectedObjectiveForPermissions.id, permissions);
            loadObjectives();
          }}
        />
      )}

      {/* User Story 2: Modal de comentarios */}
      {selectedObjectiveForComments && (
        <Modal
          isOpen={showCommentsModal}
          onClose={() => {
            setShowCommentsModal(false);
            setSelectedObjectiveForComments(null);
          }}
          title={`Comentarios - ${selectedObjectiveForComments.title}`}
          size="xl"
        >
          <ObjectiveKPIComments
            objectiveId={selectedObjectiveForComments.id}
            onCommentAdded={loadObjectives}
          />
        </Modal>
      )}

      {/* User Story 1: Modal para gestionar documentación */}
      {selectedObjectiveForDocuments && (
        <Modal
          isOpen={showDocumentsModal}
          onClose={() => {
            setShowDocumentsModal(false);
            setSelectedObjectiveForDocuments(null);
          }}
          title={`Documentación - ${selectedObjectiveForDocuments.title}`}
          size="lg"
        >
          <ObjectiveDocumentsManager
            objectiveId={selectedObjectiveForDocuments.id}
            objectiveTitle={selectedObjectiveForDocuments.title}
            onDocumentsChange={() => {
              loadObjectives();
            }}
          />
        </Modal>
      )}

      {/* User Story 2: Modal para historial de auditoría */}
      {selectedObjectiveForAudit && (
        <Modal
          isOpen={showAuditHistoryModal}
          onClose={() => {
            setShowAuditHistoryModal(false);
            setSelectedObjectiveForAudit(null);
          }}
          title={`Historial de Auditoría - ${selectedObjectiveForAudit.title}`}
          size="lg"
        >
          <AuditHistoryView
            entityType="objective"
            entityId={selectedObjectiveForAudit.id}
            entityName={selectedObjectiveForAudit.title}
            showFilters={true}
          />
        </Modal>
      )}

    </div>
  );
};

interface ObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  objective?: Objective | null;
  role: 'entrenador' | 'gimnasio';
}

const ObjectiveModal: React.FC<ObjectiveModalProps> = ({ isOpen, onClose, onSave, objective, role }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    metric: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    deadline: '',
    category: '',
  });

  useEffect(() => {
    if (objective) {
      setFormData({
        title: objective.title,
        description: objective.description || '',
        metric: objective.metric,
        targetValue: objective.targetValue.toString(),
        currentValue: objective.currentValue.toString(),
        unit: objective.unit,
        deadline: objective.deadline,
        category: objective.category,
        objectiveType: objective.objectiveType || '',
        horizon: objective.horizon || '',
        assignmentType: objective.assignment?.type || '',
        assignmentId: objective.assignment?.id || '',
        assignmentName: objective.assignment?.name || '',
        permissionsView: objective.permissions?.view || [],
        permissionsEdit: objective.permissions?.edit || [],
        permissionsApprove: objective.permissions?.approve || [],
        thresholdsEnabled: objective.colorThresholds?.enabled || false,
        thresholdGreen: objective.colorThresholds?.green || 80,
        thresholdYellow: objective.colorThresholds?.yellow || 50,
        thresholdRed: objective.colorThresholds?.red || 50,
        alertsEnabled: objective.automaticAlerts?.enabled || false,
        notifyOnYellow: objective.automaticAlerts?.notifyOnYellow ?? true,
        notifyOnRed: objective.automaticAlerts?.notifyOnRed ?? true,
        notifyOnDeviation: objective.automaticAlerts?.notifyOnDeviation ?? true,
        deviationThreshold: objective.automaticAlerts?.deviationThreshold || 10,
        notificationChannels: objective.automaticAlerts?.notificationChannels || ['in_app'],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        metric: '',
        targetValue: '',
        currentValue: '',
        unit: '',
        deadline: '',
        category: '',
        objectiveType: '',
        horizon: '',
        assignmentType: '',
        assignmentId: '',
        assignmentName: '',
        permissionsView: [],
        permissionsEdit: [],
        permissionsApprove: [],
        thresholdsEnabled: false,
        thresholdGreen: 80,
        thresholdYellow: 50,
        thresholdRed: 50,
        alertsEnabled: false,
        notifyOnYellow: true,
        notifyOnRed: true,
        notifyOnDeviation: true,
        deviationThreshold: 10,
        notificationChannels: ['in_app'],
      });
    }
  }, [objective, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (objective) {
        await updateObjective(objective.id, {
          ...formData,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
        });
      } else {
        await createObjective({
          ...formData,
          targetValue: parseFloat(formData.targetValue),
          currentValue: parseFloat(formData.currentValue),
          status: 'not_started',
          category: formData.category || 'general',
        } as any);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving objective:', error);
      alert('Error al guardar el objetivo');
    }
  };

  const metricOptions = role === 'entrenador'
    ? [
        { value: 'facturacion', label: 'Facturación Personal' },
        { value: 'adherencia', label: 'Adherencia de Clientes' },
        { value: 'retencion', label: 'Retención de Clientes' },
      ]
    : [
        { value: 'facturacion', label: 'Facturación Total' },
        { value: 'ocupacion', label: 'Ocupación Media' },
        { value: 'tasa_bajas', label: 'Tasa de Bajas' },
        { value: 'objetivos_comerciales', label: 'Objetivos Comerciales' },
      ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={objective ? 'Editar Objetivo' : 'Nuevo Objetivo'}
      size="lg"
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
          label="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Select
          label="Métrica"
          value={formData.metric}
          onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
          options={metricOptions}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valor Objetivo"
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
            required
          />
          <Input
            label="Valor Actual"
            type="number"
            value={formData.currentValue}
            onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unidad"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="€, %, clientes..."
            required
          />
          <Input
            label="Fecha Límite"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>
        <Input
          label="Categoría"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="financiero, operacional..."
        />

        {/* User Story 1: Sugerencias de IA basadas en aprendizaje */}
        {formData.metric && formData.category && (
          <div className="mt-4">
            <AILearningSuggestions
              objective={{
                id: objective?.id,
                metric: formData.metric,
                category: formData.category,
                targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
                deadline: formData.deadline || undefined,
              }}
              onSuggestionApplied={(suggestion) => {
                // Aplicar valores sugeridos al formulario
                if (suggestion.suggestedValues.newTargetValue) {
                  setFormData({ ...formData, targetValue: suggestion.suggestedValues.newTargetValue.toString() });
                }
                if (suggestion.suggestedValues.newDeadline) {
                  setFormData({ ...formData, deadline: suggestion.suggestedValues.newDeadline });
                }
              }}
            />
          </div>
        )}

        {/* User Story: Umbrales de color */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Umbrales de Color
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.thresholdsEnabled}
                onChange={(e) => setFormData({ ...formData, thresholdsEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Activar umbrales</span>
            </label>
          </div>
          {formData.thresholdsEnabled && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Verde (≥ %)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.thresholdGreen}
                  onChange={(e) => setFormData({ ...formData, thresholdGreen: parseInt(e.target.value) || 80 })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amarillo (≥ %)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.thresholdYellow}
                  onChange={(e) => setFormData({ ...formData, thresholdYellow: parseInt(e.target.value) || 50 })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rojo (&lt; %)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.thresholdRed}
                  onChange={(e) => setFormData({ ...formData, thresholdRed: parseInt(e.target.value) || 50 })}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* User Story: Alertas automáticas */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas Automáticas
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.alertsEnabled}
                onChange={(e) => setFormData({ ...formData, alertsEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Activar alertas</span>
            </label>
          </div>
          {formData.alertsEnabled && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyOnYellow}
                  onChange={(e) => setFormData({ ...formData, notifyOnYellow: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Alertar cuando entra en zona amarilla</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyOnRed}
                  onChange={(e) => setFormData({ ...formData, notifyOnRed: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Alertar cuando entra en zona roja</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={formData.notifyOnDeviation}
                    onChange={(e) => setFormData({ ...formData, notifyOnDeviation: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Alertar por desviación del progreso esperado</span>
                </label>
                {formData.notifyOnDeviation && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.deviationThreshold}
                      onChange={(e) => setFormData({ ...formData, deviationThreshold: parseInt(e.target.value) || 10 })}
                      className="w-20 text-sm"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

// User Story: Componente para ver y comparar versiones
interface VersionsModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective;
  versions: Objective[];
  onEdit: (objective: Objective) => void;
  onClone: (objective: Objective) => void;
}

const VersionsModalComponent: React.FC<VersionsModalComponentProps> = ({
  isOpen,
  onClose,
  objective,
  versions,
  onEdit,
  onClone,
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  // Separar objetivo original de versiones
  const originalObjective = versions.find(v => !v.version?.isClone || v.id === objective.id) || objective;
  const clonedVersions = versions.filter(v => v.version?.isClone && v.id !== originalObjective.id);

  const handleToggleVersion = (versionId: string) => {
    setSelectedVersions(prev =>
      prev.includes(versionId)
        ? prev.filter(id => id !== versionId)
        : [...prev, versionId]
    );
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      setCompareMode(true);
    } else {
      alert('Por favor, selecciona exactamente 2 versiones para comparar');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Versiones de: ${originalObjective.title}`}
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {selectedVersions.length === 2 && !compareMode && (
            <Button variant="primary" onClick={handleCompare}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparar
            </Button>
          )}
          {compareMode && (
            <Button variant="secondary" onClick={() => setCompareMode(false)}>
              Volver
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {!compareMode ? (
          <>
            {/* Objetivo original */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Original</h3>
                  <Badge variant="blue">Original</Badge>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(originalObjective)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onClone(originalObjective)}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                    title="Clonar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <div className="text-xs text-gray-600">Progreso</div>
                  <div className="text-lg font-semibold text-gray-900">{originalObjective.progress.toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Estado</div>
                  <Badge variant={originalObjective.status === 'achieved' ? 'green' : originalObjective.status === 'at_risk' ? 'yellow' : 'blue'}>
                    {originalObjective.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Valor</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {originalObjective.currentValue} / {originalObjective.targetValue} {originalObjective.unit}
                  </div>
                </div>
              </div>
            </div>

            {/* Versiones clonadas */}
            {clonedVersions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Versiones ({clonedVersions.length})
                </h4>
                <div className="space-y-3">
                  {clonedVersions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedVersions.includes(version.id)
                          ? 'bg-purple-50 border-purple-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedVersions.includes(version.id)}
                            onChange={() => handleToggleVersion(version.id)}
                            className="mt-1 w-4 h-4 text-purple-600 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold text-gray-900">{version.title}</h5>
                              <Badge variant="purple">{version.version?.version}</Badge>
                              {version.version?.versionNotes && (
                                <span className="text-xs text-gray-500">
                                  {version.version.versionNotes}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-xs text-gray-600">Progreso</div>
                                <div className="text-lg font-semibold text-gray-900">{version.progress.toFixed(0)}%</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Estado</div>
                                <Badge variant={version.status === 'achieved' ? 'green' : version.status === 'at_risk' ? 'yellow' : 'blue'}>
                                  {version.status}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Valor</div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {version.currentValue} / {version.targetValue} {version.unit}
                                </div>
                              </div>
                            </div>
                            {version.version?.clonedAt && (
                              <div className="text-xs text-gray-500 mt-2">
                                Clonado: {new Date(version.version.clonedAt).toLocaleDateString('es-ES')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(version)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onClone(version)}
                            className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                            title="Clonar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clonedVersions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No hay versiones clonadas de este objetivo.
              </div>
            )}
          </>
        ) : (
          /* Vista de comparación */
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Comparación de Versiones</h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedVersions.map((versionId) => {
                const version = versions.find(v => v.id === versionId);
                if (!version) return null;
                return (
                  <div key={versionId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <h5 className="font-semibold text-gray-900">{version.title}</h5>
                      <Badge variant="purple">{version.version?.version}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600">Progreso</div>
                        <div className="text-2xl font-bold text-gray-900">{version.progress.toFixed(0)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              version.progress >= 100 ? 'bg-green-600' :
                              version.progress >= 75 ? 'bg-blue-600' :
                              version.progress >= 50 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(version.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Estado</div>
                        <Badge variant={version.status === 'achieved' ? 'green' : version.status === 'at_risk' ? 'yellow' : 'blue'}>
                          {version.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Valor Actual / Objetivo</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {version.currentValue} / {version.targetValue} {version.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Fecha Límite</div>
                        <div className="text-sm text-gray-900">
                          {new Date(version.deadline).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      {version.version?.versionNotes && (
                        <div>
                          <div className="text-xs text-gray-600">Notas</div>
                          <div className="text-sm text-gray-700 mt-1">{version.version.versionNotes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

