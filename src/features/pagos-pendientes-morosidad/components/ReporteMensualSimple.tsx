import React, { useState, useEffect } from 'react';
import { Card, Button, Table, TableColumn, Badge, Select } from '../../../components/componentsreutilizables';
import type { ReporteMensualSimple as ReporteMensualSimpleData } from '../types';
import { reportesMensualesAPI } from '../api/reportesMensuales';
import { Calendar, DollarSign, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';

interface ReporteMensualSimpleProps {
  onRefresh?: () => void;
}

export const ReporteMensualSimple: React.FC<ReporteMensualSimpleProps> = ({ onRefresh }) => {
  const [reporte, setReporte] = useState<ReporteMensualSimpleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarReporte();
  }, [mes, año]);

  const cargarReporte = async () => {
    setLoading(true);
    try {
      const reporteData = await reportesMensualesAPI.obtenerReporteMensual(mes, año);
      setReporte(reporteData);
    } catch (error) {
      console.error('Error al cargar reporte mensual:', error);
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

  const obtenerNombreMes = (mesNum: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mesNum - 1];
  };

  const columnasPagosRecibidos: TableColumn<ReporteMensualSimpleData['pagosRecibidos'][0]>[] = [
    {
      key: 'numeroFactura',
      label: 'Factura',
      render: (_, row) => (
        <div className="font-medium">{row.numeroFactura}</div>
      )
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => row.clienteNombre
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (_, row) => (
        <span className="font-semibold text-green-600">
          {formatearMoneda(row.monto)}
        </span>
      ),
      align: 'right'
    },
    {
      key: 'fechaPago',
      label: 'Fecha de Pago',
      render: (_, row) => row.fechaPago.toLocaleDateString('es-ES'),
      sortable: true
    },
    {
      key: 'metodoPago',
      label: 'Método',
      render: (_, row) => (
        <Badge variant="green" size="sm">
          {row.metodoPago ? row.metodoPago.charAt(0).toUpperCase() + row.metodoPago.slice(1) : 'N/A'}
        </Badge>
      )
    }
  ];

  const columnasPagosFaltantes: TableColumn<ReporteMensualSimpleData['pagosFaltantes'][0]>[] = [
    {
      key: 'numeroFactura',
      label: 'Factura',
      render: (_, row) => (
        <div className="font-medium">{row.numeroFactura}</div>
      )
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => row.clienteNombre
    },
    {
      key: 'montoPendiente',
      label: 'Monto Pendiente',
      render: (_, row) => (
        <span className="font-semibold text-red-600">
          {formatearMoneda(row.montoPendiente)}
        </span>
      ),
      align: 'right'
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_, row) => row.fechaVencimiento.toLocaleDateString('es-ES'),
      sortable: true
    },
    {
      key: 'diasRetraso',
      label: 'Días Retraso',
      render: (_, row) => (
        <Badge 
          variant={row.diasRetraso > 30 ? 'red' : row.diasRetraso > 15 ? 'yellow' : 'green'} 
          size="sm"
        >
          {row.diasRetraso} días
        </Badge>
      )
    }
  ];

  // Generar opciones de años (últimos 2 años y próximos 2 años)
  const añosDisponibles = [];
  const añoActual = new Date().getFullYear();
  for (let i = añoActual - 2; i <= añoActual + 2; i++) {
    añosDisponibles.push({ value: i.toString(), label: i.toString() });
  }

  // Generar opciones de meses
  const mesesDisponibles = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reporte Mensual Simple
          </h2>
          <p className="text-gray-600">
            Vista mensual con totales cobrados, pendientes y lista de pagos recibidos o faltantes
          </p>
        </div>
      </div>

      {/* Selector de mes y año */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Período:</span>
            </div>
            <div className="w-40">
              <Select
                value={mes.toString()}
                onChange={(e) => setMes(parseInt(e.target.value))}
                options={mesesDisponibles}
              />
            </div>
            <div className="w-32">
              <Select
                value={año.toString()}
                onChange={(e) => setAño(parseInt(e.target.value))}
                options={añosDisponibles}
              />
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando reporte...</div>
        </div>
      ) : reporte ? (
        <>
          {/* Totales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Total Cobrado</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {formatearMoneda(reporte.totalCobrado)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {reporte.pagosRecibidos.length} {reporte.pagosRecibidos.length === 1 ? 'pago recibido' : 'pagos recibidos'}
                </div>
              </div>
            </Card>

            <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Total Pendiente</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {formatearMoneda(reporte.totalPendiente)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {reporte.pagosFaltantes.length} {reporte.pagosFaltantes.length === 1 ? 'pago faltante' : 'pagos faltantes'}
                </div>
              </div>
            </Card>
          </div>

          {/* Pagos Recibidos */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pagos Recibidos - {obtenerNombreMes(mes)} {año}
                </h3>
              </div>
              {reporte.pagosRecibidos.length > 0 ? (
                <Table
                  data={reporte.pagosRecibidos}
                  columns={columnasPagosRecibidos}
                  loading={loading}
                  emptyMessage="No hay pagos recibidos en este mes"
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay pagos recibidos en este mes
                </div>
              )}
            </div>
          </Card>

          {/* Pagos Faltantes */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pagos Faltantes - {obtenerNombreMes(mes)} {año}
                </h3>
              </div>
              {reporte.pagosFaltantes.length > 0 ? (
                <Table
                  data={reporte.pagosFaltantes}
                  columns={columnasPagosFaltantes}
                  loading={loading}
                  emptyMessage="No hay pagos faltantes en este mes"
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay pagos faltantes en este mes
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card className="bg-white shadow-sm">
          <div className="text-center py-12 text-gray-500">
            No se pudo cargar el reporte
          </div>
        </Card>
      )}
    </div>
  );
};

