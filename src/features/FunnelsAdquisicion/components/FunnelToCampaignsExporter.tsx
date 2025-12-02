import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, FileText, Mail, MessageCircle, Users, Clock, Sparkles, Loader2 } from 'lucide-react';
import { Button, Card, Checkbox, Textarea } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import { FunnelExportRequest, FunnelExportResponse } from '../types';

interface FunnelToCampaignsExporterProps {
  funnelId: string;
  funnelName: string;
  onExportComplete?: (response: FunnelExportResponse) => void;
}

export function FunnelToCampaignsExporter({
  funnelId,
  funnelName,
  onExportComplete,
}: FunnelToCampaignsExporterProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exportResponse, setExportResponse] = useState<FunnelExportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeCampaigns, setIncludeCampaigns] = useState(true);
  const [includeSequences, setIncludeSequences] = useState(true);
  const [includeLists, setIncludeLists] = useState(true);
  const [targetCampaignsModule, setTargetCampaignsModule] = useState(true);
  const [notes, setNotes] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setExportResponse(null);

    try {
      const request: FunnelExportRequest = {
        funnelId,
        includeAssets,
        includeCampaigns,
        includeSequences,
        includeLists,
        targetCampaignsModule,
        notes: notes.trim() || undefined,
      };

      const response = await FunnelsAdquisicionService.exportFunnelToCampaigns(request);
      setExportResponse(response);

      if (onExportComplete) {
        onExportComplete(response);
      }

      // Si se exportó directamente al módulo, navegar después de un breve delay
      if (targetCampaignsModule && response.success) {
        setTimeout(() => {
          navigate('/dashboard/marketing/campanas-automatizacion');
        }, 2000);
      }
    } catch (err) {
      console.error('Error exportando funnel:', err);
      setError('Error al exportar el funnel. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (exportResponse && exportResponse.success) {
    return (
      <Card className="p-6 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              ¡Funnel exportado exitosamente!
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-200 mb-4">{exportResponse.message}</p>

            {exportResponse.importedCampaignIds && exportResponse.importedCampaignIds.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                  Campañas creadas: {exportResponse.importedCampaignIds.length}
                </p>
              </div>
            )}

            {exportResponse.importedSequenceIds && exportResponse.importedSequenceIds.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                  Secuencias creadas: {exportResponse.importedSequenceIds.length}
                </p>
              </div>
            )}

            {exportResponse.warnings && exportResponse.warnings.length > 0 && (
              <div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-2">Advertencias:</p>
                <ul className="text-xs text-amber-700 dark:text-amber-200 space-y-1">
                  {exportResponse.warnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {targetCampaignsModule && (
              <div className="mt-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-200 mb-3">
                  Redirigiendo a Campañas & Automatización...
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/dashboard/marketing/campanas-automatizacion')}
                  className="inline-flex items-center gap-2"
                >
                  Ir a Campañas & Automatización
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
          <Send className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            Exportar Funnel a Campañas & Automatización
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Envía este funnel con todos sus assets (mensajes, listas, timing) al módulo de Campañas & Automatización
            para activarlo sin duplicar trabajo.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
            Funnel: <span className="font-normal text-gray-900 dark:text-slate-100">{funnelName}</span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Incluir en la exportación:</p>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer">
            <Checkbox
              checked={includeAssets}
              onChange={(e) => setIncludeAssets(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">Assets</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Mensajes, plantillas, formularios, landing pages y lead magnets
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer">
            <Checkbox
              checked={includeCampaigns}
              onChange={(e) => setIncludeCampaigns(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">Campañas</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Campañas multicanal (email, WhatsApp, SMS) configuradas
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer">
            <Checkbox
              checked={includeSequences}
              onChange={(e) => setIncludeSequences(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">Secuencias</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Secuencias de nurturing con timing y condiciones
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/50 cursor-pointer">
            <Checkbox
              checked={includeLists}
              onChange={(e) => setIncludeLists(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-slate-100">Listas</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Listas de segmentación y audiencias del funnel
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/10 cursor-pointer">
            <Checkbox
              checked={targetCampaignsModule}
              onChange={(e) => setTargetCampaignsModule(e.target.checked)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  Exportar directamente a Campañas & Automatización
                </span>
              </div>
              <p className="text-xs text-indigo-700 dark:text-indigo-200">
                Si está marcado, el funnel se importará automáticamente en el módulo de Campañas & Automatización.
                Si no, se generará un paquete de exportación que podrás revisar antes.
              </p>
            </div>
          </label>
        </div>

        <div>
          <Textarea
            label="Notas (opcional)"
            placeholder="Añade notas o comentarios sobre esta exportación..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <Button
            variant="primary"
            size="md"
            onClick={handleExport}
            disabled={loading || (!includeAssets && !includeCampaigns && !includeSequences && !includeLists)}
            className="inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Exportar Funnel
              </>
            )}
          </Button>
          {targetCampaignsModule && (
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Se redirigirá automáticamente a Campañas & Automatización
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

