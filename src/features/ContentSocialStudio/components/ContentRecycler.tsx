import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Loader2,
  RefreshCw,
  Repeat,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
} from '../../../components/componentsreutilizables';
import type {
  WinningContent,
  ContentRecycling,
  RecyclingSuggestion,
  TargetContentFormat,
} from '../types';
import {
  getWinningContent,
  getRecyclingSuggestions,
  recycleContent,
  getContentRecyclings,
} from '../api/contentRecycling';

interface ContentRecyclerProps {
  loading?: boolean;
}

const formatLabels: Record<TargetContentFormat, { label: string; icon: string }> = {
  reel: { label: 'Reel', icon: '🎬' },
  post: { label: 'Post', icon: '📝' },
  carousel: { label: 'Carrusel', icon: '🖼️' },
  story: { label: 'Story', icon: '📱' },
  tiktok: { label: 'TikTok', icon: '🎵' },
  youtube: { label: 'YouTube', icon: '▶️' },
};

const priorityColors: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-rose-100 text-rose-700 border-rose-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low: 'bg-slate-100 text-slate-700 border-slate-300',
};

export function ContentRecycler({ loading: externalLoading }: ContentRecyclerProps) {
  const [winningContent, setWinningContent] = useState<WinningContent[]>([]);
  const [recyclings, setRecyclings] = useState<ContentRecycling[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<WinningContent | null>(null);
  const [suggestions, setSuggestions] = useState<RecyclingSuggestion | null>(null);
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewRecycling, setPreviewRecycling] = useState<ContentRecycling | null>(null);
  const [activeTab, setActiveTab] = useState<'winning' | 'recycled'>('winning');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [minScore, setMinScore] = useState(50);

  // Form state for recycling
  const [recycleFormData, setRecycleFormData] = useState({
    targetFormat: 'reel' as TargetContentFormat,
    targetPlatform: 'instagram' as const,
  });

  useEffect(() => {
    loadData();
  }, [minScore, filterFormat]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [winning, recycled] = await Promise.all([
        getWinningContent({
          minScore,
          format: filterFormat !== 'all' ? (filterFormat as any) : undefined,
        }),
        getContentRecyclings(),
      ]);
      setWinningContent(winning);
      setRecyclings(recycled);
    } catch (error) {
      console.error('Error loading content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async (content: WinningContent) => {
    setSelectedContent(content);
    try {
      const suggestion = await getRecyclingSuggestions(content.id);
      setSuggestions(suggestion);
      setShowRecycleModal(true);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  const handleRecycle = async () => {
    if (!selectedContent) return;

    try {
      const recycled = await recycleContent(
        selectedContent.id,
        recycleFormData.targetFormat,
        recycleFormData.targetPlatform
      );
      setPreviewRecycling(recycled);
      setShowRecycleModal(false);
      setShowPreviewModal(true);
      await loadData(); // Reload to show new recycling
    } catch (error) {
      console.error('Error recycling content:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-slate-600';
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (externalLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Reciclaje de Contenido Ganador
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Convierte tu mejor contenido en nuevos formatos para maximizar alcance
          </p>
        </div>
        <Button variant="secondary" onClick={loadData} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Score Mínimo
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Formato Original
          </label>
          <Select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'blog', label: 'Blog' },
              { value: 'post', label: 'Post' },
              { value: 'carousel', label: 'Carrusel' },
              { value: 'video', label: 'Video' },
            ]}
          />
        </div>
      </div>

      <Tabs
        items={[
          { id: 'winning', label: `Contenido Ganador (${winningContent.length})` },
          { id: 'recycled', label: `Contenido Reciclado (${recyclings.length})` },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'winning' | 'recycled')}
      />

      {activeTab === 'winning' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {winningContent.map((content) => (
            <Card key={content.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                      {content.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-slate-100 text-slate-700">
                      {content.originalFormat}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {content.originalPlatform}
                    </Badge>
                    <span className={`text-lg font-bold ${getScoreColor(content.performance.score)}`}>
                      Score: {content.performance.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {content.originalContent.text}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {content.performance.engagement.toLocaleString()} engagement
                    </span>
                    <span>
                      {content.performance.reach.toLocaleString()} alcance
                    </span>
                    <span>
                      {content.performance.engagementRate.toFixed(1)}% tasa
                    </span>
                  </div>
                  {content.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {content.topics.map((topic) => (
                        <Badge key={topic} className="bg-violet-100 text-violet-700 text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => handleGetSuggestions(content)}
                className="w-full inline-flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4" />
                Reciclar Contenido
              </Button>
            </Card>
          ))}
          {winningContent.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 dark:text-slate-400">
                No se encontró contenido ganador con los filtros seleccionados.
              </p>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recyclings.map((recycling) => (
            <Card key={recycling.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="w-5 h-5 text-violet-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                      {recycling.recycledContent.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-slate-100 text-slate-700">
                      {recycling.sourceContent.originalFormat}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge className="bg-violet-100 text-violet-700">
                      {recycling.targetFormat}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {recycling.targetPlatform}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {recycling.recycledContent.caption}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      recycling.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      recycling.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }>
                      {recycling.status === 'published' ? 'Publicado' :
                       recycling.status === 'scheduled' ? 'Programado' : 'Borrador'}
                    </Badge>
                    {recycling.scheduledAt && (
                      <span className="text-xs text-gray-500">
                        {formatDate(recycling.scheduledAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setPreviewRecycling(recycling);
                  setShowPreviewModal(true);
                }}
                className="w-full"
              >
                Ver Detalles
              </Button>
            </Card>
          ))}
          {recyclings.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 dark:text-slate-400">
                Aún no has reciclado ningún contenido.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Recycling Suggestions Modal */}
      <Modal
        isOpen={showRecycleModal && selectedContent !== null && suggestions !== null}
        onClose={() => {
          setShowRecycleModal(false);
          setSelectedContent(null);
          setSuggestions(null);
        }}
        title={`Reciclar: ${selectedContent?.title}`}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Contenido Original</h4>
            <Card className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-slate-100 text-slate-700">
                  {selectedContent?.originalFormat}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  {selectedContent?.originalPlatform}
                </Badge>
                <span className="text-sm font-medium">
                  Score: {selectedContent?.performance.score}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {selectedContent?.originalContent.text.substring(0, 200)}...
              </p>
            </Card>
          </div>

          <div>
            <h4 className="font-medium mb-3">Sugerencias de Reciclaje</h4>
            <div className="space-y-3">
              {suggestions?.suggestedFormats.map((suggestion, index) => (
                <Card
                  key={index}
                  className={`p-4 border-2 cursor-pointer transition-all ${
                    recycleFormData.targetFormat === suggestion.format &&
                    recycleFormData.targetPlatform === suggestion.platform
                      ? priorityColors[suggestion.priority] + ' border-2 border-violet-500'
                      : priorityColors[suggestion.priority]
                  }`}
                  onClick={() => {
                    setRecycleFormData({
                      targetFormat: suggestion.format,
                      targetPlatform: suggestion.platform,
                    });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">
                          {formatLabels[suggestion.format]?.icon || '📄'}
                        </span>
                        <span className="font-semibold">
                          {formatLabels[suggestion.format]?.label || suggestion.format}
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {suggestion.platform}
                        </Badge>
                        <Badge className={
                          suggestion.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                          suggestion.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }>
                          {suggestion.priority === 'high' ? 'Alta' :
                           suggestion.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                        {suggestion.reason}
                      </p>
                      {suggestion.estimatedReach && (
                        <div className="text-xs text-gray-500">
                          Alcance estimado: {suggestion.estimatedReach.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {recycleFormData.targetFormat === suggestion.format &&
                     recycleFormData.targetPlatform === suggestion.platform && (
                      <Zap className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRecycleModal(false);
                setSelectedContent(null);
                setSuggestions(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRecycle}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generar Contenido Reciclado
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Recycled Content Modal */}
      <Modal
        isOpen={showPreviewModal && previewRecycling !== null}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewRecycling(null);
        }}
        title={`Vista Previa: ${previewRecycling?.recycledContent.title}`}
        size="lg"
      >
        {previewRecycling && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Contenido Original</h4>
              <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-slate-100 text-slate-700">
                    {previewRecycling.sourceContent.originalFormat}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    {previewRecycling.sourceContent.originalPlatform}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {previewRecycling.sourceContent.originalContent.text.substring(0, 300)}...
                </p>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-2">Contenido Reciclado</h4>
              <Card className="p-4 bg-violet-50 dark:bg-violet-900/20">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-violet-100 text-violet-700">
                    {previewRecycling.targetFormat}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    {previewRecycling.targetPlatform}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Caption
                    </label>
                    <Textarea
                      value={previewRecycling.recycledContent.caption}
                      readOnly
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  {previewRecycling.recycledContent.hashtags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        Hashtags
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {previewRecycling.recycledContent.hashtags.map((tag, index) => (
                          <Badge key={index} className="bg-violet-100 text-violet-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {previewRecycling.recycledContent.script && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        Script (para video)
                      </label>
                      <Textarea
                        value={previewRecycling.recycledContent.script}
                        readOnly
                        rows={6}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                  )}
                  {previewRecycling.recycledContent.visualCues && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        Indicaciones Visuales
                      </label>
                      <ul className="list-disc list-inside mt-1 text-sm text-gray-600 dark:text-slate-400">
                        {previewRecycling.recycledContent.visualCues.map((cue, index) => (
                          <li key={index}>{cue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewRecycling(null);
                }}
              >
                Cerrar
              </Button>
              <Button variant="primary">
                Programar Publicación
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

