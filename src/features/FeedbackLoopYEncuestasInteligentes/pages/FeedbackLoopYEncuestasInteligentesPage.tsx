import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SurveyBuilderContainer } from '../components/SurveyBuilderContainer';
import { SurveySummaryCard } from '../components/SurveySummaryCard';
import { SurveyResultsDashboard } from '../components/SurveyResultsDashboard';
import { useSurveyResults } from '../hooks/useSurveyResults';
import {
  getSurveys,
  deleteSurvey,
  SurveySummary,
  Survey
} from '../api/surveys';
import {
  MessageSquare,
  Plus,
  Filter,
  Loader2,
  Lightbulb,
  Eye,
  BarChart3,
  Trash2,
  ArrowRight,
  X
} from 'lucide-react';

type ViewMode = 'list' | 'builder' | 'results';

/**
 * Página principal de Feedback Loop & Encuestas Inteligentes
 * 
 * Permite a los entrenadores crear, gestionar y analizar encuestas automatizadas
 * para capturar feedback estructurado de los clientes.
 */
export const FeedbackLoopYEncuestasInteligentesPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [surveys, setSurveys] = useState<SurveySummary[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    results,
    isLoading: resultsLoading
  } = useSurveyResults(
    viewMode === 'results' && selectedSurveyId ? selectedSurveyId : ''
  );

  useEffect(() => {
    loadSurveys();
  }, [statusFilter]);

  const loadSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getSurveys({
        status: statusFilter !== 'all' ? statusFilter as any : undefined
      });
      setSurveys(data);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    setSelectedSurveyId(null);
    setViewMode('builder');
  };

  const handleEditSurvey = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setViewMode('builder');
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) return;

    try {
      await deleteSurvey(surveyId);
      await loadSurveys();
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
      alert('Error al eliminar la encuesta. Por favor, intenta nuevamente.');
    }
  };

  const handleViewResults = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setViewMode('results');
  };

  const handleSaveSurvey = (survey: Survey) => {
    loadSurveys();
    setViewMode('list');
    setSelectedSurveyId(null);
  };

  if (viewMode === 'builder') {
    return (
      <SurveyBuilderContainer
        surveyId={selectedSurveyId}
        onSave={handleSaveSurvey}
        onCancel={() => {
          setViewMode('list');
          setSelectedSurveyId(null);
        }}
      />
    );
  }

  if (viewMode === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setSelectedSurveyId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    Resultados de la Encuesta
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          {resultsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            <SurveyResultsDashboard results={results} />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <MessageSquare size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Feedback Loop & Encuestas
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Captura feedback estructurado y automatizado para mejorar la experiencia del cliente
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCreateSurvey}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Nueva Encuesta
              </button>
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
                ¿Qué es Feedback Loop & Encuestas?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Este módulo permite crear encuestas personalizadas y automatizadas para capturar 
                feedback estructurado de tus clientes. Configura disparadores automáticos (post-sesión, 
                después de X días, etc.) y analiza los resultados con métricas clave como NPS y CSAT. 
                Identifica clientes en riesgo, detecta tendencias y transforma el feedback en acciones 
                concretas para mejorar tu servicio y retención.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas las encuestas</option>
              <option value="draft">Borradores</option>
              <option value="active">Activas</option>
              <option value="archived">Archivadas</option>
            </select>
          </div>
        </div>

        {/* Lista de encuestas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : surveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <SurveySummaryCard
                key={survey.id}
                survey={survey}
                onView={(id) => handleEditSurvey(id)}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes encuestas creadas todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera encuesta para empezar a capturar feedback estructurado de tus clientes
            </p>
            <button
              onClick={handleCreateSurvey}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Encuesta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackLoopYEncuestasInteligentesPage;


