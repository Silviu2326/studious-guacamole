import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const NotificacionesSeguridad: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    // Simular notificaciones
    setNotificaciones([]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Badge variant={activo ? 'green' : 'gray'}>
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActivo(!activo)}
          >
            {activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>

      {/* Card principal */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Notificaciones de Seguridad
          </h2>
          <p className="text-gray-600 text-sm">
            Gestiona las notificaciones automáticas del sistema
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-base text-gray-900 font-semibold">
                  Sistema de Notificaciones
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  El sistema enviará notificaciones automáticas cuando se detecten ingredientes problemáticos o se generen nuevas alertas de seguridad alimentaria.
                </p>
              </div>
            </div>
          </div>

          {notificaciones.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-base text-gray-600">
                No hay notificaciones pendientes
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

