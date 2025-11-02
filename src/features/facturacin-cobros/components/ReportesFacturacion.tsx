import React, { useState } from 'react';
import { Card, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { Factura, TipoFactura, MetodoPago, ReporteFacturacion } from '../types';
import { Download, Calendar } from 'lucide-react';

interface ReportesFacturacionProps {
  facturas: Factura[];
}

export const ReportesFacturacion: React.FC<ReportesFacturacionProps> = ({ facturas }) => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const fecha = new Date();
    fecha.setDate(1); // Primer día del mes
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Filtrar facturas por rango de fechas
  const facturasFiltradas = facturas.filter(f => {
    const fechaEmision = new Date(f.fechaEmision);
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59);
    return fechaEmision >= inicio && fechaEmision <= fin;
  });

  // Calcular reporte
  const calcularReporte = (): ReporteFacturacion => {
    const facturasPagadas = facturasFiltradas.filter(f => f.estado === 'pagada');
    const facturasVencidas = facturasFiltradas.filter(f => f.estado === 'vencida');
    
    const facturasPorTipo: Partial<Record<TipoFactura, number>> = {};
    facturasFiltradas.forEach(f => {
      facturasPorTipo[f.tipo] = (facturasPorTipo[f.tipo] || 0) + 1;
    });

    const cobrosPorMetodo: Partial<Record<MetodoPago, number>> = {};
    facturasPagadas.forEach(f => {
      if (f.metodoPago) {
        cobrosPorMetodo[f.metodoPago] = (cobrosPorMetodo[f.metodoPago] || 0) + f.total;
      }
    });

    const totalFacturado = facturasFiltradas.reduce((sum, f) => sum + f.total, 0);
    const totalCobrado = facturasPagadas.reduce((sum, f) => sum + f.total, 0);
    const totalPendiente = facturasFiltradas.reduce((sum, f) => sum + f.montoPendiente, 0);
    const promedioTicket = facturasFiltradas.length > 0 
      ? totalFacturado / facturasFiltradas.length 
      : 0;

    return {
      id: 'reporte-' + Date.now(),
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      totalFacturado,
      totalCobrado,
      totalPendiente,
      facturasEmitidas: facturasFiltradas.length,
      facturasPagadas: facturasPagadas.length,
      facturasVencidas: facturasVencidas.length,
      promedioTicket,
      facturasPorTipo: facturasPorTipo as Record<TipoFactura, number>,
      cobrosPorMetodo: cobrosPorMetodo as Record<MetodoPago, number>
    };
  };

  const reporte = calcularReporte();

  const tiposFiltro: SelectOption[] = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'productos', label: 'Productos' },
    { value: 'recurrente', label: 'Recurrentes' },
    { value: 'paquetes', label: 'Paquetes' },
    { value: 'eventos', label: 'Eventos' }
  ];

  const tiposFactura: Record<TipoFactura, string> = {
    servicios: 'Servicios',
    productos: 'Productos',
    recurrente: 'Recurrentes',
    paquetes: 'Paquetes',
    eventos: 'Eventos',
    adicionales: 'Adicionales',
    correccion: 'Corrección'
  };

  const metodosPago: Record<MetodoPago, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    cheque: 'Cheque',
    online: 'Online'
  };

  const handleExportar = () => {
    // TODO: Implementar exportación a PDF/Excel
    alert('Funcionalidad de exportación próximamente disponible');
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Select
              label="Tipo de Factura"
              options={tiposFiltro}
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            />
            <div className="flex items-end">
              <Button variant="primary" onClick={handleExportar} fullWidth>
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen General */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Facturado</div>
            <div className="text-3xl font-bold text-blue-600">
              {formatearMoneda(reporte.totalFacturado)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {reporte.facturasEmitidas} facturas
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Cobrado</div>
            <div className="text-3xl font-bold text-green-600">
              {formatearMoneda(reporte.totalCobrado)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {reporte.facturasPagadas} facturas pagadas
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-2">Pendiente de Cobro</div>
            <div className="text-3xl font-bold text-orange-600">
              {formatearMoneda(reporte.totalPendiente)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {reporte.facturasVencidas} vencidas
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-2">Promedio Ticket</div>
            <div className="text-3xl font-bold text-purple-600">
              {formatearMoneda(reporte.promedioTicket)}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Por factura
            </div>
          </div>
        </Card>
      </div>

      {/* Desglose por Tipo */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Facturas por Tipo
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(reporte.facturasPorTipo).map(([tipo, cantidad]) => (
              <div key={tipo} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">{tiposFactura[tipo as TipoFactura]}</div>
                <div className="text-2xl font-bold mt-1">{cantidad}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Cobros por Método */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Cobros por Método de Pago
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(reporte.cobrosPorMetodo).map(([metodo, monto]) => (
              <div key={metodo} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">{metodosPago[metodo as MetodoPago]}</div>
                <div className="text-xl font-bold mt-1">{formatearMoneda(monto)}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

