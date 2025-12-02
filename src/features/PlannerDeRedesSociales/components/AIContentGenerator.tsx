import React, { useState, useEffect } from 'react';
import {
  AIContentRequest,
  AIContentResponse,
  AIContentHistory,
  generateAIContent,
  getAIContentHistory,
  optimizeContentWithAI
} from '../api/aiContent';
import { SocialPlatform, getPlatformIcon } from '../api/social';
import { Card, Button, Select, Modal } from '../../../components/componentsreutilizables';
import {
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  Save,
  History,
  Wand2,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface AIContentGeneratorProps {
  onContentGenerated?: (content: AIContentResponse) => void;
}

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  onContentGenerated
}) => {
  const [request, setRequest] = useState<AIContentRequest>({
    topic: 'motivacion',
    type: 'post',
    platform: 'instagram',
    tone: 'motivational',
    length: 'medium',
    includeHashtags: true,
    includeCallToAction: true
  });
  const [response, setResponse] = useState<AIContentResponse | null>(null);
  const [history, setHistory] = useState<AIContentHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAIContentHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAIContent(request);
      setResponse(result);
      setSelectedVariation(0);
    } catch (err: any) {
      alert('Error al generar contenido: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async (content: string) => {
    setIsOptimizing(true);
    try {
      const optimized = await optimizeContentWithAI(content, request.platform);
      if (response) {
        setResponse({
          ...response,
          content: optimized
        });
      }
    } catch (err: any) {
      alert('Error al optimizar: ' + err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = () => {
    if (response) {
      onContentGenerated?.(response);
      setResponse(null);
      setRequest({
        topic: 'motivacion',
        type: 'post',
        platform: 'instagram',
        tone: 'motivational',
        length: 'medium',
        includeHashtags: true,
        includeCallToAction: true
      });
    }
  };

  const topics = [
    { value: 'ejercicio', label: 'Ejercicio' },
    { value: 'nutricion', label: 'Nutrición' },
    { value: 'motivacion', label: 'Motivación' },
    { value: 'transformacion', label: 'Transformación' },
    { value: 'entrenamiento', label: 'Entrenamiento' }
  ];

  const tones = [
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'motivational', label: 'Motivacional' },
    { value: 'educational', label: 'Educativo' },
    { value: 'friendly', label: 'Amigable' }
  ];

  const lengths = [
    { value: 'short', label: 'Corto (100-200 caracteres)' },
    { value: 'medium', label: 'Medio (200-500 caracteres)' },
    { value: 'long', label: 'Largo (500+ caracteres)' }
  ];

  const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'linkedin'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-purple-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generación de Contenido con IA</h3>
            <p className="text-sm text-gray-600">Genera contenido optimizado usando inteligencia artificial</p>
          </div>
        </div>
        <Button
          onClick={() => setIsHistoryOpen(true)}
          variant="secondary"
          size="sm"
          leftIcon={<History size={18} />}
        >
          Historial
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Configuración</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <Select
                value={request.topic}
                onChange={(e) => setRequest(prev => ({ ...prev, topic: e.target.value }))}
                options={topics}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Contenido
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['post', 'story', 'reel', 'video'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setRequest(prev => ({ ...prev, type: type as any }))}
                    className={`p-3 border-2 rounded-xl transition-all text-sm font-medium ${
                      request.type === type
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type === 'post' ? 'Post' : type === 'story' ? 'Story' : type === 'reel' ? 'Reel' : 'Video'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setRequest(prev => ({ ...prev, platform }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      request.platform === platform
                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{getPlatformIcon(platform)}</span>
                    <span className="capitalize">{platform}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono
              </label>
              <Select
                value={request.tone}
                onChange={(e) => setRequest(prev => ({ ...prev, tone: e.target.value as any }))}
                options={tones}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud
              </label>
              <Select
                value={request.length}
                onChange={(e) => setRequest(prev => ({ ...prev, length: e.target.value as any }))}
                options={lengths}
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={request.includeHashtags}
                  onChange={(e) => setRequest(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Incluir hashtags sugeridos</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={request.includeCallToAction}
                  onChange={(e) => setRequest(prev => ({ ...prev, includeCallToAction: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Incluir llamada a la acción</span>
              </label>
            </div>
            
            {request.context && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contexto Adicional
                </label>
                <textarea
                  value={request.context}
                  onChange={(e) => setRequest(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Añade contexto adicional para personalizar el contenido..."
                  rows={3}
                  className="w-full rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>
            )}
            
            <Button
              onClick={handleGenerate}
              loading={isGenerating}
              leftIcon={<Sparkles size={18} />}
              className="w-full"
            >
              Generar con IA
            </Button>
          </div>
        </Card>

        {/* Generated Content */}
        {response ? (
          <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Contenido Generado</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Confianza:</span>
                <span className="text-sm font-semibold text-green-600">{response.confidence}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Variations */}
              {response.variations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variaciones
                  </label>
                  <div className="space-y-2">
                    {response.variations.map((variation, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVariation(idx);
                          setResponse(prev => prev ? { ...prev, content: variation } : null);
                        }}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedVariation === idx
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm text-gray-700 line-clamp-2">{variation}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Main Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido
                </label>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                    {response.content}
                  </pre>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>{response.content.length} caracteres</span>
                  <Button
                    onClick={() => handleOptimize(response.content)}
                    variant="ghost"
                    size="sm"
                    loading={isOptimizing}
                    leftIcon={<Wand2 size={14} />}
                  >
                    Optimizar
                  </Button>
                </div>
              </div>
              
              {/* Hashtags */}
              {response.hashtags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hashtags Sugeridos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {response.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suggestions */}
              {response.suggestions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sugerencias
                  </label>
                  <div className="space-y-2">
                    {response.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                        <TrendingUp size={16} className="text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  leftIcon={<Save size={18} />}
                  className="flex-1"
                >
                  Guardar
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="secondary"
                  leftIcon={<RefreshCw size={18} />}
                >
                  Regenerar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm ring-1 ring-gray-200">
            <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Genera contenido con IA</h3>
            <p className="text-gray-600">Configura las opciones y haz clic en "Generar con IA"</p>
          </Card>
        )}
      </div>

      {/* History Modal */}
      {isHistoryOpen && (
        <Modal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          title="Historial de Contenido Generado"
          size="lg"
        >
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 bg-white shadow-sm ring-1 ring-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getPlatformIcon(item.request.platform)}</span>
                        <h5 className="font-semibold text-gray-900">{item.request.topic}</h5>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                          {item.request.tone}
                        </span>
                        {item.used && (
                          <CheckCircle2 size={16} className="text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.response.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.response.hashtags.slice(0, 5).map((tag, idx) => (
                          <span key={idx} className="text-xs text-blue-600">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600 ml-4">
                      <p>{new Date(item.createdAt).toLocaleDateString('es-ES')}</p>
                      <p>{new Date(item.createdAt).toLocaleTimeString('es-ES')}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center bg-white shadow-sm">
                <History size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin historial</h3>
                <p className="text-gray-600">No hay contenido generado aún</p>
              </Card>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

