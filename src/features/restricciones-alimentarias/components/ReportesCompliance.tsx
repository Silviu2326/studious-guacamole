import { useState } from 'react';
import { Button } from '../../componentsreutilizables/Button';
import { Select } from '../../componentsreutilizables/Select';
import { Input } from '../../componentsreutilizables/Input';
import * as api from '../api/alertas';

export function ReportesCompliance() {
  const [formato, setFormato] = useState<'pdf' | 'csv'>('pdf');
  const [rango, setRango] = useState('30');
  const [downloading, setDownloading] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-3">
      <Select
        label="Formato"
        value={formato}
        onChange={(v) => setFormato(v as any)}
        options={[{ label: 'PDF', value: 'pdf' }, { label: 'CSV', value: 'csv' }]}
      />
      <Input label="Rango (días)" value={rango} onChange={setRango} type="number" />
      <Button
        loading={downloading}
        onClick={async () => {
          setDownloading(true);
          const blob = await api.generarReporteCompliance({ formato, rangoDias: Number(rango) });
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_compliance.${formato}`;
            a.click();
            URL.revokeObjectURL(url);
          }
          setDownloading(false);
        }}
      >
        Generar reporte
      </Button>
    </div>
  );
}


