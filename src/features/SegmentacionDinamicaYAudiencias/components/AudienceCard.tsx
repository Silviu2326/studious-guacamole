import React from 'react';
import { Audience, RuleOperator } from '../api/audiences';
import { Card, Button } from '../../../components/componentsreutilizables';
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
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{audience.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-900">{audience.member_count}</span>
              <span>miembros</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-xs">Operador: {audience.rules.operator}</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs">{audience.rules.rules.length} regla(s)</span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
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
      <div className="mb-4 p-3 bg-slate-50 rounded-lg ring-1 ring-slate-200">
        <p className="text-xs font-medium text-slate-700 mb-2">Reglas:</p>
        <div className="space-y-1">
          {audience.rules.rules.map((rule: any, idx: number) => (
            <p key={idx} className="text-xs text-gray-600">
              • {rule.field} {rule.operator} {typeof rule.value === 'object' ? JSON.stringify(rule.value) : rule.value}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <div className="text-xs text-gray-600">
          Creada: {formatDate(audience.created_at)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewMembers(audience.id)}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Ver Miembros
          </Button>
        </div>
      </div>
    </Card>
  );
};

