// Container principal que orquesta el dashboard de fichajes
import React, { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, MetricCards, Select } from '../../../components/componentsreutilizables';
import { TimeSheetTable } from './TimeSheetTable';
import { ManualEntryModal } from './ManualEntryModal';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { TimeEntry, ManualEntryFormData } from '../types';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  FileDown,
  Plus,
  Calendar
} from 'lucide-react';

export const TimeTrackingDashboardContainer: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const {
    entries,
    kpis,
    employees,
    loading,
    error,
    clockIn,
    clockOut,
    createManualEntry,
    updateEntry,
  } = useTimeEntries({
    dateRange,
    employeeId: selectedEmployee || undefined,
  });

  const handleEditEntry = useCallback((entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setIsModalOpen(true);
    }
  }, [entries]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEntry(null);
  }, []);

  const handleSubmitEntry = useCallback(async (data: ManualEntryFormData) => {
    if (editingEntry) {
      // Modo edición
      await updateEntry(
        editingEntry.id,
        data.clockIn,
        data.clockOut,
        data.reason
      );
    } else {
      // Modo creación (manual)
      await createManualEntry(
        data.employeeId,
        data.clockIn,
        data.clockOut,
        data.reason
      );
    }
    handleCloseModal();
  }, [editingEntry, createManualEntry, updateEntry, handleCloseModal]);

  const handleNewEntry = useCallback(() => {
    setEditingEntry(null);
    setIsModalOpen(true);
  }, []);

  const handleExport = useCallback(async () => {
    // Implementar exportación a CSV
    const csv = [
      ['Empleado', 'Entrada', 'Salida', 'Horas Totales', 'Estado'].join(','),
      ...entries.map(entry => [
        entry.employee.name,
        format(parseISO(entry.clockIn), 'dd/MM/yyyy HH:mm', { locale: es }),
        entry.clockOut ? format(parseISO(entry.clockOut), 'dd/MM/yyyy HH:mm', { locale: es }) : '-',
        entry.totalHours.toFixed(2),
        entry.status === 'ongoing' ? 'En curso' : 'Completado',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fichajes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [entries]);

  const metricData = kpis ? [
    {
      id: 'active-employees',
      title: 'Empleados Activos',
      value: kpis.activeEmployees.toString(),
      subtitle: 'Fichados actualmente',
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'total-hours',
      title: 'Horas Totales',
      value: kpis.totalHoursMonth.toFixed(1),
      subtitle: 'Este mes',
      icon: <Clock className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'overtime-hours',
      title: 'Horas Extra',
      value: kpis.overtimeHoursMonth.toFixed(1),
      subtitle: 'Acumuladas',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'labor-cost',
      title: 'Coste Laboral',
      value: `€${kpis.estimatedLaborCost.toLocaleString('es-ES')}`,
      subtitle: 'Estimado este mes',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'punctuality',
      title: 'Puntualidad',
      value: kpis.punctualityRate,
      subtitle: 'Índice de puntualidad',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'manual-edits',
      title: 'Ediciones Manuales',
      value: kpis.manualEditsCount.toString(),
      subtitle: 'Este mes',
      icon: <AlertCircle className="w-5 h-5" />,
      color: kpis.manualEditsCount > 10 ? 'warning' as const : 'info' as const,
    },
  ] : [];

  const employeeOptions = [
    { value: '', label: 'Todos los empleados' },
    ...employees.map(emp => ({
      value: emp.id,
      label: emp.name,
    })),
  ];

  const periodOptions = [
    { value: 'current', label: 'Mes Actual' },
    { value: 'last', label: 'Mes Anterior' },
    { value: 'custom', label: 'Personalizado' },
  ];

  const handlePeriodChange = (value: string) => {
    if (value === 'current') {
      setDateRange({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      });
    } else if (value === 'last') {
      const lastMonth = subMonths(new Date(), 1);
      setDateRange({
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      });
    }
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      {metricData.length > 0 && (
        <MetricCards data={metricData} columns={6} />
      )}

      {/* Filtros y acciones */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Select
                    label={
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        Período
                      </span>
                    }
                    options={periodOptions}
                    value={periodOptions.find(p => 
                      format(dateRange.start, 'yyyy-MM') === format(new Date(), 'yyyy-MM')
                    )?.value || 'custom'}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <Select
                    label={
                      <span className="flex items-center">
                        <Users size={16} className="mr-1" />
                        Empleado
                      </span>
                    }
                    options={employeeOptions}
                    value={selectedEmployee || ''}
                    onChange={(e) => setSelectedEmployee(e.target.value || null)}
                  />
                </div>
              </div>

              <div className="flex gap-3 md:items-end">
                <Button
                  variant="secondary"
                  onClick={handleExport}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNewEntry}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Fichaje
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{entries.length} fichajes encontrados</span>
            <span>
              <Calendar className="w-4 h-4 inline mr-2" />
              {format(dateRange.start, 'dd MMM yyyy', { locale: es })} -{' '}
              {format(dateRange.end, 'dd MMM yyyy', { locale: es })}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabla de fichajes */}
      <TimeSheetTable
        entries={entries}
        onEditEntry={handleEditEntry}
        isLoading={loading}
      />

      {/* Modal de edición/creación */}
      <ManualEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEntry}
        initialData={editingEntry || undefined}
        employees={employees}
      />
    </div>
  );
};

