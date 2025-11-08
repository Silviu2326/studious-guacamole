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
  DollarSign
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
            Presupuestos y Cotizaciones
          </h2>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
            {lead ? `Presupuestos para ${lead.name}` : 'Gestiona todos los presupuestos'}
          </p>
        </div>
        {lead && (
          <Button
            variant="primary"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        )}
      </div>

      {/* Filtros */}
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

      {/* Tabla de presupuestos */}
      <Card>
        <Table
          data={quotes}
          columns={columns}
          loading={loading}
          emptyMessage="No hay presupuestos"
        />
      </Card>

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

