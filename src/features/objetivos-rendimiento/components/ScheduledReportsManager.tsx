import React, { useState, useEffect } from 'react';
import { ScheduledReport } from '../types';
import { getScheduledReports, saveScheduledReport, deleteScheduledReport } from '../api/reports';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { Calendar, Clock, Mail, Plus, Edit2, Trash2, Loader2, CheckCircle2, XCircle, Settings } from 'lucide-react';

interface ScheduledReportsManagerProps {
  role: 'entrenador' | 'gimnasio';
}

export const ScheduledReportsManager: React.FC<ScheduledReportsManagerProps> = ({ role }) => {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduledReport>>({
    reportType: 'weekly',
    frequency: 'weekly',
    enabled: true,
    recipients: [],
    recipientEmails: [],
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: '09:00',
    timezone: 'Europe/Madrid',
    includeAINarrative: true,
    includeObjectivesVsTargets: true,
    includeRisks: true,
    includeProposedActions: true,
  });

  useEffect(() => {
    loadScheduledReports();
  }, []);

  const loadScheduledReports = async () => {
    setLoading(true);
    try {
      const data = await getScheduledReports();
      setScheduledReports(data);
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (report?: ScheduledReport) => {
    if (report) {
      setEditingReport(report);
      setFormData(report);
    } else {
      setEditingReport(null);
      setFormData({
        reportType: 'weekly',
        frequency: 'weekly',
        enabled: true,
        recipients: [],
        recipientEmails: [],
        dayOfWeek: 1,
        dayOfMonth: 1,
        time: '09:00',
        timezone: 'Europe/Madrid',
        includeAINarrative: true,
        includeObjectivesVsTargets: true,
        includeRisks: true,
        includeProposedActions: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const handleSave = async () => {
    try {
      const saved = await saveScheduledReport({
        ...formData,
        reportType: formData.reportType || 'weekly',
      } as Partial<ScheduledReport> & { reportType: 'weekly' | 'monthly' });
      
      await loadScheduledReports();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving scheduled report:', error);
      alert('Error al guardar el reporte programado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte programado?')) {
      return;
    }
    
    try {
      await deleteScheduledReport(id);
      await loadScheduledReports();
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      alert('Error al eliminar el reporte programado');
    }
  };

  const handleToggleEnabled = async (report: ScheduledReport) => {
    try {
      await saveScheduledReport({
        ...report,
        enabled: !report.enabled,
      });
      await loadScheduledReports();
    } catch (error) {
      console.error('Error toggling scheduled report:', error);
    }
  };

  const formatNextScheduled = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek];
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando reportes programados...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Reportes Automáticos Programados
        </h3>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Programar Reporte
        </Button>
      </div>

      {scheduledReports.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay reportes programados
          </h3>
          <p className="text-gray-600 mb-4">
            Programa envíos automáticos de reportes semanales o mensuales con resúmenes de IA
          </p>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Crear Primera Programación
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scheduledReports.map((report) => (
            <Card key={report.id} className="p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Reporte {report.reportType === 'weekly' ? 'Semanal' : 'Mensual'}
                    </h4>
                    {report.enabled ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <XCircle size={12} />
                        Inactivo
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Frecuencia</p>
                      <p className="text-sm font-medium text-gray-900">
                        {report.reportType === 'weekly' 
                          ? `Cada ${getDayName(report.dayOfWeek || 0)}`
                          : `Día ${report.dayOfMonth} de cada mes`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Hora</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Clock size={14} />
                        {report.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Próximo envío</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatNextScheduled(report.nextScheduledAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Destinatarios</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Mail size={14} />
                        {report.recipients.length + (report.recipientEmails?.length || 0)} destinatarios
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.includeAINarrative && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        Resumen IA
                      </span>
                    )}
                    {report.includeObjectivesVsTargets && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        Comparativas
                      </span>
                    )}
                    {report.includeRisks && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        Riesgos
                      </span>
                    )}
                    {report.includeProposedActions && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Acciones
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEnabled(report)}
                    className={`p-2 rounded-lg transition-colors ${
                      report.enabled
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={report.enabled ? 'Desactivar' : 'Activar'}
                  >
                    {report.enabled ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(report)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar reporte programado */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingReport ? 'Editar Reporte Programado' : 'Programar Nuevo Reporte'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <Select
              value={formData.reportType || 'weekly'}
              onChange={(e) => {
                const newType = e.target.value as 'weekly' | 'monthly';
                setFormData({
                  ...formData,
                  reportType: newType,
                  frequency: newType,
                });
              }}
              options={[
                { value: 'weekly', label: 'Semanal' },
                { value: 'monthly', label: 'Mensual' },
              ]}
            />
          </div>

          {formData.reportType === 'weekly' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día de la Semana
              </label>
              <Select
                value={formData.dayOfWeek?.toString() || '1'}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                options={[
                  { value: '0', label: 'Domingo' },
                  { value: '1', label: 'Lunes' },
                  { value: '2', label: 'Martes' },
                  { value: '3', label: 'Miércoles' },
                  { value: '4', label: 'Jueves' },
                  { value: '5', label: 'Viernes' },
                  { value: '6', label: 'Sábado' },
                ]}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día del Mes (1-31)
              </label>
              <Input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth || 1}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de Envío
            </label>
            <Input
              type="time"
              value={formData.time || '09:00'}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emails Destinatarios (separados por comas)
            </label>
            <Input
              type="text"
              placeholder="email1@example.com, email2@example.com"
              value={formData.recipientEmails?.join(', ') || ''}
              onChange={(e) => {
                const emails = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                setFormData({ ...formData, recipientEmails: emails });
              }}
            />
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contenido del Reporte
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeAINarrative !== false}
                  onChange={(e) => setFormData({ ...formData, includeAINarrative: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Incluir resumen narrativo generado por IA</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeObjectivesVsTargets !== false}
                  onChange={(e) => setFormData({ ...formData, includeObjectivesVsTargets: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Incluir comparativas objetivos vs targets</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeRisks !== false}
                  onChange={(e) => setFormData({ ...formData, includeRisks: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Incluir lista de riesgos detectados</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeProposedActions !== false}
                  onChange={(e) => setFormData({ ...formData, includeProposedActions: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Incluir acciones propuestas</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingReport ? 'Actualizar' : 'Crear'} Programación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

