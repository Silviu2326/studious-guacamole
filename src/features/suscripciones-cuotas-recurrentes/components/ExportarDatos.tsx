import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Input } from '../../../components/componentsreutilizables';
import {
  TipoDatoExportacion,
  FormatoExportacion,
  ExportarSuscripcionesRequest,
  ExportarCuotasRequest,
  ExportarMetricasRequest,
} from '../types';
import {
  exportarSuscripciones,
  exportarCuotas,
  exportarMetricasSuscripciones,
} from '../api/exportacion';
import { getSuscripciones } from '../api/suscripciones';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  FileText,
} from 'lucide-react';

interface ExportarDatosProps {
  entrenadorId?: string;
}

interface ToastMessage {
  tipo: 'success' | 'error';
  texto: string;
}

export const ExportarDatos: React.FC<ExportarDatosProps> = ({
  entrenadorId,
}) => {
  const [tipoDato, setTipoDato] = useState<TipoDatoExportacion>('suscripciones');
  const [formato, setFormato] = useState<'csv' | 'excel'>('csv');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [planId, setPlanId] = useState<string>('');
  const [planesDisponibles, setPlanesDisponibles] = useState<Array<{ id: string; nombre: string }>>([]);
  const [exportando, setExportando] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Cargar planes disponibles
  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        const suscripciones = await getSuscripciones('entrenador', entrenadorId);
        const planesUnicos = Array.from(
          new Map(
            suscripciones.map(s => [s.planId, { id: s.planId, nombre: s.planNombre }])
          ).values()
        );
        setPlanesDisponibles([
          { id: '', nombre: 'Todos los planes' },
          ...planesUnicos,
        ]);
      } catch (error) {
        console.error('Error cargando planes:', error);
      }
    };
    cargarPlanes();
  }, [entrenadorId]);

  const handleExportar = async () => {
    setExportando(true);
    setToast(null);

    try {
      let response;

      switch (tipoDato) {
        case 'suscripciones': {
          const request: ExportarSuscripcionesRequest = {
            entrenadorId,
            formato,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            planId: planId || undefined,
          };
          response = await exportarSuscripciones(request);
          break;
        }
        case 'cuotas': {
          const request: ExportarCuotasRequest = {
            entrenadorId,
            formato,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            planId: planId || undefined,
          };
          response = await exportarCuotas(request);
          break;
        }
        case 'metricas': {
          const request: ExportarMetricasRequest = {
            entrenadorId,
            formato,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            planId: planId || undefined,
          };
          response = await exportarMetricasSuscripciones(request);
          break;
        }
      }

      // Simular descarga
      if (response?.url) {
        const link = document.createElement('a');
        link.href = response.url;
        link.download = response.nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(response.url);
      }

      setToast({
        tipo: 'success',
        texto: `Exportación completada. Archivo "${response?.nombreArchivo}" descargado.`,
      });

      // Limpiar toast después de 5 segundos
      setTimeout(() => setToast(null), 5000);
    } catch (error) {
      console.error('Error exportando datos:', error);
      setToast({
        tipo: 'error',
        texto: 'Error al exportar los datos. Por favor, intenta de nuevo.',
      });
    } finally {
      setExportando(false);
    }
  };

  const getDescripcionTipoDato = (tipo: TipoDatoExportacion): string => {
    switch (tipo) {
      case 'suscripciones':
        return 'Ideal para enviar a tu gestor o contable. Incluye información completa de todas las suscripciones activas.';
      case 'cuotas':
        return 'Perfecto para análisis de pagos y facturación. Contiene el historial completo de cuotas y pagos.';
      case 'metricas':
        return 'Excelente para análisis avanzado en Excel. Incluye métricas calculadas como tasas de uso, retención y compromiso.';
      default:
        return '';
    }
  };

  const getIconoTipoDato = (tipo: TipoDatoExportacion) => {
    switch (tipo) {
      case 'suscripciones':
        return <FileText className="w-5 h-5" />;
      case 'cuotas':
        return <Download className="w-5 h-5" />;
      case 'metricas':
        return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  return (
    <Card className="bg-white shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Exportar Datos
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        Exporta datos de suscripciones, cuotas o métricas en formato CSV o Excel para análisis externo.
      </p>

      {/* Selector de tipo de dato */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Dato a Exportar
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['suscripciones', 'cuotas', 'metricas'] as TipoDatoExportacion[]).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoDato(tipo)}
              className={`flex flex-col items-start p-4 border-2 rounded-lg transition-all text-left ${
                tipoDato === tipo
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getIconoTipoDato(tipo)}
                <span className="font-medium capitalize">{tipo}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {getDescripcionTipoDato(tipo)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de formato */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formato de Exportación
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['csv', 'excel'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormato(fmt)}
              className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                formato === fmt
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="font-medium uppercase">{fmt}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {formato === 'csv'
            ? 'Formato CSV compatible con Excel y Google Sheets'
            : 'Formato Excel (.xlsx) - Se exportará como CSV compatible'}
        </p>
      </div>

      {/* Filtros de periodo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Inicio (Opcional)
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
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha Fin (Opcional)
          </label>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Filtro de plan */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plan (Opcional)
        </label>
        <Select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full"
        >
          {planesDisponibles.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.nombre}
            </option>
          ))}
        </Select>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center justify-between gap-3 ${
            toast.tipo === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{toast.texto}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Botón de exportar */}
      <Button
        onClick={handleExportar}
        disabled={exportando}
        className="w-full md:w-auto"
        variant="primary"
      >
        {exportando ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Exportar Datos
          </>
        )}
      </Button>

      {/* Información de ayuda */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              ¿Para qué sirve cada export?
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                <strong>Suscripciones:</strong> Para enviar a tu gestor o contable. Incluye información completa de todas las suscripciones.
              </li>
              <li>
                <strong>Cuotas:</strong> Para análisis de pagos y facturación. Contiene el historial completo de cuotas y pagos.
              </li>
              <li>
                <strong>Métricas:</strong> Para análisis avanzado en Excel. Incluye métricas calculadas como tasas de uso, retención y compromiso.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
