import React from 'react';
import { Card, Button, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { Calendar, Package, ArrowRight, Activity, CheckCircle } from 'lucide-react';
import { PackSemanal } from '../types';
import { ds } from '../../adherencia/ui/ds';
import type { MetricCardData } from '../../../components/componentsreutilizables';

interface PacksSemanalesProps {
  packs: PackSemanal[];
  cargando?: boolean;
  onVer: (pack: PackSemanal) => void;
  onAsignar?: (pack: PackSemanal) => void;
}

export const PacksSemanales: React.FC<PacksSemanalesProps> = ({
  packs,
  cargando = false,
  onVer,
  onAsignar,
}) => {
  const packsActivos = packs.filter(p => new Date(p.fechaFin) >= new Date()).length;
  const packsCompletados = packs.filter(p => new Date(p.fechaFin) < new Date()).length;

  const metricas: MetricCardData[] = [
    {
      id: '1',
      title: 'Total Packs',
      value: packs.length.toString(),
      icon: <Package size={24} />,
      color: 'primary',
    },
    {
      id: '2',
      title: 'Packs Activos',
      value: packsActivos.toString(),
      icon: <Activity size={24} />,
      color: 'success',
    },
    {
      id: '3',
      title: 'Completados',
      value: packsCompletados.toString(),
      icon: <CheckCircle size={24} />,
      color: 'info',
    },
  ];

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          No hay packs semanales disponibles
        </h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Los packs semanales aparecerán aquí cuando se creen para un plan
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packs.map((pack) => (
        <Card key={pack.id} variant="hover" className="p-6 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-500" />
                <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {pack.nombre}
                </h3>
              </div>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Semana {pack.semanaNumero}
              </Badge>
            </div>
          </div>

          {pack.descripcion && (
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4 line-clamp-2`}>
              {pack.descripcion}
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Calorías:</span>
              <span className="font-semibold">{pack.macros.calorias} kcal</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>P: {pack.macros.proteinas}g</span>
              <span>C: {pack.macros.carbohidratos}g</span>
              <span>G: {pack.macros.grasas}g</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs mb-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={ds.color.textSecondary}>
              {new Date(pack.fechaInicio).toLocaleDateString('es-ES')} - {new Date(pack.fechaFin).toLocaleDateString('es-ES')}
            </span>
          </div>

          <div className="flex gap-2 mt-auto pt-4">
            <Button variant="primary" size="sm" onClick={() => onVer(pack)} fullWidth>
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
            {onAsignar && (
              <Button variant="secondary" size="sm" onClick={() => onAsignar(pack)}>
                Asignar
              </Button>
            )}
          </div>
        </Card>
        ))}
      </div>
    </div>
  );
};

