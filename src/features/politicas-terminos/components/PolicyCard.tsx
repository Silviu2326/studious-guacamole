import React from 'react';
import { Policy } from '../types';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Edit, History, FileText, Shield, AlertTriangle } from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  onEdit: (policy: Policy) => void;
  onViewHistory: (policyId: string) => void;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onEdit, onViewHistory }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CANCELLATION':
        return <AlertTriangle className="w-6 h-6" />;
      case 'GDPR':
        return <Shield className="w-6 h-6" />;
      case 'FACILITY_RULES':
        return <FileText className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CANCELLATION':
        return 'Cancelación';
      case 'GDPR':
        return 'Privacidad (RGPD)';
      case 'FACILITY_RULES':
        return 'Normas de Uso';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CANCELLATION':
        return 'text-orange-600 bg-orange-50 ring-1 ring-orange-200/70';
      case 'GDPR':
        return 'text-blue-600 bg-blue-50 ring-1 ring-blue-200/70';
      case 'FACILITY_RULES':
        return 'text-purple-600 bg-purple-50 ring-1 ring-purple-200/70';
      default:
        return 'text-gray-600 bg-gray-50 ring-1 ring-gray-200/70';
    }
  };

  const formattedDate = new Date(policy.activeVersion.effectiveDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl ${getTypeColor(policy.type)}`}>
            {getTypeIcon(policy.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {policy.title}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(policy.type)}`}>
              {getTypeLabel(policy.type)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Versión activa:
            </span>
            <span className="text-sm font-semibold text-gray-900">
              v{policy.activeVersion.versionNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Última actualización:
            </span>
            <span className="text-sm text-gray-900">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onEdit(policy)}
            leftIcon={<Edit size={16} />}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => onViewHistory(policy.id)}
            leftIcon={<History size={16} />}
          >
            Historial
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PolicyCard;

