// Tabla que muestra el listado de empleados y el resumen de su nómina
import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { PayrollRunItem } from '../types';
import { TableColumn } from '../../../components/componentsreutilizables';
import { Euro, TrendingUp, TrendingDown } from 'lucide-react';

interface EmployeePayrollTableProps {
  items: PayrollRunItem[];
  onSelectItem: (employeeId: string) => void;
  status: 'draft' | 'finalized';
}

export const EmployeePayrollTable: React.FC<EmployeePayrollTableProps> = ({
  items,
  onSelectItem,
  status,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const calculateTotalVariables = (item: PayrollRunItem) => {
    return item.variables.reduce((sum, v) => sum + v.amount, 0);
  };

  const calculateTotalAdjustments = (item: PayrollRunItem) => {
    return item.adjustments.reduce((sum, a) => sum + a.amount, 0);
  };

  const columns: TableColumn<PayrollRunItem>[] = [
    {
      key: 'employeeName',
      label: 'Empleado',
      sortable: true,
      render: (value: string, row: PayrollRunItem) => (
        <button
          onClick={() => onSelectItem(row.employeeId)}
          className="text-left font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          {value}
        </button>
      ),
    },
    {
      key: 'basePay',
      label: 'Salario Base',
      sortable: true,
      align: 'right',
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'variables',
      label: 'Variables',
      sortable: true,
      align: 'right',
      render: (value: any, row: PayrollRunItem) => {
        const total = calculateTotalVariables(row);
        return (
          <div className="flex items-center justify-end gap-2">
            {total > 0 && <TrendingUp className="w-4 h-4 text-green-600" />}
            <span className={total > 0 ? 'text-green-600 font-medium' : ''}>
              {formatCurrency(total)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'adjustments',
      label: 'Ajustes',
      sortable: true,
      align: 'right',
      render: (value: any, row: PayrollRunItem) => {
        const total = calculateTotalAdjustments(row);
        return (
          <div className="flex items-center justify-end gap-2">
            {total !== 0 && (
              total > 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )
            )}
            <span className={
              total > 0
                ? 'text-blue-600 font-medium'
                : total < 0
                ? 'text-red-600 font-medium'
                : ''
            }>
              {formatCurrency(total)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'total',
      label: 'Total a Pagar',
      sortable: true,
      align: 'right',
      render: (value: number) => (
        <div className="flex items-center justify-end gap-2">
          <Euro className="w-4 h-4 text-purple-600" />
          <span className="font-bold text-purple-700 text-lg">
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={items}
      columns={columns}
      loading={false}
      emptyMessage="No hay empleados en este ciclo de nómina"
    />
  );
};

