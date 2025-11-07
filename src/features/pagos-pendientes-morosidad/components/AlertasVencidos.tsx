import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { PagoPendiente, AlertaMorosidad } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { AlertTriangle, Bell, X, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface AlertasVencidosProps {
  onRefresh?: () => void;
}

export const AlertasVencidos: React.FC<AlertasVencidosProps> = ({ onRefresh }) => {
  const [alertas, setAlertas] = useState<AlertaMorosidad[]>([]);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const pagosData = await morosidadAPI.obtenerPagosPendientes();
      setPagos(pagosData);
      
      // Generar alertas basadas en los pagos
      const nuevasAlertas = generarAlertas(pagosData);
      setAlertas(nuevasAlertas);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarAlertas = (pagosData: PagoPendiente[]): AlertaMorosidad[] => {
    return pagosData
      .filter(p => p.diasRetraso > 0)
      .map(p => ({
        id: `alerta-${p.id}`,
        pagoPendienteId: p.id,
        nivel: p.nivelMorosidad,
        titulo: `Factura ${p.numeroFactura} vencida`,
        descripcion: `${p.cliente.nombre} tiene un pago pendiente de ${p.diasRetraso} días. Monto: ${p.montoPendiente.toLocaleString('es-CO')} COP`,
        fechaGeneracion: new Date(),
        estado: 'activa',
        accionesRecomendadas: obtenerAccionesRecomendadas(p),
        prioridad: p.nivelMorosidad === 'negro' || p.nivelMorosidad === 'rojo' ? 'critica' : 
                   p.nivelMorosidad === 'naranja' ? 'alta' :
                   p.nivelMorosidad === 'amarillo' ? 'media' : 'baja'
      }));
  };

  const obtenerAccionesRecomendadas = (pago: PagoPendiente): string[] => {
    const acciones: string[] = [];
    
    if (pago.diasRetraso <= 7) {
      acciones.push('Enviar recordatorio amigable');
    } else if (pago.diasRetraso <= 15) {
      acciones.push('Enviar recordatorio firme');
      acciones.push('Contactar por teléfono');
    } else if (pago.diasRetraso <= 30) {
      acciones.push('Enviar recordatorio urgente');
      acciones.push('Programar llamada de seguimiento');
    } else {
      acciones.push('Escalar a gestión especial');
      if (pago.diasRetraso > 60) {
        acciones.push('Considerar acción legal');
      }
    }
    
    return acciones;
  };

  const obtenerColorNivel = (nivel: string) => {
    const colores: Record<string, string> = {
      verde: 'bg-green-100 text-green-800 border-green-300',
      amarillo: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      naranja: 'bg-orange-100 text-orange-800 border-orange-300',
      rojo: 'bg-red-100 text-red-800 border-red-300',
      negro: 'bg-gray-900 text-white border-gray-700'
    };
    return colores[nivel] || colores.verde;
  };

  const obtenerIconoPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'critica':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'alta':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'media':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleResolverAlerta = (id: string) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, estado: 'resuelta' as const } : a));
  };

  const alertasActivas = alertas.filter(a => a.estado === 'activa');

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Alertas de Morosidad
          </h2>
          <p className="text-gray-600">
            Alertas automáticas de pagos vencidos que requieren atención
          </p>
        </div>
        <Badge variant="red" size="md">
          {alertasActivas.length} activas
        </Badge>
      </div>

      {alertasActivas.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas activas</h3>
          <p className="text-gray-600">
            No hay alertas activas en este momento
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alertasActivas.map(alerta => {
            const pago = pagos.find(p => p.id === alerta.pagoPendienteId);
            
            return (
              <Card key={alerta.id} className="bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-xl ${obtenerColorNivel(alerta.nivel)}`}>
                        {obtenerIconoPrioridad(alerta.prioridad)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {alerta.titulo}
                          </h4>
                          <Badge variant={alerta.nivel === 'negro' || alerta.nivel === 'rojo' ? 'red' : alerta.nivel === 'naranja' ? 'yellow' : 'green'} size="sm">
                            {alerta.nivel.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {alerta.descripcion}
                        </p>
                        {pago && (
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {pago.diasRetraso} días de retraso
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {pago.montoPendiente.toLocaleString('es-CO')} COP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolverAlerta(alerta.id)}
                      title="Marcar como resuelta"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {alerta.accionesRecomendadas.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Acciones Recomendadas:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {alerta.accionesRecomendadas.map((accion, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {accion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

