import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp, MessageSquare, Target, FileText, Copy, Loader2 } from 'lucide-react';
import { Button, Card, Textarea, Select, Badge } from '../../../components/componentsreutilizables';
import type { ContentAIFeedback, PlannerContentType, SocialPlatform } from '../types';
import { analyzeContentFeedback, getFeedbackHistory } from '../api/contentFeedback';

interface ContentAIFeedbackProps {
  loading?: boolean;
}

const contentTypeOptions: Array<{ value: PlannerContentType; label: string }> = [
  { value: 'post', label: 'Post' },
  { value: 'story', label: 'Story' },
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'live', label: 'Live' },
  { value: 'video', label: 'Video' },
];

const platformOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter' },
];

export function ContentAIFeedback({ loading: externalLoading }: ContentAIFeedbackProps) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<PlannerContentType>('post');
  const [platform, setPlatform] = useState<SocialPlatform | ''>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<ContentAIFeedback | null>(null);
  const [history, setHistory] = useState<ContentAIFeedback[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert('Por favor, ingresa contenido para analizar');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeContentFeedback({
        content: content.trim(),
        contentType,
        platform: platform || undefined,
      });
      setFeedback(result);
      loadHistory();
    } catch (error) {
      console.error('Error analyzing content:', error);
      alert('Error al analizar el contenido. Intenta nuevamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadHistory = async () => {
    try {
      const historyData = await getFeedbackHistory(5);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 65) return 'bg-blue-50 border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getLevelBadgeVariant = (level: string) => {
    if (level === 'excelente') return 'green';
    if (level === 'bueno') return 'blue';
    if (level === 'regular') return 'yellow';
    return 'red';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  if (externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Retroalimentación IA de Contenido
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Recibe retroalimentación sobre claridad, CTA y coherencia para mejorar cada publicación
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) loadHistory();
          }}
        >
          {showHistory ? 'Ocultar historial' : 'Ver historial'}
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Formulario de análisis */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contenido a analizar *
            </label>
            <Textarea
              placeholder="Pega aquí el contenido que quieres analizar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              {content.length} caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de contenido
              </label>
              <Select
                options={contentTypeOptions}
                value={contentType}
                onChange={(e) => setContentType(e.target.value as PlannerContentType)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Plataforma (opcional)
              </label>
              <Select
                options={[{ value: '', label: 'Todas' }, ...platformOptions]}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform | '')}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleAnalyze}
            disabled={analyzing || !content.trim()}
            leftIcon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            fullWidth
          >
            {analyzing ? 'Analizando...' : 'Analizar contenido'}
          </Button>
        </div>

        {/* Historial */}
        {showHistory && history.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Historial reciente</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setFeedback(item)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="blue" size="sm">
                        {item.contentType}
                      </Badge>
                      {item.platform && (
                        <Badge variant="purple" size="sm">
                          {item.platform}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {item.originalContent.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-xs font-semibold ${getScoreColor(item.feedback.overall.score)}`}>
                      Puntuación general: {item.feedback.overall.score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultados del análisis */}
        {feedback && (
          <div className="border-t border-slate-200 pt-6 space-y-6">
            {/* Puntuación general */}
            <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(feedback.feedback.overall.score)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`w-6 h-6 ${getScoreColor(feedback.feedback.overall.score)}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Puntuación General</h3>
                    <p className="text-sm text-slate-600">{feedback.feedback.overall.summary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(feedback.feedback.overall.score)}`}>
                    {feedback.feedback.overall.score}
                  </div>
                  <Badge variant={getLevelBadgeVariant(feedback.feedback.overall.level) as any} size="md">
                    {feedback.feedback.overall.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Puntuaciones individuales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Claridad */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-slate-900">Claridad</h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(feedback.feedback.claridad.score)}`}>
                  {feedback.feedback.claridad.score}
                </div>
                <Badge variant={getLevelBadgeVariant(feedback.feedback.claridad.level) as any} size="sm" className="mb-2">
                  {feedback.feedback.claridad.level}
                </Badge>
                <p className="text-sm text-slate-600 mb-3">{feedback.feedback.claridad.feedback}</p>
                {feedback.feedback.claridad.suggestions.length > 0 && (
                  <ul className="text-xs text-slate-500 space-y-1">
                    {feedback.feedback.claridad.suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* CTA */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-slate-900">CTA</h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(feedback.feedback.cta.score)}`}>
                  {feedback.feedback.cta.score}
                </div>
                <Badge variant={getLevelBadgeVariant(feedback.feedback.cta.level) as any} size="sm" className="mb-2">
                  {feedback.feedback.cta.level}
                </Badge>
                <p className="text-sm text-slate-600 mb-3">{feedback.feedback.cta.feedback}</p>
                {feedback.feedback.cta.suggestions.length > 0 && (
                  <ul className="text-xs text-slate-500 space-y-1">
                    {feedback.feedback.cta.suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Coherencia */}
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-slate-900">Coherencia</h4>
                </div>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(feedback.feedback.coherencia.score)}`}>
                  {feedback.feedback.coherencia.score}
                </div>
                <Badge variant={getLevelBadgeVariant(feedback.feedback.coherencia.level) as any} size="sm" className="mb-2">
                  {feedback.feedback.coherencia.level}
                </Badge>
                <p className="text-sm text-slate-600 mb-3">{feedback.feedback.coherencia.feedback}</p>
                {feedback.feedback.coherencia.suggestions.length > 0 && (
                  <ul className="text-xs text-slate-500 space-y-1">
                    {feedback.feedback.coherencia.suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Sugerencias prioritarias */}
            {feedback.suggestions.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-slate-900">Sugerencias de mejora</h4>
                </div>
                <div className="space-y-2">
                  {feedback.suggestions
                    .sort((a, b) => {
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map((suggestion, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Badge
                          variant={suggestion.priority === 'high' ? 'red' : suggestion.priority === 'medium' ? 'yellow' : 'gray'}
                          size="sm"
                        >
                          {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{suggestion.suggestion}</p>
                          {suggestion.example && (
                            <p className="text-xs text-slate-500 italic mt-1">Ejemplo: {suggestion.example}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Versión mejorada */}
            {feedback.improvedVersion && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-slate-900">Versión mejorada sugerida</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(feedback.improvedVersion!)}
                    leftIcon={<Copy className="w-4 h-4" />}
                  >
                    Copiar
                  </Button>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{feedback.improvedVersion}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

