import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getProveedores } from '../api/proveedores';
import { CostoMantenimiento, Proveedor } from '../types';
import { Wrench, Plus, Calendar, AlertCircle } from 'lucide-react';

// Datos mock para mantenimiento
const costosMock: CostoMantenimiento[] = [
  {
    id: '1',
    fecha: new Date('2024-01-10'),
    equipoMaquina: 'Cinta Corredora #1',
    proveedorId: '3',
    proveedor: 'Mantenimiento Equipos GYM',
    tipo: 'preventivo',
    costo: 800000,
    descripcion: 'Mantenimiento preventivo completo',
    proximoServicio: new Date('2024-02-10'),
    frecuencia: 'Mensual',
    estado: 'completado',
  },
];

export const MantenimientoCostos: React.FC = () => {
  const [costos, setCostos] = useState<CostoMantenimiento[]>(costosMock);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  React.useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await getProveedores({ tipo: 'mantenimiento', activo: true });
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { color: string; label: string }> = {
      preventivo: { color: 'bg-green-100 text-green-800', label: 'Preventivo' },
      correctivo: { color: 'bg-yellow-100 text-yellow-800', label: 'Correctivo' },
      emergencia: { color: 'bg-red-100 text-red-800', label: 'Emergencia' },
    };
    const tipoInfo = tipos[tipo] || tipos.preventivo;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoInfo.color}`}>
        {tipoInfo.label}
      </span>
    );
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; label: string }> = {
      programado: { color: 'bg-blue-100 text-blue-800', label: 'Programado' },
      en_proceso: { color: 'bg-yellow-100 text-yellow-800', label: 'En Proceso' },
      completado: { color: 'bg-green-100 text-green-800', label: 'Completado' },
      cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    };
    const estadoInfo = estados[estado] || estados.programado;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
        {estadoInfo.label}
      </span>
    );
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-CO'),
    },
    {
      key: 'equipoMaquina',
      label: 'Equipo/Máquina',
    },
    {
      key: 'proveedor',
      label: 'Proveedor',
      render: (value: string | undefined) => value || 'N/A',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => getTipoBadge(value),
    },
    {
      key: 'costo',
      label: 'Costo',
      render: (value: number) => formatearMoneda(value),
      align: 'right' as const,
    },
    {
      key: 'proximoServicio',
      label: 'Próximo Servicio',
      render: (value: Date | undefined) => value ? value.toLocaleDateString('es-CO') : 'N/A',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setMostrarModal(true)}>
          <Plus size={20} className="mr-2" />
          Nuevo Costo
        </Button>
      </div>

      {/* Tabla de Costos */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <Table
            data={costos}
            columns={columnas}
            emptyMessage="No hay costos de mantenimiento registrados"
          />
        </div>
      </Card>
    </div>
  );
};

