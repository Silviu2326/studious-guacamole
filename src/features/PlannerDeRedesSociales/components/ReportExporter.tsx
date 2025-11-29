import React, { useState } from 'react';
import { SocialAnalytics, SocialPost } from '../api/social';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface ReportExporterProps {
  analytics: SocialAnalytics;
  posts: SocialPost[];
  onExport?: (format: 'pdf' | 'excel', report: any) => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({
  analytics,
  posts,
  onExport
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const report = {
        period: selectedPeriod,
        analytics,
        posts,
        generatedAt: new Date().toISOString()
      };
      
      onExport?.(format, report);
      
      // En producción, esto descargaría el archivo
      alert(`Reporte ${format.toUpperCase()} generado exitosamente`);
    } catch (err: any) {
      alert('Error al exportar: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = () => {
    // Simular programación de reporte
    const newSchedule = {
      id: `schedule_${Date.now()}`,
      format: selectedFormat,
      period: selectedPeriod,
      frequency: 'weekly',
      email: 'laura@fitness.com',
      nextSend: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setScheduledReports(prev => [...prev, newSchedule]);
    alert('Reporte programado exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Exportación de Reportes</h3>
            <p className="text-sm text-gray-600">Exporta tus métricas y análisis en diferentes formatos</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Exportar Reporte</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                options={[
                  { value: 'week', label: 'Semana' },
                  { value: 'month', label: 'Mes' },
                  { value: 'quarter', label: 'Trimestre' },
                  { value: 'year', label: 'Año' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText size={24} className={`mx-auto mb-2 ${selectedFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">PDF</p>
                  <p className="text-xs text-gray-600">Con gráficos</p>
                </button>
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedFormat === 'excel'
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileSpreadsheet size={24} className={`mx-auto mb-2 ${selectedFormat === 'excel' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-900">Excel</p>
                  <p className="text-xs text-gray-600">Para análisis</p>
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleExport(selectedFormat)}
                loading={isExporting}
                leftIcon={selectedFormat === 'pdf' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                className="w-full"
              >
                Exportar {selectedFormat.toUpperCase()}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Programar Reporte</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia
              </label>
              <Select
                value="weekly"
                onChange={() => {}}
                options={[
                  { value: 'daily', label: 'Diario' },
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'monthly', label: 'Mensual' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <FileText size={20} className={`mx-auto ${selectedFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className="text-xs mt-1">PDF</p>
                </button>
                <button
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedFormat === 'excel'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <FileSpreadsheet size={20} className={`mx-auto ${selectedFormat === 'excel' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <p className="text-xs mt-1">Excel</p>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="laura@fitness.com"
                className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2"
                placeholder="email@ejemplo.com"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleScheduleReport}
                variant="secondary"
                leftIcon={<Mail size={18} />}
                className="w-full"
              >
                Programar Envío
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Scheduled Reports */}
      {scheduledReports.length > 0 && (
        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Reportes Programados</h4>
          <div className="space-y-3">
            {scheduledReports.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {schedule.format === 'pdf' ? (
                    <FileText size={20} className="text-blue-600" />
                  ) : (
                    <FileSpreadsheet size={20} className="text-green-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      Reporte {schedule.format.toUpperCase()} - {schedule.period}
                    </p>
                    <p className="text-sm text-gray-600">
                      Enviar {schedule.frequency} a {schedule.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(schedule.nextSend).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-xs text-gray-600">Próximo envío</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Report Preview */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Vista Previa del Reporte</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Alcance Total</p>
              <p className="text-xl font-bold text-blue-600">
                {analytics.summary.totalReach.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Engagement Rate</p>
              <p className="text-xl font-bold text-green-600">
                {analytics.summary.engagementRate}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Crecimiento</p>
              <p className="text-xl font-bold text-purple-600">
                +{analytics.summary.followerGrowth}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Clics</p>
              <p className="text-xl font-bold text-orange-600">
                {analytics.summary.linkClicks.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">El reporte incluirá:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Métricas principales y comparativas</li>
              <li>Top publicaciones con análisis</li>
              <li>Gráficos de tendencias</li>
              <li>Análisis de hashtags</li>
              <li>Recomendaciones y predicciones</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

