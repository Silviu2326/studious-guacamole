import React, { useState, useEffect } from 'react';
import { ContentPackageCard } from './ContentPackageCard';
import {
  getContentPackages,
  deleteContentPackage,
  duplicatePackage,
  ContentPackage
} from '../api/contentPackages';
import { Plus, Loader2, Filter, DollarSign, Users, TrendingUp, Package as PackageIcon, AlertCircle } from 'lucide-react';
import { MetricCards, Card } from '../../../components/componentsreutilizables';

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
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-purple-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar paquetes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            <Plus size={20} className="" />
            Nuevo Paquete
          </button>
        )}
      </div>

      {/* KPIs */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total Paquetes',
            value: packages.length,
            color: 'info',
            icon: <PackageIcon />
          },
          {
            id: 'inscritos',
            title: 'Total Inscritos',
            value: totalEnrolled,
            color: 'success',
            icon: <Users />
          },
          {
            id: 'ingresos',
            title: 'Ingresos Totales',
            value: `${totalRevenue.toFixed(2)}€`,
            color: 'warning',
            icon: <DollarSign />
          }
        ]}
        columns={3}
      />

      {/* Filtros y acciones */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="createdAt">Más Recientes</option>
              <option value="title">Por Título</option>
              <option value="enrolledClients">Más Inscritos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de paquetes */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <Card className="p-8 text-center bg-white shadow-sm">
          <PackageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay paquetes creados</h3>
          <p className="text-gray-600 mb-4">Comienza creando tu primer paquete de contenido premium</p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <Plus size={20} className="" />
              Crear Primer Paquete
            </button>
          )}
        </Card>
      )}
    </div>
  );
};


