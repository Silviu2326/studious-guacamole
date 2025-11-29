import { useState } from 'react';
import { Share2, Instagram, Facebook, Twitter, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { Button, Modal } from '../../../components/componentsreutilizables';
import { Testimonial } from '../types';

interface ShareTestimonialProps {
  testimonial: Testimonial;
  onGenerateImage?: () => void;
}

export function ShareTestimonial({ testimonial, onGenerateImage }: ShareTestimonialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const testimonialText = `"${testimonial.quote}"\n\n- ${testimonial.customerName}${testimonial.role ? `, ${testimonial.role}` : ''}\n⭐ ${testimonial.score}/5`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(testimonialText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleShareInstagram = () => {
    // Instagram no tiene una API directa, pero podemos abrir la app o copiar el texto
    // En producción, esto podría abrir la app de Instagram o generar una imagen
    if (onGenerateImage) {
      onGenerateImage();
    } else {
      handleCopyToClipboard();
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(testimonialText);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(testimonialText.substring(0, 200)); // Twitter tiene límite de caracteres
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2"
        title="Compartir testimonio"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Compartir testimonio"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-2">
              "{testimonial.quote}"
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              - {testimonial.customerName}
              {testimonial.role && <span className="text-slate-500 dark:text-slate-400">, {testimonial.role}</span>}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-amber-500">⭐</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{testimonial.score}/5</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleShareInstagram}
              className="flex items-center justify-center gap-2"
            >
              <Instagram className="w-5 h-5 text-pink-600" />
              Instagram
            </Button>

            <Button
              variant="outline"
              onClick={handleShareFacebook}
              className="flex items-center justify-center gap-2"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              Facebook
            </Button>

            <Button
              variant="outline"
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-2"
            >
              <Twitter className="w-5 h-5 text-blue-400" />
              Twitter
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar texto
                </>
              )}
            </Button>
          </div>

          {onGenerateImage && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="secondary"
                onClick={() => {
                  onGenerateImage();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                Generar imagen con diseño
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Crea una imagen atractiva con foto del cliente, nombre, testimonio y tu marca
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

