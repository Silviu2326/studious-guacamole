import React, { useState, useEffect } from 'react';
import {
  RecurringPost,
  RecurringPostSeries,
  RecurrencePattern,
  getRecurringPosts,
  createRecurringPost,
  updateRecurringPost,
  deleteRecurringPost,
  generateOccurrences,
  getRecurringPostSeries
} from '../api/recurring';
import { SocialPlatform, getPlatformIcon } from '../api/social';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import {
  Repeat,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  AlertCircle
} from 'lucide-react';

interface RecurringPostsManagerProps {
  onOccurrencesGenerated?: (occurrences: any[]) => void;
}

export const RecurringPostsManager: React.FC<RecurringPostsManagerProps> = ({
  onOccurrencesGenerated
}) => {
  const [recurringPosts, setRecurringPosts] = useState<RecurringPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RecurringPost | null>(null);
  const [series, setSeries] = useState<Record<string, RecurringPostSeries[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getRecurringPosts();
      setRecurringPosts(data);
      
      // Cargar series para cada post recurrente
      const seriesData: Record<string, RecurringPostSeries[]> = {};
      for (const post of data) {
        try {
          const postSeries = await getRecurringPostSeries(post.id);
          seriesData[post.id] = postSeries;
        } catch (err) {
          seriesData[post.id] = [];
        }
      }
      setSeries(seriesData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const updated = await updateRecurringPost(id, { enabled });
      setRecurringPosts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  const handleGenerateOccurrences = async (id: string) => {
    setIsGenerating(true);
    try {
      const recurringPost = recurringPosts.find(p => p.id === id);
      if (!recurringPost) return;
      
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = recurringPost.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const occurrences = await generateOccurrences(id, startDate, endDate);
      onOccurrencesGenerated?.(occurrences);
      
      // Actualizar contador
      const updated = await updateRecurringPost(id, {
        occurrencesGenerated: recurringPost.occurrencesGenerated + occurrences.length
      });
      setRecurringPosts(prev => prev.map(p => p.id === id ? updated : p));
      
      alert(`Se generaron ${occurrences.length} ocurrencias`);
    } catch (err: any) {
      alert('Error al generar ocurrencias: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este post recurrente?')) return;
    
    try {
      await deleteRecurringPost(id);
      setRecurringPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const getPatternLabel = (pattern: RecurrencePattern): string => {
    switch (pattern) {
      case 'daily':
        return 'Diario';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensual';
      case 'custom':
        return 'Personalizado';
      default:
        return pattern;
    }
  };

  const getDaysLabel = (daysOfWeek?: number[]): string => {
    if (!daysOfWeek || daysOfWeek.length === 0) return '';
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return daysOfWeek.map(d => dayNames[d]).join(', ');
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <RefreshCw size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando posts recurrentes...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Repeat size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Programación Recurrente</h3>
            <p className="text-sm text-gray-600">Gestiona posts que se publican automáticamente de forma recurrente</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedPost(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus size={18} />}
        >
          Nuevo Post Recurrente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurringPosts.map((post) => (
          <Card
            key={post.id}
            className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{post.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {post.enabled ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {post.description && (
                  <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Repeat size={14} />
                    <span>{getPatternLabel(post.pattern)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.schedule.time}</span>
                  </div>
                  {post.pattern === 'weekly' && post.schedule.daysOfWeek && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{getDaysLabel(post.schedule.daysOfWeek)}</span>
                    </div>
                  )}
                  {post.pattern === 'monthly' && post.schedule.dayOfMonth && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Día {post.schedule.dayOfMonth}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleEnabled(post.id, !post.enabled)}
                >
                  {post.enabled ? <Pause size={16} /> : <Play size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.platforms.map(platform => (
                  <span key={platform} className="text-lg">
                    {getPlatformIcon(platform)}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{post.content.text}</p>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">{post.occurrencesGenerated}</span> ocurrencias generadas
                </div>
                {post.nextOccurrence && (
                  <div className="text-xs text-gray-600">
                    Próxima: {new Date(post.nextOccurrence).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGenerateOccurrences(post.id)}
                  variant="secondary"
                  size="sm"
                  loading={isGenerating}
                  leftIcon={<RefreshCw size={14} />}
                  className="flex-1"
                >
                  Generar Ocurrencias
                </Button>
                {series[post.id] && series[post.id].length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Mostrar series
                    }}
                  >
                    Ver Serie ({series[post.id].length})
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {recurringPosts.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Repeat size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay posts recurrentes</h3>
          <p className="text-gray-600 mb-4">Crea tu primer post recurrente para automatizar publicaciones</p>
          <Button
            onClick={() => {
              setSelectedPost(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus size={18} />}
          >
            Crear Post Recurrente
          </Button>
        </Card>
      )}
    </div>
  );
};

