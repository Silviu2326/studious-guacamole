import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  Zap,
  Settings,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Bell,
  Info,
} from 'lucide-react';
import type {
  ReglaPersonalizada,
  TipoCondicionRegla,
  TipoAccionRegla,
  CondicionRegla,
  AccionRegla,
  EjecucionRegla,
} from '../types';
import {
  getReglasPersonalizadas,
  crearReglaPersonalizada,
  actualizarReglaPersonalizada,
  eliminarReglaPersonalizada,
  getHistorialEjecuciones,
} from '../api/reglasPersonalizadas';
import { useAuth } from '../../../context/AuthContext';

interface GestorAutomatizacionesEventosProps {
  dietaId?: string;
  clienteId?: string;
  onReglaCreada?: () => void;
  onReglaActualizada?: () => void;
}

export const GestorAutomatizacionesEventos: React.FC<GestorAutomatizacionesEventosProps> = ({
  dietaId,
  clienteId,
  onReglaCreada,
  onReglaActualizada,
}) => {
  const { user } = useAuth();
  const [reglas, setReglas] = useState<ReglaPersonalizada[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaPersonalizada | null>(null);
  const [historialEjecuciones, setHistorialEjecuciones] = useState<Record<string, EjecucionRegla[]>>({});
  const [mostrarHistorial, setMostrarHistorial] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      cargarReglas();
    }
  }, [user?.id, dietaId]);

  const cargarReglas = async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const reglasCargadas = await getReglasPersonalizadas(user.id);
      // Filtrar solo reglas activadas por eventos (USER STORY 2)
      const reglasEvento = reglasCargadas.filter(r =>
        r.condicion.tipo === 'feedback-negativo' ||
        r.condicion.tipo === 'feedback-bajo' ||
        r.condicion.tipo === 'ingesta-fuera-rango' ||
        r.condicion.tipo === 'cumplimiento-bajo'
      );
      setReglas(reglasEvento);
    } catch (error) {
      console.error('Error cargando reglas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearRegla = () => {
    setReglaEditando(null);
    setMostrarEditor(true);
  };

  const handleEditarRegla = (regla: ReglaPersonalizada) => {
    setReglaEditando(regla);
    setMostrarEditor(true);
  };

  const handleEliminarRegla = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta automatización?')) return;
    try {
      await eliminarReglaPersonalizada(id);
      await cargarReglas();
    } catch (error) {
      console.error('Error eliminando regla:', error);
    }
  };

  const handleVerHistorial = async (reglaId: string) => {
    try {
      const historial = await getHistorialEjecuciones(reglaId);
      setHistorialEjecuciones(prev => ({ ...prev, [reglaId]: historial }));
      setMostrarHistorial(reglaId);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const getTipoCondicionLabel = (tipo: TipoCondicionRegla): string => {
    switch (tipo) {
      case 'feedback-negativo':
        return 'Feedback Negativo';
      case 'feedback-bajo':
        return 'Feedback Bajo';
      case 'ingesta-fuera-rango':
        return 'Ingesta Fuera de Rango';
      case 'cumplimiento-bajo':
        return 'Cumplimiento Bajo';
      default:
        return tipo;
    }
  };

  const getTipoAccionLabel = (tipo: TipoAccionRegla): string => {
    switch (tipo) {
      case 'añadir-comida':
        return 'Añadir Comida';
      case 'añadir-postre':
        return 'Añadir Postre';
      case 'ajustar-macros':
        return 'Ajustar Macros';
      case 'sustituir-comida':
        return 'Sustituir Comida';
      case 'eliminar-comida':
        return 'Eliminar Comida';
      case 'modificar-cantidad':
        return 'Modificar Cantidad';
      case 'añadir-suplemento':
        return 'Añadir Suplemento';
      case 'notificar-dietista':
        return 'Notificar Dietista';
      case 'aplicar-plantilla':
        return 'Aplicar Plantilla';
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Automatizaciones Activadas por Eventos</h3>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCrearRegla}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Nueva Automatización
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Qué son las automatizaciones activadas por eventos?</p>
              <p>
                Estas automatizaciones se ejecutan automáticamente cuando ocurre un evento específico,
                como feedback negativo del cliente, ingesta registrada fuera del rango objetivo, o
                cumplimiento bajo. No requieren intervención constante del dietista.
              </p>
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : reglas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay automatizaciones configuradas. Crea una para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reglas.map((regla) => (
              <Card key={regla.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{regla.nombre}</h4>
                      {regla.activa ? (
                        <Badge variant="success" className="text-xs">
                          Activa
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Inactiva
                        </Badge>
                      )}
                    </div>
                    {regla.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{regla.descripcion}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Condición:</p>
                        <Badge variant="blue" className="text-xs">
                          {getTipoCondicionLabel(regla.condicion.tipo)}
                        </Badge>
                        {regla.condicion.tipo === 'feedback-negativo' && (
                          <p className="text-xs text-gray-600 mt-1">
                            Umbral: Sensación {'<'} {regla.condicion.parametros.umbralSensacion || 3} o
                            Saciedad {'<'} {regla.condicion.parametros.umbralSaciedad || 3}
                          </p>
                        )}
                        {regla.condicion.tipo === 'ingesta-fuera-rango' && (
                          <p className="text-xs text-gray-600 mt-1">
                            Margen de error: {regla.condicion.parametros.margenError || 10}%
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Acción:</p>
                        <Badge variant="yellow" className="text-xs">
                          {getTipoAccionLabel(regla.accion.tipo)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      {regla.vecesEjecutada > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Ejecutada {regla.vecesEjecutada} vez(es)</span>
                        </div>
                      )}
                      {regla.ultimaEjecucion && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Última ejecución: {new Date(regla.ultimaEjecucion).toLocaleDateString()}</span>
                        </div>
                      )}
                      {regla.requiereConfirmacion && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>Requiere confirmación</span>
                        </div>
                      )}
                      {regla.notificarDietista && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Bell className="h-3 w-3" />
                          <span>Notifica al dietista</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerHistorial(regla.id)}
                    >
                      Historial
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarRegla(regla)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarRegla(regla.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Editor de regla */}
      {mostrarEditor && (
        <EditorReglaEvento
          regla={reglaEditando}
          dietaId={dietaId}
          clienteId={clienteId}
          onClose={() => {
            setMostrarEditor(false);
            setReglaEditando(null);
          }}
          onGuardar={async () => {
            await cargarReglas();
            setMostrarEditor(false);
            setReglaEditando(null);
            onReglaCreada?.();
            onReglaActualizada?.();
          }}
        />
      )}

      {/* Modal de historial */}
      {mostrarHistorial && historialEjecuciones[mostrarHistorial] && (
        <Modal
          isOpen={true}
          onClose={() => setMostrarHistorial(null)}
          title="Historial de Ejecuciones"
          size="lg"
        >
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {historialEjecuciones[mostrarHistorial].map((ejecucion) => (
              <Card key={ejecucion.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {ejecucion.exito ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {new Date(ejecucion.fechaEjecucion).toLocaleString()}
                    </span>
                  </div>
                  {ejecucion.exito ? (
                    <Badge variant="success" className="text-xs">Éxito</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  )}
                </div>
                {ejecucion.resultado && (
                  <div className="text-xs text-gray-600">
                    <p>Cambios aplicados: {ejecucion.resultado.cambiosAplicados}</p>
                    {ejecucion.resultado.detalles.map((detalle, i) => (
                      <p key={i}>- {detalle}</p>
                    ))}
                  </div>
                )}
                {ejecucion.error && (
                  <div className="text-xs text-red-600">
                    Error: {ejecucion.error}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

// Componente para editar/crear regla de evento
interface EditorReglaEventoProps {
  regla: ReglaPersonalizada | null;
  dietaId?: string;
  clienteId?: string;
  onClose: () => void;
  onGuardar: () => void;
}

const EditorReglaEvento: React.FC<EditorReglaEventoProps> = ({
  regla,
  dietaId,
  clienteId,
  onClose,
  onGuardar,
}) => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(regla?.nombre || '');
  const [descripcion, setDescripcion] = useState(regla?.descripcion || '');
  const [tipoCondicion, setTipoCondicion] = useState<TipoCondicionRegla>(
    regla?.condicion.tipo || 'feedback-negativo'
  );
  const [tipoAccion, setTipoAccion] = useState<TipoAccionRegla>(
    regla?.accion.tipo || 'ajustar-macros'
  );
  const [activa, setActiva] = useState(regla?.activa ?? true);
  const [requiereConfirmacion, setRequiereConfirmacion] = useState(regla?.requiereConfirmacion ?? false);
  const [notificarDietista, setNotificarDietista] = useState(regla?.notificarDietista ?? true);
  const [guardando, setGuardando] = useState(false);
  
  // Parámetros de condición
  const [umbralSensacion, setUmbralSensacion] = useState(
    (regla?.condicion.parametros.umbralSensacion as number) || 3
  );
  const [umbralSaciedad, setUmbralSaciedad] = useState(
    (regla?.condicion.parametros.umbralSaciedad as number) || 3
  );
  const [margenError, setMargenError] = useState(
    (regla?.condicion.parametros.margenError as number) || 10
  );
  const [porcentajeMinimo, setPorcentajeMinimo] = useState(
    (regla?.condicion.parametros.porcentajeMinimo as number) || 70
  );

  // Parámetros de acción
  const [ajusteCalorias, setAjusteCalorias] = useState(
    (regla?.accion.parametros.calorias as number) || 0
  );
  const [ajusteProteinas, setAjusteProteinas] = useState(
    (regla?.accion.parametros.proteinas as number) || 0
  );

  const handleGuardar = async () => {
    if (!user?.id || !nombre.trim()) return;
    setGuardando(true);
    try {
      const condicion: CondicionRegla = {
        tipo: tipoCondicion,
        parametros: {},
      };

      // Configurar parámetros según el tipo de condición
      if (tipoCondicion === 'feedback-negativo' || tipoCondicion === 'feedback-bajo') {
        condicion.parametros.umbralSensacion = umbralSensacion;
        condicion.parametros.umbralSaciedad = umbralSaciedad;
      } else if (tipoCondicion === 'ingesta-fuera-rango') {
        condicion.parametros.margenError = margenError;
      } else if (tipoCondicion === 'cumplimiento-bajo') {
        condicion.parametros.porcentajeMinimo = porcentajeMinimo;
      }

      const accion: AccionRegla = {
        tipo: tipoAccion,
        parametros: {},
      };

      // Configurar parámetros según el tipo de acción
      if (tipoAccion === 'ajustar-macros') {
        accion.parametros.calorias = ajusteCalorias;
        accion.parametros.proteinas = ajusteProteinas;
      }

      const datosRegla: Omit<ReglaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'vecesEjecutada'> = {
        dietistaId: user.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        activa,
        condicion,
        accion,
        frecuencia: 'bajo-demanda', // Las reglas de evento se ejecutan bajo demanda
        aplicarATodas: !dietaId,
        dietaIds: dietaId ? [dietaId] : undefined,
        requiereConfirmacion,
        notificarDietista,
      };

      if (regla) {
        await actualizarReglaPersonalizada(regla.id, datosRegla);
      } else {
        await crearReglaPersonalizada(datosRegla);
      }
      onGuardar();
    } catch (error) {
      console.error('Error guardando regla:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={regla ? 'Editar Automatización' : 'Nueva Automatización'}
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ej: Ajustar macros cuando hay feedback negativo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows={2}
            placeholder="Descripción opcional de la automatización"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evento que Activa la Automatización *
          </label>
          <select
            value={tipoCondicion}
            onChange={(e) => setTipoCondicion(e.target.value as TipoCondicionRegla)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="feedback-negativo">Feedback Negativo</option>
            <option value="feedback-bajo">Feedback Bajo</option>
            <option value="ingesta-fuera-rango">Ingesta Fuera de Rango</option>
            <option value="cumplimiento-bajo">Cumplimiento Bajo</option>
          </select>
        </div>

        {/* Parámetros de condición */}
        {(tipoCondicion === 'feedback-negativo' || tipoCondicion === 'feedback-bajo') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umbral de Sensación (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={umbralSensacion}
                onChange={(e) => setUmbralSensacion(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umbral de Saciedad (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={umbralSaciedad}
                onChange={(e) => setUmbralSaciedad(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        )}

        {tipoCondicion === 'ingesta-fuera-rango' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margen de Error (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={margenError}
              onChange={(e) => setMargenError(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              La automatización se activará si la ingesta se desvía más del {margenError}% del objetivo
            </p>
          </div>
        )}

        {tipoCondicion === 'cumplimiento-bajo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje Mínimo de Cumplimiento (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={porcentajeMinimo}
              onChange={(e) => setPorcentajeMinimo(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              La automatización se activará si el cumplimiento es menor al {porcentajeMinimo}%
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acción a Ejecutar *
          </label>
          <select
            value={tipoAccion}
            onChange={(e) => setTipoAccion(e.target.value as TipoAccionRegla)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="ajustar-macros">Ajustar Macros</option>
            <option value="añadir-comida">Añadir Comida</option>
            <option value="sustituir-comida">Sustituir Comida</option>
            <option value="notificar-dietista">Notificar Dietista</option>
          </select>
        </div>

        {/* Parámetros de acción */}
        {tipoAccion === 'ajustar-macros' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ajuste de Calorías (kcal)
              </label>
              <input
                type="number"
                value={ajusteCalorias}
                onChange={(e) => setAjusteCalorias(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ajuste de Proteínas (g)
              </label>
              <input
                type="number"
                value={ajusteProteinas}
                onChange={(e) => setAjusteProteinas(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">Activa</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiereConfirmacion}
              onChange={(e) => setRequiereConfirmacion(e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">Requiere confirmación antes de ejecutar</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notificarDietista}
              onChange={(e) => setNotificarDietista(e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700">Notificar al dietista cuando se ejecute</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            disabled={guardando || !nombre.trim()}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

