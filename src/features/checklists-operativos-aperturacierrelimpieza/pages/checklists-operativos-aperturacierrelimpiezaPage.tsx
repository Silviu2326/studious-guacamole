import React from 'react';
import { ChecklistDashboard } from '../components';
import { ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Página principal de Checklists Operativos (Apertura/Cierre/Limpieza)
 * 
 * Sistema completo de gestión de checklists operativos para gimnasios.
 * Funcionalidades principales:
 * - Creación de plantillas de checklists reutilizables
 * - Asignación de checklists al personal
 * - Ejecución y seguimiento de checklists
 * - Reporte de incidencias con fotos y notas
 * - Dashboard de monitoreo en tiempo real
 */
const ChecklistsOperativosAperturaCierreLimpiezaPage: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role === 'gerente' || user?.role === 'admin' ? 'manager' : 'staff';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <ClipboardCheck size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Checklists Operativos
                </h1>
                <p className="text-gray-600">
                  Gestión completa de checklists operativos para apertura, cierre y limpieza del gimnasio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <ChecklistDashboard userRole={userRole} />
      </div>
    </div>
  );
};

export default ChecklistsOperativosAperturaCierreLimpiezaPage;

