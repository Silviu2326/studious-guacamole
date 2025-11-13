import React, { useState, useEffect } from 'react';
import { Objective } from '../types';
import { 
  detectObsoleteObjectives, 
  archiveObjective, 
  archiveMultipleObjectives,
  unarchiveObjective 
} from '../api/objectives';
import { Card, Button, Modal, Input, Textarea, Badge, Table } from '../../../components/componentsreutilizables';
import { Archive, AlertTriangle, TrendingDown, Clock, X, CheckCircle2, RefreshCw } from 'lucide-react';

interface ObsoleteObjectivesManagerProps {
  role: 'entrenador' | 'gimnasio';
  onObjectivesArchived?: () => void;
}

export const ObsoleteObjectivesManager: React.FC<ObsoleteObjectivesManagerProps> = ({ 
  role,
  onObjectivesArchived 
}) => {
  const [obsoleteObjectives, setObsoleteObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiving, setArchiving] = useState(false);
  const [minDays, setMinDays] = useState(90);
  const [minContribution, setMinContribution] = useState(20);

  useEffect(() => {
    detectObsolete();
  }, [minDays, minContribution]);

  const detectObsolete = async () => {
    setLoading(true);
    try {
      const objectives = await detectObsoleteObjectives({
        minDaysSinceLastActivity: minDays,
        minBusinessContribution: minContribution,
        includeArchived: false,
      });
      setObsoleteObjectives(objectives);
    } catch (error) {
      console.error('Error detecting obsolete objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectObjective = (id: string) => {
    const newSelected = new Set(selectedObjectives);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedObjectives(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedObjectives.size === obsoleteObjectives.length) {
      setSelectedObjectives(new Set());
    } else {
      setSelectedObjectives(new Set(obsoleteObjectives.map(obj => obj.id)));
    }
  };

  const handleArchiveSelected = () => {
    if (selectedObjectives.size === 0) {
      alert('Por favor selecciona al menos un objetivo para archivar');
      return;
    }
    setIsArchiveModalOpen(true);
  };

  const confirmArchive = async () => {
    if (selectedObjectives.size === 0) return;

    setArchiving(true);
    try {
      await archiveMultipleObjectives(
        Array.from(selectedObjectives),
        archiveReason || 'Objetivo obsoleto o con baja contribución al negocio',
        'user' // En producción, usar el ID del usuario actual
      );
      
      setSelectedObjectives(new Set());
      setArchiveReason('');
      setIsArchiveModalOpen(false);
      await detectObsolete();
      
      if (onObjectivesArchived) {
        onObjectivesArchived();
      }
    } catch (error) {
      console.error('Error archiving objectives:', error);
      alert('Error al archivar los objetivos');
    } finally {
      setArchiving(false);
    }
  };

  const handleArchiveSingle = async (objective: Objective) => {
    if (!window.confirm(`¿Estás seguro de archivar el objetivo "${objective.title}"?`)) {
      return;
    }

    try {
      await archiveObjective(
        objective.id,
        'Objetivo obsoleto o con baja contribución al negocio',
        'user'
      );
      await detectObsolete();
      
      if (onObjectivesArchived) {
        onObjectivesArchived();
      }
    } catch (error) {
      console.error('Error archiving objective:', error);
      alert('Error al archivar el objetivo');
    }
  };

  const handleUnarchive = async (objective: Objective) => {
    try {
      await unarchiveObjective(objective.id, 'user');
      await detectObsolete();
      
      if (onObjectivesArchived) {
        onObjectivesArchived();
      }
    } catch (error) {
      console.error('Error unarchiving objective:', error);
      alert('Error al desarchivar el objetivo');
    }
  };

  const getDaysSinceActivity = (objective: Objective): number => {
    const lastActivityDate = objective.lastActivityAt 
      ? new Date(objective.lastActivityAt)
      : new Date(objective.updatedAt);
    const now = new Date();
    return Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getObsoleteReason = (objective: Objective): string => {
    const days = getDaysSinceActivity(objective);
    const contribution = objective.businessContribution || 50;
    const deadlinePassed = new Date(objective.deadline) < new Date();
    
    const reasons: string[] = [];
    if (days >= minDays) {
      reasons.push(`${days} días sin actividad`);
    }
    if (contribution < minContribution) {
      reasons.push(`Baja contribución (${contribution}%)`);
    }
    if (deadlinePassed && days >= 30) {
      reasons.push('Deadline vencido');
    }
    
    return reasons.join(', ');
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (value: any, row: Objective) => (
        <input
          type="checkbox"
          checked={selectedObjectives.has(row.id)}
          onChange={() => handleSelectObjective(row.id)}
          className="w-4 h-4 text-blue-600 rounded"
        />
      ),
    },
    {
      key: 'title',
      label: 'Objetivo',
      render: (value: any, row: Objective) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Razón',
      render: (value: any, row: Objective) => (
        <div className="text-sm">
          <Badge variant="yellow" className="mb-1">
            {getObsoleteReason(row)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'days',
      label: 'Días sin actividad',
      render: (value: any, row: Objective) => {
        const days = getDaysSinceActivity(row);
        return (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm">{days} días</span>
          </div>
        );
      },
    },
    {
      key: 'contribution',
      label: 'Contribución',
      render: (value: any, row: Objective) => {
        const contribution = row.businessContribution || 50;
        return (
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className={contribution < minContribution ? 'text-red-500' : 'text-gray-400'} />
            <span className={`text-sm ${contribution < minContribution ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {contribution}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: Objective) => (
        <div className="flex gap-2">
          {row.archived ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleUnarchive(row)}
              iconLeft={RefreshCw}
            >
              Desarchivar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleArchiveSingle(row)}
              iconLeft={Archive}
            >
              Archivar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={24} />
                Detección de Objetivos Obsoletos
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Detecta objetivos obsoletos o con baja contribución al negocio para mantener el foco en lo que importa
              </p>
            </div>
            <Button
              onClick={detectObsolete}
              iconLeft={RefreshCw}
              loading={loading}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días sin actividad mínimos
              </label>
              <Input
                type="number"
                value={minDays.toString()}
                onChange={(e) => setMinDays(parseInt(e.target.value) || 90)}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribución mínima al negocio (%)
              </label>
              <Input
                type="number"
                value={minContribution.toString()}
                onChange={(e) => setMinContribution(parseInt(e.target.value) || 20)}
                min={0}
                max={100}
              />
            </div>
          </div>

          {obsoleteObjectives.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSelectAll}
                >
                  {selectedObjectives.size === obsoleteObjectives.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedObjectives.size} de {obsoleteObjectives.length} seleccionados
                </span>
              </div>
              <Button
                onClick={handleArchiveSelected}
                iconLeft={Archive}
                disabled={selectedObjectives.size === 0}
                variant="destructive"
              >
                Archivar Seleccionados
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="mx-auto text-blue-500 animate-spin mb-4" size={32} />
            <p className="text-gray-600">Detectando objetivos obsoletos...</p>
          </div>
        ) : obsoleteObjectives.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron objetivos obsoletos
            </h3>
            <p className="text-gray-600">
              Todos los objetivos están activos y tienen una contribución adecuada al negocio
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={obsoleteObjectives}
            loading={loading}
          />
        )}
      </Card>

      <Modal
        open={isArchiveModalOpen}
        onOpenChange={setIsArchiveModalOpen}
        title="Archivar Objetivos Seleccionados"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Se archivarán {selectedObjectives.size} objetivo(s). Esto los ocultará de la vista principal pero podrás desarchivarlos más tarde.
          </p>
          <Textarea
            label="Razón del archivado (opcional)"
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
            placeholder="Ej: Objetivo obsoleto, baja contribución al negocio, deadline vencido..."
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsArchiveModalOpen(false);
                setArchiveReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmArchive}
              loading={archiving}
              iconLeft={Archive}
              variant="destructive"
            >
              Archivar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

