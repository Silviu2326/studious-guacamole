import React, { useState } from 'react';
import { Modal, Button, Input, Select, SelectOption, Textarea } from '../../../components/componentsreutilizables';
import { SuscripcionFacturacion, FrecuenciaFacturacion, ItemFactura } from '../types';
import { suscripcionesRecurrentesAPI } from '../api/suscripcionesRecurrentes';
import { Plus, Trash2 } from 'lucide-react';

interface ConfigurarCobrosRecurrentesProps {
  isOpen: boolean;
  onClose: () => void;
  onSuscripcionCreada: () => void;
  clienteId?: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
}

export const ConfigurarCobrosRecurrentes: React.FC<ConfigurarCobrosRecurrentesProps> = ({
  isOpen,
  onClose,
  onSuscripcionCreada,
  clienteId,
  clienteNombre: clienteNombreProp,
  clienteEmail: clienteEmailProp,
  clienteTelefono: clienteTelefonoProp,
}) => {
  const [loading, setLoading] = useState(false);
  const [clienteNombre, setClienteNombre] = useState(clienteNombreProp || '');
  const [clienteEmail, setClienteEmail] = useState(clienteEmailProp || '');
  const [clienteTelefono, setClienteTelefono] = useState(clienteTelefonoProp || '');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [frecuencia, setFrecuencia] = useState<FrecuenciaFacturacion>('mensual');
  const [diaFacturacion, setDiaFacturacion] = useState('1');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<ItemFactura[]>([
    {
      id: '1',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      tipo: 'servicio',
    },
  ]);
  const [enviarAutomaticamente, setEnviarAutomaticamente] = useState(true);
  const [mediosEnvio, setMediosEnvio] = useState<('email' | 'whatsapp')[]>(['email']);
  const [notas, setNotas] = useState('');

  const frecuencias: SelectOption[] = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'quincenal', label: 'Quincenal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' },
  ];

  const obtenerOpcionesDia = (): SelectOption[] => {
    if (frecuencia === 'semanal') {
      return [
        { value: '1', label: 'Lunes' },
        { value: '2', label: 'Martes' },
        { value: '3', label: 'Miércoles' },
        { value: '4', label: 'Jueves' },
        { value: '5', label: 'Viernes' },
        { value: '6', label: 'Sábado' },
        { value: '7', label: 'Domingo' },
      ];
    } else {
      // Días del mes (1-31)
      return Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      }));
    }
  };

  const actualizarItem = (id: string, campo: keyof ItemFactura, valor: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const itemActualizado = { ...item, [campo]: valor };
        if (campo === 'cantidad' || campo === 'precioUnitario' || campo === 'descuento') {
          const subtotal = itemActualizado.cantidad * itemActualizado.precioUnitario;
          const descuento = itemActualizado.descuento ? (subtotal * itemActualizado.descuento) / 100 : 0;
          itemActualizado.subtotal = subtotal - descuento;
        }
        return itemActualizado;
      }
      return item;
    }));
  };

  const agregarItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        subtotal: 0,
        tipo: 'servicio',
      },
    ]);
  };

  const eliminarItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calcularMontoTotal = (): number => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!clienteNombre || !clienteEmail) {
      alert('Debe completar al menos el nombre y email del cliente');
      return;
    }

    if (!descripcion) {
      alert('Debe ingresar una descripción para la suscripción');
      return;
    }

    if (items.some(item => !item.descripcion || item.precioUnitario <= 0)) {
      alert('Debe completar todos los ítems con descripción y precio válidos');
      return;
    }

    const montoTotal = calcularMontoTotal();
    if (montoTotal <= 0) {
      alert('El monto total debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      await suscripcionesRecurrentesAPI.crearSuscripcion({
        clienteId: clienteId || `cliente-${Date.now()}`,
        clienteNombre,
        clienteEmail,
        clienteTelefono: clienteTelefono || undefined,
        descripcion,
        monto: montoTotal,
        frecuencia,
        fechaInicio: new Date(fechaInicio),
        estado: 'activa',
        diaFacturacion: parseInt(diaFacturacion),
        items: items.map(item => ({
          ...item,
          impuesto: item.impuesto || 19,
        })),
        notas: notas || undefined,
        usuarioCreacion: 'usuario-actual',
        enviarAutomaticamente,
        mediosEnvio,
      });

      onSuscripcionCreada();
      onClose();
      
      // Reset form
      setClienteNombre(clienteNombreProp || '');
      setClienteEmail(clienteEmailProp || '');
      setClienteTelefono(clienteTelefonoProp || '');
      setDescripcion('');
      setMonto('');
      setFrecuencia('mensual');
      setDiaFacturacion('1');
      setFechaInicio(new Date().toISOString().split('T')[0]);
      setItems([{
        id: '1',
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        subtotal: 0,
        tipo: 'servicio',
      }]);
      setEnviarAutomaticamente(true);
      setMediosEnvio(['email']);
      setNotas('');
    } catch (error) {
      console.error('Error al crear suscripción:', error);
      alert('Error al crear la suscripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Cobros Automáticos Recurrentes"
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Crear Suscripción
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Cliente */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Información del Cliente</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre del Cliente *"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required
              disabled={!!clienteNombreProp}
            />
            <Input
              label="Email *"
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
              disabled={!!clienteEmailProp}
            />
            <Input
              label="Teléfono (Opcional)"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              disabled={!!clienteTelefonoProp}
            />
          </div>
        </div>

        {/* Configuración de la Suscripción */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Configuración de la Suscripción</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Descripción *"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Entrenamiento Personal Mensual"
              required
            />
            <Input
              label="Fecha de Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
            <Select
              label="Frecuencia *"
              options={frecuencias}
              value={frecuencia}
              onChange={(e) => {
                setFrecuencia(e.target.value as FrecuenciaFacturacion);
                if (e.target.value !== 'semanal') {
                  setDiaFacturacion('1');
                } else {
                  setDiaFacturacion('1'); // Lunes
                }
              }}
            />
            <Select
              label={frecuencia === 'semanal' ? 'Día de la Semana *' : 'Día del Mes *'}
              options={obtenerOpcionesDia()}
              value={diaFacturacion}
              onChange={(e) => setDiaFacturacion(e.target.value)}
            />
          </div>
        </div>

        {/* Ítems */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Ítems de la Factura</h3>
            <Button type="button" variant="secondary" size="sm" onClick={agregarItem}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ítem
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ítem {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <Input
                      label="Descripción"
                      value={item.descripcion}
                      onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Cantidad"
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => actualizarItem(item.id, 'cantidad', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Precio Unitario"
                      type="number"
                      min="0"
                      value={item.precioUnitario}
                      onChange={(e) => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Descuento (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={item.descuento || 0}
                      onChange={(e) => actualizarItem(item.id, 'descuento', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    Subtotal: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Mensual:</span>
              <span>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(calcularMontoTotal())}
              </span>
            </div>
          </div>
        </div>

        {/* Configuración de Envío */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Configuración de Envío</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enviarAutomaticamente}
                onChange={(e) => setEnviarAutomaticamente(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Enviar factura automáticamente al cliente</span>
            </label>
            {enviarAutomaticamente && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mediosEnvio.includes('email')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMediosEnvio([...mediosEnvio, 'email']);
                      } else {
                        setMediosEnvio(mediosEnvio.filter(m => m !== 'email'));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Enviar por Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mediosEnvio.includes('whatsapp')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMediosEnvio([...mediosEnvio, 'whatsapp']);
                      } else {
                        setMediosEnvio(mediosEnvio.filter(m => m !== 'whatsapp'));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Enviar por WhatsApp</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        <Textarea
          label="Notas (Opcional)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
};

