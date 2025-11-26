import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input, Button, Select, Card } from '../../../components/componentsreutilizables';
import { FiltrosRecetas, CategoriaReceta, TipoComida, DificultadReceta } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface BuscadorRecetasProps {
  filtros: FiltrosRecetas;
  onFiltrosChange: (filtros: FiltrosRecetas) => void;
}

export const BuscadorRecetas: React.FC<BuscadorRecetasProps> = ({
  filtros,
  onFiltrosChange,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const categoriasOptions: { value: CategoriaReceta; label: string }[] = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'cena', label: 'Cena' },
    { value: 'snack', label: 'Snack' },
    { value: 'postre', label: 'Postre' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'smoothie', label: 'Smoothie' },
    { value: 'ensalada', label: 'Ensalada' },
    { value: 'sopa', label: 'Sopa' },
    { value: 'plato-principal', label: 'Plato Principal' },
    { value: 'acompanamiento', label: 'Acompañamiento' },
    { value: 'personalizada', label: 'Personalizada' },
  ];

  const tiposComidaOptions: { value: TipoComida; label: string }[] = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'media-manana', label: 'Media Mañana' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'merienda', label: 'Merienda' },
    { value: 'cena', label: 'Cena' },
    { value: 'post-entreno', label: 'Post Entreno' },
  ];

  const dificultadOptions: { value: DificultadReceta; label: string }[] = [
    { value: 'facil', label: 'Fácil' },
    { value: 'media', label: 'Media' },
    { value: 'dificil', label: 'Difícil' },
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
      categoria: e.target.value as CategoriaReceta || undefined,
    });
  };

  const handleTipoComidaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      tipoComida: e.target.value as TipoComida || undefined,
    });
  };

  const handleDificultadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      dificultad: e.target.value as DificultadReceta || undefined,
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

  const handleTiempoMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFiltrosChange({
      ...filtros,
      tiempoMax: value,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  const tieneFiltros = !!(
    filtros.categoria ||
    filtros.tipoComida ||
    filtros.dificultad ||
    filtros.caloriasMin ||
    filtros.caloriasMax ||
    filtros.tiempoMax ||
    filtros.favoritas
  );

  return (
    <Card variant="hover" padding="md">
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, ingrediente o descripción..."
              value={filtros.texto || ''}
              onChange={handleTextoChange}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {tieneFiltros && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                Activos
              </span>
            )}
          </Button>
        </div>

        {mostrarFiltros && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Select
              label="Categoría"
              value={filtros.categoria || ''}
              onChange={handleCategoriaChange}
              options={[{ value: '', label: 'Todas' }, ...categoriasOptions]}
              placeholder="Categoría"
            />
            <Select
              label="Tipo de Comida"
              value={filtros.tipoComida || ''}
              onChange={handleTipoComidaChange}
              options={[{ value: '', label: 'Todos' }, ...tiposComidaOptions]}
              placeholder="Tipo"
            />
            <Select
              label="Dificultad"
              value={filtros.dificultad || ''}
              onChange={handleDificultadChange}
              options={[{ value: '', label: 'Todas' }, ...dificultadOptions]}
              placeholder="Dificultad"
            />
            <div className="space-y-2">
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Tiempo Máximo (min)
              </label>
              <Input
                type="number"
                value={filtros.tiempoMax || ''}
                onChange={handleTiempoMaxChange}
                placeholder="Tiempo máximo"
              />
            </div>
            <div className="space-y-2">
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Calorías Mín
              </label>
              <Input
                type="number"
                value={filtros.caloriasMin || ''}
                onChange={handleCaloriasMinChange}
                placeholder="Calorías mínimas"
              />
            </div>
            <div className="space-y-2">
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Calorías Máx
              </label>
              <Input
                type="number"
                value={filtros.caloriasMax || ''}
                onChange={handleCaloriasMaxChange}
                placeholder="Calorías máximas"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.favoritas || false}
                  onChange={(e) =>
                    onFiltrosChange({
                      ...filtros,
                      favoritas: e.target.checked || undefined,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className={ds.typography.bodySmall}>Solo favoritas</span>
              </label>
            </div>
            {tieneFiltros && (
              <div className="flex items-end">
                <Button variant="ghost" onClick={limpiarFiltros} size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

