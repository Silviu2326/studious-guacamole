import React from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { ExpenseAlert } from '../hooks/useExpenseAlerts';
import { AlertTriangle, CheckCircle2, X, TrendingUp, DollarSign } from 'lucide-react';
import { CATEGORIAS_GASTO } from '../types/expenses';

interface ExpenseAlertModalProps {
  isOpen: boolean;
  alert: ExpenseAlert | null;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

/**
 * Modal de alerta que se muestra cuando un gasto supera la media histórica
 * de su categoría, permitiendo al usuario confirmar o corregir el gasto
 */
export const ExpenseAlertModal: React.FC<ExpenseAlertModalProps> = ({
  isOpen,
  alert,
  onConfirm,
  onCancel,
  onEdit
}) => {
  if (!alert) return null;

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(fecha);
  };

  const porcentajeExceso = ((alert.porcentajeSobreMedia - 1) * 100).toFixed(0);
  const diferencia = alert.gasto.importe - alert.promedioCategoria;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Alerta de Gasto Anómalo"
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            Editar Gasto
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar Gasto
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Alerta principal */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">
                Gasto superior a la media histórica
              </h3>
              <p className="text-sm text-amber-800">
                {alert.mensaje}
              </p>
            </div>
          </div>
        </div>

        {/* Información del gasto */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">Detalles del gasto:</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Concepto</div>
              <div className="font-medium text-gray-900">{alert.gasto.concepto}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Fecha</div>
              <div className="font-medium text-gray-900">{formatearFecha(alert.gasto.fecha)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Categoría</div>
              <div className="font-medium text-gray-900">
                {CATEGORIAS_GASTO[alert.gasto.categoria].nombre}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Importe</div>
              <div className="font-bold text-red-600 text-lg">
                {formatearMoneda(alert.gasto.importe)}
              </div>
            </div>
          </div>
        </div>

        {/* Comparación con la media */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Comparación con tu media histórica:
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Media histórica de la categoría:</span>
              <span className="font-semibold text-blue-900">
                {formatearMoneda(alert.promedioCategoria)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Importe del gasto actual:</span>
              <span className="font-semibold text-red-900">
                {formatearMoneda(alert.gasto.importe)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-sm font-semibold text-amber-900">Diferencia:</span>
              <span className="font-bold text-amber-900">
                +{formatearMoneda(diferencia)} ({porcentajeExceso}% más)
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje de ayuda */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">¿Qué debo hacer?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Si el gasto es correcto:</strong> Haz clic en "Confirmar Gasto" para guardarlo. 
                  Puede que sea un gasto extraordinario pero válido.
                </li>
                <li>
                  <strong>Si hay un error:</strong> Haz clic en "Editar Gasto" para corregir el importe 
                  o la categoría.
                </li>
                <li>
                  <strong>Revisa la factura:</strong> Asegúrate de que el importe registrado coincida 
                  con la factura o comprobante.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

