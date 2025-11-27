import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Reserva } from '../types';
import { getReservasConPagosPendientes } from '../api/reservas';
import { enviarRecordatoriosPagosPendientes, enviarRecordatorioPagoPendiente } from '../api/notificacionesReserva';
import { Bell, Mail, Phone, Smartphone, AlertCircle, DollarSign, Calendar, Clock, User, CheckCircle, XCircle, Send } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface RecordatoriosPagoPendienteProps {
  role: 'entrenador' | 'gimnasio';
}

export const RecordatoriosPagoPendiente: React.FC<RecordatoriosPagoPendienteProps> = ({ role }) => {
  const { user } = useAuth();
  const [reservasPendientes, setReservasPendientes] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [canalSeleccionado, setCanalSeleccionado] = useState<'email' | 'sms' | 'push' | 'todos'>('email');
  const [resultadoEnvio, setResultadoEnvio] = useState<{
    totalEnviados: number;
    totalFallidos: number;
  } | null>(null);
  const [resumenPagos, setResumenPagos] = useState<{
    totalPendiente: number;
    totalClientes: number;
    promedioPendiente: number;
    diasPromedioVencido: number;
  } | null>(null);

  useEffect(() => {
    if (role === 'entrenador') {
      cargarReservasPendientes();
    }
  }, [role]);

  const cargarReservasPendientes = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const reservas = await getReservasConPagosPendientes(fechaInicio, fechaFin, user?.id);
      setReservasPendientes(reservas);
      
      // Calcular resumen de pagos
      const totalPendiente = reservas.reduce((sum, r) => sum + (r.precio || 0), 0);
      const clientesUnicos = new Set(reservas.map(r => r.clienteId));
      const promedioPendiente = clientesUnicos.size > 0 ? totalPendiente / clientesUnicos.size : 0;
      
      // Calcular días promedio vencido (mock simple)
      const ahora = new Date();
      const diasVencidos = reservas
        .map(r => {
          const diasDiff = Math.floor((ahora.getTime() - r.fecha.getTime()) / (1000 * 60 * 60 * 24));
          return diasDiff > 0 ? diasDiff : 0;
        })
        .filter(d => d > 0);
      const diasPromedioVencido = diasVencidos.length > 0
        ? diasVencidos.reduce((sum, d) => sum + d, 0) / diasVencidos.length
        : 0;
      
      setResumenPagos({
        totalPendiente,
        totalClientes: clientesUnicos.size,
        promedioPendiente,
        diasPromedioVencido: Math.round(diasPromedioVencido),
      });
    } catch (error) {
      console.error('Error cargando reservas con pagos pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarRecordatorioIndividual = async (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const confirmarEnvioIndividual = async () => {
    if (!reservaSeleccionada) return;

    setEnviando(true);
    try {
      await enviarRecordatorioPagoPendiente(reservaSeleccionada, canalSeleccionado);
      setMostrarModal(false);
      setReservaSeleccionada(null);
      // Recargar reservas para actualizar el estado
      await cargarReservasPendientes();
      alert('Recordatorio enviado exitosamente');
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      alert('Error al enviar el recordatorio. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEnviarRecordatoriosMasivos = async (canal: 'email' | 'sms' | 'push' | 'todos' = 'email') => {
    if (reservasPendientes.length === 0) {
      alert('No hay reservas con pagos pendientes');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres enviar recordatorios a ${reservasPendientes.length} cliente(s)?`)) {
      return;
    }

    setEnviando(true);
    try {
      const resultado = await enviarRecordatoriosPagosPendientes(reservasPendientes, canal);
      setResultadoEnvio(resultado);
      await cargarReservasPendientes();
      alert(`Se enviaron ${resultado.totalEnviados} recordatorio(s) exitosamente. ${resultado.totalFallidos > 0 ? `${resultado.totalFallidos} fallaron.` : ''}`);
    } catch (error) {
      console.error('Error enviando recordatorios:', error);
      alert('Error al enviar los recordatorios. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const getEstadoBadge = (estado: Reserva['estado']) => {
    const estados = {
      pendiente: { color: 'yellow' as const, icon: AlertCircle, label: 'Pendiente' },
      confirmada: { color: 'green' as const, icon: CheckCircle, label: 'Confirmada' },
      cancelada: { color: 'red' as const, icon: XCircle, label: 'Cancelada' },
      completada: { color: 'blue' as const, icon: CheckCircle, label: 'Completada' },
      'no-show': { color: 'gray' as const, icon: XCircle, label: 'No Show' },
    };
    
    const estadoInfo = estados[estado];
    const Icon = estadoInfo.icon;
    
    return (
      <Badge variant={estadoInfo.color} leftIcon={<Icon className="w-3 h-3" />}>
        {estadoInfo.label}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{value.toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Reserva['estado']) => getEstadoBadge(value),
    },
    {
      key: 'precio',
      label: 'Importe Pendiente',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-red-600" />
          <span className="text-red-600 font-semibold">€{value.toFixed(2)}</span>
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Reserva) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleEnviarRecordatorioIndividual(row)}
          leftIcon={<Send className="w-4 h-4" />}
          disabled={enviando}
        >
          Enviar Recordatorio
        </Button>
      ),
    },
  ];

  if (role !== 'entrenador') {
    return null;
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Recordatorios de Pagos Pendientes
              </h3>
            </div>
            {reservasPendientes.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={() => handleEnviarRecordatoriosMasivos('email')}
                  disabled={enviando || reservasPendientes.length === 0}
                  leftIcon={<Mail className="w-4 h-4" />}
                >
                  Enviar Todos (Email)
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 bg-red-50 rounded-lg ring-1 ring-red-200">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Reservas con pagos pendientes:</strong> {reservasPendientes.length}
            </p>
            {resumenPagos && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-red-200">
                <div>
                  <p className="text-xs text-gray-600">Total Pendiente</p>
                  <p className="text-lg font-bold text-red-700">€{resumenPagos.totalPendiente.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Clientes</p>
                  <p className="text-lg font-bold text-gray-900">{resumenPagos.totalClientes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Promedio/Cliente</p>
                  <p className="text-lg font-bold text-gray-900">€{resumenPagos.promedioPendiente.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Días Promedio</p>
                  <p className="text-lg font-bold text-orange-700">{resumenPagos.diasPromedioVencido} días</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-3">
              Envía recordatorios automáticos a los clientes que tienen pagos pendientes para reducir la morosidad y automatizar el cobro.
            </p>
          </div>

          <Table
            data={reservasPendientes}
            columns={columns}
            loading={loading}
            emptyMessage="No hay reservas con pagos pendientes"
          />

          {resultadoEnvio && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Resultado del envío:</strong> {resultadoEnvio.totalEnviados} enviados exitosamente
                {resultadoEnvio.totalFallidos > 0 && (
                  <span className="text-red-600">, {resultadoEnvio.totalFallidos} fallaron</span>
                )}
              </p>
            </div>
          )}
        </div>
      </Card>

      {mostrarModal && reservaSeleccionada && (
        <Modal
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setReservaSeleccionada(null);
          }}
          title="Enviar Recordatorio de Pago"
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setMostrarModal(false);
                  setReservaSeleccionada(null);
                }}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={confirmarEnvioIndividual}
                disabled={enviando}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {enviando ? 'Enviando...' : 'Enviar Recordatorio'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Cliente:</strong> {reservaSeleccionada.clienteNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Fecha:</strong> {reservaSeleccionada.fecha.toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Hora:</strong> {reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Importe Pendiente:</strong> <span className="font-semibold text-red-600">€{reservaSeleccionada.precio.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Selecciona el canal de notificación:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCanalSeleccionado('email')}
                  disabled={enviando}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    canalSeleccionado === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Mail className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </button>
                <button
                  onClick={() => setCanalSeleccionado('sms')}
                  disabled={enviando}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    canalSeleccionado === 'sms'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Phone className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">SMS</span>
                </button>
                <button
                  onClick={() => setCanalSeleccionado('push')}
                  disabled={enviando}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    canalSeleccionado === 'push'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Smartphone className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Push</span>
                </button>
                <button
                  onClick={() => setCanalSeleccionado('todos')}
                  disabled={enviando}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    canalSeleccionado === 'todos'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Bell className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Todos</span>
                </button>
              </div>
            </div>

            {enviando && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Enviando recordatorio...</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};


