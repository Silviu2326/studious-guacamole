import React, { useState, useEffect } from 'react';
import { AuditHistoryEntry, AuditHistoryFilters, AuditEntityType, AuditActionType } from '../types';
import { getAuditHistory, getEntityAuditHistory } from '../api/auditHistory';
import { Card, Button, Badge, Select, Input } from '../../../components/componentsreutilizables';
import { 
  History, 
  Filter, 
  X, 
  Search, 
  Loader2, 
  User, 
  Calendar, 
  FileText,
  Target,
  BarChart3,
  CheckSquare,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  Unlink,
  Copy,
  Archive,
  RotateCcw,
  Paperclip,
  FileX
} from 'lucide-react';

interface AuditHistoryViewProps {
  entityType?: AuditEntityType;
  entityId?: string;
  entityName?: string;
  showFilters?: boolean;
  limit?: number;
}

const actionIcons: Record<AuditActionType, React.ReactNode> = {
  create: <Plus className="w-4 h-4" />,
  update: <Edit2 className="w-4 h-4" />,
  delete: <Trash2 className="w-4 h-4" />,
  status_change: <ArrowRight className="w-4 h-4" />,
  assign: <User className="w-4 h-4" />,
  unassign: <User className="w-4 h-4" />,
  link: <LinkIcon className="w-4 h-4" />,
  unlink: <Unlink className="w-4 h-4" />,
  attach_document: <Paperclip className="w-4 h-4" />,
  remove_document: <FileX className="w-4 h-4" />,
  clone: <Copy className="w-4 h-4" />,
  archive: <Archive className="w-4 h-4" />,
  restore: <RotateCcw className="w-4 h-4" />,
};

const actionLabels: Record<AuditActionType, string> = {
  create: 'Creado',
  update: 'Actualizado',
  delete: 'Eliminado',
  status_change: 'Cambio de Estado',
  assign: 'Asignado',
  unassign: 'Desasignado',
  link: 'Vinculado',
  unlink: 'Desvinculado',
  attach_document: 'Documento Adjuntado',
  remove_document: 'Documento Eliminado',
  clone: 'Clonado',
  archive: 'Archivado',
  restore: 'Restaurado',
};

const entityTypeIcons: Record<AuditEntityType, React.ReactNode> = {
  objective: <Target className="w-4 h-4" />,
  kpi: <BarChart3 className="w-4 h-4" />,
  action_plan: <CheckSquare className="w-4 h-4" />,
};

const entityTypeLabels: Record<AuditEntityType, string> = {
  objective: 'Objetivo',
  kpi: 'KPI',
  action_plan: 'Plan de Acción',
};

const actionColors: Record<AuditActionType, 'green' | 'blue' | 'yellow' | 'red' | 'purple'> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  status_change: 'yellow',
  assign: 'purple',
  unassign: 'purple',
  link: 'blue',
  unlink: 'blue',
  attach_document: 'green',
  remove_document: 'red',
  clone: 'purple',
  archive: 'yellow',
  restore: 'green',
};

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  entityType,
  entityId,
  entityName,
  showFilters = true,
  limit,
}) => {
  const [history, setHistory] = useState<AuditHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditHistoryFilters>({
    entityType,
    entityId,
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHistory();
  }, [filters, entityType, entityId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      let data: AuditHistoryEntry[];
      
      if (entityType && entityId) {
        data = await getEntityAuditHistory(entityType, entityId);
      } else {
        data = await getAuditHistory(filters);
      }
      
      if (limit) {
        data = data.slice(0, limit);
      }
      
      setHistory(data);
    } catch (error) {
      console.error('Error loading audit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AuditHistoryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = () => {
    handleFilterChange('searchQuery', searchQuery);
  };

  const clearFilters = () => {
    setFilters({
      entityType,
      entityId,
    });
    setSearchQuery('');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">
            Historial de Auditoría
            {entityName && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - {entityName}
              </span>
            )}
          </h3>
        </div>
        {showFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        )}
      </div>

      {showFilters && showFiltersPanel && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Entidad
              </label>
              <Select
                value={filters.entityType || ''}
                onChange={(e) => handleFilterChange('entityType', e.target.value as AuditEntityType || undefined)}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'objective', label: 'Objetivo' },
                  { value: 'kpi', label: 'KPI' },
                  { value: 'action_plan', label: 'Plan de Acción' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Acción
              </label>
              <Select
                value={filters.action || ''}
                onChange={(e) => handleFilterChange('action', e.target.value as AuditActionType || undefined)}
                options={[
                  { value: '', label: 'Todas' },
                  ...Object.entries(actionLabels).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Buscar
              </label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por nombre de entidad o usuario..."
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </Card>
      )}

      {history.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          <History className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay registros de auditoría</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    actionColors[entry.action] === 'green' ? 'bg-green-100 text-green-600' :
                    actionColors[entry.action] === 'blue' ? 'bg-blue-100 text-blue-600' :
                    actionColors[entry.action] === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    actionColors[entry.action] === 'red' ? 'bg-red-100 text-red-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {actionIcons[entry.action]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={actionColors[entry.action]}>
                        {actionLabels[entry.action]}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {entityTypeIcons[entry.entityType]}
                        <span>{entityTypeLabels[entry.entityType]}</span>
                      </div>
                    </div>
                    <h4 className="font-medium">{entry.entityName}</h4>
                    {entry.reason && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Razón:</strong> {entry.reason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(entry.timestamp)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {entry.performedByName}
                  </div>
                </div>
              </div>

              {entry.changes && entry.changes.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <h5 className="text-sm font-medium mb-2">Cambios:</h5>
                  <div className="space-y-2">
                    {entry.changes.map((change, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{change.fieldLabel}:</span>
                          {change.changeType === 'added' && (
                            <Badge variant="green" className="text-xs">Agregado</Badge>
                          )}
                          {change.changeType === 'modified' && (
                            <Badge variant="blue" className="text-xs">Modificado</Badge>
                          )}
                          {change.changeType === 'removed' && (
                            <Badge variant="red" className="text-xs">Eliminado</Badge>
                          )}
                        </div>
                        {change.changeType === 'modified' && (
                          <div className="mt-1 text-gray-600">
                            <span className="line-through text-red-600">
                              {formatValue(change.oldValue)}
                            </span>
                            <ArrowRight className="w-3 h-3 inline mx-2" />
                            <span className="text-green-600 font-medium">
                              {formatValue(change.newValue)}
                            </span>
                          </div>
                        )}
                        {change.changeType === 'added' && (
                          <div className="mt-1 text-green-600 font-medium">
                            {formatValue(change.newValue)}
                          </div>
                        )}
                        {change.changeType === 'removed' && (
                          <div className="mt-1 text-red-600 line-through">
                            {formatValue(change.oldValue)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <h5 className="text-sm font-medium mb-2">Información Adicional:</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    {entry.metadata.documentName && (
                      <div>
                        <strong>Documento:</strong> {entry.metadata.documentName}
                      </div>
                    )}
                    {entry.metadata.linkedEntityName && (
                      <div>
                        <strong>Entidad Vinculada:</strong> {entry.metadata.linkedEntityName}
                      </div>
                    )}
                    {entry.metadata.previousStatus && entry.metadata.newStatus && (
                      <div>
                        <strong>Estado:</strong> {entry.metadata.previousStatus} → {entry.metadata.newStatus}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

