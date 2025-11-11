import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Factura, Pago, MetodoPago, EstadoFactura } from '../types';
import { facturasAPI } from '../api/facturas';
import { cobrosAPI } from '../api/cobros';
import { 
  FileText, 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Download,
  Eye,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

interface HistorialPagosClienteProps {
  clienteId: string;
}

interface TransaccionTimeline {
  id: string;
  tipo: 'factura' | 'pago';
  fecha: Date;
  monto: number;
  descripcion: string;
  estado?: EstadoFactura;
  metodoPago?: MetodoPago;
  facturaId?: string;
  numeroFactura?: string;
  referencia?: string;
}

export const HistorialPagosCliente: React.FC<HistorialPagosClienteProps> = ({ clienteId }) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TransaccionTimeline[]>([]);

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Obtener facturas del cliente
      const facturasData = await facturasAPI.obtenerFacturas({ clienteId });
      setFacturas(facturasData);

      // Obtener todos los pagos de las facturas del cliente
      const todosPagos: Pago[] = [];
      for (const factura of facturasData) {
        const pagosFactura = await cobrosAPI.obtenerPagosFactura(factura.id);
        todosPagos.push(...pagosFactura);
        // También incluir pagos que ya están en la factura
        todosPagos.push(...factura.pagos);
      }
      
      // Eliminar duplicados
      const pagosUnicos = todosPagos.filter((pago, index, self) =>
        index === self.findIndex(p => p.id === pago.id)
      );
      setPagos(pagosUnicos);

      // Crear timeline combinando facturas y pagos
      const timelineItems: TransaccionTimeline[] = [];

      // Agregar facturas al timeline
      facturasData.forEach(factura => {
        timelineItems.push({
          id: `factura-${factura.id}`,
          tipo: 'factura',
          fecha: factura.fechaEmision,
          monto: factura.total,
          descripcion: `Factura ${factura.numeroFactura}`,
          estado: factura.estado,
          facturaId: factura.id,
          numeroFactura: factura.numeroFactura
        });
      });

      // Agregar pagos al timeline
      pagosUnicos.forEach(pago => {
        const factura = facturasData.find(f => f.id === pago.facturaId);
        timelineItems.push({
          id: `pago-${pago.id}`,
          tipo: 'pago',
          fecha: pago.fecha,
          monto: pago.monto,
          descripcion: `Pago - ${factura?.numeroFactura || 'N/A'}`,
          metodoPago: pago.metodoPago,
          facturaId: pago.facturaId,
          referencia: pago.referencia
        });
      });

      // Ordenar por fecha (más reciente primero)
      timelineItems.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      setTimeline(timelineItems);
    } catch (error) {
      console.error('Error al cargar historial de pagos:', error);
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

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const obtenerBadgeEstado = (estado?: EstadoFactura) => {
    if (!estado) return null;
    
    const estados: Record<EstadoFactura, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      parcial: { label: 'Parcial', variant: 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' }
    };
    
    const estadoInfo = estados[estado];
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const obtenerMetodoPagoLabel = (metodo?: MetodoPago) => {
    const metodos: Record<MetodoPago, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      cheque: 'Cheque',
      online: 'Online'
    };
    return metodo ? metodos[metodo] : 'N/A';
  };

  // Calcular resumen
  const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0);
  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = facturas.reduce((sum, f) => sum + f.montoPendiente, 0);
  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida').length;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de pagos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de pagos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Facturado</p>
              <p className="text-lg font-bold text-gray-900">{formatearMoneda(totalFacturado)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Pagado</p>
              <p className="text-lg font-bold text-green-600">{formatearMoneda(totalPagado)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Pendiente</p>
              <p className="text-lg font-bold text-orange-600">{formatearMoneda(totalPendiente)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Facturas Pendientes</p>
              <p className="text-lg font-bold text-red-600">{facturasPendientes}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline de transacciones */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Timeline de Transacciones
        </h3>

        {timeline.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay transacciones registradas</p>
          </div>
        ) : (
          <div className="relative">
            {/* Línea vertical del timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {timeline.map((item, index) => {
                const esFactura = item.tipo === 'factura';
                const esPago = item.tipo === 'pago';
                
                return (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Ícono del timeline */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                      esFactura 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {esFactura ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <CreditCard className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Contenido de la transacción */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {esFactura ? `Factura ${item.numeroFactura}` : 'Pago Registrado'}
                            </h4>
                            {item.estado && obtenerBadgeEstado(item.estado)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatearFecha(item.fecha)}
                            </span>
                            {item.metodoPago && (
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {obtenerMetodoPagoLabel(item.metodoPago)}
                              </span>
                            )}
                            {item.referencia && (
                              <span className="text-gray-400">Ref: {item.referencia}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            esFactura 
                              ? 'text-gray-900' 
                              : 'text-green-600'
                          }`}>
                            {esFactura ? (
                              <>
                                <ArrowDown className="w-4 h-4 inline-block mr-1" />
                                {formatearMoneda(item.monto)}
                              </>
                            ) : (
                              <>
                                <ArrowUp className="w-4 h-4 inline-block mr-1" />
                                {formatearMoneda(item.monto)}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      {esFactura && item.facturaId && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Implementar vista de factura
                              console.log('Ver factura:', item.facturaId);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Factura
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const blob = await facturasAPI.exportarPDF(item.facturaId!);
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `factura-${item.numeroFactura}.pdf`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Error al descargar PDF:', error);
                              }
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Lista de facturas */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturas</h3>
        <div className="space-y-3">
          {facturas.map(factura => (
            <div
              key={factura.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{factura.numeroFactura}</span>
                  {obtenerBadgeEstado(factura.estado)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatearFecha(factura.fechaEmision)} • {formatearMoneda(factura.total)}
                </div>
                {factura.montoPendiente > 0 && (
                  <div className="text-xs text-orange-600 mt-1">
                    Pendiente: {formatearMoneda(factura.montoPendiente)}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


