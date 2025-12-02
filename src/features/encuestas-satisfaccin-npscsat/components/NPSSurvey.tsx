import React, { useState } from 'react';
import { Card, Button, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Smile, Meh, Frown } from 'lucide-react';

interface NPSSurveyProps {
  onSubmit: (score: number, comments?: string) => void;
  disabled?: boolean;
}

export const NPSSurvey: React.FC<NPSSurveyProps> = ({ onSubmit, disabled = false }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [comments, setComments] = useState('');

  const handleScoreSelect = (score: number) => {
    if (!disabled) {
      setSelectedScore(score);
    }
  };

  const handleSubmit = () => {
    if (selectedScore !== null) {
      onSubmit(selectedScore, comments || undefined);
      setSelectedScore(null);
      setComments('');
    }
  };

  const getScoreIcon = (score: number) => {
    if (score >= 9) return <Smile className="w-5 h-5" />;
    if (score >= 7) return <Meh className="w-5 h-5" />;
    return <Frown className="w-5 h-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score === selectedScore) {
      if (score >= 9) return 'bg-green-100 dark:bg-green-900 border-green-500';
      if (score >= 7) return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500';
      return 'bg-red-100 dark:bg-red-900 border-red-500';
    }
    return 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
  };

  return (
    <Card padding="lg">
      <div className="space-y-6">
        <div>
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Net Promoter Score (NPS)
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            ¿Qué tan probable es que recomiendes nuestro gimnasio a un amigo o colega?
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Poco probable
            </span>
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Muy probable
            </span>
          </div>

          <div className="grid grid-cols-11 gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => handleScoreSelect(i)}
                disabled={disabled}
                className={`
                  aspect-square rounded-xl border-2 transition-all duration-200
                  ${getScoreColor(i)}
                  ${selectedScore === i ? 'scale-110 shadow-lg' : 'hover:scale-105'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  flex flex-col items-center justify-center gap-1
                `}
              >
                <span className={`${ds.typography.body} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {i}
                </span>
                {i % 3 === 0 && (
                  <div className={selectedScore === i ? 'text-current' : 'text-gray-400'}>
                    {getScoreIcon(i)}
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedScore !== null && (
            <div className="pt-4">
              <Textarea
                label="Comentarios (opcional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={disabled}
                placeholder="Comparte tu opinión..."
                rows={4}
              />
            </div>
          )}
        </div>

        {selectedScore !== null && !disabled && (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setSelectedScore(null); setComments(''); }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Enviar Encuesta
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

