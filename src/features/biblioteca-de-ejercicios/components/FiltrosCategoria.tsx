import React from 'react';
import { Select, Badge } from '../../../components/componentsreutilizables';
import { Target, Dumbbell, ChevronDown } from 'lucide-react';
import { GrupoMuscular, Equipamiento, Dificultad, TipoLesion, FiltrosEjercicios } from '../types';

interface FiltrosCategoriaProps {
  filtros: FiltrosEjercicios;
  onChange: (filtros: FiltrosEjercicios) => void;
  onLimpiar?: () => void;
}

export const FiltrosCategoria: React.FC<FiltrosCategoriaProps> = ({
  filtros,
  onChange,
  onLimpiar,
}) => {
  const gruposMusculares: GrupoMuscular[] = [
    'pecho',
    'espalda',
    'hombros',
    'brazos',
    'piernas',
    'gluteos',
    'core',
    'cardio',
    'full-body',
  ];

  const equipamientos: Equipamiento[] = [
    'ninguno',
    'pesas',
    'mancuernas',
    'barra',
    'máquina',
    'cables',
    'bandas',
    'balón',
    'kettlebell',
  ];

  const dificultades: Dificultad[] = ['principiante', 'intermedio', 'avanzado'];

  const lesiones: TipoLesion[] = [
    'rodilla',
    'espalda',
    'hombro',
    'muñeca',
    'cuello',
    'tobillo',
    'cadera',
  ];

  const handleGrupoMuscularChange = (value: string) => {
    const grupo = value as GrupoMuscular;
    const gruposActuales = filtros.gruposMusculares || [];
    const nuevosGrupos = gruposActuales.includes(grupo)
      ? gruposActuales.filter((g) => g !== grupo)
      : [...gruposActuales, grupo];
    onChange({ ...filtros, gruposMusculares: nuevosGrupos });
  };

  const handleEquipamientoChange = (value: string) => {
    const equipo = value as Equipamiento;
    const equiposActuales = filtros.equipamiento || [];
    const nuevosEquipos = equiposActuales.includes(equipo)
      ? equiposActuales.filter((e) => e !== equipo)
      : [...equiposActuales, equipo];
    onChange({ ...filtros, equipamiento: nuevosEquipos });
  };

  const handleDificultadChange = (value: string) => {
    const dificultad = value as Dificultad;
    const dificultadesActuales = filtros.dificultad || [];
    const nuevasDificultades = dificultadesActuales.includes(dificultad)
      ? dificultadesActuales.filter((d) => d !== dificultad)
      : [...dificultadesActuales, dificultad];
    onChange({ ...filtros, dificultad: nuevasDificultades });
  };

  const handleLesionChange = (value: string) => {
    const lesion = value as TipoLesion;
    const lesionesActuales = filtros.excluirLesiones || [];
    const nuevasLesiones = lesionesActuales.includes(lesion)
      ? lesionesActuales.filter((l) => l !== lesion)
      : [...lesionesActuales, lesion];
    onChange({ ...filtros, excluirLesiones: nuevasLesiones });
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Target size={16} className="inline mr-1" />
            Grupos Musculares
          </label>
          <div className="relative">
            <select
              value=""
              onChange={(e) => handleGrupoMuscularChange(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
            >
              <option value="">Seleccionar grupo...</option>
              {gruposMusculares.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {filtros.gruposMusculares && filtros.gruposMusculares.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filtros.gruposMusculares.map((grupo) => (
                <Badge
                  key={grupo}
                  variant="blue"
                  onClick={() => handleGrupoMuscularChange(grupo)}
                  className="cursor-pointer"
                >
                  {grupo}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Dumbbell size={16} className="inline mr-1" />
            Equipamiento
          </label>
          <div className="relative">
            <select
              value=""
              onChange={(e) => handleEquipamientoChange(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
            >
              <option value="">Seleccionar equipamiento...</option>
              {equipamientos.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {filtros.equipamiento && filtros.equipamiento.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filtros.equipamiento.map((equipo) => (
                <Badge
                  key={equipo}
                  variant="green"
                  onClick={() => handleEquipamientoChange(equipo)}
                  className="cursor-pointer"
                >
                  {equipo}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dificultad
          </label>
          <div className="relative">
            <select
              value=""
              onChange={(e) => handleDificultadChange(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
            >
              <option value="">Seleccionar dificultad...</option>
              {dificultades.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {filtros.dificultad && filtros.dificultad.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filtros.dificultad.map((dif) => (
                <Badge
                  key={dif}
                  variant="yellow"
                  onClick={() => handleDificultadChange(dif)}
                  className="cursor-pointer"
                >
                  {dif}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtro de lesiones */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          <Target size={16} className="inline mr-1" />
          Excluir ejercicios para lesiones
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {lesiones.map((lesion) => (
            <button
              key={lesion}
              onClick={() => handleLesionChange(lesion)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filtros.excluirLesiones?.includes(lesion)
                  ? 'bg-red-100 text-red-700 ring-2 ring-red-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lesion.charAt(0).toUpperCase() + lesion.slice(1)}
            </button>
          ))}
        </div>
        {filtros.excluirLesiones && filtros.excluirLesiones.length > 0 && (
          <div className="mt-3 text-xs text-slate-600">
            Excluyendo {filtros.excluirLesiones.length} tipo{filtros.excluirLesiones.length !== 1 ? 's' : ''} de lesión{filtros.excluirLesiones.length !== 1 ? 'es' : ''}
          </div>
        )}
      </div>

      {/* Ordenamiento */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Ordenar por
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filtros.ordenarPor || 'popularidad'}
            onChange={(e) => onChange({ ...filtros, ordenarPor: e.target.value as any })}
            className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2 px-3 text-sm"
          >
            <option value="popularidad">Popularidad</option>
            <option value="nombre">Nombre</option>
            <option value="fecha">Fecha</option>
            <option value="grupo">Grupo</option>
          </select>
          <select
            value={filtros.orden || 'desc'}
            onChange={(e) => onChange({ ...filtros, orden: e.target.value as any })}
            className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2 px-3 text-sm"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>
    </div>
  );
};

