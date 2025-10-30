import React from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';

export const VistaPersonal: React.FC = () => {
  const metrics = [
    { id: 'm1', title: 'Sesiones esta semana', value: '12', subtitle: '1 a 1', trend: { value: 8, direction: 'up' as const }, color: 'primary' as const },
    { id: 'm2', title: 'Adherencia media', value: '78%', trend: { value: 2, direction: 'up' as const }, color: 'success' as const },
    { id: 'm3', title: 'Cancelaciones', value: '3', trend: { value: 1, direction: 'down' as const }, color: 'neutral' as const },
    { id: 'm4', title: 'Videollamadas', value: '4', subtitle: 'Programadas', trend: { value: 0, direction: 'neutral' as const }, color: 'primary' as const },
  ];
  return (
    <div className="space-y-6">
      <Card padding="md">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>Resumen Entrenador</h3>
        <MetricCards data={metrics} />
      </Card>
    </div>
  );
};