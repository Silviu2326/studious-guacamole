import React, { useState, useEffect } from 'react';
import { Card, Table, Select } from '../../../components/componentsreutilizables';
import { getResponses } from '../api';
import { SurveyResponse } from '../types';
import { BarChart3, Calendar, Filter } from 'lucide-react';

export const ResponseAnalytics: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [filterArea, setFilterArea] = useState<string>('all');

  useEffect(() => {
    loadResponses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [responses, filterPeriod, filterArea]);

  const loadResponses = async () => {
    setLoading(true);
    try {
      const data = await getResponses();
      setResponses(data);
      setFilteredResponses(data);
    } catch (error) {
      console.error('Error cargando respuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...responses];

    // Filtro por período
    if (filterPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch (filterPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      filtered = filtered.filter((r) => new Date(r.respondedAt) >= filterDate);
    }

    // Filtro por área
    if (filterArea !== 'all') {
      filtered = filtered.filter((r) => r.area === filterArea);
    }

    setFilteredResponses(filtered);
  };

  const tableColumns = [
    {
      key: 'clientName',
      label: 'Cliente',
    },
    {
      key: 'score',
      label: 'Puntuación',
      render: (value: number) => {
        const colorClass = value >= 7 
          ? 'text-green-600 font-bold text-lg' 
          : value <= 6 
          ? 'text-red-600 font-bold text-lg' 
          : 'text-yellow-600 font-bold text-lg';
        return <span className={colorClass}>{value}</span>;
      },
    },
    {
      key: 'classification',
      label: 'Clasificación',
      render: (value: string) => {
        if (!value) return '-';
        const colorClasses: Record<string, string> = {
          promotor: 'bg-green-100 text-green-800',
          neutral: 'bg-yellow-100 text-yellow-800',
          detractor: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'area',
      label: 'Área',
      render: (value: string) => {
        if (!value) return '-';
        const areaLabels: Record<string, string> = {
          servicio_general: 'Servicio General',
          clases: 'Clases',
          instalaciones: 'Instalaciones',
          atencion_recepcion: 'Atención Recepción',
          equipamiento: 'Equipamiento',
        };
        return areaLabels[value] || value;
      },
    },
    {
      key: 'comments',
      label: 'Comentarios',
      render: (value: string) => value || '-',
    },
    {
      key: 'respondedAt',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
  ];

  const averageScore = filteredResponses.length > 0
    ? (filteredResponses.reduce((sum, r) => sum + r.score, 0) / filteredResponses.length).toFixed(1)
    : '0';

  const scoreDistribution = filteredResponses.reduce((acc, r) => {
    acc[r.score] = (acc[r.score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Promedio
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Total Respuestas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredResponses.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Filter size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Tasa Respuesta
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {((filteredResponses.length / Math.max(responses.length, 1)) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value as typeof filterPeriod)}
                  options={[
                    { value: 'all', label: 'Todo el período' },
                    { value: 'week', label: 'Última semana' },
                    { value: 'month', label: 'Último mes' },
                    { value: 'quarter', label: 'Último trimestre' },
                  ]}
                />
              </div>
              <div className="flex-1">
                <Select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todas las áreas' },
                    { value: 'servicio_general', label: 'Servicio General' },
                    { value: 'clases', label: 'Clases' },
                    { value: 'instalaciones', label: 'Instalaciones' },
                    { value: 'atencion_recepcion', label: 'Atención Recepción' },
                    { value: 'equipamiento', label: 'Equipamiento' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 border-t border-slate-200 pt-4">
            <span>{filteredResponses.length} resultados encontrados</span>
            <span>{(filterPeriod !== 'all' ? 1 : 0) + (filterArea !== 'all' ? 1 : 0)} filtros aplicados</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Análisis de Respuestas
          </h3>
        </div>

        <Table
          data={filteredResponses}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No hay respuestas disponibles"
        />
      </Card>
    </div>
  );
};

