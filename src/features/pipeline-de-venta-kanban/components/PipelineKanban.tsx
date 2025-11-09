import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { PhaseColumn as PhaseColumnType, Sale, PipelinePhase, BusinessType } from '../types';
import { getPipeline, moveSale, updateSale } from '../api';
import { PhaseColumn } from './PhaseColumn';
import { FollowUpAlertModal } from './FollowUpAlertModal';
import { FollowUpService } from '../services/followUpService';
import { Loader2, Bell, AlertCircle } from 'lucide-react';

interface PipelineKanbanProps {
  businessType: BusinessType;
  userId?: string;
  onSaleUpdate?: (saleId: string, updates: Partial<Sale>) => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  businessType,
  userId,
  onSaleUpdate,
}) => {
  const [columns, setColumns] = useState<PhaseColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUpAlerts, setShowFollowUpAlerts] = useState(false);
  const [followUpAlerts, setFollowUpAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadPipeline();
  }, [businessType, userId]);

  useEffect(() => {
    // US-15: Verificar leads que necesitan seguimiento
    if (columns.length > 0) {
      const allSales = columns.flatMap(col => col.sales);
      const alerts = FollowUpService.getLeadsNeedingFollowUp(allSales, 3);
      setFollowUpAlerts(alerts);
    }
  }, [columns]);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const data = await getPipeline(businessType, userId);
      setColumns(data);
    } catch (error) {
      console.error('Error cargando pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalePhaseChange = async (saleId: string, newPhase: PipelinePhase) => {
    try {
      await moveSale(saleId, newPhase);
      await loadPipeline();
      if (onSaleUpdate) {
        const sale = columns
          .flatMap(col => col.sales)
          .find(s => s.id === saleId);
        if (sale) {
          onSaleUpdate(saleId, { phase: newPhase });
        }
      }
    } catch (error) {
      console.error('Error actualizando fase:', error);
    }
  };

  const handleSaleUpdate = async (saleId: string, updates: Partial<Sale>) => {
    try {
      await updateSale(saleId, updates);
      await loadPipeline();
      if (onSaleUpdate) {
        onSaleUpdate(saleId, updates);
      }
    } catch (error) {
      console.error('Error actualizando venta:', error);
    }
  };

  // US-15: Manejar acciones de seguimiento
  const handleMarkAsContacted = async (saleId: string) => {
    await handleSaleUpdate(saleId, {
      lastContact: new Date(),
      lastActivity: new Date(),
      followUpNotificationSent: false,
    });
  };

  const handlePostpone = async (saleId: string, days: number) => {
    const sale = columns.flatMap(col => col.sales).find(s => s.id === saleId);
    if (sale) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      await handleSaleUpdate(saleId, {
        lastContact: newDate,
        followUpNotificationSent: false,
      });
    }
  };

  const handleDiscard = async (saleId: string) => {
    await handleSaleUpdate(saleId, {
      phase: 'descartado' as PipelinePhase,
      followUpNotificationSent: true,
    });
  };

  const handleScheduleCallFromAlert = (saleId: string) => {
    // Esta función será manejada por el componente padre o se puede implementar aquí
    // Por ahora, solo cerramos el modal y el usuario puede agendar desde la tarjeta
    setShowFollowUpAlerts(false);
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <>
      {/* US-15: Alerta de seguimiento */}
      {followUpAlerts.length > 0 && (
        <div className="mb-4">
          <Card className="p-4 bg-red-50 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">
                    {followUpAlerts.length} lead{followUpAlerts.length > 1 ? 's' : ''} sin contacto por más de 3 días
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Requieren seguimiento urgente
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowFollowUpAlerts(true)}
                leftIcon={<Bell className="w-4 h-4" />}
              >
                Ver alertas ({followUpAlerts.length})
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <PhaseColumn
              key={column.phase.id}
              column={column}
              onSaleUpdate={handleSaleUpdate}
              onSalePhaseChange={handleSalePhaseChange}
            />
          ))}
        </div>
      </div>

      {/* US-15: Modal de alertas */}
      <FollowUpAlertModal
        alerts={followUpAlerts}
        isOpen={showFollowUpAlerts}
        onClose={() => setShowFollowUpAlerts(false)}
        onMarkAsContacted={handleMarkAsContacted}
        onPostpone={handlePostpone}
        onDiscard={handleDiscard}
        onScheduleCall={handleScheduleCallFromAlert}
      />
    </>
  );
};

