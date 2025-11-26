import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Textarea, Input, Select } from '../../../components/componentsreutilizables';
import { ReservaRecurrente } from '../types';
import { 
  getReservasRecurrentes, 
  cancelarReservasRecurrentes, 
  modificarReservasRecurrentes,
  desactivarReservaRecurrente,
  calcularFechasReservas
} from '../api/reservasRecurrentes';
import { useAuth } from '../../../context/AuthContext';
import { RefreshCw, XCircle, Edit, Calendar, Clock, Users, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

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
  const [accion, setAccion] = useState<'cancelar' | 'modificar' | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);
  
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
      const datos = await getReservasRecurrentes(entrenadorId);
      setReservasRecurrentes(datos);
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

  const getFrecuenciaTexto = (recurrente: ReservaRecurrente): string => {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    switch (recurrente.frecuencia) {
      case 'diaria':
        return 'Diaria';
      case 'semanal':
        return `Semanal (${recurrente.diaSemana !== undefined ? diasSemana[recurrente.diaSemana] : ''})`;
      case 'quincenal':
        return 'Quincenal';
      case 'mensual':
        return 'Mensual';
      default:
        return recurrente.frecuencia;
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
      recurrente.frecuencia,
      recurrente.diaSemana,
      recurrente.numeroRepeticiones,
      recurrente.fechaFin
    );
    return fechas.filter(fecha => fecha >= fechaActual).length;
  };

  const reservasActivas = reservasRecurrentes.filter(r => r.activo);

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
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setReservaSeleccionada(row);
              setAccion('cancelar');
            }}
            disabled={!row.activo}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancelar Serie
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
            disabled={!row.activo}
          >
            <Edit className="w-4 h-4 mr-1" />
            Modificar Serie
          </Button>
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

          {reservasActivas.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay reservas recurrentes activas.</p>
            </div>
          ) : (
            <Table
              data={reservasActivas}
              columns={columns}
              keyField="id"
            />
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

