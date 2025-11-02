import { useEffect, useState } from 'react';
import { Table } from '../../componentsreutilizables/Table';
import * as api from '../api/alertas';

export function HistorialAlertas() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api.getReportesSeguridad().then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <Table
      columns={[
        { key: 'fecha', header: 'Fecha' },
        { key: 'evento', header: 'Evento' },
        { key: 'detalle', header: 'Detalle' },
      ]}
      data={items}
    />
  );
}


