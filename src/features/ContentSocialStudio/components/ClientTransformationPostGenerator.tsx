import { useState, useEffect } from 'react';
import { Badge, Button, Card, Select } from '../../../components/componentsreutilizables';
import type {
  ClientProgressMetrics,
  PostTemplate,
  GeneratedTransformationPost,
} from '../types';
import {
  getClientsWithProgress,
  TRANSFORMATION_TEMPLATES,
  generateTransformationPost,
  requestClientPermission,
} from '../api/clientTransformations';
import { ICON_MAP } from './iconMap';
import { Users, Sparkles, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface ClientTransformationPostGeneratorProps {
  loading?: boolean;
}

export function ClientTransformationPostGenerator({ loading: externalLoading }: ClientTransformationPostGeneratorProps) {
  const [clients, setClients] = useState<ClientProgressMetrics[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [generatedPost, setGeneratedPost] = useState<GeneratedTransformationPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  useEffect(() => {
    if (!externalLoading) {
      loadClients();
    }
  }, [externalLoading]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const clientsData = await getClientsWithProgress();
      setClients(clientsData);
      if (clientsData.length > 0 && !selectedClientId) {
        setSelectedClientId(clientsData[0].clientId);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find((c) => c.clientId === selectedClientId);

  const handleGenerate = async () => {
    if (!selectedClientId || !selectedTemplateId) return;

    setGenerating(true);
    try {
      const post = await generateTransformationPost(selectedClientId, selectedTemplateId);
      setGeneratedPost(post);
    } catch (error) {
      console.error('Error generando post:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleRequestPermission = async () => {
    if (!generatedPost) return;

    setRequestingPermission(true);
    try {
      const result = await requestClientPermission(generatedPost.clientId, generatedPost.id);
      if (result.success) {
        setGeneratedPost({
          ...generatedPost,
          permissionStatus: result.permissionStatus,
        });
      }
    } catch (error) {
      console.error('Error solicitando permiso:', error);
    } finally {
      setRequestingPermission(false);
    }
  };

  const getPermissionBadge = (status: GeneratedTransformationPost['permissionStatus']) => {
    switch (status) {
      case 'granted':
        return (
          <Badge variant="green" size="sm" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Permiso concedido
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="yellow" size="sm" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Permiso pendiente
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="red" size="sm" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Permiso denegado
          </Badge>
        );
      default:
        return (
          <Badge variant="gray" size="sm">
            Permiso no solicitado
          </Badge>
        );
    }
  };

  if (externalLoading || loading) {
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
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {ICON_MAP.users ? <ICON_MAP.users className="w-5 h-5 text-indigo-500" /> : <Users className="w-5 h-5 text-indigo-500" />}
          <h2 className="text-xl font-semibold text-slate-900">
            Generador de Posts de Transformación
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Selecciona un cliente, elige una plantilla y genera automáticamente un post destacando su logro
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Selección de Cliente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Seleccionar Cliente
          </label>
          <Select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setGeneratedPost(null);
            }}
            options={clients.map((client) => ({
              value: client.clientId,
              label: client.clientName,
            }))}
            placeholder="Selecciona un cliente"
          />
        </div>

        {/* Información del Cliente Seleccionado */}
        {selectedClient && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Métricas de Progreso
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedClient.weight && (
                <div>
                  <p className="text-xs text-slate-500">Peso</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedClient.weight.current.toFixed(1)} {selectedClient.weight.unit}
                  </p>
                  {selectedClient.weight.change !== 0 && (
                    <p className={`text-xs ${selectedClient.weight.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedClient.weight.change > 0 ? '+' : ''}
                      {selectedClient.weight.change.toFixed(1)} {selectedClient.weight.unit}
                    </p>
                  )}
                </div>
              )}
              {selectedClient.measurements?.waist && (
                <div>
                  <p className="text-xs text-slate-500">Cintura</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedClient.measurements.waist.current}cm
                  </p>
                  {selectedClient.measurements.waist.change !== 0 && (
                    <p className={`text-xs ${selectedClient.measurements.waist.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedClient.measurements.waist.change > 0 ? '+' : ''}
                      {selectedClient.measurements.waist.change}cm
                    </p>
                  )}
                </div>
              )}
              {selectedClient.achievements && selectedClient.achievements.length > 0 && (
                <div className="col-span-2 md:col-span-3">
                  <p className="text-xs text-slate-500 mb-1">Logros</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="blue" size="sm">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedClient.photos && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Fotos: {selectedClient.photos.hasPermission ? '✅ Permiso concedido' : '❌ Permiso pendiente'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selección de Plantilla */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Plantilla de Post
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TRANSFORMATION_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedTemplateId === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setGeneratedPost(null);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="purple" size="sm">
                    {template.format.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón Generar */}
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!selectedClientId || !selectedTemplateId || generating}
          className="w-full"
        >
          {generating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Post
            </>
          )}
        </Button>

        {/* Post Generado */}
        {generatedPost && (
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Post Generado</h3>
              {getPermissionBadge(generatedPost.permissionStatus)}
            </div>

            <div className="bg-white rounded-xl p-4 mb-4 border border-slate-200">
              <p className="text-sm text-slate-700 whitespace-pre-line">
                {generatedPost.content.caption}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {generatedPost.content.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-indigo-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedPost.content.caption);
                }}
              >
                Copiar Contenido
              </Button>
              {generatedPost.permissionStatus === 'not_requested' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestPermission}
                  disabled={requestingPermission}
                >
                  {requestingPermission ? 'Enviando...' : 'Solicitar Permiso al Cliente'}
                </Button>
              )}
              <Button variant="ghost" size="sm">
                Agregar al Planner
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

