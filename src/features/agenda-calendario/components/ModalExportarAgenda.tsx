import React, { useState, ChangeEvent } from 'react';
import { Calendar, Download, Mail, Printer, X } from 'lucide-react';
import { Modal, Button, Input, Switch } from '../../../components/componentsreutilizables';
import { Cita } from '../types';
import { 
  exportarAgendaPDF, 
  imprimirAgenda, 
  enviarAgendaPorEmail,
  OpcionesExportacion,
  DatosAgendaExportacion 
} from '../api/exportAgenda';
import { useAuth } from '../../../context/AuthContext';

interface ModalExportarAgendaProps {
  isOpen: boolean;
  onClose: () => void;
  citas: Cita[];
  nombreEntrenador?: string;
}

export const ModalExportarAgenda: React.FC<ModalExportarAgendaProps> = ({
  isOpen,
  onClose,
  citas,
  nombreEntrenador,
}) => {
  const { user } = useAuth();
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes de esta semana
    return lunes.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const hoy = new Date();
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() - hoy.getDay() + 7); // Domingo de esta semana
    return domingo.toISOString().split('T')[0];
  });
  const [ocultarInformacionSensible, setOcultarInformacionSensible] = useState(false);
  const [incluirHorarios, setIncluirHorarios] = useState(true);
  const [incluirClientes, setIncluirClientes] = useState(true);
  const [incluirTiposSesion, setIncluirTiposSesion] = useState(true);
  const [incluirNotas, setIncluirNotas] = useState(true);
  const [emailDestino, setEmailDestino] = useState<string>('');
  const [enviarPorEmail, setEnviarPorEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportarPDF = async () => {
    setLoading(true);
    setError(null);
    try {
      const opciones: OpcionesExportacion = {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        ocultarInformacionSensible,
        incluirHorarios,
        incluirClientes,
        incluirTiposSesion,
        incluirNotas,
        formato: 'pdf',
      };

      const datos: DatosAgendaExportacion = {
        citas,
        opciones,
        nombreEntrenador,
        fechaGeneracion: new Date(),
      };

      if (enviarPorEmail && emailDestino) {
        await enviarAgendaPorEmail(datos, emailDestino);
        alert(`Agenda enviada exitosamente a ${emailDestino}`);
        onClose();
      } else {
        await exportarAgendaPDF(datos);
      }
    } catch (err) {
      console.error('Error al exportar agenda:', err);
      setError('Error al exportar la agenda. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = async () => {
    setLoading(true);
    setError(null);
    try {
      const opciones: OpcionesExportacion = {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        ocultarInformacionSensible,
        incluirHorarios,
        incluirClientes,
        incluirTiposSesion,
        incluirNotas,
        formato: 'imprimir',
      };

      const datos: DatosAgendaExportacion = {
        citas,
        opciones,
        nombreEntrenador,
        fechaGeneracion: new Date(),
      };

      imprimirAgenda(datos);
    } catch (err) {
      console.error('Error al imprimir agenda:', err);
      setError('Error al imprimir la agenda. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar/Imprimir Agenda"
      size="lg"
      footer={
        <div className="flex items-center justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={handleImprimir}
            disabled={loading}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir
          </Button>
          <Button
            variant="primary"
            onClick={handleExportarPDF}
            loading={loading}
            leftIcon={enviarPorEmail ? <Mail className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          >
            {enviarPorEmail ? 'Enviar por Email' : 'Exportar PDF'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Rango de fechas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Rango de Fechas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Opciones de contenido */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contenido a Incluir</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Incluir Horarios</label>
              <Switch
                checked={incluirHorarios}
                onChange={setIncluirHorarios}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Incluir Clientes</label>
              <Switch
                checked={incluirClientes}
                onChange={setIncluirClientes}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Incluir Tipos de Sesión</label>
              <Switch
                checked={incluirTiposSesion}
                onChange={setIncluirTiposSesion}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Incluir Notas</label>
              <Switch
                checked={incluirNotas}
                onChange={setIncluirNotas}
              />
            </div>
          </div>
        </div>

        {/* Opciones de privacidad */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Privacidad</h3>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Ocultar Información Sensible</label>
              <p className="text-xs text-gray-500 mt-1">
                Oculta nombres de clientes y notas en el documento exportado
              </p>
            </div>
            <Switch
              checked={ocultarInformacionSensible}
              onChange={setOcultarInformacionSensible}
            />
          </div>
        </div>

        {/* Envío por email */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enviar por Email</label>
              <p className="text-xs text-gray-500 mt-1">
                Envía el PDF directamente por correo electrónico
              </p>
            </div>
            <Switch
              checked={enviarPorEmail}
              onChange={setEnviarPorEmail}
            />
          </div>
          {enviarPorEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Destino
              </label>
              <Input
                type="email"
                placeholder="recepcion@ejemplo.com"
                value={emailDestino}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailDestino(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

