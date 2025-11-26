import React, { useState, useEffect } from 'react';
import {
  ABTest,
  ABTestVariant,
  getABTests,
  createABTest,
  updateABTest,
  analyzeABTest
} from '../api/abTesting';
import { SocialPlatform, getPlatformIcon } from '../api/social';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  FlaskConical,
  Plus,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Award,
  Eye,
  Heart,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface ABTestingManagerProps {
  onTestCreate?: (test: ABTest) => void;
}

export const ABTestingManager: React.FC<ABTestingManagerProps> = ({
  onTestCreate
}) => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getABTests();
      setTests(data);
      
      // Analizar tests completados
      for (const test of data.filter(t => t.status === 'completed')) {
        try {
          const result = await analyzeABTest(test.id);
          setAnalysis(prev => ({ ...prev, [test.id]: result }));
        } catch (err) {
          console.error('Error analyzing test:', err);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      const updated = await updateABTest(testId, { status: 'running' });
      setTests(prev => prev.map(t => t.id === testId ? updated : t));
    } catch (err) {
      console.error('Error starting test:', err);
    }
  };

  const handlePauseTest = async (testId: string) => {
    try {
      const updated = await updateABTest(testId, { status: 'paused' });
      setTests(prev => prev.map(t => t.id === testId ? updated : t));
    } catch (err) {
      console.error('Error pausing test:', err);
    }
  };

  const handleAnalyzeTest = async (testId: string) => {
    try {
      const result = await analyzeABTest(testId);
      setAnalysis(prev => ({ ...prev, [testId]: result }));
      
      // Marcar ganador
      const updated = await updateABTest(testId, {
        status: 'completed',
        winner: result.winner
      });
      setTests(prev => prev.map(t => t.id === testId ? updated : t));
    } catch (err: any) {
      alert('Error al analizar: ' + err.message);
    }
  };

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'En Curso';
      case 'completed':
        return 'Completado';
      case 'paused':
        return 'Pausado';
      default:
        return 'Borrador';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <FlaskConical size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando tests...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical size={24} className="text-purple-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">A/B Testing</h3>
            <p className="text-sm text-gray-600">Prueba diferentes variantes de contenido para optimizar rendimiento</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedTest(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus size={18} />}
        >
          Nuevo Test
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tests.map((test) => {
          const testAnalysis = analysis[test.id];
          const variantA = test.variants[0];
          const variantB = test.variants[1];
          
          return (
            <Card
              key={test.id}
              className="p-6 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-purple-400 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{test.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                      {getStatusLabel(test.status)}
                    </span>
                  </div>
                  {test.description && (
                    <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Inicio: {new Date(test.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    {test.endDate && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>Fin: {new Date(test.endDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{test.metrics.totalViews.toLocaleString()} vistas</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {test.status === 'draft' && (
                    <Button
                      onClick={() => handleStartTest(test.id)}
                      size="sm"
                      variant="secondary"
                      leftIcon={<Play size={16} />}
                    >
                      Iniciar
                    </Button>
                  )}
                  {test.status === 'running' && (
                    <>
                      <Button
                        onClick={() => handlePauseTest(test.id)}
                        size="sm"
                        variant="secondary"
                        leftIcon={<Pause size={16} />}
                      >
                        Pausar
                      </Button>
                      <Button
                        onClick={() => handleAnalyzeTest(test.id)}
                        size="sm"
                        leftIcon={<BarChart3 size={16} />}
                      >
                        Analizar
                      </Button>
                    </>
                  )}
                  {test.status === 'completed' && testAnalysis && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
                      <Award size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Ganador: {test.variants.find(v => v.id === test.winner)?.name || 'N/A'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {test.variants.map((variant, idx) => {
                  const isWinner = test.winner === variant.id;
                  
                  return (
                    <Card
                      key={variant.id}
                      className={`p-4 ${
                        isWinner
                          ? 'bg-green-50 ring-2 ring-green-300'
                          : 'bg-gray-50 ring-1 ring-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(variant.platform)}</span>
                          <h5 className="font-semibold text-gray-900">{variant.name}</h5>
                        </div>
                        {isWinner && (
                          <Award size={18} className="text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{variant.content}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Engagement Rate</p>
                          <p className="font-bold text-gray-900">{variant.performance.engagementRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">CTR</p>
                          <p className="font-bold text-gray-900">{variant.performance.clickThroughRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vistas</p>
                          <p className="font-bold text-gray-900">{variant.metrics.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Engagement</p>
                          <p className="font-bold text-gray-900">{variant.metrics.engagement}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Analysis Results */}
              {testAnalysis && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Resultados del Análisis</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-gray-700">
                        Confianza: {testAnalysis.confidence}%
                      </span>
                    </div>
                    {testAnalysis.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <TrendingUp size={16} className="text-blue-600 mt-0.5" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {test.status === 'running' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Progreso del Test</span>
                    <span className="text-xs font-medium text-gray-900">
                      {test.metrics.totalViews} vistas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((test.metrics.totalViews / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {tests.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <FlaskConical size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tests A/B</h3>
          <p className="text-gray-600 mb-4">Crea tu primer test para optimizar tu contenido</p>
          <Button
            onClick={() => {
              setSelectedTest(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus size={18} />}
          >
            Crear Test A/B
          </Button>
        </Card>
      )}
    </div>
  );
};

