import React, { useState, useEffect } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { useAccountingExport } from '../hooks';
import { DateRangePicker } from './DateRangePicker';
import { Download, FileText, AlertCircle } from 'lucide-react';

interface ExportControlsContainerProps {
  userType: 'trainer' | 'gym';
}

interface DateRange {
  from: Date;
  to: Date;
}

export const ExportControlsContainer: React.FC<ExportControlsContainerProps> = ({ userType }) => {
  const { generateExport, isGenerating, error } = useAccountingExport();
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay, to: today };
  });

  const [reportType, setReportType] = useState<'simple' | 'detailedVat'>('simple');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'a3' | 'sage50'>('csv');

  // Para entrenadores, solo opciones simples
  useEffect(() => {
    if (userType === 'trainer') {
      setReportType('simple');
      setExportFormat('csv');
    }
  }, [userType]);

  const reportOptions: SelectOption[] = userType === 'gym' 
    ? [
        { value: 'simple', label: 'Resumen Simple' },
        { value: 'detailedVat', label: 'Desglose IVA Detallado' }
      ]
    : [
        { value: 'simple', label: 'Resumen de Ingresos' }
      ];

  const formatOptions: SelectOption[] = userType === 'gym'
    ? [
        { value: 'csv', label: 'CSV' },
        { value: 'pdf', label: 'PDF' },
        { value: 'a3', label: 'A3con' },
        { value: 'sage50', label: 'Sage 50' }
      ]
    : [
        { value: 'csv', label: 'CSV' },
        { value: 'pdf', label: 'PDF' }
      ];

  const handleExport = async () => {
    await generateExport({
      dateFrom: dateRange.from.toISOString().split('T')[0],
      dateTo: dateRange.to.toISOString().split('T')[0],
      format: exportFormat,
      reportType: reportType
    });
  };

  const predefinedRanges = [
    {
      label: 'Mes Actual',
      getDates: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: firstDay, to: today };
      }
    },
    {
      label: 'Último Trimestre',
      getDates: () => {
        const today = new Date();
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        return { from: threeMonthsAgo, to: today };
      }
    },
    {
      label: 'Año Actual',
      getDates: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), 0, 1);
        return { from: firstDay, to: today };
      }
    }
  ];

  return (
    <Card className="p-0 bg-white shadow-sm">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Download size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Generar Exportación
            </h3>
            <p className="text-sm text-gray-600">
              Exporta tus datos fiscales y contables en diferentes formatos
            </p>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            predefinedRanges={predefinedRanges}
          />
        </div>

        {/* Report Type and Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Informe"
            options={reportOptions}
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'simple' | 'detailedVat')}
          />

          <Select
            label="Formato de Exportación"
            options={formatOptions}
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf' | 'a3' | 'sage50')}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Info Message */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FileText size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                Información Importante
              </p>
              <p className="text-xs text-blue-700">
                {userType === 'trainer'
                  ? 'Para entrenadores personales, se genera un resumen simple de ingresos ideal para enviar a tu gestor.'
                  : 'Los formatos A3con y Sage 50 son compatibles con software contable profesional y permiten la importación automática de asientos.'}
              </p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            size="lg"
            onClick={handleExport}
            loading={isGenerating}
            disabled={isGenerating}
          >
            <Download size={20} className="mr-2" />
            {isGenerating ? 'Generando...' : 'Generar y Descargar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

