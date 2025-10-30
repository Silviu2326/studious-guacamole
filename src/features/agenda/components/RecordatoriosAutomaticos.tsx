import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const RecordatoriosAutomaticos: React.FC = () => {
  const [canal, setCanal] = useState<string>('email');
  const [antelacion, setAntelacion] = useState<string>('24');
  const [habilitado, setHabilitado] = useState<boolean>(true);

  return (
    <Card padding="lg" className="space-y-6">
      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>Recordatorios Automáticos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select label="Canal" value={canal} onChange={(v) => setCanal(v || 'email')} options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push' },
        ]} />
        <Select label="Antelación (horas)" value={antelacion} onChange={(v) => setAntelacion(v || '24')} options={[
          { value: '1', label: '1h' }, { value: '12', label: '12h' }, { value: '24', label: '24h' }, { value: '48', label: '48h' }
        ]} />
        <div className="flex items-end">
          <Button variant={habilitado ? 'primary' : 'secondary'} onClick={() => setHabilitado(!habilitado)}>
            {habilitado ? 'Recordatorios habilitados' : 'Recordatorios deshabilitados'}
          </Button>
        </div>
      </div>
      <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
        Nota: la entrega real se integrará con el sistema de comunicaciones cuando esté disponible.
      </p>
    </Card>
  );
};