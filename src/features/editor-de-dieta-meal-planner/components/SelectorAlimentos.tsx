import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table } from '../../../components/componentsreutilizables';
import { Search, Plus, Check } from 'lucide-react';
import { getAlimentos, buscarAlimentos, type Alimento } from '../api/editor';
import { ds } from '../../adherencia/ui/ds';

interface SelectorAlimentosProps {
  onSeleccionarAlimento: (alimento: Alimento) => void;
  alimentosSeleccionados?: string[];
}

export const SelectorAlimentos: React.FC<SelectorAlimentosProps> = ({
  onSeleccionarAlimento,
  alimentosSeleccionados = [],
}) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAlimentos();
  }, []);

  useEffect(() => {
    if (busqueda.trim()) {
      buscar();
    } else {
      cargarAlimentos();
    }
  }, [busqueda]);

  const cargarAlimentos = async () => {
    setLoading(true);
    try {
      const data = await getAlimentos();
      setAlimentos(data);
    } catch (error) {
      console.error('Error cargando alimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscar = async () => {
    if (!busqueda.trim()) return;
    setLoading(true);
    try {
      const data = await buscarAlimentos(busqueda);
      setAlimentos(data);
    } catch (error) {
      console.error('Error buscando alimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const columnas = [
    {
      key: 'nombre',
      label: 'Alimento',
      render: (alimento: Alimento) => (
        <div>
          <div className="font-medium text-gray-900">{alimento.nombre}</div>
          <div className="text-sm text-gray-500">{alimento.categoria}</div>
        </div>
      ),
    },
    {
      key: 'calorias',
      label: 'Cal/100g',
      render: (alimento: Alimento) => (
        <span className="text-gray-700">{alimento.caloriasPor100g}</span>
      ),
    },
    {
      key: 'proteinas',
      label: 'Proteínas',
      render: (alimento: Alimento) => (
        <span className="text-gray-700">{alimento.proteinasPor100g}g</span>
      ),
    },
    {
      key: 'carbohidratos',
      label: 'Carbohidratos',
      render: (alimento: Alimento) => (
        <span className="text-gray-700">{alimento.carbohidratosPor100g}g</span>
      ),
    },
    {
      key: 'grasas',
      label: 'Grasas',
      render: (alimento: Alimento) => (
        <span className="text-gray-700">{alimento.grasasPor100g}g</span>
      ),
    },
    {
      key: 'acciones',
      label: '',
      render: (alimento: Alimento) => {
        const yaSeleccionado = alimentosSeleccionados.includes(alimento.id);
        return (
          <Button
            size="sm"
            variant={yaSeleccionado ? 'secondary' : 'primary'}
            onClick={() => !yaSeleccionado && onSeleccionarAlimento(alimento)}
            disabled={yaSeleccionado}
          >
            {yaSeleccionado ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Agregado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </>
            )}
          </Button>
        );
      },
    },
  ];

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Search size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Seleccionar Alimentos
        </h2>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar alimentos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando alimentos...</p>
        </div>
      ) : (
        <Table
          columns={columnas}
          data={alimentos}
          emptyMessage="No se encontraron alimentos"
        />
      )}
    </Card>
  );
};

