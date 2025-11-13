import React, { useState } from 'react';
import { Card, Button, Select, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  FileText,
  Calendar,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Dieta,
  ReporteEvolucion,
  TipoPeriodoReporte,
  OpcionesGeneracionReporte,
} from '../types';
import {
  generarReporteEvolucion,
  getReportesDieta,
  compartirReporte,
  exportarReporte,
} from '../api';

interface GeneradorReportesProps {
  dieta: Dieta;
  onClose?: () => void;
}

export const GeneradorReportes: React.FC<GeneradorReportesProps> = ({
  dieta,
  onClose,
}) => {
  const [mostrarGenerar, setMostrarGenerar] = useState(false);
  const [periodo, setPeriodo] = useState<TipoPeriodoReporte>('semanal');
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [generando, setGenerando] = useState(false);
  const [reporteGenerado, setReporteGenerado] = useState<ReporteEvolucion | null>(null);
  const [reportes, setReportes] = useState<ReporteEvolucion[]>([]);
  const [cargandoReportes, setCargandoReportes] = useState(false);

  React.useEffect(() => {
    cargarReportes();
  }, [dieta.id]);

  const cargarReportes = async () => {
    setCargandoReportes(true);
    try {
      const reportesData = await getReportesDieta(dieta.id);
      setReportes(reportesData);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargandoReportes(false);
    }
  };

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      const opciones: OpcionesGeneracionReporte = {
        dietaId: dieta.id,
        clienteId: dieta.clienteId,
        periodo,
        fechaInicio,
        fechaFin,
        incluirGraficos: true,
        formato: 'html',
      };

      const nuevoReporte = await generarReporteEvolucion(opciones);
      setReporteGenerado(nuevoReporte);
      await cargarReportes();
      setMostrarGenerar(false);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Por favor, inténtalo de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  const handleExportar = async (reporteId: string, formato: 'pdf' | 'excel' | 'html') => {
    try {
      await exportarReporte(reporteId, formato);
      alert(`Reporte exportado en formato ${formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      alert('Error al exportar el reporte.');
    }
  };

  const handleCompartir = async (reporteId: string) => {
    const usuariosIds = prompt('Ingresa los IDs de usuarios separados por comas:');
    if (usuariosIds) {
      try {
        await compartirReporte(reporteId, usuariosIds.split(',').map(id => id.trim()));
        alert('Reporte compartido exitosamente');
      } catch (error) {
        console.error('Error al compartir reporte:', error);
        alert('Error al compartir el reporte.');
      }
    }
  };

  const getTendenciaIcon = (tendencia: 'mejora' | 'estable' | 'empeora') => {
    switch (tendencia) {
      case 'mejora':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'empeora':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Reportes de Evolución</h3>
        </div>
        <Button
          onClick={() => setMostrarGenerar(true)}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Generar Reporte
        </Button>
      </div>

      {reporteGenerado && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Reporte generado exitosamente</p>
                <p className="text-sm text-green-700">
                  Período: {new Date(reporteGenerado.fechaInicio).toLocaleDateString()} -{' '}
                  {new Date(reporteGenerado.fechaFin).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReporteGenerado(null)}
            >
              Cerrar
            </Button>
          </div>
        </Card>
      )}

      {reportes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Reportes Anteriores</h4>
          {reportes.map((reporte) => (
            <Card key={reporte.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">
                      Reporte {reporte.periodo === 'semanal' ? 'Semanal' : 'Mensual'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(reporte.fechaInicio).toLocaleDateString()} -{' '}
                      {new Date(reporte.fechaFin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Adherencia</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {reporte.resumen.metricas.adherencia.promedio.toFixed(1)}%
                        </span>
                        {getTendenciaIcon(reporte.resumen.metricas.adherencia.tendencia)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Comidas Completadas</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {reporte.resumen.habitos.comidasCompletadas.porcentaje}%
                        </span>
                        {getTendenciaIcon(reporte.resumen.habitos.comidasCompletadas.tendencia)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hidratación</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {reporte.resumen.habitos.hidratacion.porcentaje}%
                        </span>
                        {getTendenciaIcon(reporte.resumen.habitos.hidratacion.tendencia)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ejercicio</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {reporte.resumen.habitos.ejercicio.dias} días
                        </span>
                        {getTendenciaIcon(reporte.resumen.habitos.ejercicio.tendencia)}
                      </div>
                    </div>
                  </div>
                  {reporte.resumen.logros.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Logros:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {reporte.resumen.logros.slice(0, 2).map((logro, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{logro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportar(reporte.id, 'pdf')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportar(reporte.id, 'excel')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompartir(reporte.id)}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    Compartir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {reportes.length === 0 && !cargandoReportes && (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay reportes generados aún</p>
          <p className="text-sm text-gray-400 mt-1">
            Genera tu primer reporte para ver la evolución de métricas y hábitos
          </p>
        </Card>
      )}

      {mostrarGenerar && (
        <Modal
          isOpen={mostrarGenerar}
          onClose={() => setMostrarGenerar(false)}
          title="Generar Reporte de Evolución"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as TipoPeriodoReporte)}
              >
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setMostrarGenerar(false)}
                disabled={generando}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGenerar}
                disabled={generando || !fechaInicio || !fechaFin}
              >
                {generando ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

