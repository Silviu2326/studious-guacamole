import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Download, X, Palette, Type, User, Sparkles } from 'lucide-react';
import { Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { Testimonial } from '../types';

interface GenerateTestimonialImageProps {
  testimonial: Testimonial;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageDesign {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  layout: 'classic' | 'modern' | 'minimal';
  includePhoto: boolean;
  includeBrand: boolean;
  brandText?: string;
}

const FONT_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial (Moderno)' },
  { value: 'Georgia, serif', label: 'Georgia (Clásico)' },
  { value: 'Verdana, sans-serif', label: 'Verdana (Elegante)' },
  { value: 'Times New Roman, serif', label: 'Times (Clásico)' },
];

const LAYOUT_OPTIONS = [
  { value: 'classic', label: 'Clásico' },
  { value: 'modern', label: 'Moderno' },
  { value: 'minimal', label: 'Minimalista' },
];

export function GenerateTestimonialImage({ testimonial, isOpen, onClose }: GenerateTestimonialImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [design, setDesign] = useState<ImageDesign>({
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#6366f1',
    fontFamily: 'Arial, sans-serif',
    layout: 'modern',
    includePhoto: true,
    includeBrand: true,
    brandText: 'Mi Marca',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, design, testimonial]);

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamaño del canvas (1080x1080 para Instagram)
    canvas.width = 1080;
    canvas.height = 1080;

    // Fondo
    ctx.fillStyle = design.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar diseño según el layout
    switch (design.layout) {
      case 'classic':
        drawClassicLayout(ctx, canvas, design);
        break;
      case 'modern':
        drawModernLayout(ctx, canvas, design);
        break;
      case 'minimal':
        drawMinimalLayout(ctx, canvas, design);
        break;
    }

    // Convertir a imagen
    const url = canvas.toDataURL('image/png');
    setPreviewUrl(url);
  };

  const drawClassicLayout = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, design: ImageDesign) => {
    const padding = 80;
    const centerX = canvas.width / 2;

    // Marca (arriba)
    if (design.includeBrand && design.brandText) {
      ctx.fillStyle = design.accentColor;
      ctx.font = `bold 32px ${design.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(design.brandText, centerX, padding + 40);
    }

    // Comillas decorativas
    ctx.fillStyle = design.accentColor;
    ctx.font = `bold 120px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('"', centerX, 300);

    // Testimonio
    ctx.fillStyle = design.textColor;
    ctx.font = `32px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    wrapText(ctx, testimonial.quote, centerX, 400, canvas.width - padding * 2, 40);

    // Estrellas
    const starY = 700;
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 5; i++) {
      const starX = centerX - 100 + i * 50;
      drawStar(ctx, starX, starY, 20, 10, 5);
    }

    // Nombre del cliente
    ctx.fillStyle = design.textColor;
    ctx.font = `bold 36px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(testimonial.customerName, centerX, 800);

    // Rol
    if (testimonial.role) {
      ctx.fillStyle = design.textColor;
      ctx.font = `24px ${design.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(testimonial.role, centerX, 850);
    }
  };

  const drawModernLayout = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, design: ImageDesign) => {
    const padding = 60;
    const centerX = canvas.width / 2;

    // Barra superior con color de acento
    ctx.fillStyle = design.accentColor;
    ctx.fillRect(0, 0, canvas.width, 120);

    // Marca (en la barra)
    if (design.includeBrand && design.brandText) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 28px ${design.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(design.brandText, centerX, 75);
    }

    // Testimonio (centrado)
    ctx.fillStyle = design.textColor;
    ctx.font = `36px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    wrapText(ctx, `"${testimonial.quote}"`, centerX, 400, canvas.width - padding * 2, 45);

    // Línea decorativa
    ctx.strokeStyle = design.accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, 650);
    ctx.lineTo(centerX + 100, 650);
    ctx.stroke();

    // Nombre y puntuación
    ctx.fillStyle = design.textColor;
    ctx.font = `bold 32px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(testimonial.customerName, centerX, 720);

    // Estrellas
    const starY = 780;
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < Math.floor(testimonial.score); i++) {
      const starX = centerX - 60 + i * 30;
      drawStar(ctx, starX, starY, 15, 8, 5);
    }
  };

  const drawMinimalLayout = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, design: ImageDesign) => {
    const padding = 100;
    const centerX = canvas.width / 2;

    // Testimonio (minimalista)
    ctx.fillStyle = design.textColor;
    ctx.font = `40px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    wrapText(ctx, testimonial.quote, centerX, 400, canvas.width - padding * 2, 50);

    // Separador minimalista
    ctx.strokeStyle = design.textColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 50, 700);
    ctx.lineTo(centerX + 50, 700);
    ctx.stroke();

    // Nombre
    ctx.fillStyle = design.textColor;
    ctx.font = `28px ${design.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(testimonial.customerName, centerX, 750);

    // Marca pequeña (abajo)
    if (design.includeBrand && design.brandText) {
      ctx.fillStyle = design.accentColor;
      ctx.font = `20px ${design.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(design.brandText, centerX, canvas.height - 60);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, innerRadius: number, points: number) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    const link = document.createElement('a');
    link.download = `testimonio-${testimonial.customerName.replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = previewUrl;
    link.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar imagen del testimonio"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleDownload} disabled={!previewUrl} className="inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar imagen
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Opciones de diseño */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color de fondo
            </label>
            <Input
              type="color"
              value={design.backgroundColor}
              onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color de texto
            </label>
            <Input
              type="color"
              value={design.textColor}
              onChange={(e) => setDesign({ ...design, textColor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color de acento
            </label>
            <Input
              type="color"
              value={design.accentColor}
              onChange={(e) => setDesign({ ...design, accentColor: e.target.value })}
            />
          </div>

          <Select
            label="Fuente"
            value={design.fontFamily}
            onChange={(e) => setDesign({ ...design, fontFamily: e.target.value })}
            options={FONT_OPTIONS}
          />

          <Select
            label="Estilo de diseño"
            value={design.layout}
            onChange={(e) => setDesign({ ...design, layout: e.target.value as ImageDesign['layout'] })}
            options={LAYOUT_OPTIONS}
          />

          {design.includeBrand && (
            <Input
              label="Texto de marca"
              value={design.brandText}
              onChange={(e) => setDesign({ ...design, brandText: e.target.value })}
              placeholder="Mi Marca"
            />
          )}
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
          <input
            type="checkbox"
            id="includePhoto"
            checked={design.includePhoto}
            onChange={(e) => setDesign({ ...design, includePhoto: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="includePhoto" className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4" />
            Incluir foto del cliente (si autorizada)
          </label>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
          <input
            type="checkbox"
            id="includeBrand"
            checked={design.includeBrand}
            onChange={(e) => setDesign({ ...design, includeBrand: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="includeBrand" className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Incluir mi marca
          </label>
        </div>

        {/* Vista previa */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Vista previa
          </label>
          <div className="flex justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Vista previa del testimonio"
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Generando vista previa...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas oculto para generar la imagen */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </Modal>
  );
}

