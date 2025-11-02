import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ListaEspera as ListaEsperaType } from '../types';
import { Users, Bell, CheckCircle, Package } from 'lucide-react';

interface ListaEsperaProps {
  role: 'entrenador' | 'gimnasio';
}

export const ListaEspera: React.FC<ListaEsperaProps> = ({ role }) => {
  const [listaEspera, setListaEspera] = useState<ListaEsperaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const datos: ListaEsperaType[] = [
        {
          id: '1',
          claseId: 'clase1',
          claseNombre: 'Spinning',
          clienteId: 'cliente1',
          clienteNombre: 'Juan Pérez',
          fecha: new Date(),
          hora: '10:00',
          posicion: 1,
          notificado: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          claseId: 'clase1',
          claseNombre: 'Spinning',
          clienteId: 'cliente2',
          clienteNombre: 'María García',
          fecha: new Date(),
          hora: '10:00',
          posicion: 2,
          notificado: true,
          createdAt: new Date(),
        },
      ];
      setListaEspera(datos);
      setLoading(false);
    }, 300);
  }, []);

  const columns = [
    {
      key: 'posicion',
      label: 'Posición',
      render: (value: number) => (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          <span className="text-sm font-semibold text-blue-600">
            {value}
          </span>
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'claseNombre',
      label: 'Clase',
      render: (value: string) => value,
    },
    {
      key: 'clienteNombre',
      label: 'Socio',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-ES'),
    },
    {
      key: 'hora',
      label: 'Hora',
      render: (value: string) => value,
    },
    {
      key: 'notificado',
      label: 'Estado',
      render: (value: boolean) => (
        <Badge 
          variant={value ? 'green' : 'yellow'}
          leftIcon={value ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
        >
          {value ? 'Notificado' : 'Pendiente'}
        </Badge>
      ),
    },
  ];

  if (role === 'entrenador') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista de Espera no disponible</h3>
        <p className="text-gray-600">
          La lista de espera solo está disponible para gimnasios
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Lista de Espera
          </h3>
        </div>

        <Table
          data={listaEspera}
          columns={columns}
          loading={loading}
          emptyMessage="No hay personas en lista de espera"
        />
      </div>
    </Card>
  );
};
