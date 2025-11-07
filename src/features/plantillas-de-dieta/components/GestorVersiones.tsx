import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { History, Clock, User } from 'lucide-react';
import { PlantillaDieta } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface GestorVersionesProps {
  plantilla: PlantillaDieta;
}

export const GestorVersiones: React.FC<GestorVersionesProps> = ({ plantilla }) => {
  const versiones = plantilla.versionesAnteriores || [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-400" />
        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Historial de Versiones
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Badge variant="blue">Actual</Badge>
            <span className={`font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Versión {plantilla.version}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            {new Date(plantilla.actualizadoEn).toLocaleDateString()}
          </div>
        </div>

        {versiones.length === 0 ? (
          <p className={`text-center py-4 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay versiones anteriores
          </p>
        ) : (
          versiones.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gray">v{version.version}</Badge>
                  <span className={`font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {version.cambios}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {version.creadoPor}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(version.fechaCreacion).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

