import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { IngresoDia, ProyeccionFinMes, Factura, Cobro } from '../types';
import { ingresosAPI } from '../api/ingresos';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarioIngresos: React.FC = () => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [ingresosDias, setIngresosDias] = useState<IngresoDia[]>([]);
  const [proyeccion, setProyeccion] = useState<ProyeccionFinMes | null>(null);
  const [loading, setLoading] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [cobroSeleccionado, setCobroSeleccionado] = useState<Cobro | null>(null);

  const ano = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;

  useEffect(() => {
    cargarDatos();
  }, [ano, mes]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [ingresos, proyeccionData] = await Promise.all([
        ingresosAPI.obtenerIngresosPorMes(ano, mes),
        ingresosAPI.calcularProyeccionFinMes(ano, mes)
      ]);
      setIngresosDias(ingresos);
      setProyeccion(proyeccionData);
    } catch (error) {
      console.error('Error al cargar datos de ingresos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerNombreMes = (mes: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  };

  const obtenerDiasSemana = () => {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  };

  const obtenerPrimerDiaSemana = () => {
    const primerDia = new Date(ano, mes - 1, 1);
    return primerDia.getDay();
  };

  const obtenerDiasDelMes = () => {
    const ultimoDia = new Date(ano, mes, 0);
    return ultimoDia.getDate();
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return (
      dia === hoy.getDate() &&
      mes === hoy.getMonth() + 1 &&
      ano === hoy.getFullYear()
    );
  };

  const obtenerIngresoDia = (dia: number): IngresoDia | null => {
    const fecha = new Date(ano, mes - 1, dia);
    return ingresosDias.find(ingreso => {
      const ingresoFecha = new Date(ingreso.fecha);
      return (
        ingresoFecha.getDate() === fecha.getDate() &&
        ingresoFecha.getMonth() === fecha.getMonth() &&
        ingresoFecha.getFullYear() === fecha.getFullYear()
      );
    }) || null;
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    setFechaActual(nuevaFecha);
  };

  const renderizarDia = (dia: number) => {
    const ingresoDia = obtenerIngresoDia(dia);
    const esDiaHoy = esHoy(dia);
    const tieneIngresos = ingresoDia && (ingresoDia.ingresosEsperados > 0 || ingresoDia.ingresosReales > 0);

    return (
      <div
        key={dia}
        className={`
          min-h-[100px] p-2 border rounded-lg transition-all
          ${esDiaHoy ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : 'bg-white border-gray-200'}
          ${tieneIngresos ? 'hover:shadow-md cursor-pointer' : ''}
        `}
        onClick={() => {
          if (ingresoDia) {
            if (ingresoDia.facturasPendientes.length > 0) {
              setFacturaSeleccionada(ingresoDia.facturasPendientes[0]);
            } else if (ingresoDia.cobrosConfirmados.length > 0) {
              setCobroSeleccionado(ingresoDia.cobrosConfirmados[0]);
            }
          }
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`
              text-sm font-medium
              ${esDiaHoy ? 'text-blue-700' : 'text-gray-700'}
            `}
          >
            {dia}
          </span>
        </div>
        {ingresoDia && (
          <div className="space-y-1 text-xs">
            {ingresoDia.ingresosEsperados > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="font-medium truncate">
                  {formatearMoneda(ingresoDia.ingresosEsperados).replace('COP', '').trim()}
                </span>
              </div>
            )}
            {ingresoDia.ingresosReales > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium truncate">
                  {formatearMoneda(ingresoDia.ingresosReales).replace('COP', '').trim()}
                </span>
              </div>
            )}
            {ingresoDia.facturasPendientes.length > 0 && (
              <div className="text-orange-500 text-xs">
                {ingresoDia.facturasPendientes.length} factura(s)
              </div>
            )}
            {ingresoDia.cobrosConfirmados.length > 0 && (
              <div className="text-green-500 text-xs">
                {ingresoDia.cobrosConfirmados.length} cobro(s)
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderizarCalendario = () => {
    const diasSemana = obtenerDiasSemana();
    const primerDiaSemana = obtenerPrimerDiaSemana();
    const diasDelMes = obtenerDiasDelMes();
    const diasVacidos = [];

    for (let i = 0; i < primerDiaSemana; i++) {
      diasVacidos.push(<div key={`empty-${i}`} className="min-h-[100px]"></div>);
    }

    const dias = [];
    for (let dia = 1; dia <= diasDelMes; dia++) {
      dias.push(renderizarDia(dia));
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map(dia => (
          <div
            key={dia}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {dia}
          </div>
        ))}
        {diasVacidos}
        {dias}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando calendario de ingresos...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación y calendario */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarMes('anterior')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">
              {obtenerNombreMes(mes)} {ano}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarMes('siguiente')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setFechaActual(new Date())}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Hoy
          </Button>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
            <span className="text-sm text-gray-700">Ingresos Esperados (Facturas Pendientes)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-700">Ingresos Reales (Cobros Confirmados)</span>
          </div>
        </div>

        {/* Calendario */}
        {renderizarCalendario()}
      </Card>

      {/* Proyección de fin de mes */}
      {proyeccion && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-700">Ingresos Esperados</h3>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatearMoneda(proyeccion.ingresosEsperadosAcumulados)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              + {formatearMoneda(proyeccion.ingresosEsperadosPendientes)} pendientes
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-700">Ingresos Reales</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatearMoneda(proyeccion.ingresosRealesAcumulados)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {proyeccion.porcentajeCumplimiento.toFixed(1)}% de cumplimiento
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-700">Proyección Fin de Mes</h3>
              {proyeccion.diferencia >= 0 ? (
                <TrendingUp className="w-5 h-5 text-purple-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {formatearMoneda(proyeccion.proyeccionFinMes)}
            </p>
            <p className={`text-xs mt-1 ${proyeccion.diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {proyeccion.diferencia >= 0 ? '+' : ''}{formatearMoneda(proyeccion.diferencia)} diferencia
            </p>
          </Card>
        </div>
      )}

      {/* Modal de detalle de factura */}
      {facturaSeleccionada && (
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Factura {facturaSeleccionada.numeroFactura}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFacturaSeleccionada(null)}
            >
              ×
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{facturaSeleccionada.cliente.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto Pendiente:</span>
              <span className="font-medium text-orange-600">
                {formatearMoneda(facturaSeleccionada.montoPendiente)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha Vencimiento:</span>
              <span className="font-medium">
                {facturaSeleccionada.fechaVencimiento.toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de detalle de cobro */}
      {cobroSeleccionado && (
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cobro Confirmado
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCobroSeleccionado(null)}
            >
              ×
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium text-green-600">
                {formatearMoneda(cobroSeleccionado.monto)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha Cobro:</span>
              <span className="font-medium">
                {cobroSeleccionado.fechaCobro.toLocaleDateString('es-ES')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Método de Pago:</span>
              <span className="font-medium">{cobroSeleccionado.metodoPago}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

