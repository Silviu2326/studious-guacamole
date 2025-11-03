import React from 'react';
import { EmailSequence } from '../api/sequences';
import { Play, Pause, Edit, Trash2, BarChart3, Mail, Users, TrendingUp, MoreVertical } from 'lucide-react';

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      {/* Header */}
      <div className={`p-4 border-b ${sequence.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {sequence.isActive ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              sequence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {sequence.isActive ? 'Activa' : 'Pausada'}
            </span>
          </div>
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
            {sequence.stepCount} pasos
          </span>
        </div>
        <h3 className="font-semibold text-gray-900">{sequence.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Trigger:</span> {getTriggerLabel()}
        </p>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">Activos</p>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{sequence.stats.activeEnrollments}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Apertura</p>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">{(sequence.stats.openRate * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">CTR</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-gray-900">
                {sequence.stats.clickRate ? (sequence.stats.clickRate * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Total enviados: {sequence.stats.totalSent.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>Actualizado: {formatDate(sequence.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewStats(sequence.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Estadísticas
          </button>
          <button
            onClick={() => onToggle(sequence.id)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
              sequence.isActive
                ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                : 'text-green-700 bg-green-50 hover:bg-green-100'
            }`}
          >
            {sequence.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(sequence.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(sequence.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

