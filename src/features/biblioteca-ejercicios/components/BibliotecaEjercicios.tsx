import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  SelectOption 
} from '../../../components/componentsreutilizables';
import { 
  Ejercicio, 
  FiltrosEjercicio, 
  BibliotecaEjerciciosProps, 
  Dificultad 
} from '../types';
import { ejerciciosMock, gruposMusculares, equipamientos, favoritosMock } from '../data/mockData';
import { VisorEjercicio } from './VisorEjercicio';
import { ds } from '../../adherencia/ui/ds';

export const BibliotecaEjercicios: React.FC<BibliotecaEjerciciosProps> = ({
  modo = 'visualizacion',
  onSeleccionarEjercicio,
  ejerciciosSeleccionados = [],
  mostrarFavoritos = true
}) => {
  const [ejercicios] = useState<Ejercicio[]>(ejerciciosMock);
  const [favoritos, setFavoritos] = useState<string[]>(favoritosMock);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);
  const [filtros, setFiltros] = useState<FiltrosEjercicio>({
    busqueda: '',
    gruposMusculares: [],
    equipamiento: [],
    dificultad: [],
    soloFavoritos: false
  });

  // Opciones para los selects
  const opcionesGruposMusculares: SelectOption[] = gruposMusculares.map(grupo => ({
    value: grupo.id,
    label: grupo.nombre
  }));

  const opcionesEquipamiento: SelectOption[] = equipamientos.map(equipo => ({
    value: equipo.id,
    label: equipo.nombre
  }));

  const opcionesDificultad: SelectOption[] = [
    { value: Dificultad.PRINCIPIANTE, label: 'Principiante' },
    { value: Dificultad.INTERMEDIO, label: 'Intermedio' },
    { value: Dificultad.AVANZADO, label: 'Avanzado' },
    { value: Dificultad.EXPERTO, label: 'Experto' }
  ];

  // Filtrar ejercicios
  const ejerciciosFiltrados = useMemo(() => {
    return ejercicios.filter(ejercicio => {
      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const coincide = 
          ejercicio.nombre.toLowerCase().includes(busqueda) ||
          ejercicio.descripcion.toLowerCase().includes(busqueda) ||
          ejercicio.tags.some(tag => tag.toLowerCase().includes(busqueda));
        if (!coincide) return false;
      }

      // Filtro por grupos musculares
      if (filtros.gruposMusculares && filtros.gruposMusculares.length > 0) {
        const tieneGrupo = ejercicio.grupoMuscular.some(grupo => 
          filtros.gruposMusculares!.includes(grupo.id)
        );
        if (!tieneGrupo) return false;
      }

      // Filtro por equipamiento
      if (filtros.equipamiento && filtros.equipamiento.length > 0) {
        const tieneEquipamiento = ejercicio.equipamiento.some(equipo => 
          filtros.equipamiento!.includes(equipo.id)
        );
        if (!tieneEquipamiento) return false;
      }

      // Filtro por dificultad
      if (filtros.dificultad && filtros.dificultad.length > 0) {
        if (!filtros.dificultad.includes(ejercicio.dificultad)) return false;
      }

      // Filtro por favoritos
      if (filtros.soloFavoritos) {
        if (!favoritos.includes(ejercicio.id)) return false;
      }

      return true;
    });
  }, [ejercicios, filtros, favoritos]);

  const handleAgregarFavorito = (ejercicioId: string) => {
    setFavoritos(prev => [...prev, ejercicioId]);
  };

  const handleRemoverFavorito = (ejercicioId: string) => {
    setFavoritos(prev => prev.filter(id => id !== ejercicioId));
  };

  const handleSeleccionarEjercicio = (ejercicio: Ejercicio) => {
    if (modo === 'seleccion' && onSeleccionarEjercicio) {
      onSeleccionarEjercicio(ejercicio);
    } else {
      setEjercicioSeleccionado(ejercicio);
    }
  };

  const getDificultadColor = (dificultad: Dificultad) => {
    switch (dificultad) {
      case Dificultad.PRINCIPIANTE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case Dificultad.INTERMEDIO:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case Dificultad.AVANZADO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case Dificultad.EXPERTO:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Biblioteca de Ejercicios
          </h1>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
            Catálogo completo de ejercicios con vídeos, instrucciones y advertencias
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {ejerciciosFiltrados.length} ejercicios
          </span>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar ejercicios..."
            value={filtros.busqueda || ''}
            onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <Select
            placeholder="Grupo muscular"
            options={[{ value: '', label: 'Todos los grupos' }, ...opcionesGruposMusculares]}
            value={filtros.gruposMusculares?.[0] || ''}
            onChange={(e) => {
              const valor = e.target.value;
              setFiltros(prev => ({ 
                ...prev, 
                gruposMusculares: valor ? [valor] : [] 
              }));
            }}
          />

          <Select
            placeholder="Equipamiento"
            options={[{ value: '', label: 'Todo el equipamiento' }, ...opcionesEquipamiento]}
            value={filtros.equipamiento?.[0] || ''}
            onChange={(e) => {
              const valor = e.target.value;
              setFiltros(prev => ({ 
                ...prev, 
                equipamiento: valor ? [valor] : [] 
              }));
            }}
          />

          <Select
            placeholder="Dificultad"
            options={[{ value: '', label: 'Todas las dificultades' }, ...opcionesDificultad]}
            value={filtros.dificultad?.[0] || ''}
            onChange={(e) => {
              const valor = e.target.value as Dificultad;
              setFiltros(prev => ({ 
                ...prev, 
                dificultad: valor ? [valor] : [] 
              }));
            }}
          />
        </div>

        {mostrarFavoritos && (
          <div className="mt-4 flex items-center gap-4">
            <Button
              variant={filtros.soloFavoritos ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFiltros(prev => ({ ...prev, soloFavoritos: !prev.soloFavoritos }))}
            >
              <svg className="w-4 h-4 mr-2" fill={filtros.soloFavoritos ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Solo favoritos
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltros({
                busqueda: '',
                gruposMusculares: [],
                equipamiento: [],
                dificultad: [],
                soloFavoritos: false
              })}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Lista de ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ejerciciosFiltrados.map((ejercicio) => (
          <Card 
            key={ejercicio.id} 
            variant="hover" 
            className="cursor-pointer"
            onClick={() => handleSeleccionarEjercicio(ejercicio)}
          >
            <div className="space-y-4">
              {/* Imagen/Video placeholder */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 013-3h6a3 3 0 013 3v2M7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Información del ejercicio */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {ejercicio.nombre}
                  </h3>
                  {mostrarFavoritos && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (favoritos.includes(ejercicio.id)) {
                          handleRemoverFavorito(ejercicio.id);
                        } else {
                          handleAgregarFavorito(ejercicio.id);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <svg 
                        className={`w-5 h-5 ${favoritos.includes(ejercicio.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        fill={favoritos.includes(ejercicio.id) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} line-clamp-2`}>
                  {ejercicio.descripcion}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDificultadColor(ejercicio.dificultad)}`}>
                    {ejercicio.dificultad}
                  </span>
                  {ejercicio.duracion && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg text-xs font-medium">
                      {ejercicio.duracion} min
                    </span>
                  )}
                  {ejercicio.calorias && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-lg text-xs font-medium">
                      {ejercicio.calorias} cal
                    </span>
                  )}
                </div>

                {/* Grupos musculares */}
                <div className="flex flex-wrap gap-1">
                  {ejercicio.grupoMuscular.slice(0, 2).map((grupo) => (
                    <span 
                      key={grupo.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {grupo.nombre}
                    </span>
                  ))}
                  {ejercicio.grupoMuscular.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                      +{ejercicio.grupoMuscular.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Indicador de selección para modo selección */}
              {modo === 'seleccion' && ejerciciosSeleccionados.includes(ejercicio.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {ejerciciosFiltrados.length === 0 && (
        <Card className="text-center py-12">
          <div className="space-y-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                No se encontraron ejercicios
              </h3>
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
                Intenta ajustar los filtros para encontrar más ejercicios
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Modal del visor de ejercicio */}
      {ejercicioSeleccionado && (
        <VisorEjercicio
          ejercicio={ejercicioSeleccionado}
          onCerrar={() => setEjercicioSeleccionado(null)}
          onAgregarFavorito={handleAgregarFavorito}
          onRemoverFavorito={handleRemoverFavorito}
          esFavorito={favoritos.includes(ejercicioSeleccionado.id)}
        />
      )}
    </div>
  );
};