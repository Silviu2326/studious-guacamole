import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ArqueoCaja } from '../types';
import { useCajaBancos } from '../hooks/useCajaBancos';
import { Calculator, Coins, AlertTriangle, Check, ChevronRight, Calendar, Wallet, X } from 'lucide-react';

interface ArqueoCajaModalProps {
  onClose: () => void;
  saldoSistema: number;
  onArqueoCompleto: () => void;
}

export const ArqueoCajaModal: React.FC<ArqueoCajaModalProps> = ({
  onClose,
  saldoSistema,
  onArqueoCompleto
}) => {
  const { crearArqueo, configuracion } = useCajaBancos();
  const [loading, setLoading] = useState(false);
  const [paso, setPaso] = useState<'billetes' | 'monedas' | 'resumen'>('billetes');
  
  const [billetes, setBilletes] = useState<Record<string, number>>({});
  const [monedas, setMonedas] = useState<Record<string, number>>({});
  const [observaciones, setObservaciones] = useState('');

  // Inicializar denominaciones
  useEffect(() => {
    if (configuracion) {
      const billetesInit: Record<string, number> = {};
      const monedasInit: Record<string, number> = {};
      
      configuracion.denominacionesBilletes.forEach(denom => {
        billetesInit[denom.toString()] = 0;
      });
      
      configuracion.denominacionesMonedas.forEach(denom => {
        monedasInit[denom.toString()] = 0;
      });
      
      setBilletes(billetesInit);
      setMonedas(monedasInit);
    }
  }, [configuracion]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const calcularTotalBilletes = () => {
    return Object.entries(billetes).reduce((total, [denom, cantidad]) => {
      return total + (Number(denom) * cantidad);
    }, 0);
  };

  const calcularTotalMonedas = () => {
    return Object.entries(monedas).reduce((total, [denom, cantidad]) => {
      return total + (Number(denom) * cantidad);
    }, 0);
  };

  const calcularTotalFisico = () => {
    return calcularTotalBilletes() + calcularTotalMonedas();
  };

  const calcularDiferencia = () => {
    return calcularTotalFisico() - saldoSistema;
  };

  const handleCantidadChange = (tipo: 'billetes' | 'monedas', denominacion: string, cantidad: string) => {
    const cantidadNum = cantidad === '' ? 0 : Math.max(0, parseInt(cantidad) || 0);
    
    if (tipo === 'billetes') {
      setBilletes(prev => ({ ...prev, [denominacion]: cantidadNum }));
    } else {
      setMonedas(prev => ({ ...prev, [denominacion]: cantidadNum }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const arqueo: Omit<ArqueoCaja, 'id'> = {
        fecha: new Date(),
        usuario: 'usuario_actual', // En una app real, esto vendría del contexto
        montoSistema: saldoSistema,
        montoFisico: calcularTotalFisico(),
        diferencia: calcularDiferencia(),
        billetes,
        monedas,
        observaciones: observaciones || undefined,
        estado: 'cerrado'
      };

      await crearArqueo(arqueo);
      onArqueoCompleto();
      onClose();
    } catch (error) {
      console.error('Error al crear arqueo:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBilletes = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Conteo de Billetes
        </h3>
        <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Ingrese la cantidad de billetes de cada denominación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configuracion?.denominacionesBilletes.map(denominacion => (
          <Card key={denominacion} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {denominacion >= 1000 ? `${denominacion/1000}K` : denominacion}
                  </span>
                </div>
                <div>
                  <div className={`${ds.typography.body} font-semibold`}>
                    {formatearMoneda(denominacion)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={billetes[denominacion.toString()]?.toString() || '0'}
                onChange={(e) => handleCantidadChange('billetes', denominacion.toString(), e.target.value)}
                placeholder="0"
                min="0"
                className="text-center"
              />
              <span className="text-sm text-gray-500">×</span>
              <div className={`${ds.typography.bodySmall} font-medium min-w-[80px] text-right`}>
                {formatearMoneda(denominacion * (billetes[denominacion.toString()] || 0))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={`${ds.card} ${ds.cardPad} bg-green-50 dark:bg-green-900/20`}>
        <div className="flex justify-between items-center">
          <span className={`${ds.typography.body} font-semibold`}>Total Billetes:</span>
          <span className={`${ds.typography.h3} text-green-600 font-bold`}>
            {formatearMoneda(calcularTotalBilletes())}
          </span>
        </div>
      </div>
    </div>
  );

  const renderMonedas = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Conteo de Monedas
        </h3>
        <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Ingrese la cantidad de monedas de cada denominación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configuracion?.denominacionesMonedas.map(denominacion => (
          <Card key={denominacion} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {denominacion}
                  </span>
                </div>
                <div>
                  <div className={`${ds.typography.body} font-semibold`}>
                    {formatearMoneda(denominacion)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={monedas[denominacion.toString()]?.toString() || '0'}
                onChange={(e) => handleCantidadChange('monedas', denominacion.toString(), e.target.value)}
                placeholder="0"
                min="0"
                className="text-center"
              />
              <span className="text-sm text-gray-500">×</span>
              <div className={`${ds.typography.bodySmall} font-medium min-w-[80px] text-right`}>
                {formatearMoneda(denominacion * (monedas[denominacion.toString()] || 0))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={`${ds.card} ${ds.cardPad} bg-amber-50 dark:bg-amber-900/20`}>
        <div className="flex justify-between items-center">
          <span className={`${ds.typography.body} font-semibold`}>Total Monedas:</span>
          <span className={`${ds.typography.h3} text-amber-600 font-bold`}>
            {formatearMoneda(calcularTotalMonedas())}
          </span>
        </div>
      </div>
    </div>
  );

  const renderResumen = () => {
    const diferencia = calcularDiferencia();
    const porcentajeDiferencia = saldoSistema > 0 ? (Math.abs(diferencia) / saldoSistema) * 100 : 0;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Resumen del Arqueo
          </h3>
          <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Verificación final antes de completar el arqueo
          </p>
        </div>

        {/* Comparación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Saldo Sistema
              </h4>
              <p className={`${ds.typography.h2} text-blue-600 font-bold`}>
                {formatearMoneda(saldoSistema)}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Conteo Físico
              </h4>
              <p className={`${ds.typography.h2} text-green-600 font-bold`}>
                {formatearMoneda(calcularTotalFisico())}
              </p>
            </div>
          </Card>
        </div>

        {/* Diferencia */}
        <Card className={`p-6 ${
          Math.abs(diferencia) <= (configuracion?.alertaDiferencia || 1000)
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              Math.abs(diferencia) <= (configuracion?.alertaDiferencia || 1000)
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}>
              {Math.abs(diferencia) <= (configuracion?.alertaDiferencia || 1000) ? (
                <Check className="w-10 h-10 text-white" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-white" />
              )}
            </div>
            
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Diferencia
            </h4>
            <p className={`${ds.typography.h2} font-bold mb-2 ${
              diferencia === 0 ? 'text-green-600' :
              diferencia > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {diferencia === 0 ? 'Sin diferencia' : 
               diferencia > 0 ? `+${formatearMoneda(diferencia)}` : 
               formatearMoneda(diferencia)}
            </p>
            
            {diferencia !== 0 && (
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {porcentajeDiferencia.toFixed(2)}% del saldo sistema
              </p>
            )}
            
            {Math.abs(diferencia) > (configuracion?.alertaDiferencia || 1000) && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p className={`${ds.typography.bodySmall} text-red-700 dark:text-red-300`}>
                  <AlertTriangle className="w-4 h-4 inline mr-1" /> La diferencia supera el límite permitido de {formatearMoneda(configuracion?.alertaDiferencia || 1000)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Observaciones */}
        <div>
          <label className={`block ${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ingrese cualquier observación sobre el arqueo..."
            rows={3}
            className={`${ds.input} resize-none`}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Arqueo de Caja"
      size="xl"
    >
      <div className="space-y-6">
        {/* Indicador de progreso */}
        <div className="flex items-center justify-center space-x-4">
          {['billetes', 'monedas', 'resumen'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso === stepName
                  ? 'bg-blue-600 text-white'
                  : index < ['billetes', 'monedas', 'resumen'].indexOf(paso)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index < ['billetes', 'monedas', 'resumen'].indexOf(paso) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 ${
                  index < ['billetes', 'monedas', 'resumen'].indexOf(paso)
                    ? 'bg-green-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        <div className="min-h-[400px]">
          {paso === 'billetes' && renderBilletes()}
          {paso === 'monedas' && renderMonedas()}
          {paso === 'resumen' && renderResumen()}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {paso !== 'billetes' && (
              <Button
                variant="secondary"
                onClick={() => {
                  if (paso === 'monedas') setPaso('billetes');
                  if (paso === 'resumen') setPaso('monedas');
                }}
              >
                Anterior
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            
            {paso === 'resumen' ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Completando...' : 'Completar Arqueo'}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  if (paso === 'billetes') setPaso('monedas');
                  if (paso === 'monedas') setPaso('resumen');
                }}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};