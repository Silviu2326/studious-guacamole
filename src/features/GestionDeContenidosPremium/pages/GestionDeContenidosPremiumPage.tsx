import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ContentPackageManager } from '../components/ContentPackageManager';
import { ContentBuilder } from '../components/ContentBuilder';
import { PackageAnalyticsDashboard } from '../components/PackageAnalyticsDashboard';
import { getPackageAnalytics, ContentPackage } from '../api/contentPackages';
import {
  Package,
  Lightbulb,
  Loader2,
  ArrowLeft,
  BarChart3
} from 'lucide-react';

type ViewMode = 'list' | 'builder' | 'analytics';

/**
 * Página principal de Gestión de Contenidos Premium
 * 
 * Permite a los entrenadores crear, gestionar y monetizar contenido premium
 * en formatos digitales escalables.
 */
export const GestionDeContenidosPremiumPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  const handleCreateNew = () => {
    setSelectedPackageId(null);
    setViewMode('builder');
  };

  const handleEdit = (packageId: string) => {
    setSelectedPackageId(packageId);
    setViewMode('builder');
  };

  const handleViewAnalytics = async (packageId: string) => {
    setSelectedPackageId(packageId);
    setIsLoadingAnalytics(true);
    try {
      const data = await getPackageAnalytics(packageId);
      setAnalytics(data);
      setViewMode('analytics');
    } catch (error) {
      console.error('Error cargando analíticas:', error);
      alert('Error al cargar las analíticas');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleSavePackage = (packageData: ContentPackage) => {
    setViewMode('list');
    setSelectedPackageId(null);
    // La lista se recargará automáticamente
  };

  if (viewMode === 'builder') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ContentBuilder
          packageId={selectedPackageId}
          onSave={handleSavePackage}
          onCancel={() => {
            setViewMode('list');
            setSelectedPackageId(null);
          }}
        />
      </div>
    );
  }

  if (viewMode === 'analytics' && analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setViewMode('list');
                    setSelectedPackageId(null);
                    setAnalytics(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition mr-4"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                    <BarChart3 size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Analíticas del Paquete
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {isLoadingAnalytics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            <PackageAnalyticsDashboard analytics={analytics} />
          )}
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
              <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                <Package size={24} className="text-purple-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Gestión de Contenidos Premium
                </h1>
                <p className="text-gray-600">
                  Crea, empaqueta y vende contenido digital escalable para múltiples clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es Gestión de Contenidos Premium?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Transforma tu conocimiento en activos digitales escalables. Crea programas completos 
                de entrenamiento, planes de nutrición, guías y bibliotecas de videos que pueden venderse 
                como productos digitales. Incluye control de acceso (pago único, suscripción), liberación 
                programada de contenido (drip content) y analíticas detalladas sobre el consumo y progreso 
                de tus clientes. Rompe la barrera de tiempo por dinero y crea múltiples flujos de ingresos.
              </p>
            </div>
          </div>
        </div>

        {/* Gestor de paquetes */}
        <ContentPackageManager
          trainerId={user?.id || ''}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onAnalytics={handleViewAnalytics}
        />
      </div>
    </div>
  );
};

export default GestionDeContenidosPremiumPage;


