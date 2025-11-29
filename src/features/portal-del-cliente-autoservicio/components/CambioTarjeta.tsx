import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { tarjetaAPI } from '../api';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export const CambioTarjeta: React.FC = () => {
  const [tarjetaActual, setTarjetaActual] = useState<{
    ultimosDigitos: string;
    tipo: string;
    fechaVencimiento: string;
  } | null>(null);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombreTitular: '',
    fechaVencimiento: '',
    cvv: ''
  });

  useEffect(() => {
    cargarTarjetaActual();
  }, []);

  const cargarTarjetaActual = async () => {
    try {
      const tarjeta = await tarjetaAPI.obtenerTarjetaActual();
      setTarjetaActual(tarjeta);
    } catch (error) {
      console.error('Error al cargar tarjeta:', error);
    }
  };

  const formatearNumeroTarjeta = (valor: string) => {
    const numero = valor.replace(/\s/g, '');
    const grupos = numero.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numero;
  };

  const formatearFechaVencimiento = (valor: string) => {
    const numero = valor.replace(/\D/g, '');
    if (numero.length >= 2) {
      return `${numero.slice(0, 2)}/${numero.slice(2, 4)}`;
    }
    return numero;
  };

  const handleCambiarTarjeta = async () => {
    setCargando(true);
    setMensaje(null);
    
    try {
      const nuevaTarjeta = await tarjetaAPI.cambiarTarjeta({
        numero: datosTarjeta.numero.replace(/\s/g, ''),
        nombreTitular: datosTarjeta.nombreTitular,
        fechaVencimiento: datosTarjeta.fechaVencimiento,
        cvv: datosTarjeta.cvv
      });
      
      setTarjetaActual(nuevaTarjeta);
      setMensaje({ tipo: 'success', texto: 'Tarjeta actualizada exitosamente' });
      setMostrarFormulario(false);
      setDatosTarjeta({
        numero: '',
        nombreTitular: '',
        fechaVencimiento: '',
        cvv: ''
      });
      
      setTimeout(() => setMensaje(null), 5000);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al actualizar la tarjeta' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <Card className={`p-4 bg-white shadow-sm ${
          mensaje.tipo === 'success' 
            ? 'ring-1 ring-green-200 bg-green-50' 
            : 'ring-1 ring-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-sm ${
              mensaje.tipo === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {mensaje.texto}
            </p>
          </div>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Tarjeta de Pago Actual
            </h2>
          </div>

          {tarjetaActual ? (
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {tarjetaActual.tipo} •••• {tarjetaActual.ultimosDigitos}
                    </p>
                    <p className="text-sm text-gray-600">
                      Vence: {tarjetaActual.fechaVencimiento}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setMostrarFormulario(true)}
                >
                  Cambiar Tarjeta
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                No hay tarjeta registrada
              </p>
              <Button
                variant="primary"
                onClick={() => setMostrarFormulario(true)}
              >
                Agregar Tarjeta
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Cambiar Tarjeta de Pago"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCambiarTarjeta}
              loading={cargando}
            >
              Guardar Tarjeta
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Número de tarjeta"
            value={datosTarjeta.numero}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, '');
              if (valor.length <= 19) {
                setDatosTarjeta({ ...datosTarjeta, numero: formatearNumeroTarjeta(valor) });
              }
            }}
            placeholder="1234 5678 9012 3456"
            leftIcon={<CreditCard className="w-5 h-5" />}
            maxLength={19}
          />
          
          <Input
            label="Nombre del titular"
            value={datosTarjeta.nombreTitular}
            onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombreTitular: e.target.value.toUpperCase() })}
            placeholder="JUAN PÉREZ"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de vencimiento"
              value={datosTarjeta.fechaVencimiento}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '');
                if (valor.length <= 4) {
                  setDatosTarjeta({ ...datosTarjeta, fechaVencimiento: formatearFechaVencimiento(valor) });
                }
              }}
              placeholder="MM/AA"
              maxLength={5}
            />
            
            <Input
              label="CVV"
              type="password"
              value={datosTarjeta.cvv}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '');
                if (valor.length <= 4) {
                  setDatosTarjeta({ ...datosTarjeta, cvv: valor });
                }
              }}
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

