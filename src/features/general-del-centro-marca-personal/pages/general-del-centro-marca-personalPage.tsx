import React from 'react';
import { Building2, Award } from 'lucide-react';
import { GeneralSettingsContainer } from '../components';
import { useAuth } from '../../../context/AuthContext';

/**
 * Página principal de Configuración General del Centro / Marca Personal
 * 
 * Esta funcionalidad es para ambos tipos de usuario (Gimnasios y Entrenadores Personales),
 * pero presenta campos y lógicas diferentes:
 * - Para Gimnasios: configuración del centro físico (dirección, aforo, horarios de apertura)
 * - Para Entrenadores: marca personal (nombre comercial, especialidades, horarios de atención)
 * 
 * Ruta: /settings/general-profile
 */
export default function GeneralDelCentroMarcaPersonalPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const Icono = isEntrenador ? Award : Building2;
  const titulo = isEntrenador ? 'Marca Personal' : 'General del Centro';
  const descripcion = isEntrenador
    ? 'Configura tu marca personal, especialidades y horarios de atención'
    : 'Configura la información básica del centro, horarios y aforo máximo';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Icono size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {titulo}
                </h1>
                <p className="text-gray-600">
                  {descripcion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <GeneralSettingsContainer />
      </div>
    </div>
  );
}

