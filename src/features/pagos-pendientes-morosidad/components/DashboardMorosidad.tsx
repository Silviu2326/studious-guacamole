import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { PagoPendiente, RecordatorioContacto } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { recordatoriosContactoAPI } from '../api/recordatoriosContacto';
import { DollarSign, AlertTriangle, Users, ArrowUp, Calendar, CheckCircle } from 'lucide-react';

interface DashboardMorosidadProps {
  onRefresh?: () => void;
}

export const DashboardMorosidad: React.FC<DashboardMorosidadProps> = ({ onRefresh }) => {
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [recordatorios, setRecordatorios] = useState<RecordatorioContacto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [pagosData, recordatoriosData] = await Promise.all([
        morosidadAPI.obtenerPagosPendientes(),
        recordatoriosContactoAPI.obtenerPendientes()
      ]);
      setPagos(pagosData);
      setRecordatorios(recordatoriosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarCompletado = async (id: string) => {
    try {
      await recordatoriosContactoAPI.marcarCompletado(id);
      cargarDatos();
      onRefresh?.();
    } catch (error) {
      console.error('Error al marcar como completado:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Calcular métricas simples
  const totalQueDeben = pagos.reduce((sum, p) => sum + p.montoPendiente, 0);
  const cantidadClientes = new Set(pagos.map(p => p.cliente.id)).size;
  
  // Clientes que más deben (agrupados por cliente)
  const deudaPorCliente = pagos.reduce((acc, pago) => {
    const clienteId = pago.cliente.id;
    if (!acc[clienteId]) {
      acc[clienteId] = {
        cliente: pago.cliente,
        totalDeuda: 0,
        pagos: []
      };
    }
    acc[clienteId].totalDeuda += pago.montoPendiente;
    acc[clienteId].pagos.push(pago);
    return acc;
  }, {} as Record<string, { cliente: PagoPendiente['cliente']; totalDeuda: number; pagos: PagoPendiente[] }>);

  const clientesQueMasDeben = Object.values(deudaPorCliente)
    .sort((a, b) => b.totalDeuda - a.totalDeuda)
    .slice(0, 5);

  // Alertas: clientes con más de 30 días de retraso
  const clientesConAlerta = pagos.filter(p => p.diasRetraso > 30);
  
  // Agrupar alertas por cliente
  const alertasPorCliente = clientesConAlerta.reduce((acc, pago) => {
    const clienteId = pago.cliente.id;
    if (!acc[clienteId]) {
      acc[clienteId] = {
        cliente: pago.cliente,
        diasRetraso: pago.diasRetraso,
        totalDeuda: 0,
        pagos: []
      };
    }
    acc[clienteId].totalDeuda += pago.montoPendiente;
    acc[clienteId].pagos.push(pago);
    // Tomar el mayor retraso
    if (pago.diasRetraso > acc[clienteId].diasRetraso) {
      acc[clienteId].diasRetraso = pago.diasRetraso;
    }
    return acc;
  }, {} as Record<string, { cliente: PagoPendiente['cliente']; diasRetraso: number; totalDeuda: number; pagos: PagoPendiente[] }>);

  const alertasAgrupadas = Object.values(alertasPorCliente)
    .sort((a, b) => b.diasRetraso - a.diasRetraso);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Situación Financiera
        </h2>
        <p className="text-gray-600">
          Vista simple de tu situación de pagos pendientes
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total que me deben */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total que me deben</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatearMoneda(totalQueDeben)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cantidad de clientes con deuda */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Clientes con deuda</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {cantidadClientes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas: Clientes con más de 30 días de retraso */}
      {alertasAgrupadas.length > 0 && (
        <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Alertas: Clientes con más de 30 días de retraso
              </h3>
            </div>
            <div className="space-y-3">
              {alertasAgrupadas.map((alerta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-red-900">{alerta.cliente.nombre}</div>
                    <div className="text-sm text-red-700 mt-1">
                      {alerta.diasRetraso} días de retraso • {formatearMoneda(alerta.totalDeuda)} en deuda
                    </div>
                  </div>
                  <Badge variant="red" size="md">
                    {alerta.diasRetraso} días
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Quién me debe más */}
      {clientesQueMasDeben.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ArrowUp className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Quién me debe más
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {clientesQueMasDeben.map((cliente, index) => (
                <div
                  key={cliente.cliente.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{cliente.cliente.nombre}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {cliente.pagos.length} {cliente.pagos.length === 1 ? 'pago pendiente' : 'pagos pendientes'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatearMoneda(cliente.totalDeuda)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Recordatorios de Contacto Programados */}
      {recordatorios.length > 0 && (
        <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recordatorios de Contacto
              </h3>
            </div>
            <div className="space-y-3">
              {recordatorios.map((recordatorio) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fechaRec = new Date(recordatorio.fechaRecordatorio);
                fechaRec.setHours(0, 0, 0, 0);
                const esHoy = fechaRec.getTime() === hoy.getTime();
                const esVencido = fechaRec < hoy;
                
                return (
                  <div
                    key={recordatorio.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      esVencido 
                        ? 'bg-red-50 border-red-200' 
                        : esHoy 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{recordatorio.clienteNombre}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {recordatorio.fechaRecordatorio.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {recordatorio.nota && (
                        <div className="text-sm text-gray-500 mt-1 italic">
                          "{recordatorio.nota}"
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {esVencido && (
                        <Badge variant="red" size="sm">Vencido</Badge>
                      )}
                      {esHoy && (
                        <Badge variant="yellow" size="sm">Hoy</Badge>
                      )}
                      {!esVencido && !esHoy && (
                        <Badge variant="blue" size="sm">Pendiente</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarcarCompletado(recordatorio.id)}
                        title="Marcar como completado"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {pagos.length === 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No hay clientes con deuda pendiente</p>
          </div>
        </Card>
      )}
    </div>
  );
};

