// Componente ChecklistInstanceView - Container
import React, { useEffect, useState } from 'react';
import { ChecklistInstance, ChecklistItem, TaskStatus } from '../types';
import { ChecklistsService } from '../services/checklistsService';
import { ChecklistItemComponent } from './ChecklistItem';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Clock, CheckCircle2, AlertCircle, User, Loader2 } from 'lucide-react';

interface ChecklistInstanceViewProps {
  instanceId: string;
}

export const ChecklistInstanceView: React.FC<ChecklistInstanceViewProps> = ({ instanceId }) => {
  const [instanceData, setInstanceData] = useState<ChecklistInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInstance();
  }, [instanceId]);

  const loadInstance = async () => {
    try {
      setLoading(true);
      const data = await ChecklistsService.obtenerInstanceById(instanceId);
      setInstanceData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el checklist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusChange = async (
    itemId: string,
    newStatus: TaskStatus,
    notes?: string
  ) => {
    if (!instanceData) return;

    try {
      await ChecklistsService.actualizarItemStatus(instanceId, itemId, {
        status: newStatus,
        notes
      });

      // Recargar la instancia para obtener los datos actualizados
      await loadInstance();
    } catch (err) {
      console.error('Error al actualizar el estado del item:', err);
    }
  };

  const getStatusBadge = () => {
    if (!instanceData) return null;

    const statusConfig = {
      pending: { variant: 'gray' as const, label: 'Pendiente', icon: <Clock className="w-4 h-4" /> },
      in_progress: { variant: 'blue' as const, label: 'En Progreso', icon: <Clock className="w-4 h-4" /> },
      completed: { variant: 'green' as const, label: 'Completado', icon: <CheckCircle2 className="w-4 h-4" /> },
      overdue: { variant: 'red' as const, label: 'Retrasado', icon: <AlertCircle className="w-4 h-4" /> }
    };

    const config = statusConfig[instanceData.status];
    return (
      <Badge variant={config.variant} leftIcon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (error || !instanceData) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">
          {error || 'No se encontró el checklist'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {instanceData.templateName}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {instanceData.assignedTo.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(instanceData.dueDate).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Progreso
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {instanceData.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${instanceData.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {instanceData.items && instanceData.items.length > 0 ? (
          instanceData.items.map((item) => {
            // Buscar si la tarea es crítica (necesitaríamos pasar esta info desde el template)
            const isCritical = false; // En una implementación real, esto vendría del template
            
            return (
              <ChecklistItemComponent
                key={item.id}
                taskText={item.text}
                status={item.status as TaskStatus}
                onStatusChange={(newStatus, notes) => 
                  handleItemStatusChange(item.id, newStatus, notes)
                }
                notes={item.notes}
                isCritical={isCritical}
              />
            );
          })
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin tareas</h3>
            <p className="text-gray-600">
              No hay tareas en este checklist
            </p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {instanceData.status === 'completed' && instanceData.completedAt && (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                Checklist completado el {new Date(instanceData.completedAt).toLocaleString('es-ES')}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

