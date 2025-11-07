import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import ServiceTable from '../components/ServiceTable';
import ServiceFormModal from '../components/ServiceFormModal';
import { Service, ServiceFormData, UserRole } from '../types';
import { MOCK_SERVICES_GIMNASIO, MOCK_SERVICES_ENTRENADOR, MOCK_CATEGORIES, MOCK_STATS_GIMNASIO, MOCK_STATS_ENTRENADOR } from '../data/mockData';
import { Search, Plus, Package, TrendingUp, DollarSign, BarChart3, Settings, Loader2, AlertCircle, X } from 'lucide-react';

const ServiciosTarifasPage: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    // Cargar servicios según el tipo de usuario
    loadServices();
  }, [user?.role]);

  useEffect(() => {
    // Aplicar filtros
    applyFilters();
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const loadServices = () => {
    setIsLoading(true);
    setError(null);
    // Simular carga de datos
    setTimeout(() => {
      try {
        if (user?.role === 'entrenador') {
          setServices(MOCK_SERVICES_ENTRENADOR);
        } else if (user?.role === 'gimnasio') {
          setServices(MOCK_SERVICES_GIMNASIO);
        }
      } catch (err) {
        setError('Error al cargar los servicios');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...services];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service =>
        statusFilter === 'active' ? service.isActive : !service.isActive
      );
    }

    setFilteredServices(filtered);
  };

  const handleCreateService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.serviceId !== serviceId));
  };

  const handleDuplicateService = (serviceId: string) => {
    const serviceToDuplicate = services.find(s => s.serviceId === serviceId);
    if (serviceToDuplicate) {
      const duplicated: Service = {
        ...serviceToDuplicate,
        serviceId: `svc_${Date.now()}`,
        name: `${serviceToDuplicate.name} (Copia)`,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setServices(prev => [...prev, duplicated]);
    }
  };

  const handleToggleStatus = (serviceId: string, currentStatus: boolean) => {
    setServices(prev => prev.map(s =>
      s.serviceId === serviceId ? { ...s, isActive: !currentStatus, updatedAt: new Date() } : s
    ));
  };

  const handleSubmitService = async (formData: ServiceFormData) => {
    if (selectedService) {
      // Actualizar servicio existente
      setServices(prev => prev.map(s =>
        s.serviceId === selectedService.serviceId
          ? { ...s, ...formData, updatedAt: new Date() }
          : s
      ));
    } else {
      // Crear nuevo servicio
      const newService: Service = {
        serviceId: `svc_${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setServices(prev => [...prev, newService]);
    }
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all' || statusFilter !== 'all';

  const stats = user?.role === 'entrenador' ? MOCK_STATS_ENTRENADOR : MOCK_STATS_GIMNASIO;

  const metrics: MetricCardData[] = [
    {
      id: 'total',
      title: 'Total Servicios',
      value: stats.totalServices.toString(),
      icon: Package,
      color: 'info'
    },
    {
      id: 'active',
      title: 'Servicios Activos',
      value: stats.activeServices.toString(),
      icon: TrendingUp,
      color: 'success'
    },
    {
      id: 'revenue',
      title: 'Ingresos 30 días',
      value: `€${stats.revenueLast30Days.toFixed(2)}`,
      icon: DollarSign,
      color: 'primary'
    },
    {
      id: 'average',
      title: 'Ticket Promedio',
      value: `€${stats.averageTicketPrice.toFixed(2)}`,
      icon: BarChart3,
      color: 'warning'
    }
  ];

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'Todas las categorías' },
    ...MOCK_CATEGORIES.map(cat => ({ value: cat.name, label: cat.name }))
  ];

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso requerido</h3>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </Card>
      </div>
    );
  }

  const isEntrenador = user.role === 'entrenador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Settings size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Servicios & Tarifas
                </h1>
                <p className="text-gray-600">
                  {isEntrenador
                    ? 'Gestiona tus servicios de entrenamiento y asesoramiento'
                    : 'Administra el catálogo de servicios de tu gimnasio'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button onClick={handleCreateService}>
              <Plus size={20} className="mr-2" />
              Crear Nuevo Servicio
            </Button>
          </div>

          {/* Métricas */}
          <MetricCards data={metrics} />

          {/* Filtros */}
          <Card className="mb-6 bg-white shadow-sm">
            <div className="space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar servicios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Search size={16} className="mr-2" />
                    Filtros
                    {hasActiveFilters && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                        {[searchTerm, categoryFilter !== 'all', statusFilter !== 'all'].filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={handleClearFilters}
                      size="sm"
                    >
                      <X size={16} className="mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>

              {/* Panel de filtros avanzados */}
              {showAdvancedFilters && (
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Categoría
                      </label>
                      <Select
                        options={categoryOptions}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        placeholder="Seleccionar categoría"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estado
                      </label>
                      <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
                        placeholder="Seleccionar estado"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filteredServices.length} {filteredServices.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}</span>
                <span>
                  {hasActiveFilters
                    ? `${[searchTerm, categoryFilter !== 'all', statusFilter !== 'all'].filter(Boolean).length} filtro${[searchTerm, categoryFilter !== 'all', statusFilter !== 'all'].filter(Boolean).length > 1 ? 's' : ''} aplicado${[searchTerm, categoryFilter !== 'all', statusFilter !== 'all'].filter(Boolean).length > 1 ? 's' : ''}`
                    : 'Sin filtros aplicados'}
                </span>
              </div>
            </div>
          </Card>

          {/* Estado de carga */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando servicios...</p>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar servicios</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadServices}>
                Reintentar
              </Button>
            </Card>
          ) : (
            /* Tabla de servicios */
            <ServiceTable
              services={filteredServices}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onDuplicate={handleDuplicateService}
              onToggleStatus={handleToggleStatus}
              loading={false}
              onCreateNew={handleCreateService}
            />
          )}

          {/* Modal de formulario */}
          <ServiceFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedService(null);
            }}
            onSubmit={handleSubmitService}
            initialData={selectedService}
            userRole={user.role as UserRole}
            categories={MOCK_CATEGORIES}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiciosTarifasPage;

