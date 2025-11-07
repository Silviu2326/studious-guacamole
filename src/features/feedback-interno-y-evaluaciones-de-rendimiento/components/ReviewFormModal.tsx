import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { ReviewTemplate, PerformanceReview, ReviewScore, ReviewFormData } from '../types';

export interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
  template: ReviewTemplate;
  initialData?: PerformanceReview | null;
  trainers?: Array<{ id: string; name: string }>;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  template,
  initialData,
  trainers = [],
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    staffMemberId: initialData?.staffMemberId || '',
    templateId: template.id,
    scores: template.kpis.map(kpi => ({
      kpiId: kpi.id,
      score: null,
      comment: '',
    })),
    comments: '',
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        staffMemberId: initialData.staffMemberId,
        templateId: initialData.templateId,
        scores: template.kpis.map(kpi => {
          const existingScore = initialData.scores.find(s => s.kpiId === kpi.id);
          return {
            kpiId: kpi.id,
            score: existingScore?.score || null,
            comment: existingScore?.comment || '',
          };
        }),
        comments: initialData.comments || '',
        status: initialData.status,
      });
    } else {
      setFormData({
        staffMemberId: '',
        templateId: template.id,
        scores: template.kpis.map(kpi => ({
          kpiId: kpi.id,
          score: null,
          comment: '',
        })),
        comments: '',
        status: 'draft',
      });
    }
  }, [initialData, template]);

  const handleScoreChange = (kpiId: string, value: number | null) => {
    setFormData(prev => ({
      ...prev,
      scores: prev.scores.map(score =>
        score.kpiId === kpiId ? { ...score, score: value } : score
      ),
    }));
  };

  const handleCommentChange = (kpiId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scores: prev.scores.map(score =>
        score.kpiId === kpiId ? { ...score, comment: value } : score
      ),
    }));
  };

  const handleGeneralCommentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      comments: value,
    }));
  };

  const handleSubmit = async () => {
    if (!initialData && !formData.staffMemberId) {
      alert('Por favor, selecciona un entrenador');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error al enviar la evaluación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Evaluación de Rendimiento' : 'Nueva Evaluación de Rendimiento'}
      size="xl"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {formData.status === 'draft' ? 'Guardar Borrador' : 'Finalizar Evaluación'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Template Info */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {template.name}
          </h3>
          {template.description && (
            <p className="text-gray-600">
              {template.description}
            </p>
          )}
        </div>

        {/* Trainer Selection (only when creating new review) */}
        {!initialData && trainers.length > 0 && (
          <div>
            <Select
              label="Entrenador"
              options={trainers.map(trainer => ({
                value: trainer.id,
                label: trainer.name,
              }))}
              value={formData.staffMemberId}
              onChange={(e) => setFormData(prev => ({ ...prev, staffMemberId: e.target.value }))}
              placeholder="Selecciona un entrenador"
            />
          </div>
        )}

        {/* KPIs Form */}
        <div className="space-y-6">
          {template.kpis.map((kpi) => {
            const score = formData.scores.find(s => s.kpiId === kpi.id);
            return (
              <div key={kpi.id} className="border-b border-gray-200 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {kpi.name}
                    {kpi.target && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        (Objetivo: {kpi.target}{kpi.unit ? ` ${kpi.unit}` : ''})
                      </span>
                    )}
                  </label>
                  {kpi.description && (
                    <p className="text-sm text-gray-600">
                      {kpi.description}
                    </p>
                  )}
                </div>

                {kpi.type === 'quantitative' ? (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      value={score?.score?.toString() || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        handleScoreChange(kpi.id, value);
                      }}
                      placeholder={`Introduce el valor${kpi.unit ? ` en ${kpi.unit}` : ''}`}
                    />
                    <Textarea
                      value={score?.comment || ''}
                      onChange={(e) => handleCommentChange(kpi.id, e.target.value)}
                      placeholder="Comentarios adicionales..."
                    />
                  </div>
                ) : (
                  <Textarea
                    value={score?.comment || ''}
                    onChange={(e) => handleCommentChange(kpi.id, e.target.value)}
                    placeholder="Escribe tu evaluación cualitativa..."
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* General Comments */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Comentarios Generales
          </label>
          <Textarea
            value={formData.comments || ''}
            onChange={(e) => handleGeneralCommentChange(e.target.value)}
            placeholder="Comentarios generales sobre el rendimiento del empleado..."
          />
        </div>

        {/* Status Selection */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Estado:
          </label>
          <div className="flex gap-2">
            <Button
              variant={formData.status === 'draft' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
            >
              Borrador
            </Button>
            <Button
              variant={formData.status === 'completed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, status: 'completed' }))}
            >
              Completada
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

