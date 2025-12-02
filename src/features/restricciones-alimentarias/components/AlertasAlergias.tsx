import { useEffect, useState } from 'react';
import { Table, Card, Badge } from '../../componentsreutilizables';
import { Loader2, Package } from 'lucide-react';
import * as api from '../api/alertas';

export function AlertasAlergias() {
  const [alertas, setAlertas] = useState<api.Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAlertas()
      .then(setAlertas)
      .catch(() => setAlertas([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando alertas...</p>
      </Card>
    );
  }

  if (alertas.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas</h3>
        <p className="text-gray-600">
          No se han registrado alertas de alergias en este momento.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <Table
        columns={[
          { key: 'fecha', header: 'Fecha' },
          { key: 'mensaje', header: 'Mensaje' },
          {
            key: 'nivel', 
            header: 'Nivel', 
            render: (row: api.Alerta) => (
              <Badge variant={row.nivel === 'critical' ? 'destructive' : row.nivel === 'warning' ? 'warning' : 'default'}>
                {row.nivel}
              </Badge>
            )
          },
        ]}
        data={alertas}
        loading={loading}
      />
    </Card>
  );
}


