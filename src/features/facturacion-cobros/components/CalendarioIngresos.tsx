/**
 * CalendarioIngresos - Vista calendario con ingresos agregados por día
 * 
 * Este componente muestra una vista de calendario mensual donde cada día
 * muestra los ingresos agregados (esperados y reales) para ese día.
 * 
 * Funcionalidades:
 * - Vista mensual con navegación entre meses
 * - Cada día muestra ingresos esperados (facturas pendientes) y reales (cobros confirmados)
 * - Indicadores visuales para días con ingresos altos/bajos
 * - Click en un día para ver detalles
 * - Filtros por mes/año
 * 
 * INTEGRACIÓN:
 * - Utiliza `obtenerIngresosPorMes()` de ingresos.ts
 * - Muestra IngresoDia con ingresosEsperados e ingresosReales
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { ingresosAPI } from '../api/ingresos';
import { IngresoDia } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface CalendarioIngresosProps {
  onError?: (errorMessage: string) => void;
}

interface DiaCalendario {
  fecha: Date;
  ingresosEsperados: number;
  ingresosReales: number;
  facturasPendientes: number;
  cobrosConfirmados: number;
  esDiaActual: boolean;
  esDelMes: boolean;
}

export const CalendarioIngresos: React.FC<CalendarioIngresosProps> = ({
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [ingresosPorDia, setIngresosPorDia] = useState<Map<string, IngresoDia>>(new Map());
  const [diaSeleccionado, setDiaSeleccionado] = useState<IngresoDia | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const datos = await ingresosAPI.obtenerIngresosPorMes(año, mes);
      const mapa = new Map<string, IngresoDia>();
      datos.forEach(ingreso => {
        const clave = ingreso.fecha.toISOString().split('T')[0];
        mapa.set(clave, ingreso);
      });
      setIngresosPorDia(mapa);
    } catch (error) {
      console.error('Error al cargar ingresos del calendario:', error);
      if (onError) {
        onError('Error al cargar los ingresos del calendario');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [año, mes]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  };

  const obtenerDiasDelMes = (): DiaCalendario[] => {
    const primerDia = new Date(año, mes - 1, 1);
    const ultimoDia = new Date(año, mes, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: DiaCalendario[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Días del mes anterior (para completar la primera semana)
    const mesAnterior = new Date(año, mes - 2, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      const fecha = new Date(año, mes - 2, diasMesAnterior - i);
      const clave = fecha.toISOString().split('T')[0];
      const ingreso = ingresosPorDia.get(clave);
      dias.push({
        fecha,
        ingresosEsperados: ingreso?.ingresosEsperados || 0,
        ingresosReales: ingreso?.ingresosReales || 0,
        facturasPendientes: ingreso?.facturasPendientes?.length || 0,
        cobrosConfirmados: ingreso?.cobrosConfirmados?.length || 0,
        esDiaActual: false,
        esDelMes: false
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes - 1, dia);
      fecha.setHours(0, 0, 0, 0);
      const clave = fecha.toISOString().split('T')[0];
      const ingreso = ingresosPorDia.get(clave);
      const esHoy = fecha.getTime() === hoy.getTime();
      
      dias.push({
        fecha,
        ingresosEsperados: ingreso?.ingresosEsperados || 0,
        ingresosReales: ingreso?.ingresosReales || 0,
        facturasPendientes: ingreso?.facturasPendientes?.length || 0,
        cobrosConfirmados: ingreso?.cobrosConfirmados?.length || 0,
        esDiaActual: esHoy,
        esDelMes: true
      });
    }

    // Días del mes siguiente (para completar la última semana)
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 días
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(año, mes, dia);
      const clave = fecha.toISOString().split('T')[0];
      const ingreso = ingresosPorDia.get(clave);
      dias.push({
        fecha,
        ingresosEsperados: ingreso?.ingresosEsperados || 0,
        ingresosReales: ingreso?.ingresosReales || 0,
        facturasPendientes: ingreso?.facturasPendientes?.length || 0,
        cobrosConfirmados: ingreso?.cobrosConfirmados?.length || 0,
        esDiaActual: false,
        esDelMes: false
      });
    }

    return dias;
  };

  const obtenerColorIntensidad = (ingresos: number, maxIngresos: number): string => {
    if (maxIngresos === 0) return 'bg-gray-50';
    const porcentaje = (ingresos / maxIngresos) * 100;
    if (porcentaje > 80) return 'bg-green-600';
    if (porcentaje > 60) return 'bg-green-500';
    if (porcentaje > 40) return 'bg-green-400';
    if (porcentaje > 20) return 'bg-green-300';
    if (porcentaje > 0) return 'bg-green-200';
    return 'bg-gray-50';
  };

  const dias = obtenerDiasDelMes();
  const maxIngresos = Math.max(
    ...dias.map(d => Math.max(d.ingresosEsperados, d.ingresosReales)),
    1
  );

  const handleDiaClick = (dia: DiaCalendario) => {
    if (!dia.esDelMes) return;
    
    const clave = dia.fecha.toISOString().split('T')[0];
    const ingreso = ingresosPorDia.get(clave);
    if (ingreso) {
      setDiaSeleccionado(ingreso);
      setMostrarModal(true);
    }
  };

  const mesAnterior = () => {
    setFechaActual(new Date(año, mes - 2, 1));
  };

  const mesSiguiente = () => {
    setFechaActual(new Date(año, mes, 1));
  };

  const irAHoy = () => {
    setFechaActual(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Calendario de Ingresos</h2>
        </div>
      </div>

      {/* Controles de Navegación */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={mesAnterior}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {nombresMeses[mes - 1]} {año}
              </h3>
            </div>
            <Button
              variant="secondary"
              onClick={mesSiguiente}
              disabled={loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={irAHoy}
            disabled={loading}
          >
            Hoy
          </Button>
        </div>
      </Card>

      {/* Calendario */}
      <Card className="p-6">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-500">Cargando calendario...</div>
          </div>
        ) : (
          <>
            {/* Encabezados de días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {diasSemana.map((dia, index) => (
                <div
                  key={index}
                  className="text-center text-sm font-semibold text-gray-700 py-2"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-2">
              {dias.map((dia, index) => {
                const totalIngresos = dia.ingresosEsperados + dia.ingresosReales;
                const tieneIngresos = totalIngresos > 0;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDiaClick(dia)}
                    className={`
                      min-h-24 p-2 rounded-lg border-2 cursor-pointer transition-all
                      ${dia.esDiaActual ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                      ${!dia.esDelMes ? 'opacity-40' : 'hover:border-blue-300 hover:shadow-md'}
                      ${tieneIngresos ? obtenerColorIntensidad(totalIngresos, maxIngresos) : 'bg-gray-50'}
                      ${tieneIngresos ? 'text-white' : 'text-gray-700'}
                    `}
                  >
                    <div className="text-xs font-medium mb-1">
                      {dia.fecha.getDate()}
                    </div>
                    {dia.esDelMes && tieneIngresos && (
                      <div className="space-y-1">
                        {dia.ingresosReales > 0 && (
                          <div className="text-xs font-semibold flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatearMoneda(dia.ingresosReales)}
                          </div>
                        )}
                        {dia.ingresosEsperados > 0 && dia.ingresosReales === 0 && (
                          <div className="text-xs opacity-75 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {formatearMoneda(dia.ingresosEsperados)}
                          </div>
                        )}
                        {dia.facturasPendientes > 0 && (
                          <div className="text-xs opacity-75 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {dia.facturasPendientes} fact.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="text-gray-600">Ingresos altos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 rounded"></div>
                  <span className="text-gray-600">Ingresos bajos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                  <span className="text-gray-600">Sin ingresos</span>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Modal de Detalle del Día */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={`Detalle de Ingresos - ${diaSeleccionado ? formatearFecha(diaSeleccionado.fecha) : ''}`}
        size="lg"
      >
        {diaSeleccionado && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-700 font-medium">Ingresos Reales</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {formatearMoneda(diaSeleccionado.ingresosReales)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {diaSeleccionado.cobrosConfirmados.length} cobros confirmados
                </p>
              </Card>
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-700 font-medium">Ingresos Esperados</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {formatearMoneda(diaSeleccionado.ingresosEsperados)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {diaSeleccionado.facturasPendientes.length} facturas pendientes
                </p>
              </Card>
            </div>

            {diaSeleccionado.facturasPendientes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Facturas Pendientes</h4>
                <div className="space-y-2">
                  {diaSeleccionado.facturasPendientes.map((factura, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{factura.numero}</div>
                      <div className="text-gray-600">{factura.nombreCliente}</div>
                      <div className="text-gray-500">{formatearMoneda(factura.saldoPendiente)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diaSeleccionado.cobrosConfirmados.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Cobros Confirmados</h4>
                <div className="space-y-2">
                  {diaSeleccionado.cobrosConfirmados.map((cobro, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{formatearMoneda(cobro.importe)}</div>
                      <div className="text-gray-600">{cobro.metodoPago}</div>
                      {cobro.referenciaExternaOpcional && (
                        <div className="text-gray-500">{cobro.referenciaExternaOpcional}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

