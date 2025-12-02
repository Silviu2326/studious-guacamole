// Componente principal que orquesta la vista de nóminas
import React, { useState } from 'react';
import { usePayrollRun } from '../hooks/usePayrollRun';
import { EmployeePayrollTable } from './EmployeePayrollTable';
import { PayrollAdjustmentModal } from './PayrollAdjustmentModal';
import { MetricCards, Button, ConfirmModal, Card } from '../../../components/componentsreutilizables';
import { PayrollRunItem } from '../types';
import { Period } from '../types';
import { MetricCardData } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Plus, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Euro,
} from 'lucide-react';

interface PayrollRunDashboardProps {
  currentGymId: string;
}

export const PayrollRunDashboard: React.FC<PayrollRunDashboardProps> = ({
  currentGymId,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  });

  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PayrollRunItem | null>(null);

  const {
    data: payrollRunData,
    isLoading,
    isError,
    error,
    generateRun,
    finalizeRun,
    addAdjustment,
    exportCSV,
    exportPDF,
  } = usePayrollRun({
    gymId: currentGymId,
    period: selectedPeriod,
  });

  const handlePeriodChange = (month: number, year: number) => {
    setSelectedPeriod({ month, year });
  };

  const handleGenerateRun = async () => {
    try {
      await generateRun();
    } catch (err) {
      console.error('Error al generar ciclo:', err);
    }
  };

  const handleFinalizeRun = async () => {
    try {
      await finalizeRun();
      setIsFinalizeModalOpen(false);
    } catch (err) {
      console.error('Error al finalizar ciclo:', err);
    }
  };

  const handleAddAdjustment = async (adjustment: any) => {
    try {
      await addAdjustment(adjustment);
      setIsAdjustmentModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error al agregar ajuste:', err);
    }
  };

  const handleSelectItem = (employeeId: string) => {
    if (!payrollRunData) return;
    const item = payrollRunData.items.find((i) => i.employeeId === employeeId);
    if (item) {
      setSelectedItem(item);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenAdjustmentModal = (employeeId: string, employeeName: string) => {
    setSelectedEmployee({ id: employeeId, name: employeeName });
    setIsAdjustmentModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatPeriod = (period: Period) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[period.month - 1]} ${period.year}`;
  };

  const getMetrics = (): MetricCardData[] => {
    if (!payrollRunData) {
      return [
        {
          id: 'total-base',
          title: 'Total Salario Base',
          value: formatCurrency(0),
          icon: <DollarSign className="w-6 h-6" />,
          color: 'primary',
          loading: isLoading,
        },
        {
          id: 'total-variables',
          title: 'Total Variables',
          value: formatCurrency(0),
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'success',
          loading: isLoading,
        },
        {
          id: 'total-deductions',
          title: 'Total Deducciones',
          value: formatCurrency(0),
          icon: <AlertCircle className="w-6 h-6" />,
          color: 'warning',
          loading: isLoading,
        },
        {
          id: 'total-payable',
          title: 'Total a Pagar',
          value: formatCurrency(0),
          icon: <Euro className="w-6 h-6" />,
          color: 'info',
          loading: isLoading,
        },
      ];
    }

    return [
      {
        id: 'total-base',
        title: 'Total Salario Base',
        value: formatCurrency(payrollRunData.totalBase),
        icon: <DollarSign className="w-6 h-6" />,
        color: 'primary',
        loading: isLoading,
      },
      {
        id: 'total-variables',
        title: 'Total Variables',
        value: formatCurrency(payrollRunData.totalVariables),
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'success',
        loading: isLoading,
      },
      {
        id: 'total-deductions',
        title: 'Total Deducciones',
        value: formatCurrency(payrollRunData.totalDeductions),
        icon: <AlertCircle className="w-6 h-6" />,
        color: 'warning',
        loading: isLoading,
      },
      {
        id: 'total-payable',
        title: 'Total a Pagar',
        value: formatCurrency(payrollRunData.totalPayable),
        icon: <Euro className="w-6 h-6" />,
        color: 'info',
        loading: isLoading,
      },
    ];
  };

  // Selección de período
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(2000, i).toLocaleString('es-ES', { month: 'long' }),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString(),
  }));

  return (
    <div className="space-y-6">
      {/* Toolbar superior con selección de período */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-600" />
          <select
            value={selectedPeriod.month}
            onChange={(e) => handlePeriodChange(parseInt(e.target.value), selectedPeriod.year)}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm font-medium"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedPeriod.year}
            onChange={(e) => handlePeriodChange(selectedPeriod.month, parseInt(e.target.value))}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm font-medium"
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error message */}
      {isError && error && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        </Card>
      )}

      {/* Estado vacío */}
      {!payrollRunData && !isLoading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay ciclo de nómina para {formatPeriod(selectedPeriod)}
          </h3>
          <p className="text-gray-600 mb-4">
            Genera un nuevo ciclo de nómina para comenzar a gestionar los pagos del personal.
          </p>
          <Button onClick={handleGenerateRun} variant="primary">
            <Plus size={20} className="mr-2" />
            Generar Borrador de Nómina
          </Button>
        </Card>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </Card>
      )}

      {/* Métricas */}
      {payrollRunData && (
        <>
          <MetricCards data={getMetrics()} columns={4} />

          {/* Toolbar de acciones */}
          <div className="flex items-center justify-end">
            {payrollRunData.status === 'draft' && (
              <Button
                variant="primary"
                onClick={() => setIsFinalizeModalOpen(true)}
                disabled={isLoading}
              >
                <CheckCircle size={20} className="mr-2" />
                Finalizar Nómina
              </Button>
            )}
            {payrollRunData.status === 'finalized' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={exportCSV}
                  disabled={isLoading}
                >
                  <Download size={20} className="mr-2" />
                  Exportar CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={exportPDF}
                  disabled={isLoading}
                >
                  <Download size={20} className="mr-2" />
                  Exportar PDF
                </Button>
              </div>
            )}
          </div>

          {/* Tabla de empleados */}
          <Card className="p-0 bg-white shadow-sm">
            <EmployeePayrollTable
              items={payrollRunData.items}
              onSelectItem={handleSelectItem}
              status={payrollRunData.status}
            />
          </Card>
        </>
      )}

      {/* Modal de ajuste */}
      {selectedEmployee && (
        <PayrollAdjustmentModal
          isOpen={isAdjustmentModalOpen}
          onClose={() => {
            setIsAdjustmentModalOpen(false);
            setSelectedEmployee(null);
          }}
          onSubmit={handleAddAdjustment}
          employeeName={selectedEmployee.name}
          employeeId={selectedEmployee.id}
        />
      )}

      {/* Modal de confirmación de finalización */}
      <ConfirmModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        onConfirm={handleFinalizeRun}
        title="Finalizar Ciclo de Nómina"
        message="¿Está seguro de que desea finalizar este ciclo de nómina? Una vez finalizado, no se podrán realizar más modificaciones."
        confirmText="Finalizar"
        cancelText="Cancelar"
        variant="primary"
      />

      {/* Modal de detalle de empleado */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsDetailModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalle de Nómina - {selectedItem.employeeName}
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Salario Base</h3>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedItem.basePay)}</p>
                </div>
                {selectedItem.variables.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Variables</h3>
                    <ul className="space-y-2">
                      {selectedItem.variables.map((variable, idx) => (
                        <li key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg ring-1 ring-green-200">
                          <div>
                            <p className="font-medium text-gray-900">{variable.description || variable.type}</p>
                            {variable.source_events && (
                              <p className="text-sm text-gray-600">{variable.source_events} eventos</p>
                            )}
                          </div>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(variable.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedItem.adjustments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Ajustes Manuales</h3>
                    <ul className="space-y-2">
                      {selectedItem.adjustments.map((adjustment) => (
                        <li
                          key={adjustment.adjustmentId}
                          className={`flex justify-between items-center p-3 rounded-lg ring-1 ${
                            adjustment.type === 'bonus'
                              ? 'bg-blue-50 ring-blue-200'
                              : adjustment.type === 'deduction'
                              ? 'bg-red-50 ring-red-200'
                              : 'bg-yellow-50 ring-yellow-200'
                          }`}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{adjustment.description}</p>
                            <p className="text-sm text-gray-600 capitalize">{adjustment.type}</p>
                          </div>
                          <span
                            className={`font-semibold ${
                              adjustment.amount > 0 ? 'text-blue-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(adjustment.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Total a Pagar</h3>
                    <span className="text-xl font-bold text-purple-600">
                      {formatCurrency(selectedItem.total)}
                    </span>
                  </div>
                </div>
                {payrollRunData?.status === 'draft' && (
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenAdjustmentModal(selectedItem.employeeId, selectedItem.employeeName);
                      }}
                    >
                      <Plus size={20} className="mr-2" />
                      Agregar Ajuste
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

