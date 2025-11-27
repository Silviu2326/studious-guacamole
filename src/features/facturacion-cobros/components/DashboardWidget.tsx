/**
 * DashboardWidget - Widget compacto para el dashboard general
 * 
 * Este componente muestra un widget compacto con métricas clave de facturación
 * para ser usado en el dashboard principal. Muestra:
 * - Total facturado
 * - Total cobrado
 * - Total pendiente
 * - Número de facturas pendientes/vencidas
 * 
 * INTEGRACIÓN:
 * - Utiliza `getResumenFacturacion()` con el período del mes actual
 * - Diseño compacto para espacios reducidos
 * - Click para ver más detalles (abre ReportesFacturacion)
 */

import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { getResumenFacturacion } from '../api/ingresos';
import { ResumenFacturacion } from '../types';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';

interface DashboardWidgetProps {
  onVerDetalles?: () => void;
  onError?: (errorMessage: string) => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  onVerDetalles,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState<ResumenFacturacion | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      inicioMes.setHours(0, 0, 0, 0);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      finMes.setHours(23, 59, 59, 999);

      const datos = await getResumenFacturacion({
        fechaInicio: inicioMes,
        fechaFin: finMes
      });
      setResumen(datos);
    } catch (error) {
      console.error('Error al cargar resumen de facturación:', error);
      if (onError) {
        onError('Error al cargar el resumen de facturación');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="h-32 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Cargando...</div>
        </div>
      </Card>
    );
  }

  if (!resumen) {
    return (
      <Card className="p-4">
        <div className="h-32 flex items-center justify-center">
          <div className="text-gray-500 text-sm">No hay datos disponibles</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Facturación</h3>
        </div>
        {onVerDetalles && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onVerDetalles}
            className="flex items-center gap-1"
          >
            Ver más
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Facturado */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-700 font-medium">Facturado</p>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatearMoneda(resumen.totalFacturado)}
          </p>
        </div>

        {/* Total Cobrado */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700 font-medium">Cobrado</p>
          </div>
          <p className="text-lg font-bold text-green-900">
            {formatearMoneda(resumen.totalCobrado)}
          </p>
        </div>

        {/* Total Pendiente */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-700 font-medium">Pendiente</p>
          </div>
          <p className="text-lg font-bold text-yellow-900">
            {formatearMoneda(resumen.totalPendiente)}
          </p>
        </div>

        {/* Facturas Pendientes/Vencidas */}
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-orange-700 font-medium">Pendientes</p>
          </div>
          <p className="text-lg font-bold text-orange-900">
            {resumen.numeroFacturasPendientes}
          </p>
          {resumen.numeroFacturasVencidas > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {resumen.numeroFacturasVencidas} vencidas
            </p>
          )}
        </div>
      </div>

      {/* Indicador de período */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Card>
  );
};

