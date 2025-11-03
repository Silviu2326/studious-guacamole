import React, { useState, useEffect } from 'react';
import { ContentPackageCard } from './ContentPackageCard';
import {
  getContentPackages,
  deleteContentPackage,
  duplicatePackage,
  ContentPackage
} from '../api/contentPackages';
import { Plus, Loader2, Filter, DollarSign, Users, TrendingUp } from 'lucide-react';

interface ContentPackageManagerProps {
  trainerId: string;
  onCreateNew?: () => void;
  onEdit?: (packageId: string) => void;
  onAnalytics?: (packageId: string) => void;
}

/**
 * Componente principal que renderiza la vista de gestión de contenidos.
 * Obtiene la lista de todos los paquetes y controla la apertura de modales.
 */
export const ContentPackageManager: React.FC<ContentPackageManagerProps> = ({
  trainerId,
  onCreateNew,
  onEdit,
  onAnalytics
}) => {
  const [packages, setPackages] = useState<ContentPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    loadPackages();
  }, [sortBy]);

  const loadPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getContentPackages({ sortBy });
      setPackages(data);
    } catch (err) {
      setError('Error al cargar paquetes de contenido');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (packageId: string) => {
    try {
      await deleteContentPackage(packageId);
      await loadPackages();
    } catch (error) {
      console.error('Error eliminando paquete:', error);
      alert('Error al eliminar el paquete');
    }
  };

  const handleDuplicate = async (packageId: string) => {
    const newTitle = window.prompt('Título para la copia:');
    if (!newTitle) return;

    try {
      await duplicatePackage(packageId, newTitle);
      await loadPackages();
      alert('Paquete duplicado exitosamente');
    } catch (error) {
      console.error('Error duplicando paquete:', error);
      alert('Error al duplicar el paquete');
    }
  };

  const totalRevenue = packages.reduce((sum, pkg) => sum + (pkg.totalRevenue || 0), 0);
  const totalEnrolled = packages.reduce((sum, pkg) => sum + pkg.enrolledClients, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-900">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paquetes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{packages.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inscritos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalEnrolled}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalRevenue.toFixed(2)}€
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="createdAt">Más Recientes</option>
              <option value="title">Por Título</option>
              <option value="enrolledClients">Más Inscritos</option>
            </select>
          </div>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Nuevo Paquete
            </button>
          )}
        </div>
      </div>

      {/* Lista de paquetes */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <ContentPackageCard
              key={pkg.id}
              packageData={pkg}
              onEdit={(id) => onEdit?.(id)}
              onAnalytics={(id) => onAnalytics?.(id)}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No tienes paquetes de contenido creados todavía</p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Paquete
            </button>
          )}
        </div>
      )}
    </div>
  );
};


