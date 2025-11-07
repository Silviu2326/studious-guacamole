import React from 'react';
import { MantenimientoManager } from '../components';
import { Wrench } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

/**
 * Página principal de Mantenimiento & Incidencias
 * 
 * Sistema completo de gestión de mantenimiento e incidencias para gimnasios.
 * Funcionalidades principales:
 * - Gestión de máquinas rotas y equipamiento defectuoso
 * - Checklist de mantenimiento preventivo y correctivo
 * - Gestión completa de incidencias y reportes
 * - Seguimiento de reparaciones y mantenimientos
 * - Sistema de alertas automáticas
 */
export const MantenimientoIncidenciasPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h1 className={`${ds.typography.displayLarge} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Mantenimiento & Incidencias
          </h1>
        </div>
        <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl mx-auto`}>
          Sistema completo de gestión de mantenimiento e incidencias para gimnasios. 
          Gestiona máquinas rotas, ejecuta checklist de mantenimiento, reporta incidencias 
          y realiza seguimiento de todas las reparaciones y mantenimientos.
        </p>
      </div>

      {/* Componente principal */}
      <MantenimientoManager />
    </div>
  );
};

export default MantenimientoIncidenciasPage;

