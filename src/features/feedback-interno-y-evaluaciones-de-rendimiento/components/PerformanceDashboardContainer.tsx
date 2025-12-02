import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { TrainerPerformanceCard } from './TrainerPerformanceCard';
import { ReviewFormModal } from './ReviewFormModal';
import { usePerformanceData } from './usePerformanceData';
import { 
  BarChart3, 
  Plus, 
  Filter, 
  Download, 
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { PerformanceFilters, ReviewTemplate, TrainerPerformanceSummary } from '../types';
import { createPerformanceReview, updatePerformanceReview } from '../api';
import { ReviewFormData } from '../types';

export interface PerformanceDashboardContainerProps {
  gymId: string;
}

// Mock templates - en producción esto vendría de una API
const mockTemplates: ReviewTemplate[] = [
  {
    id: 'tpl_q1_standard',
    name: 'Evaluación Trimestral Estándar',
    description: 'Plantilla para evaluaciones trimestrales de entrenadores',
    kpis: [
      {
        id: 'kpi_retention',
        name: 'Tasa de Retención de Clientes',
        description: 'Porcentaje de clientes que continúan su membresía',
        type: 'quantitative',
        target: 85,
        unit: '%',
      },
      {
        id: 'kpi_sales',
        name: 'Venta de Planes de Entrenamiento',
        description: 'Número de nuevos planes vendidos',
        type: 'quantitative',
        target: 5,
        unit: 'planes',
      },
      {
        id: 'kpi_communication',
        name: 'Habilidades de Comunicación',
        description: 'Evaluación cualitativa de las habilidades de comunicación',
        type: 'qualitative',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const PerformanceDashboardContainer: React.FC<PerformanceDashboardContainerProps> = ({
  gymId,
}) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<PerformanceFilters>({
    dateRange: [null, null],
    staffMemberId: null,
    reviewType: 'all',
    status: 'all',
    page: 1,
    limit: 10,
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerPerformanceSummary | null>(null);

  const { data, isLoading, isError, error, refetch } = usePerformanceData(gymId, filters);

  const handleCreateReview = async (reviewData: ReviewFormData) => {
    try {
      await createPerformanceReview(gymId, {
        staffMemberId: reviewData.staffMemberId,
        templateId: reviewData.templateId,
        scores: reviewData.scores,
        comments: reviewData.comments,
        status: reviewData.status,
      });
      refetch();
    } catch (err) {
      console.error('Error al crear evaluación:', err);
      throw err;
    }
  };

  const handleViewDetails = (trainerId: string) => {
    // Navegar a vista detallada del entrenador
    console.log('Ver detalles de entrenador:', trainerId);
    // TODO: Implementar navegación o modal con detalles completos
  };

  const handleNewReview = () => {
    setSelectedTemplate(mockTemplates[0]);
    setShowReviewModal(true);
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'reviews',
      label: 'Evaluaciones',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'feedback',
      label: 'Feedback Interno',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  if (isError) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error || 'Error al cargar los datos'}</p>
        <Button variant="secondary" onClick={refetch}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Download size={20} className="mr-2" />
                Exportar
              </Button>
              <Button variant="primary" onClick={handleNewReview}>
                <Plus size={20} className="mr-2" />
                Nueva Evaluación
              </Button>
            </div>
          </div>

          {/* Sistema de Filtros */}
          <Card className="mb-6 bg-white shadow-sm">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar entrenador..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  <Select
                    options={[
                      { value: 'all', label: 'Todos los entrenadores' },
                      ...(data?.summary?.map(trainer => ({
                        value: trainer.staffMemberId,
                        label: trainer.name,
                      })) || []),
                    ]}
                    value={filters.staffMemberId || 'all'}
                    onChange={(e) => 
                      setFilters(prev => ({ 
                        ...prev, 
                        staffMemberId: e.target.value === 'all' ? null : e.target.value 
                      }))
                    }
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Trainer Cards Grid */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : data?.summary?.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                No hay datos de rendimiento disponibles
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.summary?.map((trainer) => (
                <TrainerPerformanceCard
                  key={trainer.staffMemberId}
                  trainer={trainer}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <Button variant="primary" onClick={handleNewReview}>
              <Plus size={20} className="mr-2" />
              Nueva Evaluación
            </Button>
          </div>

          {/* Lista de Evaluaciones */}
          <Card className="p-4 bg-white shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </div>
            ) : data?.reviews?.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay evaluaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay evaluaciones registradas
                </p>
                <Button variant="primary" onClick={handleNewReview}>
                  Crear Primera Evaluación
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.reviews?.map((review) => (
                  <Card key={review.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {review.staffMemberName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Evaluado por {review.reviewerName} el {new Date(review.reviewDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {review.overallScore !== null && (
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">
                                Puntuación
                              </p>
                              <p className="text-xl font-bold text-gray-900">
                                {review.overallScore.toFixed(1)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Feedback Interno Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <Button variant="primary" onClick={handleNewReview}>
              <Plus size={20} className="mr-2" />
              Nuevo Feedback
            </Button>
          </div>

          {/* Contenido de Feedback Interno */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Feedback Interno
              </h3>
              <p className="text-gray-600 mb-4">
                Aquí podrás gestionar el feedback interno entre miembros del equipo
              </p>
              <p className="text-sm text-gray-500">
                Próximamente disponible
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedTemplate && (
        <ReviewFormModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedTemplate(null);
          }}
          onSubmit={handleCreateReview}
          template={selectedTemplate}
          trainers={data?.summary?.map(trainer => ({
            id: trainer.staffMemberId,
            name: trainer.name,
          })) || []}
        />
      )}
    </div>
  );
};

