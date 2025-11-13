import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Settings,
} from 'lucide-react';
import type {
  ReglaPersonalizada,
  TipoCondicionRegla,
  TipoAccionRegla,
  FrecuenciaEjecucion,
  EjecucionRegla,
  Dieta,
} from '../types';
import {
  getReglasPersonalizadas,
  crearReglaPersonalizada,
  actualizarReglaPersonalizada,
  eliminarReglaPersonalizada,
  ejecutarReglaPersonalizada,
  getHistorialEjecuciones,
} from '../api/reglasPersonalizadas';
import { useAuth } from '../../../context/AuthContext';
import { getDietas } from '../api';

interface GestorReglasPersonalizadasProps {
  dietaId?: string;
  onReglaEjecutada?: () => void;
}

const tiposCondicion: { value: TipoCondicionRegla; label: string }[] = [
  { value: 'dia-libre', label: 'Día libre' },
  { value: 'dia-semana', label: 'Día de la semana' },
  { value: 'tag-dia', label: 'Tag del día' },
  { value: 'adherencia-baja', label: 'Adherencia baja' },
];

const tiposAccion: { value: TipoAccionRegla; label: string }[] = [
  { value: 'añadir-postre', label: 'Añadir postre' },
  { value: 'añadir-comida', label: 'Añadir comida' },
  { value: 'ajustar-macros', label: 'Ajustar macros' },
  { value: 'eliminar-comida', label: 'Eliminar comida' },
];

const frecuencias: { value: FrecuenciaEjecucion; label: string }[] = [
  { value: 'bajo-demanda', label: 'Bajo demanda' },
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'recurrente', label: 'Recurrente' },
];

const diasSemana = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
];

export const GestorReglasPersonalizadas: React.FC<GestorReglasPersonalizadasProps> = ({
  dietaId,
  onReglaEjecutada,
}) => {
  const { user } = useAuth();
  const [reglas, setReglas] = useState<ReglaPersonalizada[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaPersonalizada | null>(null);
  const [dietas, setDietas] = useState<Dieta[]>([]);

  useEffect(() => {
    if (user?.id) {
      cargarReglas();
      cargarDietas();
    }
  }, [user?.id]);

  const cargarReglas = async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const reglasCargadas = await getReglasPersonalizadas(user.id);
      setReglas(reglasCargadas);
    } catch (error) {
      console.error('Error cargando reglas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarDietas = async () => {
    try {
      const dietasCargadas = await getDietas();
      setDietas(dietasCargadas);
    } catch (error) {
      console.error('Error cargando dietas:', error);
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
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;
    try {
      await eliminarReglaPersonalizada(id);
      await cargarReglas();
    } catch (error) {
      console.error('Error eliminando regla:', error);
    }
  };

  const handleEjecutarRegla = async (regla: ReglaPersonalizada) => {
    if (!dietaId) {
      alert('Selecciona una dieta primero');
      return;
    }
    setCargando(true);
    try {
      await ejecutarReglaPersonalizada(regla.id, dietaId);
      if (onReglaEjecutada) {
        onReglaEjecutada();
      }
      await cargarReglas();
    } catch (error) {
      console.error('Error ejecutando regla:', error);
      alert(error instanceof Error ? error.message : 'Error al ejecutar la regla');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Reglas Personalizadas</h3>
          </div>
          <Button variant="primary" size="sm" onClick={handleCrearRegla}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Regla
          </Button>
        </div>

        {cargando && reglas.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : reglas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No hay reglas personalizadas configuradas.</p>
            <p className="text-sm mt-2">Crea una regla para automatizar ajustes comunes.</p>
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
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Activa
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Inactiva
                        </span>
                      )}
                    </div>
                    {regla.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{regla.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>
                        <strong>Si:</strong> {tiposCondicion.find(t => t.value === regla.condicion.tipo)?.label}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Entonces:</strong> {tiposAccion.find(t => t.value === regla.accion.tipo)?.label}
                      </span>
                      <span>•</span>
                      <span>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {frecuencias.find(f => f.value === regla.frecuencia)?.label}
                      </span>
                      {regla.vecesEjecutada > 0 && (
                        <>
                          <span>•</span>
                          <span>Ejecutada {regla.vecesEjecutada} vez(es)</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {regla.frecuencia === 'bajo-demanda' && dietaId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEjecutarRegla(regla)}
                        disabled={cargando}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
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

      {mostrarEditor && (
        <EditorReglaPersonalizada
          regla={reglaEditando}
          dietas={dietas}
          onClose={() => {
            setMostrarEditor(false);
            setReglaEditando(null);
          }}
          onGuardar={async () => {
            await cargarReglas();
            setMostrarEditor(false);
            setReglaEditando(null);
          }}
        />
      )}
    </div>
  );
};

interface EditorReglaPersonalizadaProps {
  regla: ReglaPersonalizada | null;
  dietas: Dieta[];
  onClose: () => void;
  onGuardar: () => void;
}

const EditorReglaPersonalizada: React.FC<EditorReglaPersonalizadaProps> = ({
  regla,
  dietas,
  onClose,
  onGuardar,
}) => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(regla?.nombre || '');
  const [descripcion, setDescripcion] = useState(regla?.descripcion || '');
  const [tipoCondicion, setTipoCondicion] = useState<TipoCondicionRegla>(
    regla?.condicion.tipo || 'dia-semana'
  );
  const [tipoAccion, setTipoAccion] = useState<TipoAccionRegla>(
    regla?.accion.tipo || 'añadir-postre'
  );
  const [frecuencia, setFrecuencia] = useState<FrecuenciaEjecucion>(
    regla?.frecuencia || 'bajo-demanda'
  );
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>(
    regla?.condicion.parametros.dias || []
  );
  const [aplicarATodas, setAplicarATodas] = useState(regla?.aplicarATodas ?? true);
  const [dietaIdsSeleccionadas, setDietaIdsSeleccionadas] = useState<string[]>(
    regla?.dietaIds || []
  );
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!user?.id || !nombre.trim()) return;
    setGuardando(true);
    try {
      const condicion = {
        tipo: tipoCondicion,
        parametros:
          tipoCondicion === 'dia-semana'
            ? { dias: diasSeleccionados }
            : tipoCondicion === 'dia-libre'
            ? { activo: true }
            : {},
      };

      const accion = {
        tipo: tipoAccion,
        parametros:
          tipoAccion === 'añadir-postre'
            ? {
                nombre: 'Postre libre',
                tipoComida: 'postre',
                calorias: 200,
                proteinas: 5,
                carbohidratos: 30,
                grasas: 8,
              }
            : tipoAccion === 'ajustar-macros'
            ? { calorias: 200, proteinas: 10 }
            : {},
      };

      const datosRegla = {
        dietistaId: user.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        activa: true,
        condicion,
        accion,
        frecuencia,
        aplicarATodas,
        dietaIds: aplicarATodas ? undefined : dietaIdsSeleccionadas,
        requiereConfirmacion: false,
        notificarDietista: false,
        patronRecurrencia:
          frecuencia === 'recurrente'
            ? {
                tipo: 'semanal' as const,
                dias: diasSeleccionados,
              }
            : undefined,
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
      title={regla ? 'Editar Regla Personalizada' : 'Nueva Regla Personalizada'}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Postre en día libre"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            placeholder="Descripción opcional"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condición (Si)
            </label>
            <select
              value={tipoCondicion}
              onChange={(e) => setTipoCondicion(e.target.value as TipoCondicionRegla)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tiposCondicion.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acción (Entonces)
            </label>
            <select
              value={tipoAccion}
              onChange={(e) => setTipoAccion(e.target.value as TipoAccionRegla)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tiposAccion.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tipoCondicion === 'dia-semana' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de la semana
            </label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((dia) => (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => {
                    if (diasSeleccionados.includes(dia.id)) {
                      setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia.id));
                    } else {
                      setDiasSeleccionados([...diasSeleccionados, dia.id]);
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    diasSeleccionados.includes(dia.id)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dia.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frecuencia de ejecución
          </label>
          <select
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value as FrecuenciaEjecucion)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {frecuencias.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={aplicarATodas}
              onChange={(e) => setAplicarATodas(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Aplicar a todas las dietas
            </span>
          </label>
        </div>

        {!aplicarATodas && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar dietas
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {dietas.map((dieta) => (
                <label key={dieta.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={dietaIdsSeleccionadas.includes(dieta.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDietaIdsSeleccionadas([...dietaIdsSeleccionadas, dieta.id]);
                      } else {
                        setDietaIdsSeleccionadas(dietaIdsSeleccionadas.filter(id => id !== dieta.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{dieta.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} disabled={guardando || !nombre.trim()}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

