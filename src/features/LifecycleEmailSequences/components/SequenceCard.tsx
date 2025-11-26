import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { EmailSequence } from '../api/sequences';
import { Play, Pause, Edit, Trash2, BarChart3, Mail, Users, TrendingUp } from 'lucide-react';

interface SequenceCardProps {
  sequence: EmailSequence;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewStats: (id: string) => void;
}

export const SequenceCard: React.FC<SequenceCardProps> = ({
  sequence,
  onToggle,
  onEdit,
  onDelete,
  onViewStats
}) => {
  const getTriggerLabel = () => {
    const labels = {
      CLIENT_CREATED: 'Nuevo Cliente',
      WORKOUT_COMPLETED: 'Entreno Completado',
      CLIENT_INACTIVE_14_DAYS: 'Inactivo 14 Días',
      MILESTONE_REACHED: 'Hito Alcanzado',
      CLIENT_BIRTHDAY: 'Cumpleaños',
      CUSTOM: 'Personalizado'
    };
    return labels[sequence.triggerType];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${sequence.isActive ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {sequence.isActive ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            )}
            <Badge variant={sequence.isActive ? 'green' : 'gray'}>
              {sequence.isActive ? 'Activa' : 'Pausada'}
            </Badge>
          </div>
          <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded ring-1 ring-slate-200">
            {sequence.stepCount} pasos
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
        <p className="text-sm text-slate-600 mt-1">
          <span className="font-medium">Trigger:</span> {getTriggerLabel()}
        </p>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3 flex-1">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-slate-600 mb-1">Activos</p>
            <div className="flex items-center gap-1">
              <Users size={16} className="text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{sequence.stats.activeEnrollments}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Apertura</p>
            <div className="flex items-center gap-1">
              <Mail size={16} className="text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{(sequence.stats.openRate * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">CTR</p>
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-lg font-bold text-gray-900">
                {sequence.stats.clickRate ? (sequence.stats.clickRate * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Total enviados: {sequence.stats.totalSent.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Actualizado: {formatDate(sequence.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 px-4 pb-4">
        <div className="flex-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewStats(sequence.id)}
            leftIcon={<BarChart3 size={16} />}
            fullWidth
          >
            Estadísticas
          </Button>
        </div>
        <Button
          variant={sequence.isActive ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onToggle(sequence.id)}
          leftIcon={sequence.isActive ? <Pause size={16} /> : <Play size={16} />}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(sequence.id)}
          leftIcon={<Edit size={16} />}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(sequence.id)}
          leftIcon={<Trash2 size={16} />}
        />
      </div>
    </Card>
  );
};

