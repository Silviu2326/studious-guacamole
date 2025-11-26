import React from 'react';
import { TemplateManagerContainer } from '../components';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Shield } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

/**
 * Página principal de Normativa y Plantillas Globales
 * 
 * Sistema completo de gestión de normativas y plantillas para cadenas de gimnasios.
 * Funcionalidades principales:
 * - Creación y gestión de plantillas globales
 * - Control de versiones
 * - Distribución a sedes
 * - Sistema de cumplimiento
 * - Dashboard de estadísticas
 * - Búsqueda y filtrado avanzado
 */
const NormativaYPlantillasGlobalesPage: React.FC = () => {
  const { user } = useAuth();

  // Solo gimnasio (administradores corporativos o gestores de franquicia)
  const isGymUser = user?.role === 'admin' || user?.role === 'gerente';

  if (!isGymUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600">
              Esta funcionalidad está disponible únicamente para administradores corporativos y gestores de franquicia.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Normativa y Plantillas Globales
                </h1>
                <p className="text-gray-600">
                  Gestión centralizada de normas corporativas, plantillas operativas y políticas para toda la red de gimnasios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <TemplateManagerContainer />
      </div>
    </div>
  );
};

export default NormativaYPlantillasGlobalesPage;

