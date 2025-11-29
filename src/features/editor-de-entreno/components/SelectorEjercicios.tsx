import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '../../../components/componentsreutilizables';
import { Ejercicio } from '../api';
import { getEjercicios } from '../api';
import { Search, Plus, Dumbbell } from 'lucide-react';

interface SelectorEjerciciosProps {
  onSeleccionar: (ejercicio: Ejercicio) => void;
  ejerciciosSeleccionados?: Ejercicio[];
}

export const SelectorEjercicios: React.FC<SelectorEjerciciosProps> = ({
  onSeleccionar,
  ejerciciosSeleccionados = [],
}) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');

  useEffect(() => {
    const cargarEjercicios = async () => {
      const data = await getEjercicios();
      setEjercicios(data);
    };
    cargarEjercicios();
  }, []);

  const ejerciciosFiltrados = ejercicios.filter((ej) => {
    const coincideBusqueda =
      ej.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ej.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaFiltro || ej.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = Array.from(new Set(ejercicios.map((ej) => ej.categoria)));
  const yaSeleccionado = (ejercicioId: string) =>
    ejerciciosSeleccionados.some((ej) => ej.id === ejercicioId);

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Seleccionar Ejercicios
          </h3>
          <p className="text-sm text-gray-600">
            Busca y agrega ejercicios desde la biblioteca
          </p>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Buscar ejercicios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth
          />

          <Select
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categorias.map((cat) => ({ value: cat, label: cat }))
            ]}
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            fullWidth={false}
            className="w-64"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {ejerciciosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell size={48} className="mx-auto mb-2 opacity-50" />
              <p>No se encontraron ejercicios</p>
            </div>
          ) : (
            ejerciciosFiltrados.map((ejercicio) => (
              <Card
                key={ejercicio.id}
                className={`bg-white shadow-sm flex items-center justify-between p-4 ${
                  yaSeleccionado(ejercicio.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{ejercicio.nombre}</h4>
                    <Badge variant="blue" size="sm">
                      {ejercicio.categoria}
                    </Badge>
                  </div>
                  {ejercicio.descripcion && (
                    <p className="text-sm text-gray-600">
                      {ejercicio.descripcion}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {ejercicio.grupoMuscular.map((grupo) => (
                      <Badge key={grupo} variant="gray" size="sm">
                        {grupo}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={yaSeleccionado(ejercicio.id) ? 'secondary' : 'primary'}
                  onClick={() => !yaSeleccionado(ejercicio.id) && onSeleccionar(ejercicio)}
                  disabled={yaSeleccionado(ejercicio.id)}
                >
                  {yaSeleccionado(ejercicio.id) ? (
                    'Ya agregado'
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </>
                  )}
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

