import React from 'react';
import { Select, SelectOption } from '../../../components/componentsreutilizables';
import { Calendar } from 'lucide-react';

interface PredefinedRange {
  label: string;
  getDates: () => { from: Date; to: Date };
}

interface DateRangePickerProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  predefinedRanges: PredefinedRange[];
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
  predefinedRanges
}) => {
  const handlePredefinedChange = (value: string) => {
    if (value && value !== 'custom') {
      const range = predefinedRanges.find(r => r.label === value);
      if (range) {
        onDateRangeChange(range.getDates());
      }
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const options: SelectOption[] = [
    { value: 'custom', label: 'Rango Personalizado', disabled: true },
    ...predefinedRanges.map(r => ({ value: r.label, label: r.label }))
  ];

  // Detectar si el rango actual coincide con algún predefinido
  const currentRangeLabel = predefinedRanges.find(r => {
    const predefined = r.getDates();
    return (
      dateRange.from.getTime() === predefined.from.getTime() &&
      dateRange.to.getTime() === predefined.to.getTime()
    );
  })?.label || 'custom';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={16} className="text-slate-600" />
        <label className="block text-sm font-medium text-slate-700">
          Periodo del Informe
        </label>
      </div>

      {/* Predefined Ranges */}
      <Select
        options={options}
        value={currentRangeLabel}
        onChange={(e) => handlePredefinedChange(e.target.value)}
        placeholder="Seleccionar periodo"
      />

      {/* Custom Date Range Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={dateRange.from.toISOString().split('T')[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate.getTime())) {
                onDateRangeChange({ ...dateRange, from: newDate });
              }
            }}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
          />
          <p className="text-xs text-gray-500">
            {formatDate(dateRange.from)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={dateRange.to.toISOString().split('T')[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate.getTime())) {
                onDateRangeChange({ ...dateRange, to: newDate });
              }
            }}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
          />
          <p className="text-xs text-gray-500">
            {formatDate(dateRange.to)}
          </p>
        </div>
      </div>
    </div>
  );
};

