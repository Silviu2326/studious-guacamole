import React, { useState, useEffect } from 'react';
import { Suscripcion, MiembroGrupo, SesionIncluida } from '../types';
import { Card, Button, Modal, Select, Input, Badge } from '../../../components/componentsreutilizables';
import { 
  activarMultisesion, 
  desactivarMultisesion,
  obtenerSesionesIncluidas,
  crearSesionIncluida,
  actualizarSesionIncluida,
} from '../api/suscripciones';
import { Layers, Users, UserPlus, UserMinus } from 'lucide-react';

interface MultisesionProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

const serviciosDisponibles = [
  'gimnasio',
  'spa',
  'piscina',
  'clases-grupales',
  'crossfit',
  'yoga',
  'pilates',
  'fisioterapia',
];

export const Multisesion: React.FC<MultisesionProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAsignacionSesiones, setModalAsignacionSesiones] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>(
    suscripcion.serviciosMultisesion || []
  );
  const [miembrosGrupo, setMiembrosGrupo] = useState<MiembroGrupo[]>(
    suscripcion.miembrosGrupo || []
  );
  const [sesionesPorMiembro, setSesionesPorMiembro] = useState<Map<string, number>>(new Map());
  const [sesionesIncluidas, setSesionesIncluidas] = useState<SesionIncluida[]>([]);
  const [cantidadesAsignacion, setCantidadesAsignacion] = useState<Map<string, number>>(new Map());
  
  useEffect(() => {
    if (suscripcion.esGrupal) {
      loadSesionesIncluidas();
    }
  }, [suscripcion.id, suscripcion.esGrupal]);
  
  const loadSesionesIncluidas = async () => {
    try {
      const sesiones = await obtenerSesionesIncluidas({
        suscripcionId: suscripcion.id,
        incluirCaducadas: false,
      });
      setSesionesIncluidas(sesiones);
      
      // Inicializar sesiones por miembro
      const sesionesMap = new Map<string, number>();
      miembrosGrupo.forEach(miembro => {
        const sesionesMiembro = sesiones.filter(s => s.clienteId === miembro.clienteId);
        const total = sesionesMiembro.reduce((sum, s) => sum + (s.totalSesiones - s.consumidas), 0);
        sesionesMap.set(miembro.clienteId, total);
      });
      setSesionesPorMiembro(sesionesMap);
    } catch (error) {
      console.error('Error cargando sesiones incluidas:', error);
    }
  };
  
  const handleAsignarSesiones = async (miembroId: string, cantidad: number) => {
    try {
      const miembro = miembrosGrupo.find(m => m.clienteId === miembroId);
      if (!miembro) return;
      
      // Obtener o crear sesión incluida para el miembro
      const periodoActual = new Date().toISOString().slice(0, 7); // YYYY-MM
      const sesionExistente = sesionesIncluidas.find(
        s => s.clienteId === miembroId && s.periodo === periodoActual
      );
      
      if (sesionExistente) {
        await actualizarSesionIncluida(sesionExistente.id, {
          totalSesiones: sesionExistente.totalSesiones + cantidad,
        });
      } else {
        await crearSesionIncluida({
          suscripcionId: miembro.suscripcionId,
          clienteId: miembroId,
          totalSesiones: cantidad,
          consumidas: 0,
          fechaCaducidad: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
          tipoSesion: 'grupal',
          periodo: periodoActual,
        });
      }
      
      await loadSesionesIncluidas();
      onSuccess?.();
    } catch (error) {
      console.error('Error asignando sesiones:', error);
      alert('Error al asignar sesiones');
    }
  };

  const handleActivarMultisesion = async () => {
    try {
      await activarMultisesion({
        suscripcionId: suscripcion.id,
        servicios: serviciosSeleccionados,
      });
      
      setModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error activando multisesión:', error);
      alert('Error al activar multisesión');
    }
  };

  const handleDesactivarMultisesion = async () => {
    try {
      await desactivarMultisesion(suscripcion.id);
      onSuccess?.();
    } catch (error) {
      console.error('Error desactivando multisesión:', error);
      alert('Error al desactivar multisesión');
    }
  };

  const toggleServicio = (servicio: string) => {
    setServiciosSeleccionados(prev => {
      if (prev.includes(servicio)) {
        return prev.filter(s => s !== servicio);
      } else {
        return [...prev, servicio];
      }
    });
  };

  if (!suscripcion.permiteMultisesion && !suscripcion.esGrupal) {
    return null;
  }

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {suscripcion.esGrupal ? 'Suscripción Compartida' : 'Multisesión'}
              </h3>
              {suscripcion.multisesionActivo ? (
                <div className="space-y-2">
                  <p className="text-base text-gray-600">
                    Servicios activos: {suscripcion.serviciosMultisesion?.length || 0}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suscripcion.serviciosMultisesion?.map(servicio => (
                      <span
                        key={servicio}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm"
                      >
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              ) : suscripcion.esGrupal ? (
                <p className="text-base text-gray-600">
                  Suscripción compartida con {miembrosGrupo.length} miembro(s)
                </p>
              ) : (
                <p className="text-base text-gray-600">
                  Acceso a múltiples servicios con una sola membresía
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {suscripcion.esGrupal && (
                <Button
                  variant="primary"
                  onClick={() => setModalAsignacionSesiones(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Asignar Sesiones
                </Button>
              )}
              {suscripcion.multisesionActivo ? (
                <Button
                  variant="secondary"
                  onClick={handleDesactivarMultisesion}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Activar Multisesión
                </Button>
              )}
            </div>
          </div>
          
          {/* Asignación de sesiones por miembro (solo para suscripciones grupales) */}
          {suscripcion.esGrupal && miembrosGrupo.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Sesiones por Miembro</h4>
              <div className="space-y-3">
                {miembrosGrupo.map((miembro) => {
                  const sesionesDisponibles = sesionesPorMiembro.get(miembro.clienteId) || 0;
                  return (
                    <div key={miembro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{miembro.clienteNombre}</p>
                        <p className="text-sm text-gray-600">{miembro.clienteEmail}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge color="info">
                          {sesionesDisponibles} sesiones disponibles
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Activar Multisesión"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-base text-gray-600">
            Selecciona los servicios a los que quieres tener acceso:
          </p>
          
          <div className="space-y-2">
            {serviciosDisponibles.map(servicio => (
              <label
                key={servicio}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={serviciosSeleccionados.includes(servicio)}
                  onChange={() => toggleServicio(servicio)}
                  className="w-4 h-4"
                />
                <span className="text-base text-gray-900">
                  {servicio.charAt(0).toUpperCase() + servicio.slice(1).replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleActivarMultisesion}
              disabled={serviciosSeleccionados.length === 0}
            >
              Activar Multisesión
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para asignar sesiones por miembro */}
      {suscripcion.esGrupal && (
        <Modal
          isOpen={modalAsignacionSesiones}
          onClose={() => setModalAsignacionSesiones(false)}
          title="Asignar Sesiones por Miembro"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Asigna sesiones individuales a cada miembro de la suscripción compartida.
            </p>
            
            <div className="space-y-4">
              {miembrosGrupo.map((miembro) => {
                const sesionesActuales = sesionesPorMiembro.get(miembro.clienteId) || 0;
                const cantidad = cantidadesAsignacion.get(miembro.id) || 0;
                
                return (
                  <div key={miembro.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{miembro.clienteNombre}</p>
                        <p className="text-sm text-gray-600">{miembro.clienteEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Sesiones actuales: {sesionesActuales}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Input
                        label="Cantidad a asignar"
                        type="number"
                        min={0}
                        value={cantidad.toString()}
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value) || 0;
                          setCantidadesAsignacion(prev => {
                            const nuevo = new Map(prev);
                            nuevo.set(miembro.id, nuevaCantidad);
                            return nuevo;
                          });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (cantidad > 0) {
                            handleAsignarSesiones(miembro.clienteId, cantidad);
                            setCantidadesAsignacion(prev => {
                              const nuevo = new Map(prev);
                              nuevo.set(miembro.id, 0);
                              return nuevo;
                            });
                          }
                        }}
                        disabled={cantidad <= 0}
                        className="mt-6"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Asignar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setModalAsignacionSesiones(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

