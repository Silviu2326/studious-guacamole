import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { Factura, TipoFactura, MetodoPago, ReporteFacturacion, Pago } from '../types';
import { cobrosAPI } from '../api/cobros';
import { Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, [facturas]);

  const cargarPagos = async () => {
    try {
      // Obtener todos los pagos de las facturas
      const todosLosPagos: Pago[] = [];
      for (const factura of facturas) {
        if (factura.pagos && factura.pagos.length > 0) {
          todosLosPagos.push(...factura.pagos);
        } else {
          // Si no tiene pagos en la factura, intentar obtenerlos de la API
          try {
            const pagosFactura = await cobrosAPI.obtenerPagosFactura(factura.id);
            todosLosPagos.push(...pagosFactura);
          } catch (error) {
            console.error(`Error al cargar pagos de factura ${factura.id}:`, error);
          }
        }
      }
      setPagos(todosLosPagos);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    }
  };

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

  const handleExportar = async () => {
    setLoadingExport(true);
    try {
      // Filtrar facturas y pagos por el rango de fechas seleccionado
      const facturasFiltradas = facturas.filter(f => {
        const fechaEmision = new Date(f.fechaEmision);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59);
        return fechaEmision >= inicio && fechaEmision <= fin;
      });

      // Obtener todos los pagos del mes
      const pagosDelMes: Pago[] = [];
      for (const factura of facturasFiltradas) {
        try {
          const pagosFactura = await cobrosAPI.obtenerPagosFactura(factura.id);
          // Filtrar pagos por rango de fechas
          const inicio = new Date(fechaInicio);
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59);
          const pagosFiltrados = pagosFactura.filter(p => {
            const fechaPago = new Date(p.fecha);
            return fechaPago >= inicio && fechaPago <= fin;
          });
          pagosDelMes.push(...pagosFiltrados);
        } catch (error) {
          // Si hay error, usar los pagos de la factura directamente
          if (factura.pagos && factura.pagos.length > 0) {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            fin.setHours(23, 59, 59);
            const pagosFiltrados = factura.pagos.filter(p => {
              const fechaPago = new Date(p.fecha);
              return fechaPago >= inicio && fechaPago <= fin;
            });
            pagosDelMes.push(...pagosFiltrados);
          }
        }
      }

      // Preparar datos para Excel
      // Crear un mapa de facturas para acceso rápido
      const facturasMap = new Map(facturasFiltradas.map(f => [f.id, f]));

      // Combinar facturas y pagos en un solo array con fecha para ordenamiento
      interface DatoExportacionConFecha {
        fechaOrden: Date;
        Fecha: string;
        Cliente: string;
        Concepto: string;
        Monto: number;
        'Método de Pago': string;
        Estado: string;
        'Número de Factura': string;
        'Tipo': string;
      }

      const datosExportacion: DatoExportacionConFecha[] = [];

      // Agregar facturas (como filas principales)
      facturasFiltradas.forEach(factura => {
        // Obtener concepto de los items
        const concepto = factura.items.map(item => 
          `${item.descripcion} (${item.cantidad}x)`
        ).join(', ') || 'Sin concepto';

        // Estado de la factura
        const estadoFactura = {
          pendiente: 'Pendiente',
          parcial: 'Parcial',
          pagada: 'Pagada',
          vencida: 'Vencida',
          cancelada: 'Cancelada'
        }[factura.estado] || factura.estado;

        // Método de pago de la factura (si existe)
        const metodoPagoFactura = factura.metodoPago ? metodosPago[factura.metodoPago] : 'No especificado';

        datosExportacion.push({
          fechaOrden: factura.fechaEmision,
          Fecha: factura.fechaEmision.toLocaleDateString('es-ES'),
          Cliente: factura.cliente.nombre,
          Concepto: concepto,
          Monto: factura.total,
          'Método de Pago': metodoPagoFactura,
          Estado: estadoFactura,
          'Número de Factura': factura.numeroFactura,
          'Tipo': tiposFactura[factura.tipo]
        });
      });

      // Agregar pagos individuales (si hay pagos registrados)
      pagosDelMes.forEach(pago => {
        const factura = facturasMap.get(pago.facturaId);
        if (factura) {
          const concepto = `Pago - ${factura.numeroFactura}`;
          const metodoPago = metodosPago[pago.metodoPago] || pago.metodoPago;

          datosExportacion.push({
            fechaOrden: pago.fecha,
            Fecha: pago.fecha.toLocaleDateString('es-ES'),
            Cliente: factura.cliente.nombre,
            Concepto: concepto,
            Monto: pago.monto,
            'Método de Pago': metodoPago,
            Estado: 'Pagado',
            'Número de Factura': factura.numeroFactura,
            'Tipo': tiposFactura[factura.tipo]
          });
        }
      });

      // Ordenar por fecha
      datosExportacion.sort((a, b) => a.fechaOrden.getTime() - b.fechaOrden.getTime());

      // Remover fechaOrden antes de exportar
      const datosParaExcel = datosExportacion.map(({ fechaOrden, ...rest }) => rest);

      // Crear workbook y worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosParaExcel);

      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 12 }, // Fecha
        { wch: 25 }, // Cliente
        { wch: 40 }, // Concepto
        { wch: 15 }, // Monto
        { wch: 18 }, // Método de Pago
        { wch: 12 }, // Estado
        { wch: 18 }, // Número de Factura
        { wch: 15 }  // Tipo
      ];
      ws['!cols'] = columnWidths;

      // Formatear columna de monto como moneda
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let row = 1; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 3 }); // Columna D (Monto)
        if (!ws[cellAddress]) continue;
        ws[cellAddress].z = '#,##0.00';
      }

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Facturas y Cobros');

      // Generar nombre de archivo
      const mes = new Date(fechaInicio).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      const nombreArchivo = `Reporte_Facturacion_${mes.replace(' ', '_')}.xlsx`;

      // Guardar archivo
      XLSX.writeFile(wb, nombreArchivo);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar el reporte a Excel');
    } finally {
      setLoadingExport(false);
    }
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
              <Button 
                variant="primary" 
                onClick={handleExportar} 
                fullWidth 
                loading={loadingExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar a Excel
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

