import React from 'react';
import { Audience, RuleOperator } from '../api/audiences';
import { Edit, Trash2, Users, RefreshCw, Copy } from 'lucide-react';

interface AudienceCardProps {
  audience: Audience;
  onEdit: (audienceId: string) => void;
  onDelete: (audienceId: string) => void;
  onViewMembers: (audienceId: string) => void;
  onDuplicate: (audience: Audience) => void;
}

export const AudienceCard: React.FC<AudienceCardProps> = ({
  audience,
  onEdit,
  onDelete,
  onViewMembers,
  onDuplicate
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{audience.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="font-semibold text-gray-900">{audience.member_count}</span> miembros
            </div>
            <span>•</span>
            <span>Operador: {audience.rules.operator}</span>
            <span>•</span>
            <span>{audience.rules.rules.length} regla(s)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDuplicate(audience)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(audience.id)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Eliminar esta audiencia?')) {
                onDelete(audience.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Preview */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-medium text-gray-700 mb-2">Reglas:</p>
        <div className="space-y-1">
          {audience.rules.rules.map((rule: any, idx: number) => (
            <p key={idx} className="text-xs text-gray-600">
              • {rule.field} {rule.operator} {typeof rule.value === 'object' ? JSON.stringify(rule.value) : rule.value}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Creada: {formatDate(audience.created_at)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewMembers(audience.id)}
            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
          >
            <Users className="w-4 h-4" />
            Ver Miembros
          </button>
        </div>
      </div>
    </div>
  );
};

