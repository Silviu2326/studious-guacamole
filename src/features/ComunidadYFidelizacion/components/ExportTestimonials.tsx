import { useState } from 'react';
import { Download, FileText, FileJson, Code } from 'lucide-react';
import { Button, Modal, Select } from '../../../components/componentsreutilizables';
import { Testimonial } from '../types';

interface ExportTestimonialsProps {
  testimonials: Testimonial[];
  selectedTestimonials?: string[]; // IDs de testimonios seleccionados
  onClose?: () => void;
}

type ExportFormat = 'json' | 'csv' | 'html';

export function ExportTestimonials({ testimonials, selectedTestimonials, onClose }: ExportTestimonialsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [exportAll, setExportAll] = useState(true);

  const testimonialsToExport = exportAll || !selectedTestimonials
    ? testimonials
    : testimonials.filter(t => selectedTestimonials.includes(t.id));

  const handleExport = () => {
    switch (format) {
      case 'json':
        exportAsJSON();
        break;
      case 'csv':
        exportAsCSV();
        break;
      case 'html':
        exportAsHTML();
        break;
    }
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  };

  const exportAsJSON = () => {
    const data = testimonialsToExport.map(t => ({
      id: t.id,
      nombre: t.customerName,
      rol: t.role,
      testimonio: t.quote,
      puntuacion: t.score,
      fecha: t.createdAt,
      tipo: t.type,
      fuente: t.source,
      estado: t.status,
      canal: t.channel,
      foto: t.mediaUrl || null,
      etiquetas: t.tags || [],
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testimonios-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ['Nombre', 'Rol', 'Testimonio', 'Puntuación', 'Fecha', 'Tipo', 'Fuente', 'Estado', 'Canal', 'Foto', 'Etiquetas'];
    const rows = testimonialsToExport.map(t => [
      t.customerName,
      t.role,
      `"${t.quote.replace(/"/g, '""')}"`, // Escapar comillas en CSV
      t.score.toString(),
      new Date(t.createdAt).toLocaleDateString('es-ES'),
      t.type,
      t.source,
      t.status,
      t.channel,
      t.mediaUrl || '',
      (t.tags || []).join('; '),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testimonios-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testimonios</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #1e293b;
            margin-bottom: 40px;
            font-size: 2.5rem;
        }
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .testimonial-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .testimonial-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        .testimonial-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        .testimonial-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
        }
        .testimonial-info h3 {
            font-size: 1.2rem;
            color: #1e293b;
            margin-bottom: 4px;
        }
        .testimonial-info p {
            color: #64748b;
            font-size: 0.9rem;
        }
        .testimonial-quote {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #475569;
            margin-bottom: 20px;
            font-style: italic;
        }
        .testimonial-rating {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        .stars {
            color: #fbbf24;
            font-size: 1.2rem;
        }
        .testimonial-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
        }
        .meta-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #f1f5f9;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #475569;
        }
        .testimonial-date {
            color: #94a3b8;
            font-size: 0.85rem;
        }
        @media (max-width: 768px) {
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Testimonios de Clientes</h1>
        <div class="testimonials-grid">
${testimonialsToExport.map(t => {
  const initials = t.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const stars = '⭐'.repeat(Math.floor(t.score));
  const date = new Date(t.createdAt).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `            <div class="testimonial-card">
                <div class="testimonial-header">
                    ${t.mediaUrl 
                      ? `<img src="${t.mediaUrl}" alt="${t.customerName}" class="testimonial-photo" />`
                      : `<div class="testimonial-photo">${initials}</div>`
                    }
                    <div class="testimonial-info">
                        <h3>${t.customerName}</h3>
                        <p>${t.role}</p>
                    </div>
                </div>
                <div class="testimonial-quote">"${t.quote}"</div>
                <div class="testimonial-rating">
                    <span class="stars">${stars}</span>
                    <span>${t.score}/5</span>
                </div>
                <div class="testimonial-meta">
                    <span class="meta-badge">${t.type}</span>
                    <span class="meta-badge">${t.channel}</span>
                    ${(t.tags || []).map(tag => `<span class="meta-badge">${tag}</span>`).join('')}
                    <span class="testimonial-date">${date}</span>
                </div>
            </div>`;
}).join('\n')}
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testimonios-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Exportar testimonios"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} className="inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              Se exportarán <strong>{testimonialsToExport.length}</strong> de {testimonials.length} testimonios
            </p>
            {selectedTestimonials && selectedTestimonials.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id="exportAll"
                  checked={exportAll}
                  onChange={(e) => setExportAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="exportAll" className="text-sm text-slate-700 dark:text-slate-300">
                  Exportar todos los testimonios
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Formato de exportación
            </label>
            <div className="space-y-3">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  format === 'json'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                onClick={() => setFormat('json')}
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">JSON</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Formato estructurado para desarrollo y análisis
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  format === 'csv'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                onClick={() => setFormat('csv')}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">CSV</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Compatible con Excel y hojas de cálculo
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  format === 'html'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                onClick={() => setFormat('html')}
              >
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">HTML</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Código HTML listo para insertar en tu página web
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Datos incluidos:</strong> nombre, testimonio, puntuación, fecha, tipo, fuente, estado, canal, foto (si disponible) y etiquetas.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

