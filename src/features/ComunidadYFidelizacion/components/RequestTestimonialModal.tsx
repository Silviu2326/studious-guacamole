import { useState, useMemo } from 'react';
import { MessageCircle, Mail, Star, Target, CheckCircle2, Calendar } from 'lucide-react';
import { Modal, Button, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { TestimonialTemplate, TestimonialTemplateMoment, TestimonialChannel, TestimonialRequestStatus } from '../types';

interface RequestTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSend: (request: {
    clientId: string;
    templateId?: string;
    message: string;
    channel: TestimonialChannel;
  }) => Promise<void>;
}

// Plantillas predefinidas
const TESTIMONIAL_TEMPLATES: TestimonialTemplate[] = [
  {
    id: 'template-objetivo',
    name: 'Después de alcanzar un objetivo',
    moment: 'objetivo-alcanzado',
    message: '¡Hola {nombre}! 🎉\n\nMe encantaría conocer tu experiencia ahora que has alcanzado tu objetivo de {objetivo}. Tu testimonio ayudaría a otros a ver que es posible lograr sus metas.\n\n¿Podrías compartir:\n- ¿Cómo te sientes al haber alcanzado este objetivo?\n- ¿Qué fue lo que más te ayudó en el proceso?\n- ¿Qué le dirías a alguien que está empezando?\n\n¡Gracias por tu tiempo!',
    description: 'Ideal para cuando un cliente alcanza una meta importante',
    variables: ['nombre', 'objetivo'],
  },
  {
    id: 'template-programa',
    name: 'Al completar un programa',
    moment: 'programa-completado',
    message: '¡Hola {nombre}! 👏\n\n¡Felicitaciones por completar el programa {programa}! Ha sido un placer acompañarte en este proceso.\n\nMe encantaría conocer tu experiencia completa:\n- ¿Qué fue lo que más valoraste del programa?\n- ¿Qué resultados has notado?\n- ¿Recomendarías este programa a otros?\n\nTu testimonio es muy valioso para nosotros. ¡Gracias!',
    description: 'Perfecto para cuando un cliente termina un programa completo',
    variables: ['nombre', 'programa'],
  },
  {
    id: 'template-sesiones',
    name: 'Después de X sesiones',
    moment: 'despues-sesiones',
    message: '¡Hola {nombre}! 💪\n\nVeo que ya llevamos {sesiones} sesiones juntos y me encantaría conocer tu experiencia hasta ahora.\n\n¿Podrías compartir:\n- ¿Cómo te sientes con tu progreso?\n- ¿Qué ha sido lo mejor de trabajar juntos?\n- ¿Qué cambios has notado?\n\nTu opinión es muy importante para mí. ¡Gracias!',
    description: 'Ideal después de un número específico de sesiones',
    variables: ['nombre', 'sesiones'],
  },
  {
    id: 'template-personalizado',
    name: 'Mensaje personalizado',
    moment: 'personalizado',
    message: '¡Hola {nombre}!\n\nMe encantaría conocer tu experiencia trabajando conmigo. Tu testimonio ayudaría a otros a entender el valor de este proceso.\n\n¿Podrías compartir tu experiencia?',
    description: 'Crea un mensaje completamente personalizado',
    variables: ['nombre'],
  },
];

export function RequestTestimonialModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  onSend,
}: RequestTestimonialModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TestimonialTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [channel, setChannel] = useState<TestimonialChannel>('whatsapp');
  const [isSending, setIsSending] = useState(false);

  // Reemplazar variables en el mensaje
  const processedMessage = useMemo(() => {
    if (!selectedTemplate) return customMessage || '';
    
    let message = selectedTemplate.message;
    // Reemplazar variables básicas
    message = message.replace(/{nombre}/g, clientName);
    message = message.replace(/{objetivo}/g, 'tu objetivo');
    message = message.replace(/{programa}/g, 'el programa');
    message = message.replace(/{sesiones}/g, 'varias');
    
    return message;
  }, [selectedTemplate, customMessage, clientName]);

  const handleTemplateSelect = (templateId: string) => {
    const template = TESTIMONIAL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomMessage(template.message);
    }
  };

  const handleSend = async () => {
    if (!processedMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSend({
        clientId,
        templateId: selectedTemplate?.id,
        message: processedMessage,
        channel,
      });
      // Reset form
      setSelectedTemplate(null);
      setCustomMessage('');
      setChannel('whatsapp');
      onClose();
    } catch (error) {
      console.error('Error enviando solicitud de testimonio:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getMomentIcon = (moment: TestimonialTemplateMoment) => {
    switch (moment) {
      case 'objetivo-alcanzado':
        return <Target className="w-4 h-4" />;
      case 'programa-completado':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'despues-sesiones':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Solicitar testimonio"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!processedMessage.trim() || isSending}
          >
            {isSending ? 'Enviando...' : `Enviar por ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Información del cliente */}
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Cliente: <span className="font-semibold">{clientName}</span>
          </p>
        </div>

        {/* Selección de plantilla */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Selecciona una plantilla
          </label>
          <div className="grid gap-3">
            {TESTIMONIAL_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
                }`}
              >
                <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                  {getMomentIcon(template.moment)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {template.name}
                    </p>
                    {template.moment !== 'personalizado' && (
                      <Badge variant="blue" size="sm">
                        Predefinida
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Personalización del mensaje */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Mensaje personalizado
          </label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={8}
            placeholder="Personaliza el mensaje antes de enviar..."
            showCount
            maxLength={1000}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Puedes personalizar el mensaje antes de enviarlo. Las variables como {'{nombre}'} se reemplazarán automáticamente.
          </p>
        </div>

        {/* Vista previa */}
        {processedMessage && (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Vista previa del mensaje
            </p>
            <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
              {processedMessage}
            </div>
          </div>
        )}

        {/* Selección de canal */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Canal de envío
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                channel === 'whatsapp'
                  ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
              }`}
            >
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">WhatsApp</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Envío inmediato</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                channel === 'email'
                  ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600'
              }`}
            >
              <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Envío por correo</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

