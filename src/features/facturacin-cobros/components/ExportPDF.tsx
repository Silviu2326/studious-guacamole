import React, { useState } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { Factura } from '../types';
import { facturasAPI } from '../api/facturas';
import { Download } from 'lucide-react';

interface ExportPDFProps {
  factura: Factura;
  onExportComplete?: () => void;
}

export const ExportPDF: React.FC<ExportPDFProps> = ({ factura, onExportComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const blob = await facturasAPI.exportarPDF(factura.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${factura.numeroFactura}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      onExportComplete?.();
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      loading={loading}
    >
      <Download className="w-4 h-4 mr-2" />
      Descargar PDF
    </Button>
  );
};

