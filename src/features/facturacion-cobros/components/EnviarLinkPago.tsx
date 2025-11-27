/**
 * EnviarLinkPago - Componente para generar y enviar enlaces de pago
 * 
 * Este componente permite:
 * - Generar un enlace de pago desde una factura usando crearLinkPago
 * - Mostrar el enlace generado
 * - Opciones para copiar el enlace
 * - Simulación de envío por email
 * 
 * Usado en: FacturacionManager.tsx, detalle de factura
 */

import React, { useState } from 'react';
import { Modal, Button, Card } from '../../../components/componentsreutilizables';
import { Factura, LinkPago } from '../types';
import { crearLinkPago } from '../api/linksPago';
import { Copy, CheckCircle, Mail, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface EnviarLinkPagoProps {
  isOpen: boolean;
  onClose: () => void;
  factura: Factura;
  onLinkGenerado?: (link: LinkPago) => void;
}

export const EnviarLinkPago: React.FC<EnviarLinkPagoProps> = ({
  isOpen,
  onClose,
  factura,
  onLinkGenerado,
}) => {
  const [loading, setLoading] = useState(false);
  const [linkPago, setLinkPago] = useState<LinkPago | null>(null);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarLink = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calcular fecha de expiración (30 días por defecto)
      const fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + 30);

      const nuevoLink = await crearLinkPago({
        facturaIdOpcional: factura.id,
        clienteIdOpcional: factura.clienteId,
        importe: factura.saldoPendiente || factura.total,
        moneda: factura.moneda || 'EUR',
        fechaExpiracion,
      });

      setLinkPago(nuevoLink);
      if (onLinkGenerado) {
        onLinkGenerado(nuevoLink);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el enlace de pago');
    } finally {
      setLoading(false);
    }
  };

  const copiarLink = async () => {
    if (linkPago) {
      try {
        await navigator.clipboard.writeText(linkPago.urlPublica);
        setLinkCopiado(true);
        setTimeout(() => setLinkCopiado(false), 2000);
      } catch (error) {
        console.error('Error al copiar link:', error);
        setError('No se pudo copiar el enlace');
      }
    }
  };

  const enviarPorEmail = async () => {
    if (!linkPago) return;
    
    setEnviandoEmail(true);
    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailEnviado(true);
      setTimeout(() => {
        setEmailEnviado(false);
      }, 3000);
    } catch (error) {
      setError('Error al enviar el email');
    } finally {
      setEnviandoEmail(false);
    }
  };

  const formatearMoneda = (valor: number, moneda: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2,
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(fecha);
  };

  // Generar link automáticamente al abrir el modal
  React.useEffect(() => {
    if (isOpen && !linkPago && !loading) {
      generarLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Link de Pago"
      size="md"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Información de la factura */}
        <Card className="p-4 bg-slate-50">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Factura {factura.numero}</h3>
            <p className="text-sm text-gray-600">
              Cliente: {factura.nombreCliente}
            </p>
            <p className="text-sm text-gray-600">
              Monto: {formatearMoneda(factura.saldoPendiente || factura.total, factura.moneda)}
            </p>
            <p className="text-sm text-gray-600">
              Vencimiento: {formatearFecha(new Date(factura.fechaVencimiento))}
            </p>
          </div>
        </Card>

        {loading && !linkPago ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Generando enlace de pago...</p>
          </div>
        ) : linkPago ? (
          <>
            {/* Link de pago generado */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Enlace de Pago
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkPago.urlPublica}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copiarLink}
                  title="Copiar enlace"
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
                  onClick={() => window.open(linkPago.urlPublica, '_blank')}
                  title="Abrir enlace"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Este enlace expira el {formatearFecha(linkPago.fechaExpiracion)}
              </p>
            </div>

            {/* Opciones de envío */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Enviar por Email
              </label>
              <Button
                variant="secondary"
                onClick={enviarPorEmail}
                loading={enviandoEmail}
                leftIcon={<Mail className="w-4 h-4" />}
                fullWidth
              >
                {emailEnviado ? 'Email Enviado ✓' : 'Enviar Link por Email'}
              </Button>
              {emailEnviado && (
                <p className="text-sm text-green-600 text-center">
                  El enlace ha sido enviado por email (simulado)
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> El cliente podrá acceder a este enlace para realizar el pago de forma segura.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Button variant="primary" onClick={generarLink} loading={loading}>
              Generar Enlace de Pago
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

