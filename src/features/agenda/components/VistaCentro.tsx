import React from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';

export const VistaCentro: React.FC = () => {
  const metrics = [
    { id: 'm1', title: 'Clases esta semana', value: '28', subtitle: 'Publicadas', trend: { value: 5, direction: 'up' as const }, color: 'info' as const },
    { id: 'm2', title: 'Ocupación media', value: '64%', trend: { value: 3, direction: 'up' as const }, color: 'success' as const },
    { id: 'm3', title: 'Plazas libres', value: '42', trend: { value: 12, direction: 'up' as const }, color: 'info' as const },
    { id: 'm4', title: 'Servicios (Fisio)', value: '19', subtitle: 'Citas', trend: { value: 2, direction: 'down' as const }, color: 'info' as const },
  ];
  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen Centro</h3>
        <MetricCards data={metrics} />
      </Card>
    </div>
  );
};