import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, Input, Badge, Select } from '../../../components/componentsreutilizables';
import { createTrialSuscripcion } from '../api/suscripciones';
import { Sparkles, Calendar, Users, Euro, Zap, CheckCircle } from 'lucide-react';
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
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<string>('7');

  // Presets de duración
  const durationPresets = [
    { value: '7', label: '7 días', days: 7 },
    { value: '14', label: '14 días', days: 14 },
    { value: '30', label: '30 días', days: 30 },
    { value: 'custom', label: 'Personalizado', days: null },
  ];
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
      setSelectedDurationPreset('7');
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

  // Manejar cambio de preset de duración
  const handleDurationPresetChange = (value: string) => {
    setSelectedDurationPreset(value);
    const preset = durationPresets.find(p => p.value === value);
    if (preset && preset.days !== null) {
      setTrialDuration(preset.days);
    }
  };

  // Calcular fecha de fin formateada
  const fechaFinFormateada = useMemo(() => {
    const fechaFin = calcularFechaFin();
    if (!fechaFin) return '';
    return new Date(fechaFin).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [fechaInicio, trialDuration]);

  return (
    <>
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-sm p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Suscripciones de Prueba
                </h3>
                <Badge color="purple" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Prueba
                </Badge>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Crea suscripciones de prueba con sesiones limitadas y precio reducido para que nuevos clientes prueben tu servicio
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
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
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                    Suscripción de Prueba
                  </p>
                  <Badge color="purple" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                    PRUEBA
                  </Badge>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duración de la Prueba *
                </label>
                <Select
                  value={selectedDurationPreset}
                  onChange={(e) => handleDurationPresetChange(e.target.value)}
                  options={durationPresets.map(preset => ({
                    value: preset.value,
                    label: preset.label
                  }))}
                />
                {selectedDurationPreset === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={trialDuration}
                      onChange={(e) => setTrialDuration(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Días personalizados"
                      required
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Duración de la prueba en días
                </p>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Finalización
              </label>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium">
                {fechaFinFormateada || '-'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                    Resumen de la Prueba
                  </p>
                  <Badge color="success" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    PRUEBA
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-green-700 dark:text-green-400">
                  <p>
                    <strong>{trialSessions}</strong> sesión{trialSessions !== 1 ? 'es' : ''} por <strong>{trialPrice.toFixed(2)} €</strong>
                  </p>
                  <p>
                    Duración: <strong>{trialDuration} día{trialDuration !== 1 ? 's' : ''}</strong>
                  </p>
                  {fechaFinFormateada && (
                    <p>
                      Finaliza: <strong>{fechaFinFormateada}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Opción de conversión rápida */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Conversión a Plan de Pago
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                  Después de crear esta suscripción de prueba, podrás convertirla fácilmente a un plan de pago completo desde el panel de gestión de suscripciones.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Conversión rápida disponible</span>
                </div>
              </div>
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

