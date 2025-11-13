import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input, Badge } from '../../../components/componentsreutilizables';
import {
  X,
  Plus,
  Search,
  Check,
  ChefHat,
  Trash2,
  Save,
  Package,
  AlertTriangle,
} from 'lucide-react';
import {
  DatosBloquePersonalizado,
  RecursoBiblioteca,
  MacrosNutricionales,
  Alergeno,
  EstiloCulinario,
} from '../types';
import { crearBloquePersonalizado, actualizarBloquePersonalizado } from '../api/recursos';
import { getRecetas } from '../../recetario-comidas-guardadas/api/recetas';
import { Receta } from '../../recetario-comidas-guardadas/types';

interface EditorBloquePersonalizadoProps {
  isOpen: boolean;
  onClose: () => void;
  bloqueExistente?: RecursoBiblioteca;
  onGuardar?: (bloque: RecursoBiblioteca) => void;
}

const alergenoLabels: Record<Alergeno, string> = {
  gluten: 'Gluten',
  lactosa: 'Lactosa',
  huevos: 'Huevos',
  pescado: 'Pescado',
  mariscos: 'Mariscos',
  'frutos-secos': 'Frutos secos',
  cacahuetes: 'Cacahuetes',
  soja: 'Soja',
  sesamo: 'Sésamo',
  apio: 'Apio',
  mostaza: 'Mostaza',
  altramuces: 'Altramuces',
  moluscos: 'Moluscos',
  sulfitos: 'Sulfitos',
};

const estiloLabels: Record<EstiloCulinario, string> = {
  mediterraneo: 'Mediterráneo',
  asiatico: 'Asiático',
  mexicano: 'Mexicano',
  italiano: 'Italiano',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  keto: 'Keto',
  paleo: 'Paleo',
  'low-carb': 'Low Carb',
  'alto-proteina': 'Alto en Proteína',
  'sin-gluten': 'Sin Gluten',
  'sin-lactosa': 'Sin Lactosa',
  otro: 'Otro',
};

export const EditorBloquePersonalizado: React.FC<EditorBloquePersonalizadoProps> = ({
  isOpen,
  onClose,
  bloqueExistente,
  onGuardar,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [recetasSeleccionadas, setRecetasSeleccionadas] = useState<string[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [busquedaRecetas, setBusquedaRecetas] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [alergenos, setAlergenos] = useState<Alergeno[]>([]);
  const [estilosCulinarios, setEstilosCulinarios] = useState<EstiloCulinario[]>([]);
  const [costeEstimado, setCosteEstimado] = useState<number>(0);
  const [guardando, setGuardando] = useState(false);

  // Cargar recetas disponibles
  useEffect(() => {
    if (isOpen) {
      cargarRecetas();
    }
  }, [isOpen]);

  // Cargar datos del bloque existente si se está editando
  useEffect(() => {
    if (bloqueExistente && isOpen) {
      setNombre(bloqueExistente.nombre);
      setDescripcion(bloqueExistente.descripcion || '');
      setRecetasSeleccionadas(bloqueExistente.recetas || []);
      setTags(bloqueExistente.tags || []);
      setAlergenos(bloqueExistente.alergenos || []);
      setEstilosCulinarios(bloqueExistente.estiloCulinario || []);
      setCosteEstimado(bloqueExistente.costeEstimado || 0);
    } else if (isOpen) {
      // Resetear formulario para nuevo bloque
      setNombre('');
      setDescripcion('');
      setRecetasSeleccionadas([]);
      setTags([]);
      setAlergenos([]);
      setEstilosCulinarios([]);
      setCosteEstimado(0);
    }
  }, [bloqueExistente, isOpen]);

  const cargarRecetas = async () => {
    try {
      const data = await getRecetas();
      setRecetas(data);
    } catch (error) {
      console.error('Error cargando recetas:', error);
    }
  };

  // Filtrar recetas según búsqueda
  const recetasFiltradas = useMemo(() => {
    if (!busquedaRecetas) return recetas;

    const busqueda = busquedaRecetas.toLowerCase();
    return recetas.filter(
      (r) =>
        r.nombre.toLowerCase().includes(busqueda) ||
        r.descripcion?.toLowerCase().includes(busqueda) ||
        r.tags?.some((tag) => tag.toLowerCase().includes(busqueda))
    );
  }, [recetas, busquedaRecetas]);

  // Calcular macros totales de las recetas seleccionadas
  const macrosCalculados = useMemo((): MacrosNutricionales => {
    const recetasSeleccionadasData = recetas.filter((r) =>
      recetasSeleccionadas.includes(r.id)
    );

    return recetasSeleccionadasData.reduce(
      (acc, receta) => {
        return {
          calorias: acc.calorias + receta.caloriasPorPorcion,
          proteinas: acc.proteinas + receta.valorNutricional.proteinas,
          carbohidratos: acc.carbohidratos + receta.valorNutricional.carbohidratos,
          grasas: acc.grasas + receta.valorNutricional.grasas,
        };
      },
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  }, [recetas, recetasSeleccionadas]);

  // Calcular alérgenos únicos de las recetas seleccionadas
  const alergenosCalculados = useMemo(() => {
    // En producción, esto vendría de los datos de las recetas
    // Por ahora, retornamos los alérgenos seleccionados manualmente
    return alergenos;
  }, [alergenos]);

  const toggleReceta = (recetaId: string) => {
    setRecetasSeleccionadas((prev) =>
      prev.includes(recetaId)
        ? prev.filter((id) => id !== recetaId)
        : [...prev, recetaId]
    );
  };

  const agregarTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const eliminarTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleAlergeno = (alergeno: Alergeno) => {
    setAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((a) => a !== alergeno)
        : [...prev, alergeno]
    );
  };

  const toggleEstiloCulinario = (estilo: EstiloCulinario) => {
    setEstilosCulinarios((prev) =>
      prev.includes(estilo)
        ? prev.filter((e) => e !== estilo)
        : [...prev, estilo]
    );
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (recetasSeleccionadas.length === 0) {
      alert('Debes seleccionar al menos una receta');
      return;
    }

    setGuardando(true);
    try {
      const datos: DatosBloquePersonalizado = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        recetas: recetasSeleccionadas,
        macros: macrosCalculados,
        alergenos: alergenosCalculados.length > 0 ? alergenosCalculados : undefined,
        costeEstimado: costeEstimado > 0 ? costeEstimado : undefined,
        tags: tags.length > 0 ? tags : undefined,
        estiloCulinario: estilosCulinarios.length > 0 ? estilosCulinarios : undefined,
      };

      let bloqueGuardado: RecursoBiblioteca;
      if (bloqueExistente) {
        const actualizado = await actualizarBloquePersonalizado(bloqueExistente.id, datos);
        if (!actualizado) {
          throw new Error('Error actualizando bloque');
        }
        bloqueGuardado = actualizado;
      } else {
        bloqueGuardado = await crearBloquePersonalizado(datos);
      }

      if (onGuardar) {
        onGuardar(bloqueGuardado);
      }

      onClose();
    } catch (error) {
      console.error('Error guardando bloque:', error);
      alert('Error guardando el bloque. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const recetasSeleccionadasData = recetas.filter((r) =>
    recetasSeleccionadas.includes(r.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bloqueExistente ? 'Editar Bloque Personalizado' : 'Crear Bloque Personalizado'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Nombre y descripción */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre del bloque *
            </label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Desayuno completo 600 kcal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional del bloque"
            />
          </div>
        </div>

        {/* Selección de recetas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Recetas ({recetasSeleccionadas.length} seleccionadas) *
          </label>
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                value={busquedaRecetas}
                onChange={(e) => setBusquedaRecetas(e.target.value)}
                placeholder="Buscar recetas..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg p-3 max-h-60 overflow-y-auto">
            {recetasFiltradas.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-4">
                No se encontraron recetas
              </div>
            ) : (
              <div className="space-y-2">
                {recetasFiltradas.map((receta) => {
                  const seleccionada = recetasSeleccionadas.includes(receta.id);
                  return (
                    <div
                      key={receta.id}
                      onClick={() => toggleReceta(receta.id)}
                      className={`
                        flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                        ${seleccionada
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                        }
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center
                              ${seleccionada
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-slate-300'
                              }
                            `}
                          >
                            {seleccionada && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {receta.nombre}
                            </div>
                            <div className="text-xs text-slate-500">
                              {receta.caloriasPorPorcion} kcal · P: {receta.valorNutricional.proteinas}g · C: {receta.valorNutricional.carbohidratos}g · G: {receta.valorNutricional.grasas}g
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Macros calculados */}
        {recetasSeleccionadas.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Macros Totales (calculados automáticamente)
            </label>
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Calorías
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {macrosCalculados.calorias.toFixed(0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Proteínas
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {macrosCalculados.proteinas.toFixed(1)}g
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Carbohidratos
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {macrosCalculados.carbohidratos.toFixed(1)}g
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Grasas
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {macrosCalculados.grasas.toFixed(1)}g
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recetas seleccionadas */}
        {recetasSeleccionadasData.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recetas incluidas
            </label>
            <div className="flex flex-wrap gap-2">
              {recetasSeleccionadasData.map((receta) => (
                <Badge
                  key={receta.id}
                  className="bg-blue-100 text-blue-700 flex items-center gap-1"
                >
                  <ChefHat className="h-3 w-3" />
                  {receta.nombre}
                  <button
                    onClick={() => toggleReceta(receta.id)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Alérgenos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alérgenos
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(alergenoLabels) as Alergeno[]).map((alergeno) => {
              const seleccionado = alergenos.includes(alergeno);
              return (
                <button
                  key={alergeno}
                  onClick={() => toggleAlergeno(alergeno)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${seleccionado
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }
                  `}
                >
                  {alergenoLabels[alergeno]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estilos culinarios */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estilos culinarios
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(estiloLabels) as EstiloCulinario[]).map((estilo) => {
              const seleccionado = estilosCulinarios.includes(estilo);
              return (
                <button
                  key={estilo}
                  onClick={() => toggleEstiloCulinario(estilo)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${seleccionado
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }
                  `}
                >
                  {estiloLabels[estilo]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  agregarTag();
                }
              }}
              placeholder="Agregar tag..."
              className="flex-1"
            />
            <Button onClick={agregarTag} leftIcon={<Plus className="h-4 w-4" />}>
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-slate-100 text-slate-700 flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => eliminarTag(tag)}
                  className="hover:text-slate-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Coste estimado */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Coste estimado (€)
          </label>
          <Input
            type="number"
            value={costeEstimado || ''}
            onChange={(e) => setCosteEstimado(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose} disabled={guardando}>
            Cancelar
          </Button>
          <Button
            onClick={handleGuardar}
            disabled={guardando || !nombre.trim() || recetasSeleccionadas.length === 0}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {guardando ? 'Guardando...' : bloqueExistente ? 'Actualizar' : 'Crear Bloque'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

