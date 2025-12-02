import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Badge } from '../../../components/componentsreutilizables';
import { History, Clock } from 'lucide-react';
import { HistorialAlerta } from '../types';

export const HistorialAlertas: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialAlerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setHistorial([]);
      setLoading(false);
    }, 500);
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'fecha',
        label: 'Fecha',
        render: (_: any, row: HistorialAlerta) => (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{new Date(row.fecha).toLocaleString('es-ES')}</span>
          </div>
        ),
      },
      {
        key: 'accion',
        label: 'Acción',
      },
      {
        key: 'usuario',
        label: 'Usuario',
      },
      {
        key: 'detalles',
        label: 'Detalles',
        render: (_: any, row: HistorialAlerta) => row.detalles || '-',
      },
    ],
    []
  );

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Historial de Alertas
        </h2>
        <p className="text-gray-600 text-sm">
          Registro completo de todas las alertas y acciones tomadas
        </p>
      </div>
      <Table
        data={historial}
        columns={columns}
        loading={loading}
        emptyMessage="No hay historial de alertas disponible"
      />
    </Card>
  );
};

