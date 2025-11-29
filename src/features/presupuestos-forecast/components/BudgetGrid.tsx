import React, { useState } from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { BudgetGridData } from '../types';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '../../../components/componentsreutilizables';

interface BudgetGridProps {
  data: BudgetGridData[];
  onCellUpdate: (itemId: string, month: string, newValue: number) => void;
  loading?: boolean;
}

const MONTHS = [
  { key: 'jan', label: 'Ene' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Abr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Ago' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dic' },
];

export const BudgetGrid: React.FC<BudgetGridProps> = ({
  data,
  onCellUpdate,
  loading = false
}) => {
  const [editingCell, setEditingCell] = useState<{ itemId: string; month: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (itemId: string, month: string, currentValue: number) => {
    setEditingCell({ itemId, month });
    setEditValue(currentValue.toString());
  };

  const handleSave = () => {
    if (editingCell) {
      const numValue = parseFloat(editValue);
      if (!isNaN(numValue)) {
        onCellUpdate(editingCell.itemId, editingCell.month, numValue);
      }
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const formatCurrency = (value?: number): string => {
    if (value === undefined) return '-';
    return `€${value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getDeviationColor = (deviation?: number): string => {
    if (deviation === undefined) return '';
    if (deviation > 0) return 'text-green-600';
    if (deviation < 0) return 'text-red-600';
    return '';
  };

  const columns = [
    {
      key: 'category',
      label: 'Categoría',
      render: (_: any, row: BudgetGridData) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-900">
            {row.category}
          </span>
        </div>
      )
    },
    ...MONTHS.map(month => ({
      key: month.key,
      label: month.label,
      align: 'right' as const,
      render: (_: any, row: BudgetGridData) => {
        const value = row[month.key as keyof BudgetGridData] as any;
        const cellId = `${row.itemId}-${month.key}`;
        const isEditing = editingCell?.itemId === row.itemId && editingCell?.month === month.key;

        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24"
                fullWidth={false}
              />
              <div className="flex gap-1">
                <button
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2 justify-end">
            <div className="text-right">
                  {value?.budgeted !== undefined && (
                <div className="flex flex-col">
                  <div className="font-semibold text-gray-900">{formatCurrency(value.budgeted)}</div>
                  {value.actual !== undefined && (
                    <div className="text-xs text-gray-600">
                      Real: {formatCurrency(value.actual)}
                    </div>
                  )}
                  {value.deviation !== undefined && (
                    <div className={`text-xs ${getDeviationColor(value.deviation)}`}>
                      {value.deviation > 0 ? '+' : ''}{value.deviation.toFixed(1)}%
                    </div>
                  )}
                </div>
              )}
            </div>
            {row.itemId && (
              <button
                onClick={() => handleEdit(row.itemId!, month.key, value?.budgeted || 0)}
                className="opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    }))
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay datos del presupuesto disponibles"
        className="group"
      />
    </div>
  );
};

