import React from 'react';
import { AlertCircle, ChevronRight, User } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const CustomerAttentionWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const alerts = [
    { id: 1, user: 'María P.', type: 'risk', label: 'Riesgo Baja', days: 12 },
    { id: 2, user: 'Juan D.', type: 'feedback', label: 'Feedback Negativo', days: 1 },
  ];

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>Atención Prioritaria</h3>
        <Badge variant="error" size="sm">2</Badge>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.user}</p>
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {alert.label}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
          </div>
        ))}
      </div>
    </Card>
  );
};
