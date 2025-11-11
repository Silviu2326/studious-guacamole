import React, { useState } from 'react';
import { Card, Button, Select, Input } from '../../../components/componentsreutilizables';
import {
  ExportarDatosRequest,
  FormatoExportacion,
} from '../types';
import { exportarYDescargar } from '../api/exportacion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ExportarDatosProps {
  entrenadorId?: string;
}

export const ExportarDatos: React.FC<ExportarDatosProps> = ({
  entrenadorId,
}) => {
  const [formato, setFormato] = useState<FormatoExportacion>('csv');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [incluirSuscripciones, setIncluirSuscripciones] = useState(true);
  const [incluirPagos, setIncluirPagos] = useState(true);
  const [incluirCanceladas, setIncluirCanceladas] = useState(false);
  const [incluirPausadas, setIncluirPausadas] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleExportar = async () => {
    if (!incluirSuscripciones && !incluirPagos) {
      setMensaje({
        tipo: 'error',
        texto: 'Debes seleccionar al menos suscripciones o pagos para exportar',
      });
      return;
    }

    setExportando(true);
    setMensaje(null);

    try {
      const request: ExportarDatosRequest = {
        entrenadorId,
        formato,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        incluirSuscripciones,
        incluirPagos,
        incluirCanceladas,
        incluirPausadas,
      };

      await exportarYDescargar(request);

      setMensaje({
        tipo: 'success',
        texto: 'Datos exportados correctamente. El archivo se descargará automáticamente.',
      });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      console.error('Error exportando datos:', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error al exportar los datos. Por favor, intenta de nuevo.',
      });
    } finally {
      setExportando(false);
    }
  };

  const getIconoFormato = (formato: FormatoExportacion) => {
    switch (formato) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'json':
        return <File className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getDescripcionFormato = (formato: FormatoExportacion) => {
    switch (formato) {
      case 'csv':
        return 'Formato CSV compatible con Excel y Google Sheets';
      case 'excel':
        return 'Formato Excel (.xlsx) - Nota: Se exportará como CSV';
      case 'pdf':
        return 'Formato PDF - Nota: Se exportará como texto formateado';
      case 'json':
        return 'Formato JSON para análisis programático';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Exportar Datos de Suscripciones y Pagos
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        Exporta los datos de suscripciones y pagos para análisis personalizados o compartir con tu asesor fiscal.
      </p>

      {/* Formato de exportación */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formato de Exportación
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['csv', 'excel', 'pdf', 'json'] as FormatoExportacion[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormato(fmt)}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                formato === fmt
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {getIconoFormato(fmt)}
              <span className="mt-2 text-sm font-medium uppercase">{fmt}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {getDescripcionFormato(formato)}
        </p>
      </div>

      {/* Filtros de fecha */}
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

      {/* Opciones de contenido */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Contenido a Exportar
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluirSuscripciones}
              onChange={(e) => setIncluirSuscripciones(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Incluir Suscripciones</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluirPagos}
              onChange={(e) => setIncluirPagos(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Incluir Pagos</span>
          </label>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Opciones Adicionales
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluirCanceladas}
              onChange={(e) => setIncluirCanceladas(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Incluir Suscripciones Canceladas</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluirPausadas}
              onChange={(e) => setIncluirPausadas(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Incluir Suscripciones Pausadas</span>
          </label>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {mensaje.tipo === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{mensaje.texto}</span>
        </div>
      )}

      {/* Botón de exportar */}
      <Button
        onClick={handleExportar}
        disabled={exportando || (!incluirSuscripciones && !incluirPagos)}
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

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Información sobre la exportación
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Los datos se exportarán según los filtros seleccionados</li>
          <li>• El archivo se descargará automáticamente cuando esté listo</li>
          <li>• Los formatos CSV y Excel son ideales para análisis en hojas de cálculo</li>
          <li>• El formato JSON es útil para análisis programático o integraciones</li>
          <li>• Puedes compartir estos datos con tu asesor fiscal de forma segura</li>
        </ul>
      </div>
    </Card>
  );
};

