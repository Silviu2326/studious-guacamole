/**
 * PaginaPagoPublica - Página pública para realizar pagos mediante enlace
 * 
 * Esta página:
 * - Recibe un slug en la URL
 * - Carga el LinkPago con getLinkPagoPorSlug
 * - Muestra datos básicos (importe, concepto)
 * - Muestra un formulario mínimo de confirmación de pago
 * - Tras "pago" simulado, registra un cobro con registrarCobro
 * - Marca el link como usado/expirado
 * 
 * Ruta: /pago/:slug
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { LinkPago, Factura } from '../types';
import { getLinkPagoPorSlug, marcarLinkPagoComoUsado } from '../api/linksPago';
import { registrarCobro } from '../api/cobros';
import { getFacturaById } from '../api/facturas';
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
  Shield,
  ArrowLeft,
} from 'lucide-react';

export const PaginaPagoPublica: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [linkPago, setLinkPago] = useState<LinkPago | null>(null);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [nombreConfirmacion, setNombreConfirmacion] = useState('');

  useEffect(() => {
    if (slug) {
      cargarLinkPago();
    }
  }, [slug]);

  const cargarLinkPago = async () => {
    setLoading(true);
    setError(null);
    try {
      const link = await getLinkPagoPorSlug(slug!);
      
      if (!link) {
        setError('Enlace de pago no encontrado');
        return;
      }

      // Verificar estado del enlace
      if (link.estado === 'usado') {
        setError('Este enlace de pago ya fue utilizado');
        return;
      }

      if (link.estado === 'expirado') {
        setError('Este enlace de pago ha expirado');
        return;
      }

      if (link.fechaExpiracion < new Date()) {
        setError('Este enlace de pago ha expirado');
        return;
      }

      setLinkPago(link);

      // Cargar información de la factura si existe
      if (link.facturaIdOpcional) {
        try {
          const facturaData = await getFacturaById(link.facturaIdOpcional);
          setFactura(facturaData);
        } catch (err) {
          console.warn('No se pudo cargar la factura asociada:', err);
        }
      }
    } catch (err) {
      console.error('Error al cargar link de pago:', err);
      setError('Error al cargar el enlace de pago');
    } finally {
      setLoading(false);
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

  const handleConfirmarPago = async () => {
    if (!linkPago) return;

    // Validación mínima
    if (!nombreConfirmacion.trim()) {
      setError('Por favor, ingrese su nombre para confirmar el pago');
      return;
    }

    setProcesando(true);
    setError(null);

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Registrar el cobro si hay factura asociada
      if (linkPago.facturaIdOpcional) {
        try {
          await registrarCobro(linkPago.facturaIdOpcional, {
            fechaCobro: new Date(),
            importe: linkPago.importe,
            metodoPago: 'transferencia', // Método simulado
            referenciaExternaOpcional: `PAGO-${Date.now()}`,
            observacionesOpcional: `Pago realizado mediante enlace público - ${nombreConfirmacion}`,
            esCobroRecurrente: false,
          });
        } catch (err) {
          console.error('Error al registrar cobro:', err);
          // Continuar aunque falle el registro del cobro
        }
      }

      // Marcar el enlace como usado
      try {
        await marcarLinkPagoComoUsado(linkPago.id);
      } catch (err) {
        console.error('Error al marcar enlace como usado:', err);
        // Continuar aunque falle
      }

      setPagoCompletado(true);
    } catch (err) {
      console.error('Error al procesar pago:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando...</h2>
          <p className="text-gray-600">Verificando enlace de pago</p>
        </Card>
      </div>
    );
  }

  // Estado de error
  if (error && !linkPago) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  // Estado de pago completado
  if (pagoCompletado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Completado!</h2>
          <p className="text-gray-600 mb-4">
            Su pago ha sido procesado exitosamente. Recibirá una confirmación por email.
          </p>
          {linkPago && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Monto pagado:</p>
              <p className="font-semibold text-gray-900 text-lg">
                {formatearMoneda(linkPago.importe, linkPago.moneda)}
              </p>
            </div>
          )}
          <Button variant="primary" onClick={() => navigate('/')} className="mt-6">
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  // Formulario de pago
  if (!linkPago) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Pago de Factura</h1>
          <p className="text-gray-600 mt-2">Complete el pago de forma segura</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del pago */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Detalles del Pago</h2>
            </div>
            <div className="space-y-4">
              {factura && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Número de Factura</p>
                    <p className="font-semibold text-gray-900">{factura.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-semibold text-gray-900">{factura.nombreCliente}</p>
                  </div>
                  {factura.fechaVencimiento && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                      <p className="font-semibold text-gray-900">
                        {formatearFecha(new Date(factura.fechaVencimiento))}
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">Total a Pagar</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(linkPago.importe, linkPago.moneda)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Formulario de confirmación */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Confirmar Pago</h2>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                type="text"
                value={nombreConfirmacion}
                onChange={(e) => setNombreConfirmacion(e.target.value)}
                placeholder="Ingrese su nombre completo"
                required
              />

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Nota:</strong> Este es un pago simulado. En producción, aquí se integraría
                  con un gateway de pagos real (Stripe, PayPal, etc.).
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleConfirmarPago}
                loading={procesando}
                fullWidth
                className="mt-6"
                disabled={procesando || !nombreConfirmacion.trim()}
              >
                {procesando ? 'Procesando Pago...' : `Confirmar Pago de ${formatearMoneda(linkPago.importe, linkPago.moneda)}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <Shield className="w-4 h-4" />
                <span>Pago seguro y protegido</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

