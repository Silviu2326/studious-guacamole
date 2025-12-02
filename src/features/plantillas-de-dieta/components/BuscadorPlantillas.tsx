import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Select, Badge } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';
import { FiltrosPlantillas, CategoriaNutricional, ObjetivoNutricional } from '../types';
import { getCategorias, CategoriaInfo } from '../api/categorias';

interface BuscadorPlantillasProps {
  filtros: FiltrosPlantillas;
  onFiltrosChange: (filtros: FiltrosPlantillas) => void;
}

export const BuscadorPlantillas: React.FC<BuscadorPlantillasProps> = ({
  filtros,
  onFiltrosChange,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaInfo[]>([]);

  React.useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  const categoriasOptions = categorias.map(cat => ({
    value: cat.id,
    label: cat.nombre,
  }));

  const objetivosOptions: { value: ObjetivoNutricional; label: string }[] = [
    { value: 'perdida-peso', label: 'Pérdida de Peso' },
    { value: 'ganancia-muscular', label: 'Ganancia Muscular' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'rendimiento', label: 'Rendimiento' },
    { value: 'salud-general', label: 'Salud General' },
    { value: 'deficit-suave', label: 'Déficit Suave' },
    { value: 'superavit-calorico', label: 'Superávit Calórico' },
  ];

  const handleTextoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      texto: e.target.value || undefined,
    });
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      categoria: e.target.value as CategoriaNutricional || undefined,
    });
  };

  const handleObjetivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      objetivo: e.target.value as ObjetivoNutricional || undefined,
    });
  };

  const handleCaloriasMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFiltrosChange({
      ...filtros,
      caloriasMin: value,
    });
  };

  const handleCaloriasMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFiltrosChange({
      ...filtros,
      caloriasMax: value,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltros = !!(
    filtros.categoria ||
    filtros.objetivo ||
    filtros.caloriasMin ||
    filtros.caloriasMax ||
    filtros.texto
  );

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.categoria) count++;
    if (filtros.objetivo) count++;
    if (filtros.caloriasMin) count++;
    if (filtros.caloriasMax) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar plantillas por nombre, descripción o tags..."
                value={filtros.texto || ''}
                onChange={handleTextoChange}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros */}
            <Button
              variant={mostrarFiltros ? 'secondary' : 'ghost'}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter size={18} className="mr-2" />
              Filtros
              {filtrosActivos > 0 && (
                <Badge variant="blue" className="ml-2">
                  {filtrosActivos}
                </Badge>
              )}
              {mostrarFiltros ? (
                <ChevronUp size={18} className="ml-2" />
              ) : (
                <ChevronDown size={18} className="ml-2" />
              )}
            </Button>

            {/* Botón limpiar */}
            {tieneFiltros && (
              <Button variant="ghost" onClick={limpiarFiltros}>
                <X size={18} className="mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel de Filtros Avanzados */}
        {mostrarFiltros && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Categoría
                </label>
                <Select
                  placeholder="Todas las categorías"
                  options={[
                    { value: '', label: 'Todas las categorías' },
                    ...categoriasOptions,
                  ]}
                  value={filtros.categoria || ''}
                  onChange={handleCategoriaChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Objetivo
                </label>
                <Select
                  placeholder="Todos los objetivos"
                  options={[
                    { value: '', label: 'Todos los objetivos' },
                    ...objetivosOptions,
                  ]}
                  value={filtros.objetivo || ''}
                  onChange={handleObjetivoChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Calorías Mínimas
                </label>
                <input
                  type="number"
                  placeholder="Ej: 1200"
                  value={filtros.caloriasMin?.toString() || ''}
                  onChange={handleCaloriasMinChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Calorías Máximas
                </label>
                <input
                  type="number"
                  placeholder="Ej: 2500"
                  value={filtros.caloriasMax?.toString() || ''}
                  onChange={handleCaloriasMaxChange}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>

            {/* Resumen de Resultados */}
            {tieneFiltros && (
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filtrosActivos} filtros aplicados</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

