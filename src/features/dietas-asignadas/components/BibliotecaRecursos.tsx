import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { Search, Filter, Clock, ChefHat, Heart, GripVertical, FolderPlus, Eye, DollarSign, Leaf, Tag, TrendingUp } from 'lucide-react';
import {
  RecursoBiblioteca,
  FiltrosBiblioteca,
  TipoRecurso,
  EstiloCulinario,
  DragData,
  NivelAdherencia,
  NivelSatisfaccion,
} from '../types';
import { FiltrosAvanzadosBiblioteca } from './FiltrosAvanzadosBiblioteca';
import { GestionColecciones } from './GestionColecciones';
import { PreviewRecurso } from './PreviewRecurso';
import { ImportadorRecursos } from './ImportadorRecursos';
import { ConectorProveedoresExternos } from './ConectorProveedoresExternos';
import { EtiquetarAdherencia } from './EtiquetarAdherencia';
import { aplicarEtiquetasARecursos } from '../api/etiquetasAdherencia';

interface BibliotecaRecursosProps {
  recursos: RecursoBiblioteca[];
  filtros: FiltrosBiblioteca;
  onFiltrosChange: (filtros: FiltrosBiblioteca) => void;
  onRecursoDragStart: (recurso: RecursoBiblioteca, event: React.DragEvent) => void;
  tipoActivo?: TipoRecurso;
  onTipoChange?: (tipo: TipoRecurso) => void;
  cargando?: boolean;
  clienteId?: string; // ID del cliente para mostrar adherencia histórica
  clienteNombre?: string; // Nombre del cliente para mostrar en la previsualización
  onRecursoAgregado?: (recurso: RecursoBiblioteca) => void; // Callback cuando se agrega un recurso importado
}

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

export const BibliotecaRecursos: React.FC<BibliotecaRecursosProps> = ({
  recursos,
  filtros,
  onFiltrosChange,
  onRecursoDragStart,
  tipoActivo,
  onTipoChange,
  cargando = false,
  clienteId,
  clienteNombre,
  onRecursoAgregado,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [recursoSeleccionado, setRecursoSeleccionado] = useState<RecursoBiblioteca | null>(null);
  const [mostrarModalColecciones, setMostrarModalColecciones] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [recursoParaPreview, setRecursoParaPreview] = useState<RecursoBiblioteca | null>(null);
  const [mostrarEtiquetar, setMostrarEtiquetar] = useState(false);
  const [recursoParaEtiquetar, setRecursoParaEtiquetar] = useState<RecursoBiblioteca | null>(null);
  const [recursosConEtiquetas, setRecursosConEtiquetas] = useState<RecursoBiblioteca[]>([]);

  // Cargar etiquetas de adherencia/satisfacción
  useEffect(() => {
    const cargarEtiquetas = async () => {
      try {
        const recursosConEtiquetasAplicadas = await aplicarEtiquetasARecursos(recursos, clienteId);
        setRecursosConEtiquetas(recursosConEtiquetasAplicadas);
      } catch (error) {
        console.error('Error cargando etiquetas:', error);
        setRecursosConEtiquetas(recursos);
      }
    };
    cargarEtiquetas();
  }, [recursos, clienteId]);

  // Función para obtener el color del badge de adherencia
  const getNivelAdherenciaColor = (nivel?: NivelAdherencia) => {
    switch (nivel) {
      case 'excelente':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'muy-bueno':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'bueno':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'regular':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bajo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el color del badge de satisfacción
  const getNivelSatisfaccionColor = (nivel?: NivelSatisfaccion) => {
    switch (nivel) {
      case 'muy-alto':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alto':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'medio':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bajo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'muy-bajo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filtrar recursos según los filtros
  const recursosFiltrados = useMemo(() => {
    let resultados = recursosConEtiquetas.length > 0 ? recursosConEtiquetas : recursos;

    // Filtro por tipo de recurso
    if (tipoActivo) {
      resultados = resultados.filter((r) => r.tipo === tipoActivo);
    } else if (filtros.tiposRecurso && filtros.tiposRecurso.length > 0) {
      resultados = resultados.filter((r) => filtros.tiposRecurso!.includes(r.tipo));
    }

    // Filtro por búsqueda de texto
    const busqueda = filtros.busqueda || busquedaTexto;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultados = resultados.filter(
        (r) =>
          r.nombre.toLowerCase().includes(busquedaLower) ||
          r.descripcion?.toLowerCase().includes(busquedaLower) ||
          r.tags?.some((tag) => tag.toLowerCase().includes(busquedaLower))
      );
    }

    // Filtro por valores nutricionales
    if (filtros.caloriasMin !== undefined) {
      resultados = resultados.filter((r) => r.macros.calorias >= filtros.caloriasMin!);
    }
    if (filtros.caloriasMax !== undefined) {
      resultados = resultados.filter((r) => r.macros.calorias <= filtros.caloriasMax!);
    }
    if (filtros.proteinasMin !== undefined) {
      resultados = resultados.filter((r) => r.macros.proteinas >= filtros.proteinasMin!);
    }
    if (filtros.proteinasMax !== undefined) {
      resultados = resultados.filter((r) => r.macros.proteinas <= filtros.proteinasMax!);
    }
    if (filtros.carbohidratosMin !== undefined) {
      resultados = resultados.filter((r) => r.macros.carbohidratos >= filtros.carbohidratosMin!);
    }
    if (filtros.carbohidratosMax !== undefined) {
      resultados = resultados.filter((r) => r.macros.carbohidratos <= filtros.carbohidratosMax!);
    }
    if (filtros.grasasMin !== undefined) {
      resultados = resultados.filter((r) => r.macros.grasas >= filtros.grasasMin!);
    }
    if (filtros.grasasMax !== undefined) {
      resultados = resultados.filter((r) => r.macros.grasas <= filtros.grasasMax!);
    }
    if (filtros.fibraMin !== undefined) {
      resultados = resultados.filter((r) => (r.fibra || 0) >= filtros.fibraMin!);
    }
    if (filtros.fibraMax !== undefined) {
      resultados = resultados.filter((r) => (r.fibra || 0) <= filtros.fibraMax!);
    }
    if (filtros.sodioMin !== undefined) {
      resultados = resultados.filter((r) => (r.sodio || 0) >= filtros.sodioMin!);
    }
    if (filtros.sodioMax !== undefined) {
      resultados = resultados.filter((r) => (r.sodio || 0) <= filtros.sodioMax!);
    }

    // Filtro por estilo culinario
    if (filtros.estilosCulinarios && filtros.estilosCulinarios.length > 0) {
      resultados = resultados.filter(
        (r) =>
          r.estiloCulinario &&
          r.estiloCulinario.some((estilo) => filtros.estilosCulinarios!.includes(estilo))
      );
    }

    // Filtro por restricciones
    if (filtros.restricciones && filtros.restricciones.length > 0) {
      resultados = resultados.filter(
        (r) =>
          r.restricciones &&
          r.restricciones.some((restriccion) => filtros.restricciones!.includes(restriccion))
      );
    }

    // Filtro por tiempo de preparación
    if (filtros.tiempoPreparacionMax !== undefined) {
      resultados = resultados.filter(
        (r) => !r.tiempoPreparacion || r.tiempoPreparacion <= filtros.tiempoPreparacionMax!
      );
    }

    // Filtro por favoritos
    if (filtros.favoritos) {
      resultados = resultados.filter((r) => r.favorito === true);
    }

    // Filtro por coste
    if (filtros.costeMin !== undefined) {
      resultados = resultados.filter(
        (r) => r.costeEstimado !== undefined && r.costeEstimado >= filtros.costeMin!
      );
    }
    if (filtros.costeMax !== undefined) {
      resultados = resultados.filter(
        (r) => r.costeEstimado !== undefined && r.costeEstimado <= filtros.costeMax!
      );
    }

    // Filtro por huella de carbono
    if (filtros.huellaCarbonoMax !== undefined) {
      resultados = resultados.filter(
        (r) => r.huellaCarbono !== undefined && r.huellaCarbono <= filtros.huellaCarbonoMax!
      );
    }

    // Filtro por certificados
    if (filtros.soloCertificados) {
      resultados = resultados.filter((r) => r.certificado === true);
    }

    // Filtro por temporada
    if (filtros.soloTemporada) {
      resultados = resultados.filter((r) => r.ingredientesTemporada === true);
    }

    // Filtro por nivel de adherencia
    if (filtros.nivelAdherencia && filtros.nivelAdherencia.length > 0) {
      resultados = resultados.filter((r) => 
        r.nivelAdherencia && filtros.nivelAdherencia!.includes(r.nivelAdherencia)
      );
    }

    // Filtro por nivel de satisfacción
    if (filtros.nivelSatisfaccion && filtros.nivelSatisfaccion.length > 0) {
      resultados = resultados.filter((r) => 
        r.nivelSatisfaccion && filtros.nivelSatisfaccion!.includes(r.nivelSatisfaccion)
      );
    }

    // Filtro por adherencia mínima
    if (filtros.minimaAdherencia !== undefined) {
      resultados = resultados.filter((r) => 
        r.adherenciaPromedio !== undefined && r.adherenciaPromedio >= filtros.minimaAdherencia!
      );
    }

    // Filtro por satisfacción mínima
    if (filtros.minimaSatisfaccion !== undefined) {
      resultados = resultados.filter((r) => 
        r.satisfaccionPromedio !== undefined && r.satisfaccionPromedio >= filtros.minimaSatisfaccion!
      );
    }

    // Ordenar resultados
    if (filtros.ordenarPor) {
      resultados = [...resultados].sort((a, b) => {
        switch (filtros.ordenarPor) {
          case 'adherencia':
            const adherenciaA = a.adherenciaPromedio ?? 0;
            const adherenciaB = b.adherenciaPromedio ?? 0;
            return adherenciaB - adherenciaA;
          case 'satisfaccion':
            const satisfaccionA = a.satisfaccionPromedio ?? 0;
            const satisfaccionB = b.satisfaccionPromedio ?? 0;
            return satisfaccionB - satisfaccionA;
          case 'calorias':
            return b.macros.calorias - a.macros.calorias;
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          default:
            return 0;
        }
      });
    }

    return resultados;
  }, [recursosConEtiquetas, recursos, filtros, tipoActivo, busquedaTexto]);

  const handleDragStart = (recurso: RecursoBiblioteca, event: React.DragEvent) => {
    const dragData: DragData = {
      tipo: recurso.tipo,
      recurso,
      origen: 'biblioteca',
    };

    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', recurso.id); // Fallback para algunos navegadores

    // Estilo visual del elemento arrastrado
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.style.opacity = '0.5';
    }

    onRecursoDragStart(recurso, event);
  };

  const handleDragEnd = (event: React.DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.style.opacity = '1';
    }
  };

  const renderRecurso = (recurso: RecursoBiblioteca) => {
    const tiposLabels: Record<TipoRecurso, string> = {
      receta: 'Receta',
      plantilla: 'Plantilla',
      alimento: 'Alimento',
      bloque: 'Bloque',
    };

    return (
      <Card
        key={recurso.id}
        draggable
        onDragStart={(e) => handleDragStart(recurso, e)}
        onDragEnd={handleDragEnd}
        className="group relative cursor-move bg-white/80 border border-slate-200 hover:border-blue-300 hover:shadow-md shadow-sm transition-all"
      >
        <div className="flex flex-col gap-3">
          {/* Header con drag handle */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <GripVertical className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <h4 
                  className="text-sm font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecursoParaPreview(recurso);
                    setMostrarPreview(true);
                  }}
                  title="Previsualizar recurso"
                >
                  {recurso.nombre}
                </h4>
                {recurso.favorito && (
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecursoParaPreview(recurso);
                      setMostrarPreview(true);
                    }}
                    className="h-6 w-6 p-0"
                    title="Previsualizar recurso"
                  >
                    <Eye className="h-3 w-3 text-slate-400 hover:text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecursoParaEtiquetar(recurso);
                      setMostrarEtiquetar(true);
                    }}
                    className="h-6 w-6 p-0"
                    title="Etiquetar con adherencia/satisfacción"
                  >
                    <Tag className="h-3 w-3 text-slate-400 hover:text-blue-500" />
                  </Button>
                  {(recurso.tipo === 'receta' || recurso.tipo === 'plantilla') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecursoSeleccionado(recurso);
                        setMostrarModalColecciones(true);
                      }}
                      className="h-6 w-6 p-0"
                      title="Gestionar colecciones"
                    >
                      <FolderPlus className="h-3 w-3 text-slate-400 hover:text-blue-500" />
                    </Button>
                  )}
                </div>
              </div>
              {recurso.descripcion && (
                <p className="text-xs text-slate-500 line-clamp-2">{recurso.descripcion}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-50 text-blue-600 text-[10px] py-0.5 px-2 rounded-full">
                  {tiposLabels[recurso.tipo]}
                </Badge>
                {recurso.nivelAdherencia && (
                  <Badge className={`${getNivelAdherenciaColor(recurso.nivelAdherencia)} text-[10px] py-0.5 px-2 rounded-full border`}>
                    <TrendingUp className="h-2.5 w-2.5 mr-1 inline" />
                    {recurso.nivelAdherencia === 'excelente' ? 'Excelente' :
                     recurso.nivelAdherencia === 'muy-bueno' ? 'Muy Bueno' :
                     recurso.nivelAdherencia === 'bueno' ? 'Bueno' :
                     recurso.nivelAdherencia === 'regular' ? 'Regular' :
                     'Bajo'}
                  </Badge>
                )}
                {recurso.nivelSatisfaccion && (
                  <Badge className={`${getNivelSatisfaccionColor(recurso.nivelSatisfaccion)} text-[10px] py-0.5 px-2 rounded-full border`}>
                    <Heart className="h-2.5 w-2.5 mr-1 inline" />
                    {recurso.nivelSatisfaccion === 'muy-alto' ? 'Muy Alto' :
                     recurso.nivelSatisfaccion === 'alto' ? 'Alto' :
                     recurso.nivelSatisfaccion === 'medio' ? 'Medio' :
                     recurso.nivelSatisfaccion === 'bajo' ? 'Bajo' :
                     'Muy Bajo'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Valores nutricionales */}
          <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
            <div className="flex flex-col">
              <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">Kcal</span>
              <span className="font-semibold text-slate-900">{recurso.macros.calorias}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">P</span>
              <span className="font-semibold text-slate-900">{recurso.macros.proteinas}g</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">H</span>
              <span className="font-semibold text-slate-900">{recurso.macros.carbohidratos}g</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-500 uppercase tracking-wide text-[10px]">G</span>
              <span className="font-semibold text-slate-900">{recurso.macros.grasas}g</span>
            </div>
          </div>

          {/* Información adicional */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {recurso.tiempoPreparacion && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{recurso.tiempoPreparacion} min</span>
              </div>
            )}
            {recurso.fibra && (
              <div>
                <span className="font-medium">Fibra:</span> {recurso.fibra}g
              </div>
            )}
            {recurso.sodio && (
              <div>
                <span className="font-medium">Sodio:</span> {recurso.sodio}mg
              </div>
            )}
            {recurso.costeEstimado !== undefined && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-500" />
                <span className="font-medium">{recurso.costeEstimado.toFixed(2)} €</span>
              </div>
            )}
            {recurso.huellaCarbono !== undefined && (
              <div className="flex items-center gap-1">
                <Leaf className="h-3 w-3 text-green-500" />
                <span className="font-medium">{recurso.huellaCarbono.toFixed(2)} kg CO₂</span>
              </div>
            )}
          </div>

          {/* Estilos culinarios y restricciones */}
          {recurso.estiloCulinario && recurso.estiloCulinario.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recurso.estiloCulinario.map((estilo) => (
                <Badge
                  key={estilo}
                  className="bg-indigo-50 text-indigo-600 text-[10px] py-0.5 px-2 rounded-full"
                >
                  <ChefHat className="h-2.5 w-2.5 mr-1 inline" />
                  {estiloLabels[estilo]}
                </Badge>
              ))}
            </div>
          )}

          {recurso.restricciones && recurso.restricciones.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recurso.restricciones.map((restriccion) => (
                <Badge
                  key={restriccion}
                  className="bg-amber-50 text-amber-600 text-[10px] py-0.5 px-2 rounded-full"
                >
                  {restriccion.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Tags */}
          {recurso.tags && recurso.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recurso.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  className="bg-slate-100 text-slate-600 text-[10px] py-0.5 px-2 rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Indicador de arrastrable */}
          <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-400 text-center">
            Arrastra al calendario
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={busquedaTexto}
              onChange={(e) => {
                setBusquedaTexto(e.target.value);
                onFiltrosChange({ ...filtros, busqueda: e.target.value || undefined });
              }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        <ImportadorRecursos
          onRecursoImportado={(recurso) => {
            onRecursoAgregado?.(recurso);
            // El recurso ya se agregó a la biblioteca, solo notificamos
          }}
        />
        <ConectorProveedoresExternos
          onRecursoImportado={(recurso) => {
            onRecursoAgregado?.(recurso);
            // El recurso ya se agregó a la biblioteca, solo notificamos
          }}
        />
        <Button
          variant={mostrarFiltros ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          leftIcon={<Filter className="h-4 w-4" />}
        >
          Filtros
        </Button>
      </div>

      {/* Panel de filtros avanzados */}
      {mostrarFiltros && (
        <FiltrosAvanzadosBiblioteca
          filtros={filtros}
          onFiltrosChange={onFiltrosChange}
          onClose={() => setMostrarFiltros(false)}
        />
      )}

      {/* Lista de recursos */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {cargando ? (
          <div className="flex items-center justify-center py-8 text-sm text-slate-500">
            Cargando recursos...
          </div>
        ) : recursosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-sm text-slate-500">
            <Search className="h-8 w-8 mb-2 text-slate-400" />
            <p>No se encontraron recursos</p>
            <p className="text-xs text-slate-400 mt-1">Intenta ajustar los filtros</p>
          </div>
        ) : (
          recursosFiltrados.map(renderRecurso)
        )}
      </div>

      {/* Contador de resultados */}
      {recursosFiltrados.length > 0 && (
        <div className="text-xs text-slate-500 text-center">
          Mostrando {recursosFiltrados.length} de {recursos.length} recursos
        </div>
      )}

      {/* Modal de gestión de colecciones */}
      <Modal
        isOpen={mostrarModalColecciones}
        onClose={() => {
          setMostrarModalColecciones(false);
          setRecursoSeleccionado(null);
        }}
        title={`Gestionar: ${recursoSeleccionado?.nombre || ''}`}
        size="lg"
      >
        {recursoSeleccionado && (
          <GestionColecciones
            recursoId={recursoSeleccionado.id}
            tipoRecurso={recursoSeleccionado.tipo}
          />
        )}
      </Modal>

      {/* Modal de previsualización */}
      {recursoParaPreview && (
        <PreviewRecurso
          recurso={recursoParaPreview}
          clienteId={clienteId}
          clienteNombre={clienteNombre}
          isOpen={mostrarPreview}
          onClose={() => {
            setMostrarPreview(false);
            setRecursoParaPreview(null);
          }}
        />
      )}

      {/* Modal de etiquetado de adherencia/satisfacción */}
      {recursoParaEtiquetar && (
        <EtiquetarAdherencia
          recurso={recursoParaEtiquetar}
          clienteId={clienteId}
          clienteNombre={clienteNombre}
          isOpen={mostrarEtiquetar}
          onClose={() => {
            setMostrarEtiquetar(false);
            setRecursoParaEtiquetar(null);
          }}
          onEtiquetaGuardada={async () => {
            // Recargar etiquetas
            const recursosConEtiquetasAplicadas = await aplicarEtiquetasARecursos(recursos, clienteId);
            setRecursosConEtiquetas(recursosConEtiquetasAplicadas);
          }}
        />
      )}
    </div>
  );
};

