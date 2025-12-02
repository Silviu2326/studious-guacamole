import React, { useState, useEffect } from 'react';
import { MetricCards, Button, Card } from '../../../components/componentsreutilizables';
import { FacturacionService } from '../api/facturacionService';
import { KPIsFacturacion, Factura } from '../types';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  TrendingDown,
  AlertCircle,
  Building2,
  Download,
  Plus
} from 'lucide-react';
import { FacturasTable } from './FacturasTable';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { RegisterPaymentModal } from './RegisterPaymentModal';

export const FacturacionB2BDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIsFacturacion | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    cargarDatos();
  }, [selectedPeriod]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [kpisData, facturasData] = await Promise.all([
        FacturacionService.obtenerKPIs(selectedPeriod),
        FacturacionService.obtenerFacturas()
      ]);
      setKpis(kpisData);
      setFacturas(facturasData.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    await cargarDatos();
    setShowCreateModal(false);
  };

  const handleRegisterPayment = async (invoiceId: string) => {
    const factura = facturas.find(f => f.id === invoiceId);
    if (factura) {
      setSelectedInvoice(factura);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = async () => {
    await cargarDatos();
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const handleEnviar = async (invoiceId: string) => {
    try {
      await FacturacionService.enviarFactura(invoiceId);
      await cargarDatos();
    } catch (error) {
      console.error('Error enviando factura:', error);
      alert('Error al enviar la factura');
    }
  };

  const handleAnular = async (invoiceId: string) => {
    if (!confirm('¿Estás seguro de que quieres anular esta factura?')) return;
    
    try {
      await FacturacionService.anularFactura(invoiceId);
      await cargarDatos();
    } catch (error) {
      console.error('Error anulando factura:', error);
      alert('Error al anular la factura');
    }
  };

  const handleDescargarPDF = async (invoiceId: string) => {
    try {
      const blob = await FacturacionService.descargarPDF(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const handleExportarCSV = async () => {
    try {
      const blob = await FacturacionService.exportarCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facturas-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando CSV:', error);
      alert('Error al exportar el CSV');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const kpisData = kpis ? [
    {
      id: '1',
      title: 'Total Facturado',
      value: formatCurrency(kpis.totalFacturado),
      subtitle: `Periodo seleccionado`,
      color: 'info' as const
    },
    {
      id: '2',
      title: 'Total Cobrado',
      value: formatCurrency(kpis.totalCobrado),
      subtitle: `Periodo seleccionado`,
      color: 'success' as const
    },
    {
      id: '3',
      title: 'Cuentas por Cobrar',
      value: formatCurrency(kpis.cuentasPorCobrar),
      subtitle: 'Total pendiente',
      color: 'warning' as const
    },
    {
      id: '4',
      title: 'Días Promedio de Cobro',
      value: `${kpis.diasPromedioCobro} días`,
      subtitle: 'DSO',
      color: 'info' as const
    },
    {
      id: '5',
      title: '% Facturas Vencidas',
      value: `${kpis.porcentajeFacturasVencidas.toFixed(1)}%`,
      subtitle: 'Sobre total facturas',
      color: kpis.porcentajeFacturasVencidas > 10 ? 'error' as const : 'warning' as const
    },
    {
      id: '6',
      title: 'Ingreso Promedio/Cuenta',
      value: formatCurrency(kpis.ingresoPromedioPorCuenta),
      subtitle: 'ARPCA',
      color: 'success' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button
          variant="secondary"
          onClick={handleExportarCSV}
        >
          <Download size={20} className="mr-2" />
          Exportar CSV
        </Button>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="ml-3"
        >
          <Plus size={20} className="mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* KPIs */}
      <MetricCards 
        data={kpisData} 
      />

      {/* Filtros de período */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-slate-700">
                Período:
              </label>
              <div className="flex gap-2">
                {(['month', 'quarter', 'year'] as const).map(period => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'month' ? 'Mes' : period === 'quarter' ? 'Trimestre' : 'Año'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Facturas */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <FacturasTable
            data={facturas}
            loading={loading}
            onRegisterPayment={handleRegisterPayment}
            onEnviar={handleEnviar}
            onAnular={handleAnular}
            onDownloadPDF={handleDescargarPDF}
          />
        </div>
      </Card>

      {/* Modales */}
      {showCreateModal && (
        <CreateInvoiceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      {showPaymentModal && selectedInvoice && (
        <RegisterPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onSubmit={handlePaymentComplete}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

