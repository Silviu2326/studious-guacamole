import React, { useState } from 'react';
import { Card, Button, Textarea } from '../../../components/componentsreutilizables';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { CheckInNutricional, actualizarCheckInNutricional } from '../api/checkins';

interface FeedbackEntrenadorProps {
  checkIn: CheckInNutricional;
  onFeedbackEnviado?: () => void;
}

export const FeedbackEntrenador: React.FC<FeedbackEntrenadorProps> = ({
  checkIn,
  onFeedbackEnviado,
}) => {
  const [feedback, setFeedback] = useState(checkIn.feedbackEntrenador || '');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = async () => {
    if (!feedback.trim() || !checkIn.id) return;

    setEnviando(true);
    try {
      const exito = await actualizarCheckInNutricional(checkIn.id, {
        feedbackEntrenador: feedback,
      });

      if (exito) {
        setEnviado(true);
        if (onFeedbackEnviado) {
          onFeedbackEnviado();
        }
        setTimeout(() => setEnviado(false), 3000);
      }
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <MessageSquare size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Feedback del Entrenador
            </h3>
            <p className="text-xs text-gray-500">
              Proporciona comentarios y ajustes personalizados
            </p>
          </div>
        </div>

        {checkIn.feedbackEntrenador && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-900">
              {checkIn.feedbackEntrenador}
            </p>
          </div>
        )}

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribe tu feedback aquí..."
          rows={4}
          label="Nuevo Feedback"
        />

        <div className="flex items-center justify-between">
          <Button
            onClick={handleEnviar}
            loading={enviando}
            disabled={!feedback.trim() || enviado}
            variant="primary"
          >
            {enviado ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Enviado
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Feedback
              </>
            )}
          </Button>

          {checkIn.ajusteAplicado && (
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-sm text-green-600">
                Ajuste aplicado
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

