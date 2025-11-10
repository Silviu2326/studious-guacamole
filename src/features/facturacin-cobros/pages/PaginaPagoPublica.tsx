import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { LinkPago, PagoOnline } from '../types';
import { linksPagoAPI } from '../api/linksPago';
import { facturasAPI } from '../api/facturas';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Loader2,
  Building2
} from 'lucide-react';

export const PaginaPagoPublica: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [linkPago, setLinkPago] = useState<LinkPago | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'transferencia'>('tarjeta');
  
  // Datos para pago con tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Datos para transferencia
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [banco, setBanco] = useState('');
  const [referenciaTransferencia, setReferenciaTransferencia] = useState('');

  useEffect(() => {
    if (token) {
      cargarLinkPago();
    }
  }, [token]);

  const cargarLinkPago = async () => {
    setLoading(true);
    setError(null);
    try {
      const link = await linksPagoAPI.obtenerLinkPagoPorToken(token!);
      if (!link) {
        setError('Link de pago no encontrado');
        return;
      }
      
      if (link.estado !== 'activo') {
        setError(`El link de pago no está disponible (${link.estado})`);
        return;
      }
      
      if (link.fechaExpiracion < new Date()) {
        setError('El link de pago ha expirado');
        return;
      }
      
      setLinkPago(link);
    } catch (error) {
      console.error('Error al cargar link de pago:', error);
      setError('Error al cargar el link de pago');
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

  const handleProcesarPago = async () => {
    if (!linkPago) return;

    // Validaciones
    if (metodoPago === 'tarjeta') {
      if (!numeroTarjeta || !nombreTitular || !fechaVencimiento || !cvv) {
        alert('Por favor complete todos los campos de la tarjeta');
        return;
      }
      if (numeroTarjeta.replace(/\s/g, '').length < 13) {
        alert('Número de tarjeta inválido');
        return;
      }
    } else {
      if (!numeroCuenta || !banco || !referenciaTransferencia) {
        alert('Por favor complete todos los campos de la transferencia');
        return;
      }
    }

    setProcesando(true);
    try {
      const pagoOnline = await linksPagoAPI.procesarPagoOnline(linkPago.id, {
        metodoPago,
        datosPago: metodoPago === 'tarjeta' ? {
          ultimos4Digitos: numeroTarjeta.slice(-4),
          nombreTitular,
        } : {
          numeroCuenta,
          banco,
        },
        referencia: metodoPago === 'tarjeta' 
          ? `TARJ-${Date.now()}` 
          : referenciaTransferencia,
      });

      // Esperar un momento para simular el procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar el estado del pago
      const pagoActualizado = await linksPagoAPI.obtenerPagoOnline(pagoOnline.id);
      if (pagoActualizado && pagoActualizado.estado === 'completado') {
        setPagoCompletado(true);
      } else {
        setError('El pago está siendo procesado. Recibirá una confirmación por email.');
        setPagoCompletado(true);
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setProcesando(false);
    }
  };

  const metodosPago: SelectOption[] = linkPago?.metodoPagoPermitido.map(m => ({
    value: m,
    label: m === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : 'Transferencia Bancaria',
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando...</h2>
          <p className="text-gray-600">Verificando link de pago</p>
        </Card>
      </div>
    );
  }

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

  if (pagoCompletado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Completado!</h2>
          <p className="text-gray-600 mb-4">
            Su pago ha sido procesado exitosamente. Recibirá un comprobante por email.
          </p>
          {linkPago && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Referencia:</p>
              <p className="font-semibold text-gray-900">{linkPago.referenciaPago || 'Procesando...'}</p>
            </div>
          )}
          <Button variant="primary" onClick={() => navigate('/')} className="mt-6">
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  if (!linkPago) {
    return null;
  }

  // Cargar información de la factura
  const [factura, setFactura] = useState<any>(null);
  useEffect(() => {
    if (linkPago) {
      facturasAPI.obtenerFactura(linkPago.facturaId).then(setFactura);
    }
  }, [linkPago]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Pago de Factura</h1>
          <p className="text-gray-600 mt-2">Complete el pago de su factura de forma segura</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información de la factura */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Detalles de la Factura</h2>
            </div>
            {factura && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Número de Factura</p>
                  <p className="font-semibold text-gray-900">{factura.numeroFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold text-gray-900">{factura.cliente.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                  <p className="font-semibold text-gray-900">
                    {factura.fechaVencimiento.toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">Total a Pagar</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatearMoneda(linkPago.monto)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Formulario de pago */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Método de Pago</h2>
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
              <Select
                label="Método de Pago"
                options={metodosPago}
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as 'tarjeta' | 'transferencia')}
              />

              {metodoPago === 'tarjeta' ? (
                <div className="space-y-4">
                  <Input
                    label="Número de Tarjeta"
                    type="text"
                    value={numeroTarjeta}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      if (/^\d*$/.test(value) && value.length <= 16) {
                        setNumeroTarjeta(value.replace(/(.{4})/g, '$1 ').trim());
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                  <Input
                    label="Nombre del Titular"
                    type="text"
                    value={nombreTitular}
                    onChange={(e) => setNombreTitular(e.target.value.toUpperCase())}
                    placeholder="JUAN PEREZ"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Fecha de Vencimiento"
                      type="text"
                      value={fechaVencimiento}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setFechaVencimiento(value.replace(/(.{2})/, '$1/'));
                        }
                      }}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                    <Input
                      label="CVV"
                      type="text"
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setCvv(value);
                        }
                      }}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Número de Cuenta"
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    placeholder="Número de cuenta bancaria"
                    required
                  />
                  <Input
                    label="Banco"
                    type="text"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    placeholder="Nombre del banco"
                    required
                  />
                  <Input
                    label="Número de Referencia"
                    type="text"
                    value={referenciaTransferencia}
                    onChange={(e) => setReferenciaTransferencia(e.target.value)}
                    placeholder="Número de referencia de la transferencia"
                    required
                  />
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Instrucciones:</strong> Realice la transferencia bancaria y ingrese el número de referencia que recibió.
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleProcesarPago}
                loading={procesando}
                fullWidth
                className="mt-6"
                disabled={procesando}
              >
                {procesando ? 'Procesando Pago...' : `Pagar ${formatearMoneda(linkPago.monto)}`}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <Building2 className="w-4 h-4" />
                <span>Pago seguro y protegido</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

