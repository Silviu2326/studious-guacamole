import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Disponibilidad, Reserva } from '../types';
import { crearReserva, procesarPago, enviarConfirmacion } from '../api';
import { CheckCircle, CreditCard, Mail, X, User } from 'lucide-react';

interface ConfirmacionReservaProps {
  disponibilidad: Disponibilidad;
  role: 'entrenador' | 'gimnasio';
  onConfirmar: (reserva: Reserva) => void;
  onCancelar: () => void;
}

export const ConfirmacionReserva: React.FC<ConfirmacionReservaProps> = ({
  disponibilidad,
  role,
  onConfirmar,
  onCancelar,
}) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [tipoSesion, setTipoSesion] = useState<'presencial' | 'videollamada'>('presencial');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [procesando, setProcesando] = useState(false);
  const [paso, setPaso] = useState<'info' | 'pago' | 'confirmacion'>('info');

  const precio = role === 'entrenador' ? 50 : 15;

  const handleReservar = async () => {
    if (!clienteNombre.trim()) return;

    setProcesando(true);
    try {
      // Crear reserva
      const reserva = await crearReserva({
        clienteId: 'cliente-temp',
        clienteNombre,
        fecha: disponibilidad.fecha,
        horaInicio: disponibilidad.horaInicio,
        horaFin: disponibilidad.horaFin,
        tipo: role === 'entrenador' ? 'sesion-1-1' : 'clase-grupal',
        tipoSesion: role === 'entrenador' ? tipoSesion : undefined,
        estado: 'pendiente',
        precio,
        pagado: false,
        claseId: disponibilidad.claseId,
        claseNombre: disponibilidad.claseNombre,
        capacidad: disponibilidad.capacidad,
        ocupacion: disponibilidad.ocupacion,
      });

      setPaso('pago');
      
      // Procesar pago
      const pago = await procesarPago(reserva.id, metodoPago);
      
      if (pago.exito) {
        // Enviar confirmación
        await enviarConfirmacion(reserva.id, 'email');
        
        setPaso('confirmacion');
        setTimeout(() => {
          onConfirmar({ ...reserva, pagado: true, estado: 'confirmada' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error al procesar reserva:', error);
    } finally {
      setProcesando(false);
    }
  };

  if (paso === 'confirmacion') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Reserva Confirmada
        </h3>
        <p className="text-gray-600">
          Se ha enviado la confirmación por email
        </p>
      </Card>
    );
  }

  if (paso === 'pago') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Procesando Pago
        </h3>
        <p className="text-gray-600">Por favor espere...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Confirmar Reserva
          </h3>
          <button
            onClick={onCancelar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg ring-1 ring-slate-200">
            <p className="text-sm text-gray-600 mb-2">
              Horario
            </p>
            <p className="text-base font-semibold text-gray-900">
              {disponibilidad.horaInicio} - {disponibilidad.horaFin}
            </p>
            {disponibilidad.claseNombre && (
              <p className="text-sm text-gray-600 mt-1">
                {disponibilidad.claseNombre}
              </p>
            )}
          </div>

          <Input
            label="Nombre del Cliente"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            placeholder="Ingrese el nombre"
            leftIcon={<User className="w-5 h-5" />}
          />

          {role === 'entrenador' && (
            <Select
              label="Tipo de Sesión"
              value={tipoSesion}
              onChange={(e) => setTipoSesion(e.target.value as 'presencial' | 'videollamada')}
              options={[
                { value: 'presencial', label: 'Presencial' },
                { value: 'videollamada', label: 'Videollamada' },
              ]}
            />
          )}

          <Select
            label="Método de Pago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            options={[
              { value: 'tarjeta', label: 'Tarjeta de Crédito' },
              { value: 'transferencia', label: 'Transferencia' },
              { value: 'efectivo', label: 'Efectivo' },
            ]}
          />

          <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-900">
                Total
              </span>
              <span className="text-2xl font-bold text-blue-600">
                €{precio.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancelar}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleReservar}
              disabled={!clienteNombre.trim() || procesando}
              loading={procesando}
              fullWidth
            >
              Confirmar y Pagar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
