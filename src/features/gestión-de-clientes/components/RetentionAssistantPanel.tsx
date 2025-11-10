import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Client, RetentionSuggestion } from '../types';
import { getRiskClients } from '../api/clients';
import { generateRetentionSuggestions, applyRetentionSuggestion } from '../api/retention-assistant';
import { createRetentionAction } from '../api/retention';
import { 
  Bot, 
  Mail, 
  MessageSquare, 
  Phone, 
  Gift, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface RetentionAssistantPanelProps {
  clientId?: string;
  onSuggestionApplied?: () => void;
}

export const RetentionAssistantPanel: React.FC<RetentionAssistantPanelProps> = ({ 
  clientId, 
  onSuggestionApplied 
}) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<RetentionSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, [clientId, user]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      if (clientId) {
        // Cargar sugerencias para un cliente específico
        const riskClients = await getRiskClients(user?.role || 'entrenador', user?.id);
        const client = riskClients.find(c => c.id === clientId);
        if (client) {
          setSelectedClient(client);
          const clientSuggestions = await generateRetentionSuggestions(client);
          setSuggestions(clientSuggestions);
        }
      } else {
        // Cargar sugerencias para todos los clientes en riesgo
        const riskClients = await getRiskClients(user?.role || 'entrenador', user?.id);
        if (riskClients.length > 0) {
          const allSuggestions: RetentionSuggestion[] = [];
          for (const client of riskClients.slice(0, 5)) { // Limitar a 5 clientes para performance
            const clientSuggestions = await generateRetentionSuggestions(client);
            allSuggestions.push(...clientSuggestions);
          }
          setSuggestions(allSuggestions.slice(0, 10)); // Mostrar máximo 10 sugerencias
        }
      }
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: RetentionSuggestion) => {
    setApplyingId(suggestion.id);
    try {
      // Crear la acción de retención
      await createRetentionAction({
        clientId: suggestion.clientId,
        type: suggestion.actionType === 'personalized-message' ? 'email' : suggestion.actionType,
        scheduledDate: new Date().toISOString(),
        status: 'pending',
        notes: suggestion.description,
      });

      // Aplicar la sugerencia
      await applyRetentionSuggestion(suggestion);

      // Recargar sugerencias
      await loadSuggestions();
      onSuggestionApplied?.();
    } catch (error) {
      console.error('Error aplicando sugerencia:', error);
    } finally {
      setApplyingId(null);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'offer':
        return <Gift className="w-4 h-4" />;
      case 'personalized-message':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="red">Alta</Badge>;
      case 'medium':
        return <Badge variant="yellow">Media</Badge>;
      case 'low':
        return <Badge variant="gray">Baja</Badge>;
      default:
        return <Badge variant="gray">-</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="green">Alto</Badge>;
      case 'medium':
        return <Badge variant="yellow">Medio</Badge>;
      case 'low':
        return <Badge variant="gray">Bajo</Badge>;
      default:
        return <Badge variant="gray">-</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Analizando clientes y generando sugerencias...</p>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay sugerencias de retención
        </h3>
        <p className="text-gray-600">
          {clientId 
            ? 'Este cliente no tiene sugerencias de retención en este momento.'
            : 'No hay clientes en riesgo que requieran acciones de retención en este momento.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                <Bot size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Asistente Virtual de Retención
                </h3>
                <p className="text-sm text-gray-600">
                  {suggestions.length} sugerencias personalizadas para retener clientes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    {getActionIcon(suggestion.actionType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {suggestion.title}
                      </h4>
                      {getPriorityBadge(suggestion.priority)}
                      {getImpactBadge(suggestion.expectedImpact)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>Confianza: {suggestion.confidence}%</span>
                      </div>
                      {suggestion.suggestedTiming && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{suggestion.suggestedTiming}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {suggestion.suggestedMessage && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Mensaje sugerido:</p>
                  <p className="text-sm text-gray-600 italic">
                    "{suggestion.suggestedMessage}"
                  </p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-blue-900 mb-1">Razonamiento:</p>
                <p className="text-sm text-blue-800">
                  {suggestion.reasoning}
                </p>
              </div>

              {suggestion.relatedFactors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestion.relatedFactors.map((factor, index) => (
                    <Badge key={index} variant="gray" size="sm">
                      {factor}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApplySuggestion(suggestion)}
                  disabled={applyingId === suggestion.id}
                >
                  {applyingId === suggestion.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Aplicar Sugerencia
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="hover" className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              💡 Consejo del Asistente
            </p>
            <p className="text-sm text-gray-600">
              Las sugerencias están ordenadas por prioridad e impacto esperado. 
              Aplica las de alta prioridad primero para maximizar la retención.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

