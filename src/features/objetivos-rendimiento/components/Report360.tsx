/**
 * Componente para reportes 360º consolidando métricas de objetivos en dashboards ERP
 * User Story: Como manager quiero consolidar métricas de objetivos en dashboards globales del ERP
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  FileText,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Megaphone,
  Settings,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import {
  generate360Report,
  Dashboard360Report,
  ERPDashboardType,
} from '../api/erpDashboardIntegration';
import { useAuth } from '../../../context/AuthContext';

interface Report360Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Report360: React.FC<Report360Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [report, setReport] = useState<Dashboard360Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<string>('mes');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && !report) {
      handleGenerateReport();
    }
  }, [isOpen]);

  const handleGenerateReport = async () => {
    if (!user?.id || !user?.name) return;

    setGenerating(true);
    try {
      const newReport = await generate360Report(period, user.id, user.name);
      setReport(newReport);
    } catch (error) {
      console.error('Error generating 360 report:', error);
      alert('Error al generar el reporte. Por favor, intenta de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // En producción, esto exportaría el reporte
    console.log(`Exportando reporte en formato ${format}`);
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
  };

  const handleShare = () => {
    // En producción, esto compartiría el reporte
    console.log('Compartiendo reporte');
    alert('Funcionalidad de compartir reporte próximamente...');
  };

  const getDashboardIcon = (type: ERPDashboardType) => {
    switch (type) {
      case 'finanzas':
        return <DollarSign size={20} className="text-green-600" />;
      case 'marketing':
        return <Megaphone size={20} className="text-blue-600" />;
      case 'operaciones':
        return <Settings size={20} className="text-purple-600" />;
    }
  };

  const getDashboardLabel = (type: ERPDashboardType) => {
    switch (type) {
      case 'finanzas':
        return 'Finanzas';
      case 'marketing':
        return 'Marketing';
      case 'operaciones':
        return 'Operaciones';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-700';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'behind':
        return 'bg-red-100 text-red-700';
      case 'exceeded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reporte 360º - Consolidación ERP" size="xl">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semana">Semana</option>
              <option value="mes">Mes</option>
              <option value="trimestre">Trimestre</option>
              <option value="año">Año</option>
            </select>
            <Button
              onClick={handleGenerateReport}
              disabled={generating}
              variant="outline"
            >
              <BarChart3 size={16} className={`mr-2 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generando...' : 'Regenerar'}
            </Button>
          </div>
          {report && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download size={16} className="mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 size={16} className="mr-2" />
                Compartir
              </Button>
            </div>
          )}
        </div>

        {generating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Generando reporte 360º...</p>
            </div>
          </div>
        ) : report ? (
          <>
            {/* Summary */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Resumen Ejecutivo</h2>
                  <p className="text-sm text-gray-600">
                    Período: {report.period} | Generado: {new Date(report.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-600 font-medium">Total Objetivos</span>
                  <p className="text-3xl font-bold text-gray-900">{report.summary.totalObjectives}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-medium">En Camino</span>
                  <p className="text-3xl font-bold text-green-600">
                    {report.summary.onTrackObjectives}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-medium">En Riesgo</span>
                  <p className="text-3xl font-bold text-yellow-600">
                    {report.summary.atRiskObjectives}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-medium">Progreso Global</span>
                  <p className="text-3xl font-bold text-blue-600">
                    {report.summary.overallProgress}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Key Insights */}
            {report.summary.keyInsights.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="text-yellow-600" size={20} />
                  <h3 className="font-semibold text-gray-900">Insights Clave</h3>
                </div>
                <ul className="space-y-2">
                  {report.summary.keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Dashboards */}
            <div className="space-y-4">
              {(['finanzas', 'marketing', 'operaciones'] as ERPDashboardType[]).map((dashboardType) => {
                const dashboardMetrics = report.dashboards[dashboardType];
                if (dashboardMetrics.length === 0) return null;

                const Icon = getDashboardIcon(dashboardType);
                const label = getDashboardLabel(dashboardType);

                return (
                  <Card key={dashboardType} className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      {Icon}
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                      <Badge className="bg-gray-100 text-gray-700">
                        {dashboardMetrics.length} objetivos
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dashboardMetrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {metric.objectiveTitle}
                            </h4>
                            <Badge className={getStatusColor(metric.status)}>
                              {metric.status === 'on_track' && 'En camino'}
                              {metric.status === 'at_risk' && 'En riesgo'}
                              {metric.status === 'behind' && 'Retrasado'}
                              {metric.status === 'exceeded' && 'Superado'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {metric.currentValue.toLocaleString()} / {metric.targetValue.toLocaleString()}{' '}
                              {metric.unit}
                            </span>
                            <span className="font-semibold text-gray-900">{metric.progress}%</span>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                metric.progress >= 100
                                  ? 'bg-blue-500'
                                  : metric.progress >= 75
                                  ? 'bg-green-500'
                                  : metric.progress >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(metric.progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Cross-Dashboard Insights */}
            {report.crossDashboardInsights && report.crossDashboardInsights.length > 0 && (
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="text-purple-600" size={20} />
                  <h3 className="font-semibold text-gray-900">Insights Transversales</h3>
                </div>
                <div className="space-y-3">
                  {report.crossDashboardInsights.map((insight) => (
                    <div key={insight.id} className="p-3 bg-white rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <Badge
                          className={
                            insight.impact === 'high'
                              ? 'bg-red-100 text-red-700'
                              : insight.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {insight.impact === 'high' && 'Alto impacto'}
                          {insight.impact === 'medium' && 'Medio impacto'}
                          {insight.impact === 'low' && 'Bajo impacto'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Dashboards relacionados:</span>
                        {insight.relatedDashboards.map((db) => (
                          <Badge key={db} className="bg-gray-100 text-gray-700">
                            {getDashboardLabel(db)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600">No hay reporte disponible</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

