import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  Sparkles,
  Settings,
  Play,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import type {
  Dieta,
  ReglaBalanceoMacros,
  ResultadoBalanceoMacros,
  AlcanceBalanceo,
} from '../types';
import {
  getReglasBalanceo,
  crearReglaBalanceo,
  actualizarReglaBalanceo,
  eliminarReglaBalanceo,
  equilibrarMacrosIA,
} from '../api/balanceoMacros';
import { getDieta } from '../api';
import { useAuth } from '../../../context/AuthContext';

interface BalanceoMacrosIAProps {
  dieta: Dieta;
  onDietaActualizada?: (dieta: Dieta) => void;
}

const diasSemana = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
];

export const BalanceoMacrosIA: React.FC<BalanceoMacrosIAProps> = ({
  dieta,
  onDietaActualizada,
}) => {
  const { user } = useAuth();
  const [reglas, setReglas] = useState<ReglaBalanceoMacros[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarReglas, setMostrarReglas] = useState(false);
  const [mostrarEditorRegla, setMostrarEditorRegla] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaBalanceoMacros | null>(null);
  const [alcance, setAlcance] = useState<AlcanceBalanceo>('semana');
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('lunes');
  const [resultado, setResultado] = useState<ResultadoBalanceoMacros | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    if (user?.id) {
      cargarReglas();
    }
  }, [user?.id]);

  const cargarReglas = async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const reglasCargadas = await getReglasBalanceo(user.id);
      setReglas(reglasCargadas);
    } catch (error) {
      console.error('Error cargando reglas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEquilibrar = async () => {
    if (!user?.id) return;
    setCargando(true);
    setResultado(null);
    try {
      const resultadoBalanceo = await equilibrarMacrosIA(
        dieta.id,
        alcance,
        alcance === 'dia' ? diaSeleccionado : undefined
      );
      setResultado(resultadoBalanceo);
      setMostrarResultado(true);
      if (resultadoBalanceo.exito && onDietaActualizada) {
        // Recargar la dieta actualizada
        const dietaActualizada = await getDieta(dieta.id);
        if (dietaActualizada) {
          onDietaActualizada(dietaActualizada);
        }
      }
    } catch (error) {
      console.error('Error equilibrando macros:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearRegla = () => {
    setReglaEditando(null);
    setMostrarEditorRegla(true);
  };

  const handleEditarRegla = (regla: ReglaBalanceoMacros) => {
    setReglaEditando(regla);
    setMostrarEditorRegla(true);
  };

  const handleEliminarRegla = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;
    try {
      await eliminarReglaBalanceo(id);
      await cargarReglas();
    } catch (error) {
      console.error('Error eliminando regla:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold">Balanceo Automático de Macros con IA</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarReglas(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Reglas
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alcance del balanceo
            </label>
            <div className="flex gap-2">
              <Button
                variant={alcance === 'semana' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAlcance('semana')}
              >
                Semana completa
              </Button>
              <Button
                variant={alcance === 'dia' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAlcance('dia')}
              >
                Día específico
              </Button>
            </div>
          </div>

          {alcance === 'dia' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar día
              </label>
              <select
                value={diaSeleccionado}
                onChange={(e) => setDiaSeleccionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {diasSemana.map((dia) => (
                  <option key={dia.id} value={dia.id}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Reglas activas:</strong> {reglas.length} regla(s) se aplicarán al balancear
              los macros. Las reglas respetan límites mínimos y máximos de proteínas, carbohidratos,
              grasas, azúcares y calorías.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleEquilibrar}
            disabled={cargando || reglas.length === 0}
            className="w-full"
          >
            {cargando ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Equilibrando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Equilibrar Macros con IA
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Modal de reglas */}
      <Modal
        isOpen={mostrarReglas}
        onClose={() => setMostrarReglas(false)}
        title="Reglas de Balanceo de Macros"
        size="lg"
      >
        <div className="space-y-4">
          <Button variant="primary" size="sm" onClick={handleCrearRegla}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Regla
          </Button>

          {reglas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay reglas configuradas. Crea una regla para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reglas.map((regla) => (
                <Card key={regla.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{regla.nombre}</h4>
                      {regla.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">{regla.descripcion}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {regla.proteinaMinima && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            Proteína mín: {regla.proteinaMinima}g
                          </span>
                        )}
                        {regla.azucaresMaximos && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                            Azúcares máx: {regla.azucaresMaximos}g
                          </span>
                        )}
                        {regla.caloriasMinimas && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            Calorías mín: {regla.caloriasMinimas} kcal
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
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
        </div>
      </Modal>

      {/* Modal de resultado */}
      {resultado && (
        <Modal
          isOpen={mostrarResultado}
          onClose={() => setMostrarResultado(false)}
          title={resultado.exito ? 'Balanceo Completado' : 'Error en Balanceo'}
          size="lg"
        >
          <div className="space-y-4">
                {resultado.exito ? (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">{resultado.mensaje}</span>
                </div>

                {/* USER STORY 1: Explicación general del balanceo */}
                {resultado.explicacionGeneral && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Explicación del Balanceo
                    </h4>
                    <p className="text-sm text-blue-800">{resultado.explicacionGeneral}</p>
                  </div>
                )}

                {/* USER STORY 1: Explicaciones de las reglas aplicadas */}
                {resultado.explicacionesReglas && resultado.explicacionesReglas.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="font-semibold text-indigo-900 mb-3">Reglas Aplicadas y su Justificación</h4>
                    <div className="space-y-3">
                      {resultado.explicacionesReglas.map((explicacion, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-indigo-100">
                          <h5 className="font-medium text-indigo-900 mb-1">{explicacion.nombreRegla}</h5>
                          <p className="text-sm text-gray-700 mb-2">{explicacion.explicacion}</p>
                          <div className="bg-indigo-50 rounded p-2">
                            <p className="text-xs font-medium text-indigo-800 mb-1">Impacto Profesional:</p>
                            <p className="text-xs text-indigo-700">{explicacion.impacto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Macros Antes</h4>
                    <div className="text-sm space-y-1">
                      <p>Calorías: {resultado.macrosAntes.calorias} kcal</p>
                      <p>Proteínas: {resultado.macrosAntes.proteinas}g</p>
                      <p>Carbohidratos: {resultado.macrosAntes.carbohidratos}g</p>
                      <p>Grasas: {resultado.macrosAntes.grasas}g</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Macros Después</h4>
                    <div className="text-sm space-y-1">
                      <p>Calorías: {resultado.macrosDespues.calorias} kcal</p>
                      <p>Proteínas: {resultado.macrosDespues.proteinas}g</p>
                      <p>Carbohidratos: {resultado.macrosDespues.carbohidratos}g</p>
                      <p>Grasas: {resultado.macrosDespues.grasas}g</p>
                    </div>
                  </div>
                </div>

                {resultado.cambios.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Cambios Aplicados con Explicaciones</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {resultado.cambios.map((cambio, index) => (
                        <Card key={index} className="p-4 bg-gray-50">
                          <p className="font-medium text-sm mb-2">{cambio.nombreComida}</p>
                          
                          {/* USER STORY 1: Explicación general del cambio en esta comida */}
                          {cambio.explicacionGeneral && (
                            <div className="mb-3 p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-700 italic">{cambio.explicacionGeneral}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            {cambio.cambios.map((c, i) => (
                              <div key={i} className="bg-white rounded p-2 border border-gray-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-900 capitalize">
                                    {c.campo}:
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {c.valorAnterior} → {c.valorNuevo} (
                                    <span className={c.diferencia > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {c.diferencia > 0 ? '+' : ''}
                                      {c.diferencia}
                                    </span>
                                    )
                                  </span>
                                </div>
                                {/* USER STORY 1: Explicación detallada del ajuste */}
                                {c.explicacion && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                                    <p className="text-xs text-blue-800">{c.explicacion}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {resultado.advertencias && resultado.advertencias.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Advertencias</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                      {resultado.advertencias.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Tiempo de ejecución: {resultado.tiempoEjecucion}ms
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>{resultado.mensaje || 'Error al equilibrar macros'}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Editor de regla simplificado - se puede expandir más adelante */}
      {mostrarEditorRegla && (
        <EditorRegla
          regla={reglaEditando}
          onClose={() => {
            setMostrarEditorRegla(false);
            setReglaEditando(null);
          }}
          onGuardar={async () => {
            await cargarReglas();
            setMostrarEditorRegla(false);
            setReglaEditando(null);
          }}
        />
      )}
    </div>
  );
};

// Componente simplificado para editar reglas
interface EditorReglaProps {
  regla: ReglaBalanceoMacros | null;
  onClose: () => void;
  onGuardar: () => void;
}

const EditorRegla: React.FC<EditorReglaProps> = ({ regla, onClose, onGuardar }) => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(regla?.nombre || '');
  const [descripcion, setDescripcion] = useState(regla?.descripcion || '');
  const [proteinaMinima, setProteinaMinima] = useState(regla?.proteinaMinima?.toString() || '');
  const [azucaresMaximos, setAzucaresMaximos] = useState(regla?.azucaresMaximos?.toString() || '');
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!user?.id || !nombre.trim()) return;
    setGuardando(true);
    try {
      const datosRegla = {
        dietistaId: user.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        activa: true,
        proteinaMinima: proteinaMinima ? parseFloat(proteinaMinima) : undefined,
        azucaresMaximos: azucaresMaximos ? parseFloat(azucaresMaximos) : undefined,
        prioridadAjuste: ['proteinas', 'carbohidratos', 'grasas', 'calorias'] as const,
        aplicarATodos: true,
      };

      if (regla) {
        await actualizarReglaBalanceo(regla.id, datosRegla);
      } else {
        await crearReglaBalanceo(datosRegla);
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
      title={regla ? 'Editar Regla' : 'Nueva Regla'}
      size="md"
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
            placeholder="Ej: Proteína mínima diaria"
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
            placeholder="Descripción opcional de la regla"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proteína Mínima (g)
            </label>
            <input
              type="number"
              value={proteinaMinima}
              onChange={(e) => setProteinaMinima(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Azúcares Máximos (g)
            </label>
            <input
              type="number"
              value={azucaresMaximos}
              onChange={(e) => setAzucaresMaximos(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 50"
            />
          </div>
        </div>

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

