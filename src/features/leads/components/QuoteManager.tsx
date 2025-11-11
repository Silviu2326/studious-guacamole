import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select, Table } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, Quote } from '../types';
import { QuoteService } from '../services/quoteService';
import { QuoteBuilder } from './QuoteBuilder';
import { getLead } from '../api';
import {
  Plus,
  Edit,
  Trash2,
  Send,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Receipt,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface QuoteManagerProps {
  lead?: Lead;
  businessType: 'entrenador' | 'gimnasio';
}

export const QuoteManager: React.FC<QuoteManagerProps> = ({ lead, businessType }) => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(lead || null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadQuotes();
  }, [lead?.id, filter]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (lead) {
        filters.leadId = lead.id;
      }
      if (filter !== 'all') {
        filters.status = filter;
      }
      const data = await QuoteService.getQuotes(filters);
      setQuotes(data);
    } catch (error) {
      console.error('Error cargando presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!lead) {
      alert('Selecciona un lead primero');
      return;
    }
    setEditingQuote(null);
    setSelectedLead(lead);
    setShowBuilder(true);
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    if (quote.leadId) {
      getLead(quote.leadId).then(lead => {
        if (lead) {
          setSelectedLead(lead);
          setShowBuilder(true);
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este presupuesto?')) {
      try {
        await QuoteService.deleteQuote(id);
        await loadQuotes();
      } catch (error) {
        console.error('Error eliminando presupuesto:', error);
      }
    }
  };

  const handleSend = async (id: string) => {
    try {
      await QuoteService.sendQuote(id);
      await loadQuotes();
      alert('Presupuesto enviado correctamente');
    } catch (error) {
      console.error('Error enviando presupuesto:', error);
      alert('Error al enviar el presupuesto');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await QuoteService.approveQuote(id, user?.id || 'unknown');
      await loadQuotes();
    } catch (error) {
      console.error('Error aprobando presupuesto:', error);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      await QuoteService.rejectQuote(id, reason, user?.id || 'unknown');
      await loadQuotes();
    } catch (error) {
      console.error('Error rechazando presupuesto:', error);
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
      case 'sent':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'opened':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'sent':
        return 'Enviado';
      case 'opened':
        return 'Abierto';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const columns = [
    {
      key: 'quoteNumber' as keyof Quote,
      label: 'Número',
      render: (value: any, row: Quote) => (
        <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
          {row.quoteNumber}
        </div>
      )
    },
    {
      key: 'title' as keyof Quote,
      label: 'Título',
      render: (value: any, row: Quote) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-[#F1F5F9]">{row.title}</div>
          {row.leadId && (
            <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
              Lead ID: {row.leadId}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'total' as keyof Quote,
      label: 'Total',
      render: (value: any, row: Quote) => (
        <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
          ${row.total.toFixed(2)}
        </div>
      )
    },
    {
      key: 'status' as keyof Quote,
      label: 'Estado',
      render: (value: any, row: Quote) => (
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </span>
      )
    },
    {
      key: 'actions' as keyof Quote,
      label: 'Acciones',
      render: (value: any, row: Quote) => (
        <div className="flex items-center gap-2">
          {row.status === 'draft' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(row)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSend(row.id)}
              >
                <Send className="w-4 h-4" />
              </Button>
            </>
          )}
          {row.status === 'sent' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApprove(row.id)}
                title="Aprobar"
              >
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const reason = prompt('Razón del rechazo:');
                  if (reason) handleReject(row.id, reason);
                }}
                title="Rechazar"
              >
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
              {businessType === 'entrenador' ? 'Propuestas y Precios' : 'Presupuestos y Cotizaciones'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1 ml-14">
            {businessType === 'entrenador' 
              ? lead 
                ? `Crea y envía propuestas de precios personalizadas a ${lead.name}. Cuando aprueben, conviértelos en cliente.`
                : 'Crea propuestas de precios para tus leads. Cuando las aprueben, conviértelos en clientes.'
              : lead 
                ? `Presupuestos para ${lead.name}`
                : 'Gestiona todos los presupuestos'}
          </p>
        </div>
        {lead && (
          <Button
            variant="primary"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            {businessType === 'entrenador' ? 'Nueva Propuesta' : 'Nuevo Presupuesto'}
          </Button>
        )}
      </div>

      {/* Info Card para entrenadores cuando no hay presupuestos */}
      {businessType === 'entrenador' && quotes.length === 0 && !loading && (
        <Card variant="outlined" padding="lg" className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-[#F1F5F9] mb-2">
                ¿Por qué crear propuestas de precios?
              </h3>
              <p className="text-sm text-gray-700 dark:text-[#94A3B8] mb-3">
                Cuando un lead muestra interés, crear una propuesta formal aumenta significativamente las probabilidades de conversión.
              </p>
              <ul className="text-sm text-gray-700 dark:text-[#94A3B8] space-y-1 list-disc list-inside mb-3">
                <li><strong>Profesionalismo:</strong> Muestra que eres serio y organizado</li>
                <li><strong>Claridad:</strong> El lead sabe exactamente qué incluye y cuánto cuesta</li>
                <li><strong>Compromiso:</strong> Una propuesta aprobada es casi una venta cerrada</li>
                <li><strong>Seguimiento:</strong> Puedes ver quién abrió tu propuesta y cuándo</li>
              </ul>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                💡 <strong>Tip:</strong> Incluye descuentos por pago anticipado o planes de varios meses para incentivar la aprobación
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filtros */}
      {quotes.length > 0 && (
        <Card>
          <div className={ds.spacing.md}>
            <Select
              label="Filtrar por Estado"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'draft', label: 'Borradores' },
                { value: 'sent', label: 'Enviados' },
                { value: 'approved', label: 'Aprobados' },
                { value: 'rejected', label: 'Rechazados' }
              ]}
            />
          </div>
        </Card>
      )}

      {/* Tabla de presupuestos */}
      {quotes.length > 0 ? (
        <Card>
          <Table
            data={quotes}
            columns={columns}
            loading={loading}
            emptyMessage={businessType === 'entrenador' ? 'No hay propuestas creadas' : 'No hay presupuestos'}
          />
        </Card>
      ) : !loading && (
        <Card>
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-[#94A3B8] mb-2">
              {businessType === 'entrenador' 
                ? lead
                  ? `Aún no has creado ninguna propuesta para ${lead.name}.`
                  : 'Aún no has creado ninguna propuesta de precios.'
                : 'No hay presupuestos creados.'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {businessType === 'entrenador'
                ? lead
                  ? 'Crea tu primera propuesta para este lead y aumenta tus probabilidades de conversión.'
                  : 'Selecciona un lead y crea una propuesta personalizada.'
                : 'Crea tu primer presupuesto para empezar.'}
            </p>
          </div>
        </Card>
      )}

      {/* Modal de builder */}
      {selectedLead && (
        <QuoteBuilder
          lead={selectedLead}
          quote={editingQuote}
          isOpen={showBuilder}
          onClose={() => {
            setShowBuilder(false);
            setEditingQuote(null);
            setSelectedLead(lead || null);
          }}
          onSave={async (savedQuote) => {
            await loadQuotes();
          }}
        />
      )}
    </div>
  );
};

