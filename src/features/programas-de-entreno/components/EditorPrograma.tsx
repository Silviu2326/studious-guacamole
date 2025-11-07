import { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';
import { FileEdit, Plus, Trash2, Save } from 'lucide-react';
import * as programasApi from '../api/programas';
import * as categoriasApi from '../api/categorias';
import { useAuth } from '../../../context/AuthContext';

export function EditorPrograma() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [programa, setPrograma] = useState<Partial<programasApi.Programa>>({
    nombre: '',
    descripcion: '',
    tipo: isEntrenador ? 'personalizado' : 'grupal',
    categoria: '',
    ejercicios: [],
    activo: true,
    creadoPor: user?.id || '',
  });
  const [categorias, setCategorias] = useState<categoriasApi.Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState<Partial<programasApi.EjercicioPrograma>>({
    nombre: '',
    series: 3,
    repeticiones: '10-12',
    peso: undefined,
    descanso: 60,
    orden: 0,
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const cats = await categoriasApi.getCategorias(programa.tipo);
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  };

  const handleGuardar = async () => {
    if (!programa.nombre || !programa.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...programa,
        ejercicios: programa.ejercicios?.map((e, index) => ({
          ...e,
          orden: index,
        })) || [],
      } as any;

      let result;
      if (programa.id) {
        result = await programasApi.actualizarPrograma(programa.id, data);
        if (result) {
          alert('Programa actualizado correctamente');
        }
      } else {
        result = await programasApi.crearPrograma(data);
        if (result) {
          alert('Programa creado correctamente');
          setPrograma({ ...programa, id: result.id });
        }
      }
    } catch (error) {
      console.error('Error saving programa:', error);
      alert('Error al guardar el programa');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarEjercicio = () => {
    if (!nuevoEjercicio.nombre) {
      alert('Por favor ingresa el nombre del ejercicio');
      return;
    }

    const ejercicio: programasApi.EjercicioPrograma = {
      ejercicioId: `ej-${Date.now()}`,
      nombre: nuevoEjercicio.nombre || '',
      series: nuevoEjercicio.series || 3,
      repeticiones: nuevoEjercicio.repeticiones || '10-12',
      peso: nuevoEjercicio.peso,
      descanso: nuevoEjercicio.descanso || 60,
      notas: nuevoEjercicio.notas,
      orden: programa.ejercicios?.length || 0,
    };

    setPrograma({
      ...programa,
      ejercicios: [...(programa.ejercicios || []), ejercicio],
    });

    setNuevoEjercicio({
      nombre: '',
      series: 3,
      repeticiones: '10-12',
      peso: undefined,
      descanso: 60,
      orden: 0,
    });
  };

  const handleEliminarEjercicio = (index: number) => {
    const nuevos = programa.ejercicios?.filter((_, i) => i !== index) || [];
    setPrograma({ ...programa, ejercicios: nuevos });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleGuardar} iconLeft={Save} loading={loading}>
          Guardar Programa
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="space-y-4 p-4">
          <Input
            label="Nombre del Programa"
            value={programa.nombre || ''}
            onChange={(e) => setPrograma({ ...programa, nombre: e.target.value })}
            placeholder="Ej: Rutina de fuerza para Carla"
            required
          />

          <Textarea
            label="Descripción"
            value={programa.descripcion || ''}
            onChange={(e) => setPrograma({ ...programa, descripcion: e.target.value })}
            placeholder="Describe los objetivos y características del programa"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={programa.categoria || ''}
              onChange={(v) => setPrograma({ ...programa, categoria: v })}
              options={[
                { label: 'Selecciona una categoría', value: '' },
                ...categorias.map((c) => ({ label: c.nombre, value: c.id })),
              ]}
            />

            <Input
              label="Duración (semanas)"
              type="number"
              value={programa.duracionSemanas?.toString() || ''}
              onChange={(e) =>
                setPrograma({ ...programa, duracionSemanas: parseInt(e.target.value) || undefined })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={programa.activo}
              onChange={(e) => setPrograma({ ...programa, activo: e.target.checked })}
            />
            <label htmlFor="activo" className="text-sm text-gray-700">
              Programa activo
            </label>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Ejercicios del Programa</h3>

          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Agregar Nuevo Ejercicio</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nombre"
              value={nuevoEjercicio.nombre || ''}
              onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value })}
              placeholder="Ej: Press banca"
            />
            <Input
              label="Series"
              type="number"
              value={nuevoEjercicio.series?.toString() || '3'}
              onChange={(e) =>
                setNuevoEjercicio({ ...nuevoEjercicio, series: parseInt(e.target.value) || 3 })
              }
            />
            <Input
              label="Repeticiones"
              value={nuevoEjercicio.repeticiones || '10-12'}
              onChange={(e) => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: e.target.value })}
              placeholder="Ej: 10-12"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Peso (kg) - opcional"
              type="number"
              value={nuevoEjercicio.peso?.toString() || ''}
              onChange={(e) =>
                setNuevoEjercicio({
                  ...nuevoEjercicio,
                  peso: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
            <Input
              label="Descanso (segundos)"
              type="number"
              value={nuevoEjercicio.descanso?.toString() || '60'}
              onChange={(e) =>
                setNuevoEjercicio({ ...nuevoEjercicio, descanso: parseInt(e.target.value) || 60 })
              }
            />
          </div>
          <Button onClick={handleAgregarEjercicio} iconLeft={Plus}>
            Agregar Ejercicio
          </Button>
        </div>

            <div className="space-y-3">
              {programa.ejercicios && programa.ejercicios.length > 0 ? (
                programa.ejercicios.map((ejercicio, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl ring-1 ring-slate-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{ejercicio.nombre}</div>
                      <div className="text-sm text-slate-600">
                        {ejercicio.series} series x {ejercicio.repeticiones}
                        {ejercicio.peso && ` @ ${ejercicio.peso}kg`}
                        {ejercicio.descanso && ` - Descanso: ${ejercicio.descanso}s`}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEliminarEjercicio(index)}
                      iconLeft={Trash2}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-600">
                    No hay ejercicios agregados. Agrega ejercicios para completar el programa.
                  </p>
                </div>
              )}
            </div>
          </div>
      </Card>
    </div>
  );
}

