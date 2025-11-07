import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { BarChart3, Download, FileText } from 'lucide-react';

export const ReportesInventario: React.FC = () => {
  const [tipoReporte, setTipoReporte] = useState('stock_completo');
  const [periodo, setPeriodo] = useState('mensual');
  const [loading, setLoading] = useState(false);

  const tiposReporte = [
    { value: 'stock_completo', label: 'Stock Completo' },
    { value: 'movimientos', label: 'Movimientos de Stock' },
    { value: 'caducidades', label: 'Productos por Caducar' },
    { value: 'alertas', label: 'Alertas y Excepciones' },
    { value: 'analisis', label: 'Análisis de Rendimiento' },
  ];

  const periodos = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  const handleGenerarReporte = async () => {
    setLoading(true);
    try {
      // En producción, llamar a la API para generar el reporte
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Reporte generado exitosamente. En producción, se descargaría el archivo.');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuración de reporte */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Generar Reporte
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Reporte
              </label>
              <Select
                options={tiposReporte}
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Período
              </label>
              <Select
                options={periodos}
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handleGenerarReporte}
              loading={loading}
              fullWidth
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {/* Información sobre reportes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tipos de Reportes Disponibles
          </h3>
          
          <div className="space-y-4">
            {tiposReporte.map((tipo) => (
              <div
                key={tipo.value}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {tipo.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {tipo.value === 'stock_completo' && 'Listado completo de productos con stock actual, mínimos y estados'}
                      {tipo.value === 'movimientos' && 'Historial detallado de todos los movimientos de stock (entradas, salidas, ajustes)'}
                      {tipo.value === 'caducidades' && 'Productos próximos a vencer organizados por fecha de caducidad'}
                      {tipo.value === 'alertas' && 'Resumen de todas las alertas activas y resueltas en el período seleccionado'}
                      {tipo.value === 'analisis' && 'Análisis de rendimiento, rotación de stock y tendencias'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
