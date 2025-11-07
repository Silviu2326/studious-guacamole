import React from 'react';
import { PoliciesManagerContainer } from '../components';
import { FileText } from 'lucide-react';

/**
 * Página principal de Políticas & Términos
 * 
 * Sistema de gestión de políticas y términos para gimnasios.
 * Funcionalidades principales:
 * - Creación y edición de políticas de cancelación, privacidad y normas de uso
 * - Versionado completo de cada política
 * - Requerir aceptación de nuevos términos por parte de los socios
 * - Historial inmutable de todas las versiones
 */
const PoliticasTerminosPage: React.FC = () => {
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
                  Políticas & Términos
                </h1>
                <p className="text-gray-600">
                  Gestiona toda la documentación legal y normativa de tu gimnasio. Crea, edita y versiona tus políticas de cancelación, términos de privacidad y normas de uso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <PoliciesManagerContainer />
      </div>
    </div>
  );
};

export default PoliticasTerminosPage;

