import { useState } from 'react';
import { Plus, Link, MessageCircle, Mail, FileText, Star, Upload, X } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { TestimonialSource, TestimonialType } from '../types';

interface TestimonialInputManagerProps {
  onTestimonialAdded?: () => void;
}

const SOURCE_OPTIONS: { value: TestimonialSource; label: string; icon: React.ReactNode }[] = [
  { value: 'formulario', label: 'Link de formulario', icon: <Link className="w-4 h-4" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'manual', label: 'Captura manual', icon: <FileText className="w-4 h-4" /> },
  { value: 'google-reviews', label: 'Google Reviews', icon: <Star className="w-4 h-4" /> },
  { value: 'redes-sociales', label: 'Redes sociales', icon: <Upload className="w-4 h-4" /> },
];

const TYPE_OPTIONS: { value: TestimonialType; label: string }[] = [
  { value: 'texto', label: 'Texto' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
];

export function TestimonialInputManager({ onTestimonialAdded }: TestimonialInputManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState<TestimonialSource>('manual');
  const [type, setType] = useState<TestimonialType>('texto');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [quote, setQuote] = useState('');
  const [score, setScore] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    // Aquí se enviaría al backend
    console.log('Testimonial data:', {
      source,
      type,
      customerName,
      customerId,
      quote,
      score,
      tags,
      mediaUrl,
    });
    
    // Reset form
    setSource('manual');
    setType('texto');
    setCustomerName('');
    setCustomerId('');
    setQuote('');
    setScore(5);
    setTags([]);
    setMediaUrl('');
    setIsModalOpen(false);
    
    onTestimonialAdded?.();
  };

  const getSourceLabel = (sourceValue: TestimonialSource) => {
    return SOURCE_OPTIONS.find((opt) => opt.value === sourceValue)?.label || sourceValue;
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Centralizar testimonios desde múltiples fuentes
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Recibe testimonios desde formularios, WhatsApp, email, captura manual, Google Reviews o redes sociales. Todos se centralizan en un solo lugar.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar testimonio
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SOURCE_OPTIONS.map((option) => (
          <div
            key={option.value}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            onClick={() => {
              setSource(option.value);
              setIsModalOpen(true);
            }}
          >
            <div className="text-slate-600 dark:text-slate-400">{option.icon}</div>
            <span className="text-xs font-medium text-center text-slate-700 dark:text-slate-300">
              {option.label}
            </span>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Agregar testimonio desde ${getSourceLabel(source)}`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar testimonio</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Fuente"
              value={source}
              onChange={(e) => setSource(e.target.value as TestimonialSource)}
              options={SOURCE_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value }))}
            />
            <Select
              label="Tipo de testimonio"
              value={type}
              onChange={(e) => setType(e.target.value as TestimonialType)}
              options={TYPE_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nombre del cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej. María Fernández"
            />
            <Input
              label="ID del cliente (opcional)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="cliente_001"
            />
          </div>

          <Textarea
            label="Testimonio"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            placeholder="Escribe o pega el testimonio aquí..."
            showCount
            maxLength={1000}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Puntuación (1-5)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={score}
                  onChange={(e) => setScore(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-12 text-right">
                  {score.toFixed(1)}
                </span>
              </div>
            </div>
            {(type === 'video' || type === 'audio') && (
              <Input
                label="URL del archivo multimedia"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                type="url"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button variant="secondary" onClick={handleAddTag} size="sm">
                Agregar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="blue" size="sm" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

