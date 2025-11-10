import React, { useState, useEffect } from 'react';
import { Card, Button, Select, SelectOption, Tooltip } from '../../../components/componentsreutilizables';
import { useAccountingExport } from '../hooks';
import { DateRangePicker } from './DateRangePicker';
import { Download, FileText, AlertCircle, HelpCircle } from 'lucide-react';

interface ExportControlsContainerProps {
  userType: 'trainer' | 'gym';
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
  initialDateRange?: { from: Date; to: Date };
}

interface DateRange {
  from: Date;
  to: Date;
}

export const ExportControlsContainer: React.FC<ExportControlsContainerProps> = ({ 
  userType,
  onDateRangeChange,
  initialDateRange
}) => {
  const { generateExport, isGenerating, error } = useAccountingExport();
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    if (initialDateRange) {
      return initialDateRange;
    }
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay, to: today };
  });

  // Notificar cambios en el rango de fechas
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const [reportType, setReportType] = useState<'simple' | 'detailedVat'>('simple');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx'>('xlsx');

  // Para entrenadores, solo opciones simples
  useEffect(() => {
    if (userType === 'trainer') {
      setReportType('simple');
      setExportFormat('xlsx'); // Por defecto Excel para entrenadores
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
        { value: 'xlsx', label: 'Excel (.xlsx)' },
        { value: 'a3', label: 'A3con' },
        { value: 'sage50', label: 'Sage 50' }
      ]
    : [
        { value: 'xlsx', label: 'Excel (.xlsx)' },
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
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-slate-700">Rango de Fechas</label>
            <Tooltip 
              content={
                <div className="max-w-xs">
                  <p className="font-semibold mb-2">Rango de Fechas para Exportación:</p>
                  <p className="text-xs mb-2">Selecciona el periodo de tiempo para el que quieres exportar tus datos fiscales. Puedes usar rangos predefinidos o seleccionar fechas personalizadas.</p>
                  <p className="text-xs font-semibold mt-2">Consejos:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Usa rangos predefinidos para periodos comunes (mes actual, trimestre, año)</li>
                    <li>Selecciona fechas personalizadas para periodos específicos</li>
                    <li>El informe incluirá todos los datos del rango seleccionado</li>
                  </ul>
                  <p className="text-xs mt-2 italic">Ejemplo: Selecciona "Año Actual" para exportar todos los datos del año en curso.</p>
                </div>
              }
              position="right"
              delay={100}
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            predefinedRanges={predefinedRanges}
          />
        </div>

        {/* Report Type and Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Tipo de Informe</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Tipo de Informe:</p>
                    <p className="text-xs mb-2">Selecciona el tipo de informe que necesitas generar según tus necesidades.</p>
                    <p className="text-xs font-semibold mt-2">Opciones disponibles:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li><strong>Resumen Simple:</strong> Informe básico con ingresos, gastos y resumen fiscal. Ideal para entrenadores personales.</li>
                      {userType === 'gym' && (
                        <li><strong>Desglose IVA Detallado:</strong> Informe completo con desglose detallado de IVA por transacción. Ideal para gimnasios.</li>
                      )}
                    </ul>
                    <p className="text-xs mt-2 italic">El resumen simple es perfecto para enviar a tu gestor o para tu propia referencia.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Select
              label=""
              options={reportOptions}
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'simple' | 'detailedVat')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <span>Formato de Exportación</span>
              <Tooltip 
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-2">Formato de Exportación:</p>
                    <p className="text-xs mb-2">Selecciona el formato en el que quieres exportar tus datos fiscales.</p>
                    <p className="text-xs font-semibold mt-2">Formatos disponibles:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li><strong>Excel (.xlsx):</strong> Formato estándar con múltiples hojas. Ideal para análisis y envío a gestor.</li>
                      <li><strong>CSV:</strong> Formato de texto plano. Compatible con cualquier hoja de cálculo.</li>
                      <li><strong>PDF:</strong> Formato de documento. Ideal para impresión o envío por email.</li>
                      {userType === 'gym' && (
                        <>
                          <li><strong>A3con:</strong> Formato compatible con software contable A3.</li>
                          <li><strong>Sage 50:</strong> Formato compatible con software contable Sage 50.</li>
                        </>
                      )}
                    </ul>
                    <p className="text-xs mt-2 italic">Recomendación: Usa Excel para análisis detallado o PDF para presentación.</p>
                  </div>
                }
                position="right"
                delay={100}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </label>
            <Select
              label=""
              options={formatOptions}
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx')}
            />
          </div>
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
                  ? 'El formato Excel (.xlsx) incluye hojas separadas para ingresos, gastos, resumen fiscal y desglose mensual/trimestral, ideal para trabajar con tus datos o enviar a tu gestor.'
                  : 'Los formatos A3con y Sage 50 son compatibles con software contable profesional. El formato Excel (.xlsx) incluye hojas separadas para un análisis detallado.'}
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

