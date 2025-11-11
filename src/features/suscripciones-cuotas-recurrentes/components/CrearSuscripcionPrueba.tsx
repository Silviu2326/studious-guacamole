import React, { useState } from 'react';
import { Card, Button, Modal, Input, Badge } from '../../../components/componentsreutilizables';
import { createTrialSuscripcion } from '../api/suscripciones';
import { Sparkles, Calendar, Users, Euro } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface CrearSuscripcionPruebaProps {
  onSuccess?: () => void;
}

export const CrearSuscripcionPrueba: React.FC<CrearSuscripcionPruebaProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [clienteId, setClienteId] = useState<string>('');
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteEmail, setClienteEmail] = useState<string>('');
  const [clienteTelefono, setClienteTelefono] = useState<string>('');
  const [trialSessions, setTrialSessions] = useState<number>(2);
  const [trialPrice, setTrialPrice] = useState<number>(0);
  const [trialDuration, setTrialDuration] = useState<number>(7);
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notas, setNotas] = useState<string>('');

  const handleCrearSuscripcion = async () => {
    if (!clienteId || !clienteNombre || !clienteEmail) {
      alert('Por favor, completa los campos obligatorios (ID, Nombre y Email del cliente)');
      return;
    }

    if (trialSessions < 1) {
      alert('El número de sesiones debe ser al menos 1');
      return;
    }

    if (trialDuration < 1) {
      alert('La duración debe ser al menos 1 día');
      return;
    }

    setLoading(true);
    try {
      await createTrialSuscripcion({
        clienteId,
        clienteNombre,
        clienteEmail,
        clienteTelefono: clienteTelefono || undefined,
        planId: `trial-${trialSessions}`,
        planNombre: `Suscripción de Prueba - ${trialSessions} sesiones`,
        trialSessions,
        trialPrice,
        trialDuration,
        fechaInicio,
        entrenadorId: user?.id,
        notas: notas || undefined,
      });

      // Reset form
      setClienteId('');
      setClienteNombre('');
      setClienteEmail('');
      setClienteTelefono('');
      setTrialSessions(2);
      setTrialPrice(0);
      setTrialDuration(7);
      setFechaInicio(new Date().toISOString().split('T')[0]);
      setNotas('');
      setModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creando suscripción de prueba:', error);
      alert('Error al crear la suscripción de prueba');
    } finally {
      setLoading(false);
    }
  };

  const calcularFechaFin = () => {
    if (!fechaInicio || !trialDuration) return '';
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + trialDuration);
    return fecha.toISOString().split('T')[0];
  };

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Suscripciones de Prueba
            </h3>
            <p className="text-base text-gray-600">
              Crea suscripciones de prueba con sesiones limitadas y precio reducido para que nuevos clientes prueben tu servicio
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Crear Suscripción de Prueba
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Suscripción de Prueba"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Suscripción de Prueba
                </p>
                <p className="text-sm text-blue-700">
                  Crea una suscripción especial con sesiones limitadas y precio reducido para nuevos clientes.
                  Esta suscripción permitirá que los clientes prueben tu servicio antes de comprometerse.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ID del Cliente *"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              placeholder="c1"
              required
            />
            <Input
              label="Nombre del Cliente *"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
            <Input
              label="Email del Cliente *"
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              placeholder="juan@example.com"
              required
            />
            <Input
              label="Teléfono del Cliente"
              type="tel"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              placeholder="+34600123456"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Configuración de la Prueba
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sesiones Incluidas *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={trialSessions}
                    onChange={(e) => setTrialSessions(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Número limitado de sesiones para la prueba</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Reducido (€) *
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={trialPrice}
                    onChange={(e) => setTrialPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Precio especial para la prueba</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (días) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={trialDuration}
                  onChange={(e) => setTrialDuration(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Duración de la prueba en días</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio *"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Finalización
              </label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                {calcularFechaFin() ? new Date(calcularFechaFin()).toLocaleDateString('es-ES') : '-'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">
                  Resumen de la Prueba
                </p>
                <p className="text-sm text-green-700">
                  {trialSessions} sesión{trialSessions !== 1 ? 'es' : ''} por {trialPrice.toFixed(2)} € durante {trialDuration} día{trialDuration !== 1 ? 's' : ''}
                </p>
              </div>
              <Badge color="success">Prueba</Badge>
            </div>
          </div>

          <Input
            label="Notas (opcional)"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas adicionales sobre esta suscripción de prueba"
            multiline
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCrearSuscripcion}
              disabled={loading || !clienteId || !clienteNombre || !clienteEmail}
            >
              {loading ? 'Creando...' : 'Crear Suscripción de Prueba'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

