import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ListaEspera as ListaEsperaType } from '../types';
import { 
  getListaEspera, 
  eliminarDeListaEspera, 
  moverAListaEsperaAReserva,
  actualizarPosicionListaEspera,
  marcarComoNotificado,
  getEstadisticasListaEspera
} from '../api/listaEspera';
import { getReservas, FiltrosReservas } from '../api';
import { Users, Bell, CheckCircle, Package, ArrowUp, ArrowDown, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ListaEsperaProps {
  role: 'entrenador' | 'gimnasio';
}

export const ListaEspera: React.FC<ListaEsperaProps> = ({ role }) => {
  const { user } = useAuth();
  const [listaEspera, setListaEspera] = useState<ListaEsperaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroClase, setFiltroClase] = useState<string>('todas');
  const [entradaSeleccionada, setEntradaSeleccionada] = useState<ListaEsperaType | null>(null);
  const [mostrarModalMover, setMostrarModalMover] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [estadisticas, setEstadisticas] = useState<{
    total: number;
    porClase: Array<{ claseId: string; claseNombre: string; cantidad: number }>;
    notificados: number;
    pendientes: number;
  } | null>(null);

  // Cargar lista de espera
  const cargarListaEspera = async () => {
    setLoading(true);
    try {
      const claseId = filtroClase !== 'todas' ? filtroClase : undefined;
      const lista = await getListaEspera(role, claseId);
      setListaEspera(lista);
      
      // Cargar estadísticas
      const stats = await getEstadisticasListaEspera(role);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando lista de espera:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarListaEspera();
  }, [role, filtroClase]);

  // Obtener lista única de clases para el filtro
  const clasesUnicas = useMemo(() => {
    const clasesMap = new Map<string, { id: string; nombre: string }>();
    listaEspera.forEach((entrada) => {
      if (!clasesMap.has(entrada.claseId)) {
        clasesMap.set(entrada.claseId, {
          id: entrada.claseId,
          nombre: entrada.claseNombre,
        });
      }
    });
    return Array.from(clasesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [listaEspera]);

  // Agrupar entradas por clase y horario
  const entradasAgrupadas = useMemo(() => {
    const grupos = new Map<string, ListaEsperaType[]>();
    
    listaEspera.forEach(entrada => {
      const key = `${entrada.claseId}-${entrada.fecha.toISOString()}-${entrada.hora}`;
      if (!grupos.has(key)) {
        grupos.set(key, []);
      }
      grupos.get(key)!.push(entrada);
    });
    
    // Ordenar cada grupo por posición
    grupos.forEach((entradas) => {
      entradas.sort((a, b) => a.posicion - b.posicion);
    });
    
    return Array.from(grupos.entries()).map(([key, entradas]) => ({
      key,
      claseId: entradas[0].claseId,
      claseNombre: entradas[0].claseNombre,
      fecha: entradas[0].fecha,
      hora: entradas[0].hora,
      entradas,
    }));
  }, [listaEspera]);

  // Manejar mover a reserva
  const handleMoverAReserva = async () => {
    if (!entradaSeleccionada) return;
    
    setProcesando(true);
    try {
      // Calcular hora de fin (asumiendo 1 hora de duración por defecto)
      const [hora, minutos] = entradaSeleccionada.hora.split(':').map(Number);
      const horaFin = `${String((hora + 1) % 24).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
      
      await moverAListaEsperaAReserva(
        entradaSeleccionada.id,
        entradaSeleccionada.fecha,
        entradaSeleccionada.hora,
        horaFin,
        user?.id
      );
      
      setMostrarModalMover(false);
      setEntradaSeleccionada(null);
      await cargarListaEspera();
    } catch (error) {
      console.error('Error moviendo a reserva:', error);
      alert(error instanceof Error ? error.message : 'Error al mover a reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  // Manejar eliminar de lista de espera
  const handleEliminar = async () => {
    if (!entradaSeleccionada) return;
    
    setProcesando(true);
    try {
      await eliminarDeListaEspera(entradaSeleccionada.id);
      setMostrarModalEliminar(false);
      setEntradaSeleccionada(null);
      await cargarListaEspera();
    } catch (error) {
      console.error('Error eliminando de lista de espera:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  // Manejar cambiar prioridad
  const handleCambiarPrioridad = async (entrada: ListaEsperaType, direccion: 'arriba' | 'abajo') => {
    const nuevaPosicion = direccion === 'arriba' ? entrada.posicion - 1 : entrada.posicion + 1;
    
    if (nuevaPosicion < 1) return;
    
    // Verificar que no exceda el máximo
    const entradasMismaClase = listaEspera.filter(
      le => le.claseId === entrada.claseId &&
      le.fecha.getTime() === entrada.fecha.getTime() &&
      le.hora === entrada.hora
    ).length;
    
    if (nuevaPosicion > entradasMismaClase) return;
    
    try {
      await actualizarPosicionListaEspera(entrada.id, nuevaPosicion);
      await cargarListaEspera();
    } catch (error) {
      console.error('Error cambiando prioridad:', error);
      alert(error instanceof Error ? error.message : 'Error al cambiar prioridad. Por favor, inténtalo de nuevo.');
    }
  };

  // Manejar marcar como notificado
  const handleMarcarNotificado = async (entrada: ListaEsperaType) => {
    try {
      await marcarComoNotificado(entrada.id);
      await cargarListaEspera();
    } catch (error) {
      console.error('Error marcando como notificado:', error);
      alert(error instanceof Error ? error.message : 'Error al marcar como notificado. Por favor, inténtalo de nuevo.');
    }
  };

  const columns = [
    {
      key: 'posicion',
      label: 'Prioridad',
      render: (value: number, row: ListaEsperaType) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <span className="text-sm font-semibold text-blue-600">
              {value}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleCambiarPrioridad(row, 'arriba')}
              disabled={value === 1}
              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Aumentar prioridad"
            >
              <ArrowUp className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={() => handleCambiarPrioridad(row, 'abajo')}
              disabled={value === listaEspera.filter(
                le => le.claseId === row.claseId &&
                le.fecha.getTime() === row.fecha.getTime() &&
                le.hora === row.hora
              ).length}
              className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Disminuir prioridad"
            >
              <ArrowDown className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'claseNombre',
      label: 'Clase',
      render: (value: string) => value,
    },
    {
      key: 'clienteNombre',
      label: 'Socio',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
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
      key: 'hora',
      label: 'Hora',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'notificado',
      label: 'Estado',
      render: (value: boolean, row: ListaEsperaType) => (
        <div className="flex items-center gap-2">
          <Badge 
            variant={value ? 'green' : 'yellow'}
            leftIcon={value ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
          >
            {value ? 'Notificado' : 'Pendiente'}
          </Badge>
          {!value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarcarNotificado(row)}
              leftIcon={<Bell className="w-3 h-3" />}
              className="ml-2"
            >
              Marcar Notificado
            </Button>
          )}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: ListaEsperaType) => (
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEntradaSeleccionada(row);
              setMostrarModalMover(true);
            }}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Mover a Reserva
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setEntradaSeleccionada(row);
              setMostrarModalEliminar(true);
            }}
            leftIcon={<X className="w-4 h-4" />}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (role === 'entrenador') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de Espera no disponible</h3>
        <p className="text-gray-600">
          La lista de espera solo está disponible para gimnasios
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Lista de Espera
              </h3>
            </div>
            {estadisticas && (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-bold text-blue-600">{estadisticas.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-lg font-bold text-yellow-600">{estadisticas.pendientes}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Notificados</p>
                  <p className="text-lg font-bold text-green-600">{estadisticas.notificados}</p>
                </div>
              </div>
            )}
          </div>

          {/* Filtro por clase */}
          {clasesUnicas.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtrar por clase:</span>
              </div>
              <div className="w-64">
                <Select
                  value={filtroClase}
                  onChange={(e) => setFiltroClase(e.target.value)}
                  options={[
                    { value: 'todas', label: 'Todas las clases' },
                    ...clasesUnicas.map((clase) => ({
                      value: clase.id,
                      label: clase.nombre,
                    })),
                  ]}
                  placeholder="Selecciona una clase"
                  fullWidth={false}
                  className="w-full"
                />
              </div>
              {filtroClase !== 'todas' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltroClase('todas')}
                  className="text-sm"
                >
                  Limpiar filtro
                </Button>
              )}
            </div>
          )}

          {/* Estadísticas por clase */}
          {estadisticas && estadisticas.porClase.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              {estadisticas.porClase.map((clase) => (
                <div key={clase.claseId} className="text-center">
                  <p className="text-sm font-medium text-gray-700">{clase.claseNombre}</p>
                  <p className="text-xl font-bold text-blue-600">{clase.cantidad} en espera</p>
                </div>
              ))}
            </div>
          )}

          <Table
            data={listaEspera}
            columns={columns}
            loading={loading}
            emptyMessage="No hay personas en lista de espera"
          />
        </div>
      </Card>

      {/* Modal para mover a reserva */}
      <Modal
        isOpen={mostrarModalMover}
        onClose={() => {
          setMostrarModalMover(false);
          setEntradaSeleccionada(null);
        }}
        title="Mover a Reserva"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalMover(false);
                setEntradaSeleccionada(null);
              }}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleMoverAReserva}
              loading={procesando}
              disabled={procesando}
            >
              Confirmar Reserva
            </Button>
          </div>
        }
      >
        {entradaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Cliente:</strong> {entradaSeleccionada.clienteNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Clase:</strong> {entradaSeleccionada.claseNombre}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Fecha:</strong> {entradaSeleccionada.fecha.toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Hora:</strong> {entradaSeleccionada.hora}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">
                    ¿Confirmar reserva?
                  </p>
                  <p className="text-sm text-green-700">
                    El cliente será movido de la lista de espera y se creará una reserva confirmada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para eliminar */}
      <Modal
        isOpen={mostrarModalEliminar}
        onClose={() => {
          setMostrarModalEliminar(false);
          setEntradaSeleccionada(null);
        }}
        title="Eliminar de Lista de Espera"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalEliminar(false);
                setEntradaSeleccionada(null);
              }}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleEliminar}
              loading={procesando}
              disabled={procesando}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        {entradaSeleccionada && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">
                    ¿Eliminar de la lista de espera?
                  </p>
                  <p className="text-sm text-red-700 mb-2">
                    Esta acción eliminará a <strong>{entradaSeleccionada.clienteNombre}</strong> de la lista de espera para:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    <li><strong>Clase:</strong> {entradaSeleccionada.claseNombre}</li>
                    <li><strong>Fecha:</strong> {entradaSeleccionada.fecha.toLocaleDateString('es-ES')}</li>
                    <li><strong>Hora:</strong> {entradaSeleccionada.hora}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
