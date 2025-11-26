import React, { useState } from 'react';
import { Card, Button, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Star } from 'lucide-react';

interface CSATSurveyProps {
  onSubmit: (score: number, comments?: string) => void;
  question?: string;
  disabled?: boolean;
}

export const CSATSurvey: React.FC<CSATSurveyProps> = ({
  onSubmit,
  question = '¿Qué tan satisfecho estás con nuestro servicio?',
  disabled = false,
}) => {
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

  return (
    <Card padding="lg">
      <div className="space-y-6">
        <div>
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Customer Satisfaction (CSAT)
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {question}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Muy insatisfecho
            </span>
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Muy satisfecho
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleScoreSelect(score)}
                disabled={disabled}
                className={`
                  w-16 h-16 rounded-xl border-2 transition-all duration-200
                  ${selectedScore === score
                    ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500 scale-110 shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:scale-105'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  flex flex-col items-center justify-center gap-1
                `}
              >
                <Star
                  className={`
                    w-6 h-6
                    ${selectedScore === score
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                    }
                  `}
                />
                <span className={`${ds.typography.bodySmall} font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {score}
                </span>
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

