import React, { useState } from 'react';
import { DateRange } from '../types';
import { Card } from '../../../components/componentsreutilizables';
import { Select } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Calendar, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onApply: () => void;
  loading?: boolean;
}

type PresetRange = 'month' | 'quarter' | 'year' | 'custom';

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  onApply,
  loading = false,
}) => {
  const [preset, setPreset] = useState<PresetRange>('month');
  const [startDate, setStartDate] = useState(format(dateRange.startDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(dateRange.endDate, 'yyyy-MM-dd'));

  const handlePresetChange = (value: string) => {
    const presetValue = value as PresetRange;
    setPreset(presetValue);
    
    const now = new Date();
    let newRange: DateRange;
    
    switch (presetValue) {
      case 'month':
        newRange = {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
        break;
      case 'quarter':
        newRange = {
          startDate: startOfQuarter(now),
          endDate: endOfQuarter(now),
        };
        break;
      case 'year':
        newRange = {
          startDate: startOfYear(now),
          endDate: endOfYear(now),
        };
        break;
      case 'custom':
        // Mantener las fechas actuales
        newRange = dateRange;
        break;
      default:
        newRange = dateRange;
    }
    
    onDateRangeChange(newRange);
    setStartDate(format(newRange.startDate, 'yyyy-MM-dd'));
    setEndDate(format(newRange.endDate, 'yyyy-MM-dd'));
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      const newRange: DateRange = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
      onDateRangeChange(newRange);
    }
  };

  const presetOptions = [
    { value: 'month', label: 'Mes Actual' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Año Actual' },
    { value: 'custom', label: 'Personalizado' },
  ];

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda y filtros */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Período
                </label>
                <Select
                  options={presetOptions}
                  value={preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  fullWidth
                />
              </div>

              {preset === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        handleCustomDateChange();
                      }}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        handleCustomDateChange();
                      }}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                    />
                  </div>
                </>
              )}

              <div className="flex items-end">
                <Button
                  onClick={onApply}
                  loading={loading}
                  leftIcon={<Calendar size={20} className="mr-2" />}
                  fullWidth
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
          <span>
            Período seleccionado:{' '}
            <span className="font-semibold">
              {format(dateRange.startDate, 'dd MMM yyyy', { locale: es })} - {format(dateRange.endDate, 'dd MMM yyyy', { locale: es })}
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
};

