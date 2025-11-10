import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { Download, FileText, FileSpreadsheet, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ExportacionFiscalService, ResumenFiscal } from '../services/exportacionFiscalService';

export const ExportacionFiscal: React.FC = () => {
  const { user } = useAuth();
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const hoy = new Date();
    const primerDiaAño = new Date(hoy.getFullYear(), 0, 1);
    return primerDiaAño.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });
  const [exportando, setExportando] = useState(false);
  const [formato, setFormato] = useState<'excel' | 'pdf'>('excel');
  const [resumenFiscal, setResumenFiscal] = useState<ResumenFiscal | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Información fiscal del usuario (se puede obtener de un perfil de usuario)
  const informacionFiscal = {
    nombre: user?.name || 'Entrenador Personal',
    nif: '', // Se puede obtener del perfil del usuario
    actividad: 'Actividades de entrenamiento personal',
    epigrafeIAE: '932.1 - Actividades de gimnasios y centros de fitness'
  };

  const cargarResumen = async () => {
    try {
      setError(null);
      setExportando(true);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999); // Incluir el día completo

      const resumen = await ExportacionFiscalService.obtenerDatosFiscales(
        inicio,
        fin,
        user?.id,
        user?.role as 'entrenador' | 'gimnasio',
        informacionFiscal
      );

      setResumenFiscal(resumen);
    } catch (err) {
      console.error('Error cargando resumen fiscal:', err);
      setError('Error al cargar el resumen fiscal. Por favor, intenta nuevamente.');
    } finally {
      setExportando(false);
    }
  };

  const exportar = async () => {
    if (!resumenFiscal) {
      await cargarResumen();
      return;
    }

    try {
      setError(null);
      setExportando(true);

      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);

      // Obtener datos actualizados
      const resumen = await ExportacionFiscalService.obtenerDatosFiscales(
        inicio,
        fin,
        user?.id,
        user?.role as 'entrenador' | 'gimnasio',
        informacionFiscal
      );

      const nombreArchivo = `resumen-fiscal-${inicio.getFullYear()}-${inicio.toLocaleDateString('es-ES', { month: '2-digit' })}-${fin.toLocaleDateString('es-ES', { month: '2-digit' })}`;

      if (formato === 'excel') {
        const blob = await ExportacionFiscalService.exportarAExcel(resumen, nombreArchivo);
        ExportacionFiscalService.descargarArchivo(blob, nombreArchivo, 'xlsx');
      } else {
        const blob = await ExportacionFiscalService.exportarAPDF(resumen, nombreArchivo);
        ExportacionFiscalService.descargarArchivo(blob, nombreArchivo, 'pdf');
      }
    } catch (err) {
      console.error('Error exportando:', err);
      setError('Error al exportar el resumen fiscal. Por favor, intenta nuevamente.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Exportación Fiscal
              </h2>
              <p className="text-sm text-gray-600">
                Exporta un resumen de ingresos y gastos categorizados según normativa española para tu asesor fiscal
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Rango de fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Formato de exportación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Exportación
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormato('excel')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    formato === 'excel'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Excel (XLSX)</span>
                </button>
                <button
                  onClick={() => setFormato('pdf')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    formato === 'pdf'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={exportar}
                loading={exportando}
                disabled={exportando}
                leftIcon={exportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              >
                {exportando ? 'Exportando...' : 'Exportar Resumen Fiscal'}
              </Button>
              <Button
                variant="secondary"
                onClick={cargarResumen}
                loading={exportando}
                disabled={exportando}
              >
                Vista Previa
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Vista previa del resumen */}
      {resumenFiscal && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Vista Previa del Resumen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-900">
                  €{resumenFiscal.ingresos.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-700 mb-1">Gastos Totales</p>
                <p className="text-2xl font-bold text-red-900">
                  €{resumenFiscal.gastos.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">Beneficio Neto</p>
                <p className="text-2xl font-bold text-blue-900">
                  €{resumenFiscal.beneficio.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ingresos por categoría */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Ingresos por Categoría</h4>
                <div className="space-y-2">
                  {Object.entries(resumenFiscal.ingresos.porCategoria).map(([cat, total]) => (
                    total > 0 && (
                      <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">
                          {cat === 'servicios_profesionales' ? 'Servicios Profesionales' :
                           cat === 'venta_productos' ? 'Venta de Productos' :
                           'Otras Actividades'}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          €{total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Gastos por categoría */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Gastos por Categoría</h4>
                <div className="space-y-2">
                  {Object.entries(resumenFiscal.gastos.porCategoria).map(([cat, total]) => (
                    total > 0 && (
                      <div key={cat} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">
                          {cat === 'adquisicion_inmovilizado' ? 'Adquisición de Inmovilizado' :
                           cat === 'servicios_profesionales_independientes' ? 'Servicios Profesionales Independientes' :
                           cat === 'primas_seguros' ? 'Primas de Seguros' :
                           cat === 'servicios' ? 'Servicios' :
                           cat === 'suministros' ? 'Suministros' :
                           'Otras Deducciones'}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          €{total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )
                  ))}
                  {resumenFiscal.gastos.total === 0 && (
                    <p className="text-sm text-gray-500">No hay gastos registrados en este período</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este resumen está categorizado según la normativa fiscal española. 
                Los datos están listos para ser compartidos con tu asesor fiscal. 
                El archivo exportado incluirá información detallada de todas las transacciones.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

