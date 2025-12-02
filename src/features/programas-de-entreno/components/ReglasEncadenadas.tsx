/**
 * Componente para gestionar reglas encadenadas con condicionales
 * User Story: Como coach quiero definir reglas encadenadas con condicionales (si/entonces, y/o, limite),
 * para modificar duración, intensidad, modalidad o notas según múltiples factores.
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Button, Card, Input, Select, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  obtenerReglasEncadenadas,
  crearReglaEncadenada,
  actualizarReglaEncadenada,
  eliminarReglaEncadenada,
} from '../utils/chainedRules';
import type {
  ReglaEncadenada,
  CondicionAvanzada,
  AccionModificacion,
  TipoCondicionAvanzada,
  OperadorComparacion,
  TipoModificacion,
  TipoAccionModificacion,
  OperadorLogico,
} from '../types';

export function ReglasEncadenadas() {
  const [reglas, setReglas] = useState<ReglaEncadenada[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaEncadenada | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarReglas();
  }, []);

  const cargarReglas = () => {
    const reglasCargadas = obtenerReglasEncadenadas();
    setReglas(reglasCargadas);
  };

  const handleNuevaRegla = () => {
    setReglaEditando(null);
    setMostrarModal(true);
  };

  const handleEditarRegla = (regla: ReglaEncadenada) => {
    setReglaEditando(regla);
    setMostrarModal(true);
  };

  const handleEliminarRegla = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;

    const exito = eliminarReglaEncadenada(id);
    if (exito) {
      cargarReglas();
    }
  };

  const handleToggleActiva = async (regla: ReglaEncadenada) => {
    const actualizada = actualizarReglaEncadenada(regla.id, {
      activa: !regla.activa,
    });
    if (actualizada) {
      cargarReglas();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reglas Encadenadas</h2>
          <p className="text-gray-600 mt-1">
            Define reglas con condicionales (si/entonces, y/o, límites) para modificar automáticamente
            duración, intensidad, modalidad o notas según múltiples factores.
          </p>
        </div>
        <Button onClick={handleNuevaRegla} className="flex items-center gap-2">
          <Plus size={18} />
          Nueva Regla
        </Button>
      </div>

      {reglas.length === 0 ? (
        <Card className="p-12 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay reglas encadenadas
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera regla para automatizar modificaciones en los programas de entrenamiento.
          </p>
          <Button onClick={handleNuevaRegla}>Crear Primera Regla</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reglas.map((regla) => (
            <Card key={regla.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{regla.nombre}</h3>
                    <Badge
                      variant={regla.activa ? 'success' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {regla.activa ? (
                        <>
                          <CheckCircle2 size={14} />
                          Activa
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} />
                          Inactiva
                        </>
                      )}
                    </Badge>
                    <Badge variant="info">Prioridad: {regla.prioridad}</Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{regla.descripcion}</p>

                  {/* Condiciones */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Condiciones:</h4>
                    <div className="space-y-2">
                      {regla.condiciones.map((condicion, index) => (
                        <div key={condicion.id} className="flex items-center gap-2 text-sm">
                          {index > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {condicion.operadorLogico || 'AND'}
                            </Badge>
                          )}
                          <span className="text-gray-700">
                            <strong>{formatearTipoCondicion(condicion.tipo)}</strong>{' '}
                            {formatearOperador(condicion.operador)}{' '}
                            <strong>{condicion.valor}</strong>
                            {condicion.valor2 !== undefined && (
                              <> y {condicion.valor2}</>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Acciones:</h4>
                    <div className="space-y-2">
                      {regla.acciones.map((accion, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <ArrowRight size={14} className="text-gray-400" />
                          <strong>{formatearTipoModificacion(accion.tipo)}</strong>:{' '}
                          {formatearAccionModificacion(accion)}
                          {accion.limites && (
                            <span className="text-gray-500 text-xs ml-2">
                              (Límites: {accion.limites.minimo || 'sin mínimo'} -{' '}
                              {accion.limites.maximo || 'sin máximo'})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActiva(regla)}
                  >
                    {regla.activa ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarRegla(regla)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEliminarRegla(regla.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {mostrarModal && (
        <FormularioRegla
          regla={reglaEditando}
          onClose={() => {
            setMostrarModal(false);
            setReglaEditando(null);
          }}
          onGuardar={() => {
            cargarReglas();
            setMostrarModal(false);
            setReglaEditando(null);
          }}
        />
      )}
    </div>
  );
}

function FormularioRegla({
  regla,
  onClose,
  onGuardar,
}: {
  regla: ReglaEncadenada | null;
  onClose: () => void;
  onGuardar: () => void;
}) {
  const [nombre, setNombre] = useState(regla?.nombre || '');
  const [descripcion, setDescripcion] = useState(regla?.descripcion || '');
  const [activa, setActiva] = useState(regla?.activa ?? true);
  const [prioridad, setPrioridad] = useState(regla?.prioridad || 5);
  const [condiciones, setCondiciones] = useState<CondicionAvanzada[]>(
    regla?.condiciones || []
  );
  const [acciones, setAcciones] = useState<AccionModificacion[]>(regla?.acciones || []);
  const [guardando, setGuardando] = useState(false);

  const handleAgregarCondicion = () => {
    const nuevaCondicion: CondicionAvanzada = {
      id: `cond-${Date.now()}`,
      tipo: 'patron',
      operador: 'contiene',
      valor: '',
    };
    setCondiciones([...condiciones, nuevaCondicion]);
  };

  const handleActualizarCondicion = (
    id: string,
    actualizaciones: Partial<CondicionAvanzada>
  ) => {
    setCondiciones(
      condiciones.map((c) => (c.id === id ? { ...c, ...actualizaciones } : c))
    );
  };

  const handleEliminarCondicion = (id: string) => {
    setCondiciones(condiciones.filter((c) => c.id !== id));
  };

  const handleAgregarAccion = () => {
    const nuevaAccion: AccionModificacion = {
      tipo: 'duracion',
      accion: 'establecer',
      valor: '',
    };
    setAcciones([...acciones, nuevaAccion]);
  };

  const handleActualizarAccion = (index: number, actualizaciones: Partial<AccionModificacion>) => {
    setAcciones(
      acciones.map((a, i) => (i === index ? { ...a, ...actualizaciones } : a))
    );
  };

  const handleEliminarAccion = (index: number) => {
    setAcciones(acciones.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (condiciones.length === 0) {
      alert('Debes agregar al menos una condición');
      return;
    }
    if (acciones.length === 0) {
      alert('Debes agregar al menos una acción');
      return;
    }

    setGuardando(true);
    try {
      const datosRegla = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        activa,
        prioridad,
        condiciones,
        acciones,
        programaId: regla?.programaId,
        clienteId: regla?.clienteId,
      };

      if (regla) {
        actualizarReglaEncadenada(regla.id, datosRegla);
      } else {
        crearReglaEncadenada(datosRegla);
      }

      onGuardar();
    } catch (error) {
      console.error('Error guardando regla:', error);
      alert('Error al guardar la regla');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={regla ? 'Editar Regla Encadenada' : 'Nueva Regla Encadenada'}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Reducir intensidad en días de fatiga"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué hace esta regla"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad (1-10)
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={prioridad}
              onChange={(e) => setPrioridad(parseInt(e.target.value) || 5)}
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activa}
                onChange={(e) => setActiva(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Activa</span>
            </label>
          </div>
        </div>

        {/* Condiciones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Condiciones *
            </label>
            <Button size="sm" variant="outline" onClick={handleAgregarCondicion}>
              <Plus size={14} className="mr-1" />
              Agregar Condición
            </Button>
          </div>
          <div className="space-y-3">
            {condiciones.map((condicion, index) => (
              <Card key={condicion.id} className="p-4">
                <div className="grid grid-cols-12 gap-2 items-end">
                  {index > 0 && (
                    <div className="col-span-12 mb-2">
                      <Select
                        value={condiciones[index - 1].operadorLogico || 'AND'}
                        onChange={(e) =>
                          handleActualizarCondicion(condiciones[index - 1].id, {
                            operadorLogico: e.target.value as OperadorLogico,
                          })
                        }
                        options={[
                          { value: 'AND', label: 'Y (AND)' },
                          { value: 'OR', label: 'O (OR)' },
                        ]}
                      />
                    </div>
                  )}
                  <div className="col-span-4">
                    <Select
                      label="Tipo"
                      value={condicion.tipo}
                      onChange={(e) =>
                        handleActualizarCondicion(condicion.id, {
                          tipo: e.target.value as TipoCondicionAvanzada,
                        })
                      }
                      options={[
                        { value: 'lesion', label: 'Lesión' },
                        { value: 'patron', label: 'Patrón' },
                        { value: 'modalidad', label: 'Modalidad' },
                        { value: 'intensidad', label: 'Intensidad' },
                        { value: 'duracion', label: 'Duración' },
                        { value: 'equipamiento', label: 'Equipamiento' },
                        { value: 'tag', label: 'Tag' },
                        { value: 'peso_cliente', label: 'Peso Cliente' },
                        { value: 'imc', label: 'IMC' },
                        { value: 'adherencia', label: 'Adherencia' },
                        { value: 'progreso', label: 'Progreso' },
                        { value: 'dias_semana', label: 'Día Semana' },
                        { value: 'hora_dia', label: 'Hora Día' },
                      ]}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      label="Operador"
                      value={condicion.operador}
                      onChange={(e) =>
                        handleActualizarCondicion(condicion.id, {
                          operador: e.target.value as OperadorComparacion,
                        })
                      }
                      options={[
                        { value: 'contiene', label: 'Contiene' },
                        { value: 'igual', label: 'Igual' },
                        { value: 'no_contiene', label: 'No contiene' },
                        { value: 'mayor_que', label: 'Mayor que' },
                        { value: 'menor_que', label: 'Menor que' },
                        { value: 'mayor_igual', label: 'Mayor o igual' },
                        { value: 'menor_igual', label: 'Menor o igual' },
                        { value: 'entre', label: 'Entre' },
                        { value: 'tiene_tag', label: 'Tiene tag' },
                        { value: 'no_tiene_tag', label: 'No tiene tag' },
                      ]}
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      label="Valor"
                      type={condicion.tipo.includes('peso') || condicion.tipo.includes('imc') || condicion.tipo.includes('adherencia') || condicion.tipo.includes('progreso') || condicion.tipo === 'duracion' ? 'number' : 'text'}
                      value={condicion.valor}
                      onChange={(e) =>
                        handleActualizarCondicion(condicion.id, {
                          valor:
                            condicion.tipo.includes('peso') ||
                            condicion.tipo.includes('imc') ||
                            condicion.tipo.includes('adherencia') ||
                            condicion.tipo.includes('progreso') ||
                            condicion.tipo === 'duracion'
                              ? parseFloat(e.target.value) || 0
                              : e.target.value,
                        })
                      }
                      placeholder="Valor a comparar"
                    />
                  </div>
                  {condicion.operador === 'entre' && (
                    <div className="col-span-4">
                      <Input
                        label="Valor 2"
                        type="number"
                        value={condicion.valor2 || ''}
                        onChange={(e) =>
                          handleActualizarCondicion(condicion.id, {
                            valor2: parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="Valor máximo"
                      />
                    </div>
                  )}
                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminarCondicion(condicion.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Acciones *
            </label>
            <Button size="sm" variant="outline" onClick={handleAgregarAccion}>
              <Plus size={14} className="mr-1" />
              Agregar Acción
            </Button>
          </div>
          <div className="space-y-3">
            {acciones.map((accion, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Select
                      label="Modificar"
                      value={accion.tipo}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          tipo: e.target.value as TipoModificacion,
                        })
                      }
                      options={[
                        { value: 'duracion', label: 'Duración' },
                        { value: 'intensidad', label: 'Intensidad' },
                        { value: 'modalidad', label: 'Modalidad' },
                        { value: 'notas', label: 'Notas' },
                      ]}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      label="Acción"
                      value={accion.accion}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          accion: e.target.value as TipoAccionModificacion,
                        })
                      }
                      options={[
                        { value: 'establecer', label: 'Establecer' },
                        { value: 'aumentar', label: 'Aumentar' },
                        { value: 'disminuir', label: 'Disminuir' },
                        { value: 'multiplicar', label: 'Multiplicar' },
                        { value: 'limitar', label: 'Limitar' },
                      ]}
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      label="Valor"
                      type={accion.tipo === 'duracion' ? 'number' : 'text'}
                      value={accion.valor}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          valor:
                            accion.tipo === 'duracion'
                              ? parseFloat(e.target.value) || 0
                              : e.target.value,
                        })
                      }
                      placeholder={
                        accion.accion === 'establecer'
                          ? 'Valor a establecer'
                          : accion.accion === 'aumentar' || accion.accion === 'disminuir'
                          ? 'Cantidad'
                          : accion.accion === 'multiplicar'
                          ? 'Factor (ej: 1.2)'
                          : ''
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminarAccion(index)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  {(accion.accion === 'aumentar' ||
                    accion.accion === 'disminuir' ||
                    accion.accion === 'multiplicar' ||
                    accion.accion === 'limitar') && (
                    <div className="col-span-12 grid grid-cols-2 gap-2 mt-2">
                      <Input
                        label="Mínimo"
                        type={accion.tipo === 'duracion' ? 'number' : 'text'}
                        value={accion.limites?.minimo || ''}
                        onChange={(e) =>
                          handleActualizarAccion(index, {
                            limites: {
                              ...accion.limites,
                              tipo: accion.tipo,
                              minimo:
                                accion.tipo === 'duracion'
                                  ? parseFloat(e.target.value) || undefined
                                  : e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Sin mínimo"
                      />
                      <Input
                        label="Máximo"
                        type={accion.tipo === 'duracion' ? 'number' : 'text'}
                        value={accion.limites?.maximo || ''}
                        onChange={(e) =>
                          handleActualizarAccion(index, {
                            limites: {
                              ...accion.limites,
                              tipo: accion.tipo,
                              maximo:
                                accion.tipo === 'duracion'
                                  ? parseFloat(e.target.value) || undefined
                                  : e.target.value || undefined,
                            },
                          })
                        }
                        placeholder="Sin máximo"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando}>
            <Save size={16} className="mr-2" />
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function formatearTipoCondicion(tipo: TipoCondicionAvanzada): string {
  const map: Record<TipoCondicionAvanzada, string> = {
    lesion: 'Lesión',
    patron: 'Patrón',
    modalidad: 'Modalidad',
    intensidad: 'Intensidad',
    duracion: 'Duración',
    equipamiento: 'Equipamiento',
    tag: 'Tag',
    peso_cliente: 'Peso Cliente',
    imc: 'IMC',
    adherencia: 'Adherencia',
    progreso: 'Progreso',
    dias_semana: 'Día Semana',
    hora_dia: 'Hora Día',
  };
  return map[tipo] || tipo;
}

function formatearOperador(operador: OperadorComparacion): string {
  const map: Record<OperadorComparacion, string> = {
    contiene: 'contiene',
    igual: 'es igual a',
    no_contiene: 'no contiene',
    mayor_que: 'es mayor que',
    menor_que: 'es menor que',
    mayor_igual: 'es mayor o igual a',
    menor_igual: 'es menor o igual a',
    entre: 'está entre',
    tiene_tag: 'tiene tag',
    no_tiene_tag: 'no tiene tag',
  };
  return map[operador] || operador;
}

function formatearTipoModificacion(tipo: TipoModificacion): string {
  const map: Record<TipoModificacion, string> = {
    duracion: 'Duración',
    intensidad: 'Intensidad',
    modalidad: 'Modalidad',
    notas: 'Notas',
  };
  return map[tipo] || tipo;
}

function formatearAccionModificacion(accion: AccionModificacion): string {
  const tipo = formatearTipoModificacion(accion.tipo);
  const map: Record<TipoAccionModificacion, string> = {
    establecer: `Establecer a ${accion.valor}`,
    aumentar: `Aumentar en ${accion.valor}`,
    disminuir: `Disminuir en ${accion.valor}`,
    multiplicar: `Multiplicar por ${accion.valor}`,
    limitar: 'Limitar',
  };
  return `${tipo}: ${map[accion.accion] || accion.accion}`;
}

