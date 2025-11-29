/**
 * ConfigurarCobrosRecurrentes - Componente para crear y editar suscripciones recurrentes
 * 
 * Este componente permite:
 * - Crear nuevas suscripciones recurrentes
 * - Editar suscripciones existentes
 * - Configurar cliente, importe, frecuencia, método de pago preferido
 * - Seleccionar día de facturación según la frecuencia
 * 
 * INTEGRACIÓN FUTURA:
 * - A futuro se conectará con pasarelas de pago reales (Stripe, PayPal, etc.)
 *   para registrar las suscripciones y procesar los cobros automáticamente
 * - Al crear/editar, se registraría también en la pasarela de pago
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Textarea, Modal } from '../../../components/componentsreutilizables';
import { 
  SuscripcionRecurrente, 
  FrecuenciaFacturacion,
  MetodoPago 
} from '../types';
import { suscripcionesRecurrentesAPI } from '../api/suscripcionesRecurrentes';
import { getClients } from '../../gestión-de-clientes/api/clients';
import { 
  Save, 
  X, 
  Loader2, 
  User, 
  DollarSign, 
  Calendar,
  CreditCard,
  Repeat,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ConfigurarCobrosRecurrentesProps {
  suscripcionId?: string; // Si se proporciona, es modo edición
  isOpen: boolean;
  onClose: () => void;
  onSave?: (suscripcion: SuscripcionRecurrente) => void;
}

interface Cliente {
  id: string;
  name: string;
  email?: string;
}

interface FormularioSuscripcion {
  clienteId: string;
  descripcion: string;
  importe: string;
  moneda: string;
  frecuencia: FrecuenciaFacturacion;
  diaFacturacion: number;
  metodoPagoPreferido: MetodoPago;
  notas?: string;
}

export const ConfigurarCobrosRecurrentes: React.FC<ConfigurarCobrosRecurrentesProps> = ({
  suscripcionId,
  isOpen,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  
  const [formulario, setFormulario] = useState<FormularioSuscripcion>({
    clienteId: '',
    descripcion: '',
    importe: '',
    moneda: 'COP',
    frecuencia: 'mensual',
    diaFacturacion: 1,
    metodoPagoPreferido: 'tarjeta',
    notas: ''
  });

  useEffect(() => {
    if (isOpen) {
      cargarClientes();
      if (suscripcionId) {
        cargarSuscripcion();
      } else {
        resetearFormulario();
      }
    }
  }, [isOpen, suscripcionId]);

  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      const datos = await getClients('entrenador');
      setClientes(datos.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email
      })));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setCargandoClientes(false);
    }
  };

  const cargarSuscripcion = async () => {
    if (!suscripcionId) return;
    
    setLoading(true);
    try {
      const suscripcion = await suscripcionesRecurrentesAPI.obtenerSuscripcion(suscripcionId);
      if (suscripcion) {
        setFormulario({
          clienteId: suscripcion.clienteId,
          descripcion: suscripcion.descripcion,
          importe: suscripcion.importe.toString(),
          moneda: suscripcion.moneda,
          frecuencia: suscripcion.frecuencia,
          diaFacturacion: suscripcion.diaFacturacion,
          metodoPagoPreferido: suscripcion.metodoPagoPreferido,
          notas: suscripcion.notas || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar suscripción:', error);
      alert('Error al cargar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setFormulario({
      clienteId: '',
      descripcion: '',
      importe: '',
      moneda: 'COP',
      frecuencia: 'mensual',
      diaFacturacion: 1,
      metodoPagoPreferido: 'tarjeta',
      notas: ''
    });
    setErrores({});
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.clienteId) {
      nuevosErrores.clienteId = 'Debes seleccionar un cliente';
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    }

    const importeNumero = parseFloat(formulario.importe);
    if (isNaN(importeNumero) || importeNumero <= 0) {
      nuevosErrores.importe = 'El importe debe ser mayor a 0';
    }

    const diaMaximo = obtenerDiaMaximo(formulario.frecuencia);
    if (formulario.diaFacturacion < 1 || formulario.diaFacturacion > diaMaximo) {
      nuevosErrores.diaFacturacion = `El día debe estar entre 1 y ${diaMaximo}`;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const obtenerDiaMaximo = (frecuencia: FrecuenciaFacturacion): number => {
    switch (frecuencia) {
      case 'diaria':
      case 'semanal':
        return 7; // 1-7 para días de la semana
      case 'quincenal':
        return 15;
      case 'mensual':
      case 'bimestral':
      case 'trimestral':
      case 'semestral':
      case 'anual':
        return 31; // Día del mes
      default:
        return 31;
    }
  };

  const obtenerOpcionesDia = (frecuencia: FrecuenciaFacturacion) => {
    const diaMaximo = obtenerDiaMaximo(frecuencia);
    
    if (frecuencia === 'semanal') {
      return [
        { value: 1, label: 'Lunes' },
        { value: 2, label: 'Martes' },
        { value: 3, label: 'Miércoles' },
        { value: 4, label: 'Jueves' },
        { value: 5, label: 'Viernes' },
        { value: 6, label: 'Sábado' },
        { value: 7, label: 'Domingo' }
      ];
    }
    
    const opciones = [];
    for (let i = 1; i <= diaMaximo; i++) {
      opciones.push({ value: i, label: i.toString() });
    }
    return opciones;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    try {
      const clienteSeleccionado = clientes.find(c => c.id === formulario.clienteId);
      const datosSuscripcion = {
        clienteId: formulario.clienteId,
        nombreCliente: clienteSeleccionado?.name || '',
        descripcion: formulario.descripcion.trim(),
        importe: parseFloat(formulario.importe),
        moneda: formulario.moneda,
        frecuencia: formulario.frecuencia,
        diaFacturacion: formulario.diaFacturacion,
        metodoPagoPreferido: formulario.metodoPagoPreferido,
        notas: formulario.notas?.trim() || undefined
      };

      let suscripcion: SuscripcionRecurrente;
      
      if (suscripcionId) {
        // Editar suscripción existente
        suscripcion = await suscripcionesRecurrentesAPI.actualizarSuscripcion(
          suscripcionId,
          datosSuscripcion
        );
      } else {
        // Crear nueva suscripción
        suscripcion = await suscripcionesRecurrentesAPI.crearSuscripcion(datosSuscripcion);
      }

      if (onSave) {
        onSave(suscripcion);
      }

      resetearFormulario();
      onClose();
    } catch (error) {
      console.error('Error al guardar suscripción:', error);
      alert(error instanceof Error ? error.message : 'Error al guardar la suscripción');
    } finally {
      setGuardando(false);
    }
  };

  const formatearMoneda = (valor: number, moneda: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={suscripcionId ? 'Editar Suscripción Recurrente' : 'Nueva Suscripción Recurrente'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Nota sobre integración futura */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Integración con Pasarelas de Pago</p>
                <p>
                  A futuro, este sistema se conectará con pasarelas de pago reales (Stripe, PayPal, etc.)
                  para procesar los cobros automáticamente. Por ahora, las suscripciones se registran
                  para seguimiento y se generarán facturas manualmente según la frecuencia configurada.
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Cliente *
            </label>
            {cargandoClientes ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cargando clientes...</span>
              </div>
            ) : (
              <Select
                value={formulario.clienteId}
                onChange={(e) => {
                  setFormulario({ ...formulario, clienteId: e.target.value });
                  setErrores({ ...errores, clienteId: '' });
                }}
                options={[
                  { value: '', label: 'Selecciona un cliente...' },
                  ...clientes.map(c => ({
                    value: c.id,
                    label: `${c.name}${c.email ? ` (${c.email})` : ''}`
                  }))
                ]}
                error={errores.clienteId}
              />
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Servicio/Producto *
            </label>
            <Input
              type="text"
              value={formulario.descripcion}
              onChange={(e) => {
                setFormulario({ ...formulario, descripcion: e.target.value });
                setErrores({ ...errores, descripcion: '' });
              }}
              placeholder="Ej: Membresía Mensual - Plan Premium"
              error={errores.descripcion}
            />
          </div>

          {/* Importe y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Importe *
              </label>
              <Input
                type="number"
                value={formulario.importe}
                onChange={(e) => {
                  setFormulario({ ...formulario, importe: e.target.value });
                  setErrores({ ...errores, importe: '' });
                }}
                placeholder="0"
                min="0"
                step="0.01"
                error={errores.importe}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <Select
                value={formulario.moneda}
                onChange={(e) => setFormulario({ ...formulario, moneda: e.target.value })}
                options={[
                  { value: 'COP', label: 'COP - Peso Colombiano' },
                  { value: 'USD', label: 'USD - Dólar Estadounidense' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'MXN', label: 'MXN - Peso Mexicano' }
                ]}
              />
            </div>
          </div>

          {/* Frecuencia y Día de Facturación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Repeat className="w-4 h-4 inline mr-1" />
                Frecuencia *
              </label>
              <Select
                value={formulario.frecuencia}
                onChange={(e) => {
                  const nuevaFrecuencia = e.target.value as FrecuenciaFacturacion;
                  const diaMaximo = obtenerDiaMaximo(nuevaFrecuencia);
                  setFormulario({
                    ...formulario,
                    frecuencia: nuevaFrecuencia,
                    diaFacturacion: Math.min(formulario.diaFacturacion, diaMaximo)
                  });
                }}
                options={[
                  { value: 'diaria', label: 'Diaria' },
                  { value: 'semanal', label: 'Semanal' },
                  { value: 'quincenal', label: 'Quincenal' },
                  { value: 'mensual', label: 'Mensual' },
                  { value: 'bimestral', label: 'Bimestral' },
                  { value: 'trimestral', label: 'Trimestral' },
                  { value: 'semestral', label: 'Semestral' },
                  { value: 'anual', label: 'Anual' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Día de Facturación *
              </label>
              <Select
                value={formulario.diaFacturacion.toString()}
                onChange={(e) => {
                  setFormulario({
                    ...formulario,
                    diaFacturacion: parseInt(e.target.value)
                  });
                  setErrores({ ...errores, diaFacturacion: '' });
                }}
                options={obtenerOpcionesDia(formulario.frecuencia).map(op => ({
                  value: op.value.toString(),
                  label: op.label
                }))}
                error={errores.diaFacturacion}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formulario.frecuencia === 'semanal' 
                  ? 'Día de la semana en que se realizará el cobro'
                  : 'Día del mes en que se realizará el cobro'}
              </p>
            </div>
          </div>

          {/* Método de Pago Preferido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Método de Pago Preferido
            </label>
            <Select
              value={formulario.metodoPagoPreferido}
              onChange={(e) => setFormulario({
                ...formulario,
                metodoPagoPreferido: e.target.value as MetodoPago
              })}
              options={[
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'tarjeta', label: 'Tarjeta' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'stripe', label: 'Stripe' },
                { value: 'otro', label: 'Otro' }
              ]}
            />
            <p className="text-xs text-gray-500 mt-1">
              Método de pago preferido del cliente (a futuro se usará para procesamiento automático)
            </p>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <Textarea
              value={formulario.notas || ''}
              onChange={(e) => setFormulario({ ...formulario, notas: e.target.value })}
              placeholder="Notas adicionales sobre esta suscripción..."
              rows={3}
            />
          </div>

          {/* Vista previa */}
          {formulario.importe && !isNaN(parseFloat(formulario.importe)) && (
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Vista Previa</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Importe por ciclo:</span>
                  <span className="font-semibold">
                    {formatearMoneda(parseFloat(formulario.importe), formulario.moneda)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia:</span>
                  <span className="font-semibold capitalize">{formulario.frecuencia}</span>
                </div>
                {formulario.clienteId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-semibold">
                      {clientes.find(c => c.id === formulario.clienteId)?.name || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );
};

