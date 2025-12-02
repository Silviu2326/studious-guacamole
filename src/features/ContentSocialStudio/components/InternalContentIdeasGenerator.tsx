import { useState, useEffect } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { generateInternalContentIdeas, getSavedInternalContentIdeas } from '../api/internalContentIdeas';
import type { InternalContentIdea, InternalContentCategory, InternalContentGenerationRequest } from '../api/internalContentIdeas';
import { 
  Lightbulb, 
  Sparkles, 
  Copy, 
  Share2, 
  Filter,
  RefreshCw,
  Users,
  FileText,
  Image as ImageIcon,
  Video,
  Layers,
  Send,
  CheckCircle2
} from 'lucide-react';

interface InternalContentIdeasGeneratorProps {
  loading?: boolean;
}

export function InternalContentIdeasGenerator({ loading: externalLoading }: InternalContentIdeasGeneratorProps) {
  const [ideas, setIdeas] = useState<InternalContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InternalContentCategory | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'text' | 'image' | 'video' | 'carousel'>('all');
  const [targetAudience, setTargetAudience] = useState<'all_clients' | 'new_clients' | 'active_clients' | 'inactive_clients'>('all_clients');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!externalLoading) {
      loadIdeas();
    }
  }, [externalLoading]);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const savedIdeas = await getSavedInternalContentIdeas();
      if (savedIdeas.length > 0) {
        setIdeas(savedIdeas);
      } else {
        // Generar ideas iniciales
        await generateNewIdeas();
      }
    } catch (error) {
      console.error('Error cargando ideas de contenido interno:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewIdeas = async () => {
    setGenerating(true);
    try {
      const request: InternalContentGenerationRequest = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        targetAudience,
        format: selectedFormat !== 'all' ? selectedFormat : undefined,
        count: 6,
      };
      const newIdeas = await generateInternalContentIdeas(request);
      setIdeas(newIdeas);
    } catch (error) {
      console.error('Error generando ideas:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (idea: InternalContentIdea) => {
    try {
      await navigator.clipboard.writeText(idea.content);
      setCopiedId(idea.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copiando contenido:', error);
    }
  };

  const getCategoryLabel = (category: InternalContentCategory) => {
    const labels: Record<InternalContentCategory, string> = {
      nutricion: 'Nutrición',
      ejercicio: 'Ejercicio',
      motivacion: 'Motivación',
      bienestar: 'Bienestar',
      recuperacion: 'Recuperación',
    };
    return labels[category];
  };

  const getCategoryIcon = (category: InternalContentCategory) => {
    const icons: Record<InternalContentCategory, string> = {
      nutricion: '🥗',
      ejercicio: '💪',
      motivacion: '✨',
      bienestar: '🧘',
      recuperacion: '🔄',
    };
    return icons[category];
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'carousel':
        return <Layers className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return '💬';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      case 'email':
        return '📧';
      default:
        return '📱';
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) return false;
    if (selectedFormat !== 'all' && idea.format !== selectedFormat) return false;
    return true;
  });

  if (loading || externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Ideas de Contenido Interno
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Genera ideas de contenido (tips de nutrición, ejercicios, motivación) para compartir con tus clientes
            </p>
          </div>
          <Button 
            onClick={generateNewIdeas} 
            disabled={generating}
            variant="default"
            size="sm"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Generar Ideas
              </>
            )}
          </Button>
        </div>

        {/* Filtros */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Categoría
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Todas
              </Button>
              {(['nutricion', 'ejercicio', 'motivacion', 'bienestar', 'recuperacion'] as InternalContentCategory[]).map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="mr-1">{getCategoryIcon(cat)}</span>
                  {getCategoryLabel(cat)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Formato
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFormat === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFormat('all')}
              >
                Todos
              </Button>
              {(['text', 'image', 'video', 'carousel'] as const).map((format) => (
                <Button
                  key={format}
                  variant={selectedFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFormat(format)}
                >
                  {getFormatIcon(format)}
                  <span className="ml-1 capitalize">{format}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Audiencia Objetivo
            </label>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: 'all_clients', label: 'Todos los clientes' },
                { value: 'new_clients', label: 'Clientes nuevos' },
                { value: 'active_clients', label: 'Clientes activos' },
                { value: 'inactive_clients', label: 'Clientes inactivos' },
              ] as const).map((audience) => (
                <Button
                  key={audience.value}
                  variant={targetAudience === audience.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTargetAudience(audience.value)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {audience.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Ideas */}
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay ideas con estos filtros</p>
              <Button onClick={generateNewIdeas} variant="outline" className="mt-4">
                Generar nuevas ideas
              </Button>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(idea.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {idea.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {getCategoryLabel(idea.category)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getFormatIcon(idea.format)}
                          <span className="capitalize">{idea.format}</span>
                        </Badge>
                        {idea.estimatedEngagement === 'high' && (
                          <Badge variant="default" className="bg-green-500">
                            Alto engagement
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {idea.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Plataformas sugeridas:</span>
                    <div className="flex gap-1">
                      {idea.suggestedPlatforms.map((platform) => (
                        <span key={platform} className="text-lg" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                    {idea.tags.length > 0 && (
                      <div className="flex gap-1 ml-2">
                        {idea.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(idea)}
                    >
                      {copiedId === idea.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                    {idea.canShareDirectly && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          // Aquí se implementaría la funcionalidad de compartir directamente
                          alert('Funcionalidad de compartir directamente - Por implementar');
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Compartir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredIdeas.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    💡 Consejo
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Puedes compartir estas ideas directamente con tus clientes por WhatsApp o email, 
                    o usarlas como base para crear contenido en redes sociales. Personaliza el contenido 
                    según las necesidades específicas de cada cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

