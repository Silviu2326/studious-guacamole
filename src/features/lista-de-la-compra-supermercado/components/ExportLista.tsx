import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Download, Mail, FileText, Smartphone, Printer } from 'lucide-react';
import { 
  type ListaCompra,
  exportarLista,
  generarPDF,
  copiarAlPortapapeles,
  type FormatoExportacion
} from '../api/exportar';

interface ExportListaProps {
  lista: ListaCompra;
  onExportado?: () => void;
}

export const ExportLista: React.FC<ExportListaProps> = ({ lista, onExportado }) => {
  const [formato, setFormato] = useState<FormatoExportacion>('pdf');
  const [exportando, setExportando] = useState(false);
  const [incluirPrecios, setIncluirPrecios] = useState(false);

  const formatos = [
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
    { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { value: 'app', label: 'App Móvil', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'impresion', label: 'Imprimir', icon: <Printer className="w-4 h-4" /> },
  ];

  const handleExportar = async () => {
    setExportando(true);
    try {
      if (formato === 'impresion') {
        generarPDF(lista);
        onExportado?.();
        return;
      }

      const resultado = await exportarLista(lista.id, {
        formato,
        incluirPrecios,
        incluirSecciones: true,
        incluirNotas: true,
      });

      if (!resultado) {
        alert('Error al exportar la lista');
        return;
      }

      if (formato === 'pdf' && resultado instanceof Blob) {
        const url = URL.createObjectURL(resultado);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista-compra-${lista.clienteNombre}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (formato === 'app') {
        const texto = lista.ingredientes
          .map((ing) => `- ${ing.cantidad} ${ing.unidad} ${ing.nombre}`)
          .join('\n');
        await copiarAlPortapapeles(texto);
        alert('Lista copiada al portapapeles. Pégala en tu app de notas.');
      }

      onExportado?.();
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar la lista');
    } finally {
      setExportando(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Exportar Lista
        </h2>
      </div>

      <div className="space-y-4">
        <Select
          label="Formato de Exportación"
          options={formatos.map((f) => ({ value: f.value, label: f.label }))}
          value={formato}
          onChange={(e) => setFormato(e.target.value as FormatoExportacion)}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="incluirPrecios"
            checked={incluirPrecios}
            onChange={(e) => setIncluirPrecios(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="incluirPrecios"
            className="text-sm text-gray-900"
          >
            Incluir precios aproximados
          </label>
        </div>

        <Button onClick={handleExportar} loading={exportando} fullWidth>
          <Download className="w-4 h-4 mr-2" />
          Exportar Lista
        </Button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            La lista se exportará con todos los ingredientes organizados por secciones.
            {incluirPrecios && ' Los precios son aproximados y pueden variar según el supermercado.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

