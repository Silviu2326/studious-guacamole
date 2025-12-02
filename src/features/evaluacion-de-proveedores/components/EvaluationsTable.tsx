import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { SupplierEvaluation } from '../types';
import { Edit, Trash2, Star, Calendar, User } from 'lucide-react';

interface EvaluationsTableProps {
  evaluations: SupplierEvaluation[];
  onEdit: (evaluation: SupplierEvaluation) => void;
  onDelete: (evaluationId: string) => void;
  loading?: boolean;
}

export const EvaluationsTable: React.FC<EvaluationsTableProps> = ({
  evaluations,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} className="text-yellow-400 fill-yellow-400 opacity-50" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(score);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      key: 'supplierName',
      label: 'Proveedor',
      render: (value: string, row: SupplierEvaluation) => (
        <div className="font-medium text-gray-900">
          {value}
        </div>
      ),
    },
    {
      key: 'concept',
      label: 'Concepto',
      render: (value: string, row: SupplierEvaluation) => (
        <div className="text-sm text-gray-600 max-w-xs truncate" title={value || 'Sin concepto'}>
          {value || 'Sin concepto'}
        </div>
      ),
    },
    {
      key: 'evaluationDate',
      label: 'Fecha',
      render: (value: Date | string, row: SupplierEvaluation) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'overallScore',
      label: 'Calificación',
      render: (value: number, row: SupplierEvaluation) => renderStars(value),
      align: 'center' as const,
    },
    {
      key: 'evaluatorName',
      label: 'Evaluador',
      render: (value: string, row: SupplierEvaluation) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          {value}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: SupplierEvaluation) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar evaluación"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Eliminar evaluación"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <Table
      data={evaluations}
      columns={columns}
      loading={loading}
      emptyMessage="No hay evaluaciones registradas. Crea una nueva evaluación para comenzar."
    />
  );
};

