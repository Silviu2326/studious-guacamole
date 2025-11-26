import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { AlertTriangle, Info } from 'lucide-react';
import { AdvertenciaLesion } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface AdvertenciasLesionProps {
  advertencias: AdvertenciaLesion[];
  className?: string;
}

export const AdvertenciasLesion: React.FC<AdvertenciasLesionProps> = ({
  advertencias,
  className = '',
}) => {
  if (!advertencias || advertencias.length === 0) {
    return null;
  }

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'consulta-profesional':
        return 'red';
      case 'evitar':
        return 'yellow';
      case 'precaucion':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getSeveridadTexto = (severidad: string) => {
    switch (severidad) {
      case 'consulta-profesional':
        return 'Consulta Profesional';
      case 'evitar':
        return 'Evitar';
      case 'precaucion':
        return 'Precaución';
      default:
        return 'Info';
    }
  };

  return (
    <Card padding="md" className={className}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Advertencias y Contraindicaciones
          </h3>
        </div>

        <div className="space-y-3">
          {advertencias.map((advertencia, index) => (
            <div
              key={index}
              className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeveridadColor(advertencia.severidad) as any}>
                    {getSeveridadTexto(advertencia.severidad)}
                  </Badge>
                  <Badge variant="outline">
                    {advertencia.tipoLesion}
                  </Badge>
                </div>
              </div>
              
              <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                {advertencia.descripcion}
              </p>

              {advertencia.alternativas && advertencia.alternativas.length > 0 && (
                <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      Ejercicios Alternativos:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {advertencia.alternativas.map((alt, idx) => (
                      <Badge key={idx} variant="green" size="sm">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

