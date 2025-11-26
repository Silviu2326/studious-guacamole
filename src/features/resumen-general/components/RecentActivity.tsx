import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Activity, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'client' | 'payment' | 'session' | 'system';
  title: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
}) => {
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Hace unos momentos';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return timestamp.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Actividad Reciente
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Últimas acciones en el sistema
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">
                {activity.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              No hay actividad reciente
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
