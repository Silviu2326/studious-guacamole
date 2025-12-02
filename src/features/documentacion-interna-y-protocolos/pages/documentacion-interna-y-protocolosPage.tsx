import React from 'react';
import { DocumentLibraryContainer } from '../components';
import { useAuth } from '../../../context/AuthContext';
import { FileText } from 'lucide-react';

/**
 * Página principal de Documentación Interna y Protocolos
 * 
 * Sistema completo de gestión de documentación operativa para gimnasios.
 * Funcionalidades principales:
 * - Biblioteca centralizada de documentos
 * - Control de versiones
 * - Sistema de acuse de recibo
 * - Categorización personalizada
 * - Búsqueda y filtrado avanzado
 * - Dashboard de cumplimiento
 */
const DocumentacionInternaYProtocolosPage: React.FC = () => {
  const { user } = useAuth();

  // Verificar que el usuario tenga acceso (solo gimnasio)
  const isGymUser = user?.role === 'gerente' || user?.role === 'admin' || user?.role === 'staff';

  if (!isGymUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-gray-600">
                Esta funcionalidad está disponible únicamente para gimnasios.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header según guía de estilos */}
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
                  Documentación Interna y Protocolos
                </h1>
                <p className="text-gray-600">
                  Gestión centralizada de documentos operativos, protocolos de seguridad y procedimientos del gimnasio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal según guía */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Componente principal */}
        <DocumentLibraryContainer currentUser={user || { role: 'staff' }} />
      </div>
    </div>
  );
};

export default DocumentacionInternaYProtocolosPage;
