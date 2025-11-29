/**
 * SeguimientoEstados - Componente para mostrar timeline de cambios de estado
 * 
 * Este componente muestra un timeline pequeño de cambios de estado para una factura.
 * Útil para ver el historial de transiciones de estado (pendiente -> parcialmentePagada -> pagada, etc.)
 * 
 * INTEGRACIÓN CON FacturacionManager:
 * - Se puede usar como componente compacto dentro del modal de detalle de factura
 * - Muestra el historial de estados de forma visual y cronológica
 * - Ayuda a entender el flujo de pago de una factura
 */

import React, { useMemo } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Factura, EstadoFactura, Cobro } from '../types';
import { cobrosAPI } from '../api/cobros';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  FileText,
  XCircle
} from 'lucide-react';

interface SeguimientoEstadosProps {
  factura: Factura;
  compacto?: boolean; // Si es true, muestra una versión más compacta
  className?: string;
}

interface EventoEstado {
  fecha: Date;
  estado: EstadoFactura;
  descripcion: string;
  icono: React.ReactNode;
  color: string;
  esActual: boolean;
}

export const SeguimientoEstados: React.FC<SeguimientoEstadosProps> = ({
  factura,
  compacto = false,
  className = ''
}) => {
  const [cobros, setCobros] = React.useState<Cobro[]>([]);
  const [cargando, setCargando] = React.useState(false);

  React.useEffect(() => {
    cargarCobros();
  }, [factura.id]);

  const cargarCobros = async () => {
    setCargando(true);
    try {
      const cobrosData = await cobrosAPI.getCobrosPorFactura(factura.id);
      setCobros(cobrosData);
    } catch (error) {
      console.error('Error al cargar cobros para timeline:', error);
    } finally {
      setCargando(false);
    }
  };

  // Construir timeline de eventos basado en la factura y sus cobros
  const eventos = useMemo<EventoEstado[]>(() => {
    const eventosLista: EventoEstado[] = [];

    // Evento: Creación de la factura
    eventosLista.push({
      fecha: factura.fechaEmision,
      estado: 'pendiente',
      descripcion: 'Factura creada',
      icono: <FileText className="w-4 h-4" />,
      color: 'blue',
      esActual: false
    });

    // Eventos: Cobros registrados (ordenados por fecha)
    const cobrosOrdenados = [...cobros].sort((a, b) => 
      new Date(a.fechaCobro).getTime() - new Date(b.fechaCobro).getTime()
    );

    cobrosOrdenados.forEach((cobro, index) => {
      const totalCobradoHastaAhora = cobrosOrdenados
        .slice(0, index + 1)
        .reduce((sum, c) => sum + c.importe, 0);
      
      let estado: EstadoFactura = 'pendiente';
      let descripcion = `Pago de ${formatearMoneda(cobro.importe)}`;
      
      if (totalCobradoHastaAhora >= factura.total) {
        estado = 'pagada';
        descripcion = `Pago completo - ${formatearMoneda(cobro.importe)}`;
      } else if (totalCobradoHastaAhora > 0) {
        estado = 'parcialmentePagada';
        descripcion = `Pago parcial - ${formatearMoneda(cobro.importe)}`;
      }

      eventosLista.push({
        fecha: cobro.fechaCobro,
        estado,
        descripcion,
        icono: <DollarSign className="w-4 h-4" />,
        color: estado === 'pagada' ? 'green' : 'yellow',
        esActual: false
      });
    });

    // Evento: Estado actual
    const estadoActual = factura.estado;
    const hoy = new Date();
    const fechaVencimiento = new Date(factura.fechaVencimiento);
    
    let descripcionEstado = '';
    let iconoEstado = <Clock className="w-4 h-4" />;
    let colorEstado = 'blue';

    switch (estadoActual) {
      case 'pagada':
        descripcionEstado = 'Factura completamente pagada';
        iconoEstado = <CheckCircle className="w-4 h-4" />;
        colorEstado = 'green';
        break;
      case 'parcialmentePagada':
        descripcionEstado = `Pago parcial - Pendiente: ${formatearMoneda(factura.saldoPendiente)}`;
        iconoEstado = <DollarSign className="w-4 h-4" />;
        colorEstado = 'yellow';
        break;
      case 'vencida':
        descripcionEstado = 'Factura vencida';
        iconoEstado = <AlertCircle className="w-4 h-4" />;
        colorEstado = 'red';
        break;
      case 'cancelada':
        descripcionEstado = 'Factura cancelada';
        iconoEstado = <XCircle className="w-4 h-4" />;
        colorEstado = 'gray';
        break;
      default:
        if (fechaVencimiento < hoy) {
          descripcionEstado = 'Factura vencida';
          iconoEstado = <AlertCircle className="w-4 h-4" />;
          colorEstado = 'red';
        } else {
          descripcionEstado = 'Pendiente de pago';
          iconoEstado = <Clock className="w-4 h-4" />;
          colorEstado = 'blue';
        }
    }

    eventosLista.push({
      fecha: factura.actualizadaEn || new Date(),
      estado: estadoActual,
      descripcion: descripcionEstado,
      icono: iconoEstado,
      color: colorEstado,
      esActual: true
    });

    // Ordenar eventos por fecha
    return eventosLista.sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }, [factura, cobros]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: factura.moneda || 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: compacto ? undefined : '2-digit',
      minute: compacto ? undefined : '2-digit'
    });
  };

  const obtenerColorClase = (color: string) => {
    const colores: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      gray: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colores[color] || colores.blue;
  };

  const obtenerBadgeEstado = (estado: EstadoFactura) => {
    const config: Record<EstadoFactura, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray' }> = {
      pendiente: { label: 'Pendiente', variant: 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      parcialmentePagada: { label: 'Parcial', variant: 'yellow' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' }
    };
    const c = config[estado] || { label: estado, variant: 'blue' as const };
    return <Badge variant={c.variant} size="sm">{c.label}</Badge>;
  };

  if (compacto) {
    // Versión compacta: solo muestra los últimos 3 eventos
    const eventosRecientes = eventos.slice(-3);
    
    return (
      <Card className={`p-3 ${className}`}>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-600 mb-2">Historial de Estados</div>
          {eventosRecientes.map((evento, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className={`p-1 rounded ${obtenerColorClase(evento.color)}`}>
                {evento.icono}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 truncate">{evento.descripcion}</div>
                <div className="text-gray-500">{formatearFecha(evento.fecha)}</div>
              </div>
              {evento.esActual && (
                <Badge variant="blue" size="sm">Actual</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Versión completa: timeline vertical
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Seguimiento de Estados</h3>
      </div>

      {cargando ? (
        <div className="text-center py-4 text-gray-500">Cargando historial...</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay eventos registrados
        </div>
      ) : (
        <div className="relative">
          {/* Línea vertical del timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Eventos */}
          <div className="space-y-4">
            {eventos.map((evento, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Punto del timeline */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  evento.esActual 
                    ? obtenerColorClase(evento.color) + ' ring-2 ring-offset-2'
                    : obtenerColorClase(evento.color)
                }`}>
                  {evento.icono}
                </div>

                {/* Contenido del evento */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{evento.descripcion}</span>
                    {obtenerBadgeEstado(evento.estado)}
                    {evento.esActual && (
                      <Badge variant="blue" size="sm">Actual</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatearFecha(evento.fecha)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Estado Actual:</span>
            <div className="mt-1">
              {obtenerBadgeEstado(factura.estado)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Pagos Registrados:</span>
            <div className="mt-1 font-medium text-gray-900">
              {cobros.length} {cobros.length === 1 ? 'pago' : 'pagos'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

