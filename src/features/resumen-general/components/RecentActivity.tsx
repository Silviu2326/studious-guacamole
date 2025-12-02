import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  Clock,
  User,
  CreditCard,
  Dumbbell,
  Calendar,
  Activity,
} from 'lucide-react';

/**
 * Modelo de actividad del sistema
 * 
 * TODO: Este tipo será reemplazado por el modelo que venga del backend
 * cuando se implemente la API de actividades.
 */
export interface ActivityItem {
  id: string;
  type: 'client' | 'payment' | 'workout' | 'booking';
  description: string;
  createdAt: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

/**
 * Componente RecentActivity
 * 
 * Muestra una línea de tiempo sencilla con las últimas acciones relevantes del sistema.
 * Las actividades se muestran en orden cronológico inverso (más reciente primero).
 * 
 * TODO: Reemplazar los datos mock por una llamada real a la API del backend.
 * La llamada debería hacerse en el componente padre (resumen-generalPage.tsx)
 * y pasar los datos como prop.
 */
export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
}) => {
  /**
   * Formatea la fecha/hora de la actividad de forma relativa
   */
  const formatTime = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Hace unos momentos';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    
    // Para fechas más antiguas, mostrar fecha completa
    return createdAt.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Obtiene el icono y colores según el tipo de actividad
   */
  const getActivityConfig = (type: ActivityItem['type']) => {
    switch (type) {
      case 'client':
        return {
          icon: User,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          label: 'Cliente',
        };
      case 'payment':
        return {
          icon: CreditCard,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200',
          label: 'Pago',
        };
      case 'workout':
        return {
          icon: Dumbbell,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-200',
          label: 'Entrenamiento',
        };
      case 'booking':
        return {
          icon: Calendar,
          bgColor: 'bg-orange-100',
          iconColor: 'text-orange-600',
          borderColor: 'border-orange-200',
          label: 'Reserva',
        };
      default:
        return {
          icon: Activity,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          label: 'Actividad',
        };
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Últimas acciones en el sistema
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Ordenar actividades por fecha (más reciente primero)
  const sortedActivities = [...activities].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Actividad Reciente
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Últimas acciones en el sistema
        </p>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-sm">
            Aún no hay actividad reciente
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Línea vertical del timeline */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {sortedActivities.map((activity) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-4 pl-2"
                >
                  {/* Punto del timeline */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Contenido de la actividad */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.iconColor}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(activity.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
