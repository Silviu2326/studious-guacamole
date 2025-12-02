// Componente de tabla para mostrar fichajes
import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { TimeEntry } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/componentsreutilizables';

interface TimeSheetTableProps {
  entries: TimeEntry[];
  onEditEntry: (entryId: string) => void;
  isLoading?: boolean;
}

export const TimeSheetTable: React.FC<TimeSheetTableProps> = ({
  entries,
  onEditEntry,
  isLoading = false,
}) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatHours = (hours: number): string => {
    if (hours === 0) return '-';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const columns = [
    {
      key: 'employee',
      label: 'Empleado',
      render: (_: any, row: TimeEntry) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
            {row.employee.name.charAt(0)}
          </span>
        </div>
          <span className="font-medium">{row.employee.name}</span>
        </div>
      ),
    },
    {
      key: 'clockIn',
      label: 'Entrada',
      render: (_: any, row: TimeEntry) => formatDate(row.clockIn),
    },
    {
      key: 'clockOut',
      label: 'Salida',
      render: (_: any, row: TimeEntry) => (
        <div className="flex items-center space-x-2">
          {row.clockOut ? (
            <span>{formatDate(row.clockOut)}</span>
          ) : (
            <Badge variant="yellow">Activo</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'totalHours',
      label: 'Horas',
      render: (_: any, row: TimeEntry) => (
        <span className="font-semibold">{formatHours(row.totalHours)}</span>
      ),
      align: 'center' as const,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: any, row: TimeEntry) => {
        if (row.status === 'ongoing') {
          return (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">En curso</span>
            </div>
          );
        }
        if (row.isManual) {
          return (
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm">Manual</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm">Completado</span>
          </div>
        );
      },
      align: 'center' as const,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: TimeEntry) => (
        <button
          onClick={() => onEditEntry(row.id)}
          className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
          title="Editar fichaje"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <Table
      data={entries}
      columns={columns}
      loading={isLoading}
      emptyMessage="No hay fichajes registrados en el periodo seleccionado"
    />
  );
};

