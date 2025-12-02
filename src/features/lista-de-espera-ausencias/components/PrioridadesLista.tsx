import React, { useState } from 'react';
import { Card, Table, Button, Input, Select } from '../../../components/componentsreutilizables';
import { PrioridadListaEspera } from '../types';
import { Star, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export const PrioridadesLista: React.FC = () => {
  const [prioridades, setPrioridades] = useState<PrioridadListaEspera[]>([
    {
      id: '1',
      nombre: 'Premium',
      descripcion: 'Socios con membresía premium',
      reglas: {
        tipo: 'membresia',
        valor: 'premium',
      },
      orden: 1,
    },
    {
      id: '2',
      nombre: 'Antigüedad',
      descripcion: 'Socios con más de 1 año de membresía',
      reglas: {
        tipo: 'antiguedad',
        valor: 365,
      },
      orden: 2,
    },
    {
      id: '3',
      nombre: 'Alta Frecuencia',
      descripcion: 'Socios que asisten regularmente',
      reglas: {
        tipo: 'frecuencia',
        valor: 4,
      },
      orden: 3,
    },
  ]);

  const handleCambiarOrden = (id: string, direccion: 'arriba' | 'abajo') => {
    setPrioridades((prev) => {
      const nuevaLista = [...prev];
      const index = nuevaLista.findIndex(p => p.id === id);
      
      if (direccion === 'arriba' && index > 0) {
        [nuevaLista[index - 1], nuevaLista[index]] = [nuevaLista[index], nuevaLista[index - 1]];
        nuevaLista[index - 1].orden = index;
        nuevaLista[index].orden = index + 1;
      } else if (direccion === 'abajo' && index < nuevaLista.length - 1) {
        [nuevaLista[index], nuevaLista[index + 1]] = [nuevaLista[index + 1], nuevaLista[index]];
        nuevaLista[index].orden = index + 1;
        nuevaLista[index + 1].orden = index + 2;
      }
      
      return nuevaLista;
    });
  };

  const columns = [
    {
      key: 'orden',
      label: 'Orden',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">#{value}</span>
        </div>
      ),
    },
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value: string) => (
        <div className="font-semibold">{value}</div>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value: string) => (
        <div className="text-sm text-gray-600">{value}</div>
      ),
    },
    {
      key: 'reglas',
      label: 'Regla',
      render: (value: any) => (
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {value.tipo}: {value.valor}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: PrioridadListaEspera) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCambiarOrden(row.id, 'arriba')}
            disabled={row.orden === 1}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCambiarOrden(row.id, 'abajo')}
            disabled={row.orden === prioridades.length}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {}}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setPrioridades(prev => prev.filter(p => p.id !== row.id));
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Prioridades de Lista de Espera
          </h3>
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Nueva Prioridad
          </Button>
        </div>

        <p className="text-gray-600 mb-6">
          Configure las reglas de prioridad para determinar el orden en la lista de espera.
          Las prioridades se evalúan en orden de arriba a abajo.
        </p>

        <Table
          data={prioridades}
          columns={columns}
          emptyMessage="No hay prioridades configuradas"
        />
      </Card>
    </div>
  );
};

