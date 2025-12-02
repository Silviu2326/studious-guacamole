import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { Factura, LinkPago } from '../types';
import { linksPagoAPI } from '../api/linksPago';
import { notificacionesAPI, CanalNotificacion } from '../api/notificaciones';
import { Mail, MessageCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';

interface EnviarLinkPagoProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura;
  onLinkEnviado?: () => void;
}

export const EnviarLinkPago: React.FC<EnviarLinkPagoProps> = ({
  isOpen,
  onClose,
  factura,
  onLinkEnviado,
}) => {
  const [loading, setLoading] = useState(false);
  const [linkPago, setLinkPago] = useState<LinkPago | null>(null);
  const [canal, setCanal] = useState<CanalNotificacion>('ambos');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (isOpen && factura) {
      cargarLinkPago();
    }
  }, [isOpen, factura]);

  const cargarLinkPago = async () => {
    try {
      // Verificar si ya existe un link activo
      const linkExistente = await linksPagoAPI.obtenerLinkPagoFactura(factura.id);
      if (linkExistente && linkExistente.estado === 'activo') {
        setLinkPago(linkExistente);
      } else {
        // Crear nuevo link
        const nuevoLink = await linksPagoAPI.crearLinkPago(factura.id, {
          creadoPor: 'usuario-actual',
        });
        setLinkPago(nuevoLink);
      }
    } catch (error) {
      console.error('Error al cargar link de pago:', error);
    }
  };

  const canales: SelectOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'ambos', label: 'Email y WhatsApp' },
  ];

  const copiarLink = async () => {
    if (linkPago) {
      try {
        await navigator.clipboard.writeText(linkPago.url);
        setLinkCopiado(true);
        setTimeout(() => setLinkCopiado(false), 2000);
      } catch (error) {
        console.error('Error al copiar link:', error);
      }
    }
  };

  const handleEnviar = async () => {
    if (!linkPago) {
      alert('No se pudo generar el link de pago');
      return;
    }

    setLoading(true);
    try {
      await notificacionesAPI.enviarLinkPago(factura, linkPago, canal);
      setEnviado(true);
      if (onLinkEnviado) {
        onLinkEnviado();
      }
    } catch (error) {
      console.error('Error al enviar link de pago:', error);
      alert('Error al enviar el link de pago');
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  if (!linkPago) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Enviar Link de Pago"
        size="md"
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando link de pago...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Link de Pago"
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            {enviado ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!enviado && (
            <Button variant="primary" onClick={handleEnviar} loading={loading}>
              Enviar Link
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la factura */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Factura {factura.numeroFactura}</h3>
          <p className="text-sm text-gray-600">
            Cliente: {factura.cliente.nombre}
          </p>
          <p className="text-sm text-gray-600">
            Monto: {formatearMoneda(linkPago.monto)}
          </p>
          <p className="text-sm text-gray-600">
            Vencimiento: {factura.fechaVencimiento.toLocaleDateString('es-ES')}
          </p>
        </div>

        {enviado ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Link de pago enviado exitosamente</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              El link de pago ha sido enviado al cliente por {canal === 'ambos' ? 'email y WhatsApp' : canal === 'email' ? 'email' : 'WhatsApp'}.
            </p>
          </div>
        ) : (
          <>
            {/* Link de pago */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Link de Pago
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkPago.url}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copiarLink}
                  title="Copiar link"
                >
                  {linkCopiado ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(linkPago.url, '_blank')}
                  title="Abrir link"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Este link expira el {linkPago.fechaExpiracion.toLocaleDateString('es-ES')}
              </p>
            </div>

            {/* Canal de envío */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Enviar por
              </label>
              <Select
                options={canales}
                value={canal}
                onChange={(e) => setCanal(e.target.value as CanalNotificacion)}
              />
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {(canal === 'email' || canal === 'ambos') && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{factura.cliente.email}</span>
                  </div>
                )}
                {(canal === 'whatsapp' || canal === 'ambos') && factura.cliente.telefono && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{factura.cliente.telefono}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Métodos de pago disponibles:</strong>{' '}
                {linkPago.metodoPagoPermitido.map(m => m === 'tarjeta' ? 'Tarjeta' : 'Transferencia').join(', ')}
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};


