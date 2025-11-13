import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  IntelligentSummary,
} from '../types';
import {
  generateIntelligentSummary,
  getIntelligentSummaries,
  createShareableLink,
  exportSummaryAsPDF,
  exportSummaryAsPresentation,
  sendSummaryByEmail,
} from '../api/intelligentSummaries';
import { Card, Button, Modal, Select, Input, Textarea } from '../../../components/componentsreutilizables';
import {
  FileText,
  Share2,
  Download,
  Mail,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Copy,
  Eye,
  Presentation,
} from 'lucide-react';

interface IntelligentSummaryGeneratorProps {
  role: 'entrenador' | 'gimnasio';
  period?: string | 'semana' | 'mes' | 'trimestre';
}

export const IntelligentSummaryGenerator: React.FC<IntelligentSummaryGeneratorProps> = ({
  role,
  period,
}) => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<IntelligentSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<IntelligentSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Configuración de generación
  const [config, setConfig] = useState({
    includeDetailedMetrics: true,
    includeCharts: true,
    includeActionItems: true,
    audience: 'stakeholders' as 'management' | 'investors' | 'team' | 'stakeholders',
    language: 'es' as 'es' | 'en' | 'ca',
  });

  // Compartir
  const [shareConfig, setShareConfig] = useState({
    expiresInDays: 30,
    passwordProtected: false,
    password: '',
    recipients: [] as string[],
  });

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    setLoading(true);
    try {
      const data = await getIntelligentSummaries();
      setSummaries(data);
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const currentPeriod = period || new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      const summary = await generateIntelligentSummary(role, currentPeriod, config);
      await loadSummaries();
      setSelectedSummary(summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Error al generar el resumen');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!selectedSummary) return;

    try {
      const link = await createShareableLink(selectedSummary.id, {
        expiresInDays: shareConfig.expiresInDays,
        passwordProtected: shareConfig.passwordProtected,
        password: shareConfig.password || undefined,
      });

      const shareUrl = `${window.location.origin}/objetivos-rendimiento/summary/${link.token}`;
      setShareLink(shareUrl);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Error creating shareable link:', error);
      alert('Error al crear enlace compartible');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Enlace copiado al portapapeles');
  };

  const handleExportPDF = async () => {
    if (!selectedSummary) return;

    try {
      const filename = await exportSummaryAsPDF(selectedSummary.id);
      alert(`Resumen exportado: ${filename}`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error al exportar PDF');
    }
  };

  const handleExportPresentation = async () => {
    if (!selectedSummary) return;

    try {
      const filename = await exportSummaryAsPresentation(selectedSummary.id);
      alert(`Presentación exportada: ${filename}`);
    } catch (error) {
      console.error('Error exporting presentation:', error);
      alert('Error al exportar presentación');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedSummary || shareConfig.recipients.length === 0) {
      alert('Por favor, ingresa al menos un destinatario');
      return;
    }

    try {
      await sendSummaryByEmail(selectedSummary.id, shareConfig.recipients);
      alert('Resumen enviado por email exitosamente');
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar email');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'text-green-700 bg-green-100';
      case 'at_risk':
        return 'text-yellow-700 bg-yellow-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      case 'in_progress':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Resúmenes Inteligentes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Genera resúmenes completos (narrativa + métricas + alertas) para compartir con stakeholders
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Nuevo Resumen
              </>
            )}
          </Button>
        </div>

        {/* Configuración */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audiencia
            </label>
            <Select
              value={config.audience}
              onChange={(e) => setConfig({ ...config, audience: e.target.value as any })}
              options={[
                { value: 'stakeholders', label: 'Stakeholders' },
                { value: 'management', label: 'Dirección' },
                { value: 'investors', label: 'Inversores' },
                { value: 'team', label: 'Equipo' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <Select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
              options={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
                { value: 'ca', label: 'Català' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Lista de resúmenes */}
      {loading ? (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando resúmenes...</p>
        </Card>
      ) : summaries.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay resúmenes generados aún</p>
          <p className="text-sm text-gray-500 mt-2">
            Haz clic en "Generar Nuevo Resumen" para crear uno
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {summaries.map((summary) => (
            <Card
              key={summary.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedSummary(summary);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {summary.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Período: {summary.period} | Generado: {new Date(summary.generatedAt).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      <Target className="w-4 h-4 inline mr-1" />
                      {summary.keyMetrics.totalObjectives} objetivos
                    </span>
                    <span className="text-green-600">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      {summary.keyMetrics.achievedObjectives} alcanzados
                    </span>
                    {summary.criticalAlerts.length > 0 && (
                      <span className="text-red-600">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        {summary.criticalAlerts.length} alertas
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSummary(summary);
                      handleShare();
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSummary(summary);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de resumen */}
      {selectedSummary && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedSummary.title}
          size="xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Narrativa */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {selectedSummary.narrative.executiveSummary}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Puntos Destacados</h4>
                  <ul className="space-y-1">
                    {selectedSummary.narrative.keyHighlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Oportunidades</h4>
                  <ul className="space-y-1">
                    {selectedSummary.narrative.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <TrendingUp size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                <ul className="space-y-2">
                  {selectedSummary.narrative.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600 font-bold">{idx + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Métricas */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Métricas Clave
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedSummary.keyMetrics.totalObjectives}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Objetivos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedSummary.keyMetrics.achievedObjectives}</p>
                  <p className="text-xs text-gray-600 mt-1">Alcanzados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{selectedSummary.keyMetrics.atRiskObjectives}</p>
                  <p className="text-xs text-gray-600 mt-1">En Riesgo</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedSummary.keyMetrics.successRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600 mt-1">Tasa de Éxito</p>
                </div>
              </div>
            </Card>

            {/* Alertas Críticas */}
            {selectedSummary.criticalAlerts.length > 0 && (
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Alertas Críticas ({selectedSummary.criticalAlerts.length})
                </h3>
                <div className="space-y-3">
                  {selectedSummary.criticalAlerts.map((alert) => (
                    <div
                      key={alert.alertId}
                      className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity === 'critical' ? 'Crítico' :
                           alert.severity === 'high' ? 'Alto' :
                           alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      {alert.recommendedAction && (
                        <p className="text-xs text-gray-600">
                          <strong>Acción recomendada:</strong> {alert.recommendedAction}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Acciones */}
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="secondary" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="secondary" onClick={handleExportPresentation}>
                <Presentation className="w-4 h-4 mr-2" />
                Exportar Presentación
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de compartir */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Compartir Resumen"
        size="md"
      >
        <div className="space-y-4">
          {shareLink && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace Compartible
              </label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enviar por Email
            </label>
            <Textarea
              placeholder="Ingresa emails separados por comas"
              value={shareConfig.recipients.join(', ')}
              onChange={(e) => setShareConfig({
                ...shareConfig,
                recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean),
              })}
              rows={3}
            />
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleSendEmail}
              disabled={shareConfig.recipients.length === 0}
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

