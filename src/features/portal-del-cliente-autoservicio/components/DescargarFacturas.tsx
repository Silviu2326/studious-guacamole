import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { facturasAPI } from '../api';
import { Download, FileText } from 'lucide-react';
import type { TableColumn } from '../../../components/componentsreutilizables';

interface FacturaDescarga {
  id: string;
  numeroFactura: string;
  fechaEmision: string;
  monto: number;
  estado: string;
}

export const DescargarFacturas: React.FC = () => {
  const [facturas, setFacturas] = useState<FacturaDescarga[]>([]);
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState<string | null>(null);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setCargando(true);
      const facturasData = await facturasAPI.obtenerFacturas();
      
      const facturasFormateadas: FacturaDescarga[] = facturasData.map(f => ({
        id: f.id,
        numeroFactura: f.numeroFactura,
        fechaEmision: f.fechaEmision.toLocaleDateString('es-ES'),
        monto: f.monto,
        estado: f.estado
      }));
      
      setFacturas(facturasFormateadas);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleDescargar = async (id: string, numeroFactura: string) => {
    try {
      setDescargando(id);
      const blob = await facturasAPI.descargarFactura(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${numeroFactura}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar factura:', error);
    } finally {
      setDescargando(null);
    }
  };

  const columnas: TableColumn<FacturaDescarga>[] = [
    {
      key: 'numeroFactura',
      label: 'Número de Factura',
      sortable: true
    },
    {
      key: 'fechaEmision',
      label: 'Fecha de Emisión',
      sortable: true
    },
    {
      key: 'monto',
      label: 'Monto',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold">
          {new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }).format(value)}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'pagada' ? 'bg-green-100 text-green-700' :
          value === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleDescargar(row.id, row.numeroFactura)}
          loading={descargando === row.id}
          disabled={descargando !== null}
        >
          <Download className="w-4 h-4 mr-1" />
          Descargar PDF
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Descargar Facturas
            </h2>
          </div>

          <p className="text-gray-600">
            Descarga tus facturas en formato PDF. Todas tus facturas históricas están disponibles aquí.
          </p>

          <Table
            data={facturas}
            columns={columnas}
            loading={cargando}
            emptyMessage="No hay facturas disponibles"
          />
        </div>
      </Card>
    </div>
  );
};

