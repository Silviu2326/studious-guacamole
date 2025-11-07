import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ImportProcessContainer } from '../components';
import { Database } from 'lucide-react';

/**
 * Página principal de Importadores y Migraciones
 * 
 * Herramienta para importar datos masivos desde archivos CSV/Excel.
 * Adaptada según el rol del usuario:
 * - Entrenador: Flujo simplificado para importar clientes rápidamente
 * - Gimnasio: Flujo avanzado con mapeo de campos y validación completa
 */
export default function ImportadoresMigracionesPage() {
  const { user } = useAuth();
  const userType = user?.role === 'entrenador' ? 'trainer' : 'gym';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Database size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Importadores / Migraciones
                </h1>
                <p className="text-gray-600">
                  {userType === 'trainer'
                    ? 'Importa tu lista de clientes desde un archivo CSV o Excel de forma rápida y sencilla.'
                    : 'Herramienta completa de migración de datos desde sistemas externos con validación avanzada.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <ImportProcessContainer userType={userType} />
      </div>
    </div>
  );
}

