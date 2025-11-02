import React, { useState, useMemo } from 'react';
import { Baja } from '../types';
import { Card, Button, Input, Table, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { Search, Download, X, Check, Users, TrendingDown, PieChart, Calendar } from 'lucide-react';

interface GestorBajasProps {
  bajas: Baja[];
  onProcessBaja: (id: string, motivoId?: string, motivoTexto?: string) => Promise<void>;
  onCancelBaja: (id: string) => Promise<void>;
  onExportBajas: () => Promise<void>;
  loading?: boolean;
}

export const GestorBajas: React.FC<GestorBajasProps> = ({
  bajas,
  onProcessBaja,
  onCancelBaja,
  onExportBajas,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBajas = useMemo(() => {
    return bajas.filter(baja =>
      baja.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (baja.motivoTexto || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bajas, searchTerm]);

  // Calcular métricas y estadísticas
  const metricas = useMemo(() => {
    const total = bajas.length;
    
    // Bajas por categoría
    const porCategoria = bajas.reduce((acc, baja) => {
      const cat = baja.categoria || 'Sin categoría';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoriaComun = Object.entries(porCategoria)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    // Bajas en los últimos 30 días
    const hace30Dias = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recientes = bajas.filter(b => new Date(b.fechaBaja).getTime() >= hace30Dias).length;
    
    return {
      total,
      categoriaComun,
      recientes,
      porCategoria,
    };
  }, [bajas]);

  const metricCards: MetricCardData[] = [
    {
      id: 'total-bajas',
      title: 'Total Bajas',
      value: metricas.total.toString(),
      subtitle: 'Bajas registradas',
      color: 'error',
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: 'recientes',
      title: 'Últimos 30 días',
      value: metricas.recientes.toString(),
      subtitle: 'Bajas recientes',
      color: 'warning',
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      id: 'categoria-comun',
      title: 'Categoría Más Común',
      value: metricas.categoriaComun,
      subtitle: 'Motivo principal',
      color: 'info',
      icon: <PieChart className="w-6 h-6" />,
    },
    {
      id: 'tendencia',
      title: 'Análisis Churn',
      value: metricas.total > 10 ? 'Alto' : 'Bajo',
      subtitle: 'Indicador de tendencia',
      color: metricas.total > 10 ? 'error' : 'success',
      icon: <TrendingDown className="w-6 h-6" />,
    },
  ];

  const getCategoriaBadge = (categoria?: string) => {
    if (!categoria) return null;
    const categorias: Record<string, { bg: string; text: string }> = {
      'Motivos Economicos': { bg: 'bg-red-100 text-red-800', text: 'Económicos' },
      'Motivos Personales': { bg: 'bg-blue-100 text-blue-800', text: 'Personales' },
      'Motivos de Servicio': { bg: 'bg-orange-100 text-orange-800', text: 'Servicio' },
      'Motivos de Ubicacion': { bg: 'bg-purple-100 text-purple-800', text: 'Ubicación' },
      'Motivos de Salud': { bg: 'bg-green-100 text-green-800', text: 'Salud' },
    };
    const cat = categorias[categoria] || { bg: 'bg-gray-100 text-gray-800', text: categoria };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cat.bg}`}>
        {cat.text}
      </span>
    );
  };

  const columns: TableColumn<Baja>[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-600">{row.cliente.email}</div>
        </div>
      ),
    },
    {
      key: 'motivo',
      label: 'Motivo de Baja',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.motivoTexto || 'Sin motivo especificado'}</div>
          {row.categoria && getCategoriaBadge(row.categoria)}
        </div>
      ),
    },
    {
      key: 'fechaBaja',
      label: 'Fecha de Baja',
      render: (_, row) => (
        <div>
          {new Date(row.fechaBaja).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onProcessBaja(row.id, row.motivoId, row.motivoTexto)}
          >
            <Check size={20} className="mr-2" />
            Procesar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCancelBaja(row.id)}
          >
            <X size={20} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricCards} columns={4} />

      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={onExportBajas}>
          <Download size={20} className="mr-2" />
          Exportar Bajas
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cliente o motivo..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredBajas.length} resultado{filteredBajas.length !== 1 ? 's' : ''} encontrado{filteredBajas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>

      {/* Tabla de Bajas */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={filteredBajas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay bajas registradas"
        />
      </Card>
    </div>
  );
};
