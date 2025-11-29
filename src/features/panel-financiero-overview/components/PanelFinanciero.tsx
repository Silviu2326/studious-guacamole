/**
 * PanelFinanciero - Componente principal de overview financiero
 * 
 * Este componente actúa como cabecera visual del módulo financiero, mostrando
 * un resumen ejecutivo de métricas financieras y alertas de pagos adaptadas al rol.
 * 
 * @remarks
 * Este componente es reutilizable y puede ser utilizado desde:
 * - El tab "Overview" de la página principal del módulo financiero
 * - Otros módulos que requieran mostrar un resumen financiero compacto
 * - Dashboards personalizados o widgets financieros
 * 
 * El componente gestiona sus propios estados de carga y error para las llamadas
 * de API, proporcionando una experiencia de usuario fluida y resiliente.
 */

import React from 'react';
import { Card, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  AlertCircle, 
  AlertTriangle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { getResumenFinancieroGeneral, getResumenAlertasPagos } from '../api';
import { RolFinanciero, MetricasFinancieras } from '../types';

export interface PanelFinancieroProps {
  /** Rol financiero del usuario que determina qué métricas y alertas mostrar */
  rol: RolFinanciero;
}

export const PanelFinanciero: React.FC<PanelFinancieroProps> = ({ rol }) => {
  // Estados locales para el resumen financiero general
  const [resumenFinanciero, setResumenFinanciero] = React.useState<MetricasFinancieras[]>([]);
  const [loadingResumen, setLoadingResumen] = React.useState(true);
  const [errorResumen, setErrorResumen] = React.useState<string | null>(null);

  // Estados locales para las alertas de pagos
  const [alertasPagos, setAlertasPagos] = React.useState<{
    totalPendiente: number;
    numeroClientesRiesgoAlto: number;
    proximosVencimientos: number;
  } | null>(null);
  const [loadingAlertas, setLoadingAlertas] = React.useState(true);
  const [errorAlertas, setErrorAlertas] = React.useState<string | null>(null);

  // Cargar resumen financiero general
  React.useEffect(() => {
    const cargarResumenFinanciero = async () => {
      try {
        setLoadingResumen(true);
        setErrorResumen(null);
        const data = await getResumenFinancieroGeneral(rol);
        setResumenFinanciero(data);
      } catch (error) {
        console.error('Error cargando resumen financiero general:', error);
        setErrorResumen('No se pudo cargar el resumen financiero. Por favor, intenta de nuevo.');
      } finally {
        setLoadingResumen(false);
      }
    };

    cargarResumenFinanciero();
  }, [rol]);

  // Cargar resumen de alertas de pagos
  React.useEffect(() => {
    const cargarAlertasPagos = async () => {
      try {
        setLoadingAlertas(true);
        setErrorAlertas(null);
        const data = await getResumenAlertasPagos(rol);
        setAlertasPagos(data);
      } catch (error) {
        console.error('Error cargando alertas de pagos:', error);
        setErrorAlertas('No se pudieron cargar las alertas de pagos.');
      } finally {
        setLoadingAlertas(false);
      }
    };

    cargarAlertasPagos();
  }, [rol]);

  // Función para reintentar carga en caso de error
  const handleRetryResumen = () => {
    setErrorResumen(null);
    setLoadingResumen(true);
    getResumenFinancieroGeneral(rol)
      .then(data => {
        setResumenFinanciero(data);
        setErrorResumen(null);
      })
      .catch(error => {
        console.error('Error en reintento:', error);
        setErrorResumen('No se pudo cargar el resumen financiero. Por favor, intenta de nuevo.');
      })
      .finally(() => setLoadingResumen(false));
  };

  const handleRetryAlertas = () => {
    setErrorAlertas(null);
    setLoadingAlertas(true);
    getResumenAlertasPagos(rol)
      .then(data => {
        setAlertasPagos(data);
        setErrorAlertas(null);
      })
      .catch(error => {
        console.error('Error en reintento:', error);
        setErrorAlertas('No se pudieron cargar las alertas de pagos.');
      })
      .finally(() => setLoadingAlertas(false));
  };

  // Convertir métricas financieras a formato de tarjetas
  const metricasCards: MetricCardData[] = resumenFinanciero.slice(0, 4).map((metrica, index) => {
    const formatearValor = (valor: number, esPorcentaje: boolean = false): string => {
      if (esPorcentaje) {
        return `${valor.toFixed(1)}%`;
      }
      return `€${valor.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
    };

    const esPorcentaje = metrica.etiqueta.toLowerCase().includes('margen') || 
                        metrica.etiqueta.toLowerCase().includes('porcentaje');

    return {
      id: `metrica-${index}`,
      title: metrica.etiqueta,
      value: formatearValor(metrica.valorActual, esPorcentaje),
      subtitle: metrica.descripcionOpcional || `${metrica.periodoActual || 'Período actual'}`,
      trend: {
        value: Math.abs(metrica.variacionPorcentual),
        direction: metrica.tendencia,
        label: 'vs período anterior'
      },
      icon: metrica.tendencia === 'up' ? <TrendingUp className="w-5 h-5" /> : 
            metrica.tendencia === 'down' ? <TrendingDown className="w-5 h-5" /> : 
            <DollarSign className="w-5 h-5" />,
      color: metrica.tendencia === 'up' ? 'success' : 
             metrica.tendencia === 'down' ? 'error' : 
             'info',
      loading: loadingResumen
    };
  });

  const isEntrenador = rol === 'entrenador';

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo - Métricas Financieras Principales */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Resumen Ejecutivo
          </h2>
        </div>

        {errorResumen ? (
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="p-3 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Error al cargar el resumen financiero
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
                {errorResumen}
              </p>
              <button
                onClick={handleRetryResumen}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </button>
            </div>
          </Card>
        ) : (
          <MetricCards data={metricasCards} columns={4} />
        )}
      </div>

      {/* Resumen de Alertas de Pagos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas de Pagos
          </h2>
        </div>

        {errorAlertas ? (
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="p-2 bg-amber-100 rounded-full mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-gray-600 text-center mb-3">
                {errorAlertas}
              </p>
              <button
                onClick={handleRetryAlertas}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </button>
            </div>
          </Card>
        ) : loadingAlertas ? (
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm text-gray-600">Cargando alertas...</span>
            </div>
          </Card>
        ) : alertasPagos ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Pendiente */}
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Total Pendiente
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    €{alertasPagos.totalPendiente.toLocaleString('es-ES')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isEntrenador ? 'Pagos de clientes' : 'Cuotas y pagos pendientes'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </Card>

            {/* Clientes en Riesgo Alto */}
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {isEntrenador ? 'Clientes' : 'Socios'} en Riesgo
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {alertasPagos.numeroClientesRiesgoAlto}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pagos vencidos &gt; 15 días
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </Card>

            {/* Próximos Vencimientos */}
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Próximos Vencimientos
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {alertasPagos.proximosVencimientos}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    En los próximos 7 días
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};

