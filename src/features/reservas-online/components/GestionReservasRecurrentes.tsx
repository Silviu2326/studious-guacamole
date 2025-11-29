import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Textarea, Input, Select } from '../../../components/componentsreutilizables';
import { ReservaRecurrente } from '../types';
import { 
  getReservasRecurrentes, 
  cancelarReservasRecurrentes, 
  modificarReservasRecurrentes,
  desactivarReservaRecurrente,
  calcularFechasReservas,
  updateReservaRecurrente,
  getReservasFuturasDeRecurrente
} from '../api/reservasRecurrentes';
import { getReservas } from '../api/reservas';
import { useAuth } from '../../../context/AuthContext';
import { RefreshCw, XCircle, Edit, Calendar, Clock, Users, DollarSign, AlertTriangle, CheckCircle, Pause, Play } from 'lucide-react';

interface GestionReservasRecurrentesProps {
  entrenadorId: string;
}

export const GestionReservasRecurrentes: React.FC<GestionReservasRecurrentesProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [reservasRecurrentes, setReservasRecurrentes] = useState<ReservaRecurrente[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaRecurrente | null>(null);
  const [accion, setAccion] = useState<'cancelar' | 'modificar' | 'pausar' | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [proximasSesiones, setProximasSesiones] = useState<Record<string, Date[]>>({});
  
  // Estado para modificación
  const [modificaciones, setModificaciones] = useState<{
    horaInicio?: string;
    horaFin?: string;
    tipoSesion?: 'presencial' | 'videollamada';
    precio?: number;
    duracionMinutos?: number;
    observaciones?: string;
  }>({});

  const cargarReservasRecurrentes = async () => {
    setLoading(true);
    try {
      const datos = await getReservasRecurrentes({ entrenadorId });
      setReservasRecurrentes(datos);
      
      // Cargar próximas sesiones para cada serie recurrente
      const sesionesMap: Record<string, Date[]> = {};
      for (const recurrente of datos) {
        if (recurrente.activo) {
          const fechas = calcularFechasReservas(
            recurrente.fechaInicio,
            recurrente.frecuencia || recurrente.reglaRecurrencia?.frecuencia || 'semanal',
            recurrente.diaSemana || recurrente.reglaRecurrencia?.diaSemana,
            recurrente.numeroRepeticiones || recurrente.reglaRecurrencia?.numeroRepeticiones,
            recurrente.fechaFin || recurrente.fechaFinOpcional || recurrente.reglaRecurrencia?.fechaFin
          );
          const fechaActual = new Date();
          const proximas = fechas
            .filter(fecha => fecha >= fechaActual)
            .slice(0, 5); // Mostrar las próximas 5 sesiones
          sesionesMap[recurrente.id] = proximas;
        }
      }
      setProximasSesiones(sesionesMap);
    } catch (error) {
      console.error('Error cargando reservas recurrentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservasRecurrentes();
  }, [entrenadorId]);

  const handleCancelar = async () => {
    if (!reservaSeleccionada) return;

    setProcesando(true);
    try {
      const resultado = await cancelarReservasRecurrentes(
        reservaSeleccionada.id,
        entrenadorId,
        motivo,
        true // solo futuras
      );
      
      // Desactivar la recurrencia
      await desactivarReservaRecurrente(reservaSeleccionada.id);
      
      alert(`Se han cancelado ${resultado.canceladas} reservas futuras de esta serie.`);
      setReservaSeleccionada(null);
      setMotivo('');
      setAccion(null);
      cargarReservasRecurrentes();
    } catch (error) {
      console.error('Error al cancelar reservas recurrentes:', error);
      alert('Error al cancelar las reservas. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleModificar = async () => {
    if (!reservaSeleccionada) return;

    setProcesando(true);
    try {
      const resultado = await modificarReservasRecurrentes(
        reservaSeleccionada.id,
        entrenadorId,
        modificaciones,
        true // solo futuras
      );
      
      alert(`Se han modificado ${resultado.modificadas} reservas futuras de esta serie.`);
      setReservaSeleccionada(null);
      setModificaciones({});
      setAccion(null);
      cargarReservasRecurrentes();
    } catch (error) {
      console.error('Error al modificar reservas recurrentes:', error);
      alert('Error al modificar las reservas. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handlePausar = async () => {
    if (!reservaSeleccionada) return;

    setProcesando(true);
    try {
      await updateReservaRecurrente(reservaSeleccionada.id, {
        estado: 'pausada',
        activo: false,
      });
      
      alert('La serie de reservas recurrentes ha sido pausada.');
      setReservaSeleccionada(null);
      setAccion(null);
      cargarReservasRecurrentes();
    } catch (error) {
      console.error('Error al pausar reservas recurrentes:', error);
      alert('Error al pausar la serie. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleReanudar = async (recurrente: ReservaRecurrente) => {
    setProcesando(true);
    try {
      await updateReservaRecurrente(recurrente.id, {
        estado: 'activa',
        activo: true,
      });
      
      alert('La serie de reservas recurrentes ha sido reanudada.');
      cargarReservasRecurrentes();
    } catch (error) {
      console.error('Error al reanudar reservas recurrentes:', error);
      alert('Error al reanudar la serie. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const getFrecuenciaTexto = (recurrente: ReservaRecurrente): string => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const frecuencia = recurrente.frecuencia || recurrente.reglaRecurrencia?.frecuencia || 'semanal';
    const diaSemana = recurrente.diaSemana !== undefined ? recurrente.diaSemana : recurrente.reglaRecurrencia?.diaSemana;
    
    switch (frecuencia) {
      case 'diaria':
        return 'Diaria';
      case 'semanal':
        return `Semanal${diaSemana !== undefined ? ` (${diasSemana[diaSemana]})` : ''}`;
      case 'quincenal':
        return 'Quincenal';
      case 'mensual':
        return 'Mensual';
      default:
        return frecuencia;
    }
  };

  const getTipoTexto = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1 a 1',
      'fisio': 'Fisioterapia',
      'nutricion': 'Nutrición',
      'masaje': 'Masaje',
    };
    return tipos[tipo] || tipo;
  };

  const calcularReservasFuturas = (recurrente: ReservaRecurrente): number => {
    const fechaActual = new Date();
    const fechas = calcularFechasReservas(
      recurrente.fechaInicio,
      recurrente.frecuencia || recurrente.reglaRecurrencia?.frecuencia || 'semanal',
      recurrente.diaSemana !== undefined ? recurrente.diaSemana : recurrente.reglaRecurrencia?.diaSemana,
      recurrente.numeroRepeticiones !== undefined ? recurrente.numeroRepeticiones : recurrente.reglaRecurrencia?.numeroRepeticiones,
      recurrente.fechaFin || recurrente.fechaFinOpcional || recurrente.reglaRecurrencia?.fechaFin
    );
    return fechas.filter(fecha => fecha >= fechaActual).length;
  };

  const reservasActivas = reservasRecurrentes.filter(r => r.activo);
  const reservasPausadas = reservasRecurrentes.filter(r => !r.activo && r.estado === 'pausada');

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string, row: ReservaRecurrente) => (
        <div>
          <div className="font-medium">{getTipoTexto(value)}</div>
          {row.tipoSesion && (
            <div className="text-sm text-gray-500">
              {row.tipoSesion === 'presencial' ? 'Presencial' : 'Videollamada'}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'horario',
      label: 'Horario',
      render: (_: any, row: ReservaRecurrente) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'frecuencia',
      label: 'Frecuencia',
      render: (_: any, row: ReservaRecurrente) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{getFrecuenciaTexto(row)}</span>
        </div>
      ),
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (_: any, row: ReservaRecurrente) => (
        <div className="text-sm">
          {row.fechaInicio.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: 'fechaFin',
      label: 'Fecha Fin',
      render: (_: any, row: ReservaRecurrente) => {
        const fechaFin = row.fechaFin || row.fechaFinOpcional || row.reglaRecurrencia?.fechaFin;
        return (
          <div className="text-sm">
            {fechaFin 
              ? fechaFin.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : 'Sin límite'}
          </div>
        );
      },
    },
    {
      key: 'proximasSesiones',
      label: 'Próximas Sesiones',
      render: (_: any, row: ReservaRecurrente) => {
        const sesiones = proximasSesiones[row.id] || [];
        if (sesiones.length === 0) {
          return <span className="text-sm text-gray-500">Sin sesiones futuras</span>;
        }
        return (
          <div className="text-sm space-y-1">
            {sesiones.slice(0, 3).map((fecha, idx) => (
              <div key={idx} className="text-gray-700">
                {fecha.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            ))}
            {sesiones.length > 3 && (
              <div className="text-xs text-gray-500">
                +{sesiones.length - 3} más
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>€{value.toFixed(2)}</span>
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'reservasFuturas',
      label: 'Reservas Futuras',
      render: (_: any, row: ReservaRecurrente) => {
        const futuras = calcularReservasFuturas(row);
        return (
          <div className="text-center">
            <span className="font-medium text-blue-600">{futuras}</span>
            <div className="text-xs text-gray-500">{row.reservasCreadas} creadas</div>
          </div>
        );
      },
      align: 'center' as const,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: ReservaRecurrente) => (
        <div className="flex items-center gap-1">
          {row.activo ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Activa</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Inactiva</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: ReservaRecurrente) => (
        <div className="flex items-center gap-2 flex-wrap">
          {row.activo ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setReservaSeleccionada(row);
                  setAccion('pausar');
                }}
              >
                <Pause className="w-4 h-4 mr-1" />
                Pausar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setReservaSeleccionada(row);
                  setAccion('modificar');
                  setModificaciones({
                    horaInicio: row.horaInicio,
                    horaFin: row.horaFin,
                    tipoSesion: row.tipoSesion,
                    precio: row.precio,
                    duracionMinutos: row.duracionMinutos,
                  });
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Modificar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setReservaSeleccionada(row);
                  setAccion('cancelar');
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </>
          ) : row.estado === 'pausada' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleReanudar(row)}
              disabled={procesando}
            >
              <Play className="w-4 h-4 mr-1" />
              Reanudar
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando reservas recurrentes...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Gestión de Reservas Recurrentes
              </h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={cargarReservasRecurrentes}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actualizar
            </Button>
          </div>

          <p className="text-gray-600">
            Gestiona las series de reservas recurrentes. Puedes cancelar o modificar todas las reservas futuras de una serie a la vez.
          </p>

          {reservasActivas.length === 0 && reservasPausadas.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay reservas recurrentes.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reservasActivas.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Series Activas</h4>
                  <Table
                    data={reservasActivas}
                    columns={columns}
                    keyField="id"
                  />
                </div>
              )}
              {reservasPausadas.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Series Pausadas</h4>
                  <Table
                    data={reservasPausadas}
                    columns={columns}
                    keyField="id"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Cancelación */}
      <Modal
        isOpen={accion === 'cancelar' && reservaSeleccionada !== null}
        onClose={() => {
          setAccion(null);
          setReservaSeleccionada(null);
          setMotivo('');
        }}
        title="Cancelar Serie de Reservas Recurrentes"
      >
        {reservaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Confirmación requerida</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Se cancelarán {calcularReservasFuturas(reservaSeleccionada)} reservas futuras de esta serie.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-gray-900">{reservaSeleccionada.clienteNombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                <p className="text-gray-900">{reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia
                </label>
                <p className="text-gray-900">{getFrecuenciaTexto(reservaSeleccionada)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación (opcional)
              </label>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Indica el motivo de la cancelación..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setAccion(null);
                  setReservaSeleccionada(null);
                  setMotivo('');
                }}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelar}
                disabled={procesando}
              >
                {procesando ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Pausar */}
      <Modal
        isOpen={accion === 'pausar' && reservaSeleccionada !== null}
        onClose={() => {
          setAccion(null);
          setReservaSeleccionada(null);
        }}
        title="Pausar Serie de Reservas Recurrentes"
      >
        {reservaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Pausar serie recurrente</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    La serie se pausará y no se crearán nuevas reservas. Las reservas futuras existentes no se cancelarán.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-gray-900">{reservaSeleccionada.clienteNombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                <p className="text-gray-900">{reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia
                </label>
                <p className="text-gray-900">{getFrecuenciaTexto(reservaSeleccionada)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setAccion(null);
                  setReservaSeleccionada(null);
                }}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handlePausar}
                disabled={procesando}
              >
                {procesando ? 'Pausando...' : 'Confirmar Pausa'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Modificación */}
      <Modal
        isOpen={accion === 'modificar' && reservaSeleccionada !== null}
        onClose={() => {
          setAccion(null);
          setReservaSeleccionada(null);
          setModificaciones({});
        }}
        title="Modificar Serie de Reservas Recurrentes"
      >
        {reservaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Modificación masiva</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Se modificarán {calcularReservasFuturas(reservaSeleccionada)} reservas futuras de esta serie.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <Input
                  type="time"
                  value={modificaciones.horaInicio || reservaSeleccionada.horaInicio}
                  onChange={(e) => setModificaciones({ ...modificaciones, horaInicio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <Input
                  type="time"
                  value={modificaciones.horaFin || reservaSeleccionada.horaFin}
                  onChange={(e) => setModificaciones({ ...modificaciones, horaFin: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Sesión
              </label>
              <Select
                value={modificaciones.tipoSesion || reservaSeleccionada.tipoSesion || 'presencial'}
                onChange={(e) => setModificaciones({ ...modificaciones, tipoSesion: e.target.value as 'presencial' | 'videollamada' })}
                options={[
                  { value: 'presencial', label: 'Presencial' },
                  { value: 'videollamada', label: 'Videollamada' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={modificaciones.precio !== undefined ? modificaciones.precio : reservaSeleccionada.precio}
                  onChange={(e) => setModificaciones({ ...modificaciones, precio: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <Input
                  type="number"
                  value={modificaciones.duracionMinutos !== undefined ? modificaciones.duracionMinutos : reservaSeleccionada.duracionMinutos}
                  onChange={(e) => setModificaciones({ ...modificaciones, duracionMinutos: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones (opcional)
              </label>
              <Textarea
                value={modificaciones.observaciones || ''}
                onChange={(e) => setModificaciones({ ...modificaciones, observaciones: e.target.value })}
                placeholder="Observaciones para las reservas..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setAccion(null);
                  setReservaSeleccionada(null);
                  setModificaciones({});
                }}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleModificar}
                disabled={procesando}
              >
                {procesando ? 'Modificando...' : 'Confirmar Modificación'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

